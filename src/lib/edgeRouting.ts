import { routing } from "@/i18n/routing";

const LEGACY_EXACT_PATHS = ["/about", "/blog", "/contact", "/projects", "/privacy"] as const;

const ONE_YEAR = "public, max-age=31536000";
const ONE_HOUR = "public, max-age=3600";

const UNCACHEABLE_PATHS = new Set(["/", "/mcp", "/api/analytics"]);

export function legacyRedirectLocation(pathname: string, search: string): string | null {
  const { defaultLocale } = routing;

  if (
    (LEGACY_EXACT_PATHS as readonly string[]).includes(pathname) ||
    pathname === "/index.html" ||
    pathname === "/home.html"
  ) {
    const destination =
      pathname === "/index.html" || pathname === "/home.html"
        ? `/${defaultLocale}`
        : `/${defaultLocale}${pathname}`;
    return `${destination}${search}`;
  }

  if (
    (pathname.startsWith("/blog/") && pathname !== "/blog/") ||
    (pathname.startsWith("/projects/") && pathname !== "/projects/")
  ) {
    return `/${defaultLocale}${pathname}${search}`;
  }

  return null;
}

export function isContactPath(pathname: string): boolean {
  return pathname === "/en/contact" || pathname === "/pl/contact";
}

export function isUncacheablePath(pathname: string): boolean {
  return UNCACHEABLE_PATHS.has(pathname) || pathname.startsWith("/mcp/");
}

export function edgeCacheDirective(input: {
  pathname: string;
  method: string;
  status: number;
  hasSetCookie: boolean;
}): string | null {
  if (input.method !== "GET" && input.method !== "HEAD") {
    return null;
  }

  if (input.hasSetCookie || isUncacheablePath(input.pathname)) {
    return null;
  }

  if (isContactPath(input.pathname)) {
    return input.status === 200 ? ONE_HOUR : null;
  }

  if (input.status === 200 || input.status === 301 || input.status === 308 || input.status === 404) {
    return ONE_YEAR;
  }

  return null;
}

export function withEdgeCache(request: Request, response: Response): Response {
  const url = new URL(request.url);
  const directive = edgeCacheDirective({
    pathname: url.pathname,
    method: request.method,
    status: response.status,
    hasSetCookie: response.headers.has("set-cookie"),
  });

  if (!directive) {
    if (!isUncacheablePath(url.pathname)) {
      return response;
    }

    const cacheControl = response.headers.get("cache-control") ?? "";
    if (/no-store/i.test(cacheControl)) {
      return response;
    }

    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "private, no-store");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  const headers = new Headers(response.headers);
  headers.set("Cloudflare-CDN-Cache-Control", directive);

  if (isContactPath(url.pathname)) {
    headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
