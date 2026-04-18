import { localizeHref, type AppLocale } from "@/lib/localeHref";

export const WEBMCP_PAGE_PATHS = {
  home: "/",
  about: "/about",
  projects: "/projects",
  blog: "/blog",
  contact: "/contact",
  privacy: "/privacy",
} as const;

export const WEBMCP_HOME_SECTIONS = [
  "hero",
  "trust",
  "projects",
  "expertise",
  "about",
  "writing",
  "faq",
  "contact",
] as const;

export type WebMcpPageName = keyof typeof WEBMCP_PAGE_PATHS;
export type WebMcpHomeSection = typeof WEBMCP_HOME_SECTIONS[number];

export interface WebMcpRouteOption {
  slug: string;
  title: string;
  href: string;
}

export function getWebMcpPageHref(locale: AppLocale, page: WebMcpPageName): string {
  return localizeHref(locale, WEBMCP_PAGE_PATHS[page]);
}

export function getWebMcpProjectHref(locale: AppLocale, slug: string): string {
  return localizeHref(locale, `/projects/${slug}`);
}

export function getWebMcpPostHref(locale: AppLocale, slug: string): string {
  return localizeHref(locale, `/blog/${slug}`);
}

export function getWebMcpHomeSectionHref(
  locale: AppLocale,
  section: WebMcpHomeSection,
): string {
  return localizeHref(locale, `/#${section}`);
}

export function replaceLocaleInPathname(pathname: string, locale: AppLocale): string {
  const normalizedPathname =
    pathname.startsWith("/") || pathname === "" ? pathname || "/" : `/${pathname}`;

  if (/^\/(en|pl)(?=\/|$)/.test(normalizedPathname)) {
    return normalizedPathname.replace(/^\/(en|pl)(?=\/|$)/, `/${locale}`);
  }

  return localizeHref(locale, normalizedPathname);
}
