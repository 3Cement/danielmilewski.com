import { getTranslations } from "next-intl/server";
import { formatContentDate, getLatestContentDate } from "@/lib/contentDates";
import { SectionHeading } from "@/components/home/SectionHeading";

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
    <section className="scroll-mt-24" id="faq">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("heading")} sub={t("sub")} />
        <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.question} className="border-b border-[var(--color-border)] py-6">
              <h3 className="text-lg font-bold text-[var(--color-text-base)]">{item.question}</h3>
              <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">{item.answer}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm text-[var(--color-text-faint)]">
          {t("updatedLabel")}: {latestContentDate}
        </p>
      </div>
    </section>
  );
}
