"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-24 px-4">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text-base)] mb-4">{t("errorTitle")}</h1>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-accent-muted)] transition-colors"
        >
          {t("errorRetry")}
        </button>
      </div>
    </div>
  );
}
