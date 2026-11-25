import { describe, expect, it } from "vitest";
import { localeFromRequest } from "@/i18n/localePreference";
import { edgeCacheDirective, legacyRedirectLocation, withEdgeCache } from "@/lib/edgeRouting";

describe("localeFromRequest", () => {
  it("prefers the locale cookie over Accept-Language", () => {
    expect(localeFromRequest("NEXT_LOCALE=en", "pl")).toBe("en");
    expect(localeFromRequest("theme=dark; NEXT_LOCALE=pl", "en")).toBe("pl");
  });

  it("uses the highest-quality supported Accept-Language tag", () => {
    expect(localeFromRequest(null, "fr;q=0.9,pl;q=0.8,en;q=0.1")).toBe("pl");
    expect(localeFromRequest(null, null)).toBe("en");
  });
});

describe("legacyRedirectLocation", () => {
  it("sends locale-less pages to the default locale and keeps the query", () => {
    expect(legacyRedirectLocation("/about", "?utm=1")).toBe("/en/about?utm=1");
    expect(legacyRedirectLocation("/blog/fastapi-patterns", "")).toBe("/en/blog/fastapi-patterns");
    expect(legacyRedirectLocation("/projects/investtracker", "?x=1")).toBe("/en/projects/investtracker?x=1");
    expect(legacyRedirectLocation("/index.html", "")).toBe("/en");
    expect(legacyRedirectLocation("/en/about", "")).toBeNull();
    expect(legacyRedirectLocation("/blog/", "")).toBeNull();
  });
});

describe("edgeCacheDirective", () => {
  it("caches public GET documents at the edge and skips personalized routes", () => {
    expect(
      edgeCacheDirective({ pathname: "/en", method: "GET", status: 200, hasSetCookie: false }),
    ).toBe("public, max-age=31536000");
    expect(
      edgeCacheDirective({ pathname: "/en/contact", method: "GET", status: 200, hasSetCookie: false }),
    ).toBe("public, max-age=3600");
    expect(
      edgeCacheDirective({ pathname: "/", method: "GET", status: 307, hasSetCookie: false }),
    ).toBeNull();
    expect(
      edgeCacheDirective({ pathname: "/mcp", method: "POST", status: 200, hasSetCookie: false }),
    ).toBeNull();
    expect(
      edgeCacheDirective({ pathname: "/en", method: "GET", status: 200, hasSetCookie: true }),
    ).toBeNull();
  });
});

describe("withEdgeCache", () => {
  it("sets an edge TTL without storing the contact page as no-store", () => {
    const response = withEdgeCache(
      new Request("https://danielmilewski.com/pl/contact"),
      new Response("ok", { headers: { "Cache-Control": "private, no-store" } }),
    );

    expect(response.headers.get("Cloudflare-CDN-Cache-Control")).toBe("public, max-age=3600");
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=0, must-revalidate");
  });
});
