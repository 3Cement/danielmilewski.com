import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { absoluteUrl, buildMetadata, type SiteLocale } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { breadcrumbSchema } from "@/lib/schema";
import { StructuredDataScript } from "@/components/ui/StructuredDataScript";

export const dynamic = "force-static";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildMetadata({
    title: t("privacyTitle"),
    description: t("privacyDescription"),
    pathWithoutLocale: "/privacy",
    locale: locale as SiteLocale,
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const year = new Date().getFullYear();
  const sections = [
    {
      title: t("privacyControllerTitle"),
      body: t("privacyControllerBody"),
    },
    {
      title: t("privacyFormTitle"),
      body: t("privacyFormBody"),
    },
    {
      title: t("privacyAnalyticsTitle"),
      body: t("privacyAnalyticsBody"),
    },
    {
      title: t("privacyCookiesTitle"),
      body: t("privacyCookiesBody"),
    },
    {
      title: t("privacyRetentionTitle"),
      body: t("privacyRetentionBody"),
    },
  ];

  const structuredData = JSON.stringify(
    breadcrumbSchema([
      { name: tNav("home"), item: absoluteUrl(locale as SiteLocale, "/") },
      {
        name: t("privacyTitle"),
        item: absoluteUrl(locale as SiteLocale, "/privacy"),
      },
    ]),
  ).replace(/<\/script>/gi, "<\\/script>");

  return (
    <>
      <div className="px-4 pt-10">
        <div className="mx-auto max-w-2xl">
          <Breadcrumbs
            ariaLabel={tCommon("breadcrumbsAriaLabel")}
            locale={locale as "en" | "pl"}
            items={[
              { label: tNav("home"), href: "/" },
              { label: t("privacyTitle") },
            ]}
          />
        </div>
      </div>
      <StructuredDataScript id="privacy-structured-data" json={structuredData} />
      <div className="py-16 px-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-base)] mb-2">
          {t("privacyTitle")}
        </h1>
        <p className="text-sm text-[var(--color-text-faint)] mb-10">
          {year} — {t("privacyUpdates")}
        </p>
        <div className="space-y-8 text-[var(--color-text-muted)] leading-relaxed">
          <p>{t("privacyIntro")}</p>
          {sections.map((section) => (
            <section key={section.title} className="space-y-2">
              <h2 className="text-lg font-semibold text-[var(--color-text-base)]">
                {section.title}
              </h2>
              <p>{section.body}</p>
            </section>
          ))}
          <p>{t("privacyContact")}</p>
        </div>
      </div>
      </div>
    </>
  );
}
