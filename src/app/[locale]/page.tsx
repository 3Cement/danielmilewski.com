import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata, type SiteLocale } from "@/lib/metadata";
import { HomePageContent } from "@/components/home/HomePageContent";
import { faqPageSchema, homePageSchema, serviceSchema } from "@/lib/schema";

export const dynamic = "force-static";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildMetadata({
    description: t("siteDescription"),
    pathWithoutLocale: "/",
    locale: locale as SiteLocale,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const tFaq = await getTranslations({ locale, namespace: "homeFaq" });
  const faqItems = tFaq.raw("items") as Array<{ question: string; answer: string }>;
  const structuredData = JSON.stringify([
    homePageSchema(locale as SiteLocale),
    serviceSchema(locale as SiteLocale),
    faqPageSchema(faqItems),
  ]).replace(/<\/script>/gi, "<\\/script>");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <HomePageContent locale={locale} />
    </>
  );
}
