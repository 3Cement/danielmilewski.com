import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata, type SiteLocale } from "@/lib/metadata";

export const dynamic = "force-static";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildMetadata({
    title: locale === "pl" ? "Polityka prywatności" : "Privacy policy",
    description: t("privacyDescription"),
    pathWithoutLocale: "/privacy",
    locale: locale as SiteLocale,
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  const year = new Date().getFullYear();

  return (
    <div className="py-16 px-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-base)] mb-2">
          {t("privacyTitle")}
        </h1>
        <p className="text-sm text-[var(--color-text-faint)] mb-10">
          {year} — {t("privacyUpdates")}
        </p>
        <div className="space-y-6 text-[var(--color-text-muted)] leading-relaxed">
          <p>{t("privacyIntro")}</p>
          <p>{t("privacyContact")}</p>
        </div>
      </div>
    </div>
  );
}
