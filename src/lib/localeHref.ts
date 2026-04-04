export type AppLocale = "en" | "pl";

const NON_LOCALIZED_PATH_PREFIXES = [
  "/_next/",
  "/images/",
  "/cv/",
  "/favicon",
  "/icon",
  "/apple-icon",
  "/opengraph-image",
  "/twitter-image",
] as const;

const NON_LOCALIZED_EXACT_PATHS = new Set([
  "/feed.xml",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
  "/site.webmanifest",
]);

function splitHref(href: string): { pathname: string; suffix: string } {
  const [pathname = href, suffix = ""] = href.split(/([?#].*)/, 2);
  return { pathname, suffix };
}

export function shouldLocalizeHref(href: string): boolean {
  if (!href.startsWith("/") || href.startsWith("//")) {
    return false;
  }

  const { pathname } = splitHref(href);

  if (pathname === "/" || pathname === "") {
    return true;
  }

  if (NON_LOCALIZED_EXACT_PATHS.has(pathname)) {
    return false;
  }

  return !NON_LOCALIZED_PATH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
}

export function localizeHref(locale: AppLocale, href: string): string {
  if (!shouldLocalizeHref(href)) {
    return href;
  }

  const { pathname, suffix } = splitHref(href);

  if (/^\/(en|pl)(?=\/|$)/.test(pathname)) {
    return href;
  }

  const localizedPathname =
    pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return `${localizedPathname}${suffix}`;
}
