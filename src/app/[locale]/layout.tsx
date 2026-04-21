import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsConsentBanner } from "@/components/ui/AnalyticsConsentBanner";
import { GoogleAnalytics } from "@/components/ui/GoogleAnalytics";
import { AnalyticsBeacon } from "@/components/ui/AnalyticsBeacon";
import { AnalyticsEventScript } from "@/components/ui/AnalyticsEventScript";
import { ThemeInitializer } from "@/components/ui/ThemeInitializer";
import { ThemeSync } from "@/components/ui/ThemeSync";
import { WebMcpProvider } from "@/components/ui/WebMcpProvider";
import { StructuredDataScript } from "@/components/ui/StructuredDataScript";
import { personSchema, websiteSchema } from "@/lib/schema";
import { SITE_URL, SITE_NAME } from "@/lib/metadata";
import {
  buildWebMcpPostOptions,
  buildWebMcpProjectOptions,
} from "@/lib/webmcpContent";
import { routing } from "@/i18n/routing";

const cfAnalyticsToken = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
const defaultSocialImage = `${SITE_URL}/opengraph-image`;

const geistSans = localFont({
  src: [
    { path: "../fonts/geist-latin.woff2", weight: "100 900", style: "normal" },
    { path: "../fonts/geist-latin-ext.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const geistMono = localFont({
  src: [
    { path: "../fonts/geist-mono-latin.woff2", weight: "100 900", style: "normal" },
    { path: "../fonts/geist-mono-latin-ext.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: {
      default: `${SITE_NAME} — Software Engineer`,
      template: `%s — ${SITE_NAME}`,
    },
    description: t("siteDescription"),
    metadataBase: new URL(SITE_URL),
    icons: {
      icon: [
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
        { url: "/logo.svg", type: "image/svg+xml", sizes: "any" },
      ],
      shortcut: [{ url: "/favicon-32.png", type: "image/png" }],
      apple: [{ url: "/logo-256.png", sizes: "256x256", type: "image/png" }],
    },
    openGraph: {
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: defaultSocialImage,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — Software Engineer`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [defaultSocialImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      types: {
        "application/rss+xml": `${SITE_URL}/feed.xml`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "pl")) {
    notFound();
  }

  setRequestLocale(locale);
  const siteLocale = locale as "en" | "pl";
  const [tCookie, structuredData] = await Promise.all([
    getTranslations({ locale: siteLocale, namespace: "cookieConsent" }),
    Promise.resolve(
      JSON.stringify([personSchema(siteLocale), websiteSchema(siteLocale)]).replace(
        /<\/script>/gi,
        "<\\/script>",
      ),
    ),
  ]);
  const webMcpProjectOptions = buildWebMcpProjectOptions(siteLocale);
  const webMcpPostOptions = buildWebMcpPostOptions(siteLocale);

  return (
    <html lang={siteLocale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col`}
      >
        <ThemeInitializer />
        <ThemeSync />
        <WebMcpProvider
          locale={siteLocale}
          projectOptions={webMcpProjectOptions}
          postOptions={webMcpPostOptions}
        />
        <AnalyticsEventScript />
        <Script id="persist-locale" strategy="beforeInteractive">
          {`document.cookie="NEXT_LOCALE=${siteLocale}; Path=/; Max-Age=31536000; SameSite=Lax";`}
        </Script>
        <StructuredDataScript id="site-structured-data" json={structuredData} />
        <Navbar locale={siteLocale} />
        <main className="flex-1">{children}</main>
        <Footer locale={siteLocale} />
        <AnalyticsConsentBanner
          title={tCookie("title")}
          body={tCookie("body")}
          acceptLabel={tCookie("accept")}
          rejectLabel={tCookie("reject")}
        />
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <AnalyticsBeacon token={cfAnalyticsToken} />
      </body>
    </html>
  );
}
