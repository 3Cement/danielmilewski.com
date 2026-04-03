"use client";

import { useTranslations } from "next-intl";

interface ExpectationItem {
  title: string;
  body: string;
}

export function ContactExpectations() {
  const t = useTranslations("contactExpectations");
  const items = t.raw("items") as ExpectationItem[];

  return (
    <section className="mb-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--color-text-base)]">
          {t("heading")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
          {t("sub")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-surface-muted)] p-4"
          >
            <p className="text-sm font-semibold text-[var(--color-text-base)]">
              {item.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
