import { AGENT_DISCOVERY_LINK_HEADER } from "../src/lib/agentDiscovery";
import { localeFromRequest } from "../src/i18n/localePreference";
import { legacyRedirectLocation, withEdgeCache } from "../src/lib/edgeRouting";

type OpenNextWorker = {
  fetch: (request: Request, env: unknown, ctx: ExecutionContext) => Promise<Response> | Response;
};

// Literal specifier so Wrangler code-splits the generated worker. It does not
// exist until `opennextjs-cloudflare build`, and this file is excluded from
// the Next.js typecheck for that reason.
let openNextWorker: Promise<OpenNextWorker> | undefined;

function loadOpenNextWorker(): Promise<OpenNextWorker> {
  openNextWorker ??= import("../.open-next/worker.js").then(
    (mod: { default: OpenNextWorker }) => mod.default,
  );
  return openNextWorker;
}

function earlyResponse(request: Request): Response | null {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return null;
  }

  const url = new URL(request.url);

  if (url.pathname === "/") {
    const locale = localeFromRequest(request.headers.get("cookie"), request.headers.get("accept-language"));
    return new Response(null, {
      status: 307,
      headers: {
        Location: `/${locale}`,
        "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
        "Content-Type": "text/html; charset=utf-8",
        Link: AGENT_DISCOVERY_LINK_HEADER,
        Vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding",
      },
    });
  }

  const location = legacyRedirectLocation(url.pathname, url.search);
  if (!location) {
    return null;
  }

  return new Response(null, {
    status: 308,
    headers: {
      Location: location,
      Refresh: `0;url=${location}`,
      "Cache-Control": "public, max-age=3600",
      "Cloudflare-CDN-Cache-Control": "public, max-age=31536000",
    },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    const early = earlyResponse(request);
    if (early) {
      return early;
    }

    const worker = await loadOpenNextWorker();
    const response = await worker.fetch(request, env, ctx);
    return withEdgeCache(request, response);
  },
};
