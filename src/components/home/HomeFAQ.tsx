import { getTranslations } from "next-intl/server";
import { formatContentDate, getLatestContentDate } from "@/lib/contentDates";

interface FAQItem {
  question: string;
  answer: string;
}

interface HomeFAQProps {
  locale: "en" | "pl";
}

export async function HomeFAQ({ locale }: HomeFAQProps) {
  const t = await getTranslations({ locale, namespace: "homeFaq" });
  const items = t.raw("items") as FAQItem[];
  const latestContentDate = formatContentDate(getLatestContentDate(), locale);

  return (
    <section className="scroll-mt-24 bg-[var(--color-surface-muted)] py-24 px-4" id="faq">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-medium text-[var(--color-accent)] uppercase tracking-wide mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-base)]">
            {t("heading")}
          </h2>
          <p className="mt-3 text-[var(--color-text-muted)] leading-relaxed">
            {t("sub")}
          </p>
          <p className="mt-4 text-sm text-[var(--color-text-faint)]">
            {t("updatedLabel")}: {latestContentDate}
          </p>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.question}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm"
            >
              <h3 className="text-base font-semibold text-[var(--color-text-base)]">
                {item.question}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
