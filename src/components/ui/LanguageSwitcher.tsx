"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  function switchLocale(newLocale: string) {
    if (newLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  }

  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={() => switchLocale("en")}
        className={`px-1.5 py-1 text-sm rounded transition-opacity ${
          locale === "en" ? "opacity-100 font-medium" : "opacity-40 hover:opacity-70"
        }`}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchLocale("pl")}
        className={`px-1.5 py-1 text-sm rounded transition-opacity ${
          locale === "pl" ? "opacity-100 font-medium" : "opacity-40 hover:opacity-70"
        }`}
        aria-label="Przełącz na polski"
        aria-pressed={locale === "pl"}
      >
        PL
      </button>
    </div>
  );
}
