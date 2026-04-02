import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LocaleSync } from "@/components/ui/LocaleSync";
import { personSchema, websiteSchema } from "@/lib/schema";
import { routing } from "@/i18n/routing";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    description: t("siteDescription"),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "pl")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const siteLocale = locale as "en" | "pl";
  const structuredData = JSON.stringify([
    personSchema(siteLocale),
    websiteSchema(siteLocale),
  ]).replace(/<\/script>/gi, "<\\/script>");

  return (
    <>
      <LocaleSync locale={siteLocale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredData,
        }}
      />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </NextIntlClientProvider>
    </>
  );
}
