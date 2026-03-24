import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata, type SiteLocale } from "@/lib/metadata";
import { HomePageContent } from "@/components/home/HomePageContent";

export const dynamic = "force-static";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildMetadata({
    title: t("mainPageTitle"),
    description: t("siteDescription"),
    pathWithoutLocale: "/main",
    locale: locale as SiteLocale,
    canonicalPathWithoutLocale: "/",
  });
}

export default async function MainPage({ params }: Props) {
  const { locale } = await params;
  return <HomePageContent locale={locale} />;
}
