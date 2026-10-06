"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

const errorMessages = {
  en: {
    errorTitle: "Something went wrong",
    errorRetry: "Try again",
  },
  pl: {
    errorTitle: "Coś poszło nie tak",
    errorRetry: "Spróbuj ponownie",
  },
} as const;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "pl" ? "pl" : "en";
  const t = errorMessages[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-24 px-4">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-expanded mb-4 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-text-base)]">{t.errorTitle}</h1>
        <button
          type="button"
          onClick={() => reset()}
          className="btn btn-primary"
        >
          {t.errorRetry}
        </button>
      </div>
    </div>
  );
}
