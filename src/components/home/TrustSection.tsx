import { getTranslations } from "next-intl/server";

interface CompanyItem {
  name: string;
  role: string;
  period: string;
}

interface TrustSectionProps {
  locale: string;
}

export async function TrustSection({ locale }: TrustSectionProps) {
  const t = await getTranslations({ locale, namespace: "trust" });
  const companies = t.raw("companies") as CompanyItem[];

  return (
    <section
      className="scroll-mt-24 border-b border-[var(--color-border)]"
      id="trust"
      aria-labelledby="trust-heading"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-[auto_repeat(3,1fr)] lg:px-8">
        <h2
          id="trust-heading"
          className="font-condensed text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)] sm:col-span-2 lg:col-span-1"
        >
          {t("label")}
        </h2>
        {companies.map((company) => (
          <div key={company.name}>
            <p className="font-expanded text-xl font-extrabold tracking-tight text-[var(--color-text-base)]">
              {company.name}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              {company.role} · {company.period}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
