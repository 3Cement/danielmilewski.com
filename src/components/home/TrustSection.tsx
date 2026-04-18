import { getTranslations } from "next-intl/server";

interface TrustItem {
  label: string;
  value: string;
  note: string;
}

interface CompanyItem {
  name: string;
  role: string;
  domain: string;
}

interface TrustSectionProps {
  locale: string;
}

export async function TrustSection({ locale }: TrustSectionProps) {
  const t = await getTranslations({ locale, namespace: "trust" });
  const items = t.raw("items") as TrustItem[];
  const companies = t.raw("companies") as CompanyItem[];

  return (
    <section className="scroll-mt-24 bg-[var(--color-surface-muted)] py-24 px-4" id="trust">
      <div className="mx-auto max-w-6xl">
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
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-[var(--color-text-faint)] uppercase tracking-widest">
                {item.label}
              </p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-text-base)]">
                {item.value}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {item.note}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
          <p className="text-sm font-medium text-[var(--color-text-faint)] uppercase tracking-widest">
            {t("companiesHeading")}
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {companies.map((company) => (
              <article
                key={company.name}
                className="rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-surface-muted)] p-4"
              >
                <p className="text-sm font-semibold text-[var(--color-text-base)]">
                  {company.name}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {company.role}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-faint)]">
                  {company.domain}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
