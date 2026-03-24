import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://danielmilewski.com";
export const SITE_NAME = "Daniel Milewski";
export const SITE_DESCRIPTION =
  "Senior Python Developer — backend systems, APIs, and automation.";
export const TWITTER_HANDLE = "@danielmilewski";
export const GITHUB_URL = "https://github.com/3Cement";
export const LINKEDIN_URL = "https://www.linkedin.com/in/daniel-milewski/";
export const EMAIL = "hello@danielmilewski.dev";

/** Local file in /public — professional headshot. */
export const PROFILE_IMAGE_PATH = "/daniel-milewski.jpg";

export const CV_URL_EN = "/cv/CV_DANIEL_MILEWSKI_ENG_25.pdf";
export const CV_URL_PL = "/cv/CV_DANIEL_MILEWSKI_POL_25.pdf";

export function profileImageAbsoluteUrl(): string {
  const base = SITE_URL.replace(/\/$/, "");
  return `${base}${PROFILE_IMAGE_PATH}`;
}

export type SiteLocale = "en" | "pl";

export function absoluteUrl(locale: SiteLocale, pathWithoutLocale: string): string {
  const path = pathWithoutLocale === "/" ? "" : pathWithoutLocale;
  if (locale === "en") {
    return `${SITE_URL}${path}`;
  }
  return `${SITE_URL}/pl${path}`;
}

const defaultOgImagePath = "/opengraph-image";

export function buildMetadata({
  title,
  description,
  pathWithoutLocale,
  locale,
  image,
  type = "website",
  /** When set, canonical and openGraph.url use this path (e.g. "/" for /main duplicate of home). */
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
  const metaTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Python Developer`;
  const metaDescription = description ?? SITE_DESCRIPTION;
  const canonical = absoluteUrl(locale, canonicalPathWithoutLocale ?? pathWithoutLocale);
  const ogImage = image ?? defaultOgImagePath;

  return {
    title: metaTitle,
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
      title: metaTitle,
      description: metaDescription,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: metaTitle }],
      type,
      locale,
      alternateLocale: locale === "en" ? "pl" : "en",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
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
