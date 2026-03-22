import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://danielmilewski.com";
export const SITE_NAME = "Daniel Milewski";
export const SITE_DESCRIPTION =
  "Senior Python Developer building AI-powered products, backend systems and smart automation.";
export const TWITTER_HANDLE = "@danielmilewski";
export const GITHUB_URL = "https://github.com/3Cement";
export const LINKEDIN_URL = "https://www.linkedin.com/in/daniel-milewski/";
export const EMAIL = "hello@danielmilewski.dev";

export function buildMetadata({
  title,
  description,
  path: urlPath = "",
  image,
  type = "website",
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const metaTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Python & AI Developer`;
  const metaDescription = description ?? SITE_DESCRIPTION;
  const url = `${SITE_URL}${urlPath}`;
  const ogImage = image ?? `${SITE_URL}/og-default.png`;

  return {
    title: metaTitle,
    description: metaDescription,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: metaTitle }],
      type,
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
