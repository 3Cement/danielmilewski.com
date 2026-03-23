"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  function switchLocale(newLocale: string) {
    if (newLocale === locale) return;

    // Current pathname includes locale prefix for non-default: /pl/about
    // For default locale EN: /about
    let newPath: string;

    if (locale === "en") {
      // Going from EN to PL: prepend /pl
      newPath = `/pl${pathname}`;
    } else {
      // Going from PL to EN: strip /pl prefix
      newPath = pathname.replace(/^\/pl/, "") || "/";
    }

    startTransition(() => {
      router.push(newPath);
    });
  }

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => switchLocale("en")}
        className={`px-1.5 py-1 text-sm rounded transition-opacity ${
          locale === "en" ? "opacity-100 font-medium" : "opacity-40 hover:opacity-70"
        }`}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
      >
        🇬🇧
      </button>
      <button
        onClick={() => switchLocale("pl")}
        className={`px-1.5 py-1 text-sm rounded transition-opacity ${
          locale === "pl" ? "opacity-100 font-medium" : "opacity-40 hover:opacity-70"
        }`}
        aria-label="Przełącz na polski"
        aria-pressed={locale === "pl"}
      >
        🇵🇱
      </button>
    </div>
  );
}
