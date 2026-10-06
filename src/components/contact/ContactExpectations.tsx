import { getTranslations } from "next-intl/server";

interface ExpectationItem {
  title: string;
  body: string;
}

interface ContactExpectationsProps {
  locale: string;
  compact?: boolean;
}

export async function ContactExpectations({
  locale,
  compact = false,
}: ContactExpectationsProps) {
  const t = await getTranslations({ locale, namespace: "contactExpectations" });
  const items = t.raw("items") as ExpectationItem[];

  return (
    <section className="mb-8 border-t-[3px] border-[var(--color-text-base)] pt-6">
      <div className="mb-6">
        <h2 className="font-expanded text-2xl font-extrabold uppercase tracking-tight text-[var(--color-text-base)]">
          {t("heading")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
          {t("sub")}
        </p>
      </div>

      <div
        className={
          compact
            ? "grid grid-cols-1 gap-4"
            : "grid grid-cols-1 gap-4 sm:grid-cols-3"
        }
      >
        {items.map((item) => (
          <article
            key={item.title}
            className="border-b border-[var(--color-border)] pb-4"
          >
            <p className="font-bold text-[var(--color-text-base)]">
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
