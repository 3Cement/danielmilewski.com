import { getTranslations } from "next-intl/server";
import { TrackedLink } from "@/components/ui/TrackedLink";

interface ContactCTAProps {
  locale: string;
}

export async function ContactCTA({ locale }: ContactCTAProps) {
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <section className="scroll-mt-24 py-24 px-4" id="contact">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-base)] sm:text-4xl">
          {t("contactHeading")}
        </h2>
        <p className="mt-4 text-lg text-[var(--color-text-muted)]">{t("contactSub")}</p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <TrackedLink
            locale={locale as "en" | "pl"}
            href="/contact"
            analytics={{
              event: "cta_click",
              locale: locale as "en" | "pl",
              ctaId: "contact_cta_primary",
              surface: "contact_cta",
            }}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-accent-muted)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            {t("getInTouch")}
          </TrackedLink>
          <TrackedLink
            locale={locale as "en" | "pl"}
            href="/projects"
            analytics={{
              event: "cta_click",
              locale: locale as "en" | "pl",
              ctaId: "contact_cta_secondary",
              surface: "contact_cta",
            }}
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-[var(--color-text-base)] ring-1 ring-inset ring-[var(--color-border)] hover:bg-[var(--color-surface-muted)] transition-colors"
          >
            {t("viewProjects")}
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
