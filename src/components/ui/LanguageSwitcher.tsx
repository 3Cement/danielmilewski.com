"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface LanguageSwitcherProps {
  locale: "en" | "pl";
}

function localizePathname(pathname: string, locale: "en" | "pl") {
  const normalizedPathname =
    pathname.replace(/^\/(en|pl)(?=\/|$)/, "") || "/";

  if (normalizedPathname === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalizedPathname}`;
}

function persistLocale(locale: "en" | "pl") {
  document.cookie = `NEXT_LOCALE=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname() || `/${locale}`;
  const englishPath = localizePathname(pathname, "en");
  const polishPath = localizePathname(pathname, "pl");

  return (
    <div className="flex items-center gap-0.5">
      <Link
        href={englishPath}
        prefetch={false}
        onClick={() => persistLocale("en")}
        className={`px-1.5 py-1 text-sm rounded transition-colors ${
          locale === "en"
            ? "text-[var(--color-text-base)] font-medium"
            : "text-[var(--color-text-muted)] hover:text-[var(--color-text-base)]"
        }`}
        aria-label="EN — switch to English"
        aria-current={locale === "en" ? "page" : undefined}
      >
        EN
      </Link>
      <Link
        href={polishPath}
        prefetch={false}
        onClick={() => persistLocale("pl")}
        className={`px-1.5 py-1 text-sm rounded transition-colors ${
          locale === "pl"
            ? "text-[var(--color-text-base)] font-medium"
            : "text-[var(--color-text-muted)] hover:text-[var(--color-text-base)]"
        }`}
        aria-label="PL — przełącz na polski"
        aria-current={locale === "pl" ? "page" : undefined}
      >
        PL
      </Link>
    </div>
  );
}
