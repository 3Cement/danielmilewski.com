import { localizeHref, type AppLocale } from "@/lib/localeHref";

const ANCHOR_HREF_RE = /(<a\b[^>]*?\shref=)(["'])(\/[^"']*)(\2)/gi;

export function localizeHtmlContent(locale: AppLocale, html: string): string {
  return html.replace(
    ANCHOR_HREF_RE,
    (_match, prefix: string, quote: string, href: string) =>
      `${prefix}${quote}${localizeHref(locale, href)}${quote}`,
  );
}
