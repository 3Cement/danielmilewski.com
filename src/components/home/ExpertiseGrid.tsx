import { getTranslations } from "next-intl/server";

interface ExpertiseItem {
  icon: string;
  title: string;
  description: string;
}

export async function ExpertiseGrid() {
  const t = await getTranslations("expertise");
  const items = t.raw("items") as ExpertiseItem[];

  return (
    <section className="py-24 px-4 bg-[var(--color-surface-muted)]">
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
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <span className="text-2xl mb-4 block" aria-hidden="true">
                {item.icon}
              </span>
              <h3 className="text-base font-semibold text-[var(--color-text-base)] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
