import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://danielmilewski.com";
export const SITE_NAME = "Daniel Milewski";
export const SITE_DESCRIPTION =
  "Software engineer focused on backend systems, APIs, automation, and AI-enabled products.";
export const TWITTER_HANDLE = "@33cement";
export const GITHUB_URL = "https://github.com/3Cement";
export const LINKEDIN_URL = "https://www.linkedin.com/in/daniel-milewski/";
export const X_URL = "https://x.com/33cement";
export const EMAIL = "danielmilewski123@gmail.com";

/** Public business registry listing (CEIDG / Monitor Firm). */
export const COMPANY_REGISTRY_URL =
  "https://monitorfirm.pb.pl/firma/daniel-milewski-52277208100000/";

export const COMPANY_NIP = "8442338935";
export const COMPANY_REGON = "522772081";

/** Local file in /public — professional headshot. */
export const PROFILE_IMAGE_PATH = "/daniel-milewski.webp";

export const CV_URL_EN = "/cv/cv-en.pdf";
export const CV_URL_PL = "/cv/cv-pl.pdf";

export function profileImageAbsoluteUrl(): string {
  const base = SITE_URL.replace(/\/$/, "");
  return `${base}${PROFILE_IMAGE_PATH}`;
}

export type SiteLocale = "en" | "pl";

export function absoluteUrl(locale: SiteLocale, pathWithoutLocale: string): string {
  const base = SITE_URL.replace(/\/$/, "");
  const path = pathWithoutLocale === "/" ? "" : pathWithoutLocale;
  const localePrefix = locale === "en" ? "/en" : "/pl";

  return `${base}${localePrefix}${path}`;
}

const defaultOgImagePath = "/opengraph-image";

function toAbsoluteSiteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const base = SITE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export function buildMetadata({
  title,
  description,
  pathWithoutLocale,
  locale,
  image,
  type = "website",
  /** When set, canonical and openGraph.url use this path instead of the current route. */
  canonicalPathWithoutLocale,
}: {
  title?: string;
  description?: string;
  pathWithoutLocale: string;
  locale: SiteLocale;
  image?: string;
  type?: "website" | "article";
  canonicalPathWithoutLocale?: string;
}): Metadata {
  const socialTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Software Engineer`;
  const metaDescription = description ?? SITE_DESCRIPTION;
  const canonical = absoluteUrl(locale, canonicalPathWithoutLocale ?? pathWithoutLocale);
  const ogImage = toAbsoluteSiteUrl(image ?? defaultOgImagePath);

  return {
    ...(title ? { title } : {}),
    description: metaDescription,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl("en", pathWithoutLocale),
        pl: absoluteUrl("pl", pathWithoutLocale),
        "x-default": absoluteUrl("en", pathWithoutLocale),
      },
    },
    openGraph: {
      title: socialTitle,
      description: metaDescription,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: socialTitle }],
      type,
      locale,
      alternateLocale: locale === "en" ? "pl" : "en",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: metaDescription,
      images: [ogImage],
      creator: TWITTER_HANDLE,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
