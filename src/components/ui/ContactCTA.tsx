import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

interface ContactCTAProps {
  locale: string;
}

export async function ContactCTA({ locale }: ContactCTAProps) {
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-base)] sm:text-4xl">
          {t("contactHeading")}
        </h2>
        <p className="mt-4 text-lg text-[var(--color-text-muted)]">{t("contactSub")}</p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-accent-muted)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            {t("getInTouch")}
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-[var(--color-text-base)] ring-1 ring-inset ring-[var(--color-border)] hover:bg-[var(--color-surface-muted)] transition-colors"
          >
            {t("viewProjects")}
          </Link>
        </div>
      </div>
    </section>
  );
}
