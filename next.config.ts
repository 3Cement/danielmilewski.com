import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
    // Required for Cloudflare Pages (@cloudflare/next-on-pages): no Next.js image optimizer API.
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
