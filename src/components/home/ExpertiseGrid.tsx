import { getTranslations } from "next-intl/server";

interface ExpertiseItem {
  icon: string;
  title: string;
  description: string;
}

/** Short mono codes replacing emoji icons, matched to item order in messages/*.json. */
const EXPERTISE_CODES = ["PY", "API", "OPS", "AI", "FE"];
/** Index of the AI/LLM item — rendered in the second (coral) accent. */
const AI_INDEX = 3;

interface ExpertiseGridProps {
  locale: string;
}

export async function ExpertiseGrid({ locale }: ExpertiseGridProps) {
  const t = await getTranslations({ locale, namespace: "expertise" });
  const items = t.raw("items") as ExpertiseItem[];

  return (
    <section
      className="scroll-mt-24 bg-[var(--color-surface-muted)] py-24 px-4"
      id="expertise"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-base)]">
            {t("heading")}
          </h2>
          <p className="mt-2 text-[var(--color-text-muted)] max-w-xl">
            {t("sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, index) => {
            const isAi = index === AI_INDEX;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
              >
                <span
                  className={
                    "mb-4 inline-flex h-8 items-center rounded-md border px-2.5 font-mono text-xs font-bold tracking-wide " +
                    (isAi
                      ? "border-[var(--color-accent-2)]/40 text-[var(--color-accent-2)]"
                      : "border-[var(--color-accent)]/30 text-[var(--color-accent)]")
                  }
                  aria-hidden="true"
                >
                  {EXPERTISE_CODES[index] ?? ""}
                </span>
                <h3 className="text-base font-semibold text-[var(--color-text-base)] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
