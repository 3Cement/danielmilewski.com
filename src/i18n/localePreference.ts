import { routing } from "./routing";

export type AppLocale = (typeof routing.locales)[number];

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export function isSupportedLocale(value: string | undefined): value is AppLocale {
  return routing.locales.includes(value as AppLocale);
}

export function normalizeLocale(value: string | undefined): AppLocale | null {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase().split("-")[0];

  return isSupportedLocale(normalized) ? normalized : null;
}

export function readCookie(header: string | null, name: string): string | undefined {
  if (!header) {
    return undefined;
  }

  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = part.slice(0, separator).trim();
    if (key !== name) {
      continue;
    }

    const raw = part.slice(separator + 1).trim();
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }

  return undefined;
}

export function getLocaleFromAcceptLanguage(headerValue: string | null): AppLocale {
  if (!headerValue) {
    return routing.defaultLocale;
  }

  const preferredLocales = headerValue
    .split(",")
    .map((part) => {
      const [locale, ...params] = part.trim().split(";");
      const qParam = params.find((param) => param.trim().startsWith("q="));
      const quality = qParam ? Number.parseFloat(qParam.split("=")[1] ?? "1") : 1;

      return {
        locale: normalizeLocale(locale),
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter((entry): entry is { locale: AppLocale; quality: number } => Boolean(entry.locale))
    .sort((a, b) => b.quality - a.quality);

  return preferredLocales[0]?.locale ?? routing.defaultLocale;
}

export function localeFromRequest(cookieHeader: string | null, acceptLanguage: string | null): AppLocale {
  const cookieLocale = normalizeLocale(readCookie(cookieHeader, LOCALE_COOKIE_NAME));

  if (cookieLocale) {
    return cookieLocale;
  }

  return getLocaleFromAcceptLanguage(acceptLanguage);
}
