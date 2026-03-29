import { cookies, headers } from "next/headers";
import { routing } from "./routing";

type AppLocale = (typeof routing.locales)[number];

const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

function isSupportedLocale(value: string | undefined): value is AppLocale {
  return routing.locales.includes(value as AppLocale);
}

function normalizeLocale(value: string | undefined): AppLocale | null {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase().split("-")[0];

  return isSupportedLocale(normalized) ? normalized : null;
}

function getLocaleFromAcceptLanguage(headerValue: string | null): AppLocale {
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

export async function getRequestLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const cookieLocale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);

  if (cookieLocale) {
    return cookieLocale;
  }

  const headerStore = await headers();
  return getLocaleFromAcceptLanguage(headerStore.get("accept-language"));
}
