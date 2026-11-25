import { cookies, headers } from "next/headers";
import {
  getLocaleFromAcceptLanguage,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
} from "./localePreference";

export async function getRequestLocale() {
  const cookieStore = await cookies();
  const cookieLocale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);

  if (cookieLocale) {
    return cookieLocale;
  }

  const headerStore = await headers();
  return getLocaleFromAcceptLanguage(headerStore.get("accept-language"));
}
