import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import createNextIntlPlugin from "next-intl/plugin";
import { routing } from "./src/i18n/routing";
import { createHomepageAgentDiscoveryHeaders } from "./src/lib/agentDiscovery";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  allowedDevOrigins: ["127.0.0.1", "192.168.0.115"],
  htmlLimitedBots: /.*/,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return createHomepageAgentDiscoveryHeaders(routing.locales);
  },
  async redirects() {
    const { defaultLocale, locales } = routing;

    const mainRedirects = locales.map((locale) => ({
      source: `/${locale}/main`,
      destination: `/${locale}`,
      permanent: true,
    }));

    const legacyPaths = ["/about", "/blog", "/contact", "/projects", "/privacy"] as const;
    const localelessRedirects = legacyPaths.map((path) => ({
      source: path,
      destination: `/${defaultLocale}${path}`,
      permanent: true,
    }));

    const legacyFileRedirects = [
      { source: "/index.html", destination: `/${defaultLocale}`, permanent: true as const },
      { source: "/home.html", destination: `/${defaultLocale}`, permanent: true as const },
    ];

    return [...mainRedirects, ...localelessRedirects, ...legacyFileRedirects];
  },
};

if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

export default withNextIntl(nextConfig);
