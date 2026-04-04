import {
  SITE_NAME,
  SITE_DESCRIPTION,
  GITHUB_URL,
  LINKEDIN_URL,
  EMAIL,
  absoluteUrl,
  profileImageAbsoluteUrl,
  type SiteLocale,
} from "./metadata";

export function personSchema(locale: SiteLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    image: profileImageAbsoluteUrl(),
    url: absoluteUrl(locale, "/"),
    email: EMAIL,
    jobTitle: "Senior Python Developer",
    description: SITE_DESCRIPTION,
    sameAs: [GITHUB_URL, LINKEDIN_URL],
    knowsAbout: [
      "Python",
      "Artificial Intelligence",
      "Large Language Models",
      "FastAPI",
      "Backend Engineering",
      "Automation",
      "APIs",
    ],
  };
}

export function websiteSchema(locale: SiteLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(locale, "/"),
    description: SITE_DESCRIPTION,
    author: { "@type": "Person", name: SITE_NAME },
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; item: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

export function blogPostingSchema({
  title,
  excerpt,
  date,
  slug,
  tags,
  locale,
}: {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  tags: string[];
  locale: SiteLocale;
}) {
  const pageUrl = absoluteUrl(locale, `/blog/${slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    datePublished: date,
    url: pageUrl,
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: absoluteUrl(locale, "/"),
    },
    keywords: tags.join(", "),
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
      url: absoluteUrl(locale, "/"),
    },
  };
}

export function softwareSchema({
  title,
  description,
  stack,
  slug,
  repo,
  locale,
}: {
  title: string;
  description: string;
  stack: string[];
  slug: string;
  repo?: string;
  locale: SiteLocale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: title,
    description,
    url: absoluteUrl(locale, `/projects/${slug}`),
    codeRepository: repo,
    programmingLanguage: stack,
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: absoluteUrl(locale, "/"),
    },
  };
}
