import { getTranslations } from "next-intl/server";

export async function CredibilityStrip() {
  const t = await getTranslations("credibility");
  const tags = t.raw("tags") as string[];

  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-surface-muted)] py-6 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {tags.map((cap) => (
            <span
              key={cap}
              className="text-sm font-medium text-[var(--color-text-muted)]"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
