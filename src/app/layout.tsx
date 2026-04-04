import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AnalyticsBeacon } from "@/components/ui/AnalyticsBeacon";
import { AnalyticsEventScript } from "@/components/ui/AnalyticsEventScript";
import { ThemeInitializer } from "@/components/ui/ThemeInitializer";
import { SITE_URL, SITE_NAME } from "@/lib/metadata";

const cfAnalyticsToken = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;

const geistSans = localFont({
  src: [
    { path: "./fonts/geist-latin.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/geist-latin-ext.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const geistMono = localFont({
  src: [
    { path: "./fonts/geist-mono-latin.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/geist-mono-latin-ext.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Python Developer`,
    template: `%s — ${SITE_NAME}`,
  },
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
  },
  twitter: {
    card: "summary_large_image",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head />
      <body className="min-h-screen flex flex-col">
        <ThemeInitializer />
        <AnalyticsEventScript />
        {children}
        <AnalyticsBeacon token={cfAnalyticsToken} />
      </body>
    </html>
  );
}
