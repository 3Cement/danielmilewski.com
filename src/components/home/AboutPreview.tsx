import { getTranslations } from "next-intl/server";
import { LocalizedLink } from "@/components/ui/LocalizedLink";

interface AboutPreviewProps {
  locale: string;
}

export async function AboutPreview({ locale }: AboutPreviewProps) {
  const t = await getTranslations({ locale, namespace: "about" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <section className="scroll-mt-24 py-24 px-4" id="about">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-base)] mb-6">
            {t("heading")}
          </h2>
          <div className="space-y-4 text-[var(--color-text-muted)] leading-relaxed">
            <p>{t("bio1")}</p>
            <p>{t("bio2")}</p>
          </div>
          <LocalizedLink
            locale={locale as "en" | "pl"}
            href="/about"
            className="inline-flex items-center gap-1.5 mt-8 text-sm font-medium text-[var(--color-accent)] hover:gap-2.5 transition-all"
          >
            {tCommon("moreAbout")}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}
