import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { absoluteUrl, buildMetadata, type SiteLocale } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/PageHeader";
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
      <PageHeader
        locale={locale as "en" | "pl"}
        title={t("privacyTitle")}
        breadcrumbs={{
          ariaLabel: tCommon("breadcrumbsAriaLabel"),
          items: [{ label: tNav("home"), href: "/" }, { label: t("privacyTitle") }],
        }}
      >
        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {year} · {t("privacyUpdates")}
        </p>
      </PageHeader>
      <StructuredDataScript id="privacy-structured-data" json={structuredData} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="space-y-10 text-lg leading-relaxed text-[var(--color-text-muted)]">
          <p>{t("privacyIntro")}</p>
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="heading-rule">{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <p className="border-l-4 border-[var(--color-signal)] pl-4">{t("privacyContact")}</p>
        </div>
      </div>
    </>
  );
}
