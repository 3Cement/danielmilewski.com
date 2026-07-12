import { getTranslations } from "next-intl/server";

interface CredibilityStripProps {
  locale: string;
}

export async function CredibilityStrip({ locale }: CredibilityStripProps) {
  const t = await getTranslations({ locale, namespace: "credibility" });
  const tags = t.raw("tags") as string[];

  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-surface-muted)] py-6 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tags.map((cap, index) => {
            const isLast = index === tags.length - 1;
            return (
              <span
                key={cap}
                className={
                  "inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs font-medium " +
                  (isLast
                    ? "border-[var(--color-accent-2)]/40 text-[var(--color-accent-2)]"
                    : "border-[var(--color-border)] text-[var(--color-text-muted)]")
                }
              >
                {cap}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
