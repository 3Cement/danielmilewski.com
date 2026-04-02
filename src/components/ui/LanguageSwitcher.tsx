"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname() || "/";

  return (
    <div className="flex items-center gap-0.5">
      <Link
        href={pathname}
        locale="en"
        prefetch={false}
        className={`px-1.5 py-1 text-sm rounded transition-opacity ${
          locale === "en" ? "opacity-100 font-medium" : "opacity-40 hover:opacity-70"
        }`}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
        aria-current={locale === "en" ? "page" : undefined}
      >
        EN
      </Link>
      <Link
        href={pathname}
        locale="pl"
        prefetch={false}
        className={`px-1.5 py-1 text-sm rounded transition-opacity ${
          locale === "pl" ? "opacity-100 font-medium" : "opacity-40 hover:opacity-70"
        }`}
        aria-label="Przełącz na polski"
        aria-pressed={locale === "pl"}
        aria-current={locale === "pl" ? "page" : undefined}
      >
        PL
      </Link>
    </div>
  );
}
