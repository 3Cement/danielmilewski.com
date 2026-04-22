import {
  SITE_NAME,
  SITE_DESCRIPTION,
  GITHUB_URL,
  LINKEDIN_URL,
  X_URL,
  EMAIL,
  absoluteUrl,
  profileImageAbsoluteUrl,
  type SiteLocale,
} from "./metadata";
import { getLatestContentDate } from "./contentDates";

export function personSchema(locale: SiteLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    image: profileImageAbsoluteUrl(),
    url: absoluteUrl(locale, "/"),
    email: EMAIL,
    inLanguage: locale,
    jobTitle: "Software Engineer",
    description: SITE_DESCRIPTION,
    sameAs: [GITHUB_URL, LINKEDIN_URL, X_URL],
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
    inLanguage: locale,
    description: SITE_DESCRIPTION,
    dateModified: getLatestContentDate(),
    author: { "@type": "Person", name: SITE_NAME },
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl(locale, "/blog")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
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
    dateModified: date,
    inLanguage: locale,
    mainEntityOfPage: pageUrl,
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
    inLanguage: locale,
    keywords: stack.join(", "),
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

export function homePageSchema(locale: SiteLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${SITE_NAME} — Software Engineer`,
    url: absoluteUrl(locale, "/"),
    inLanguage: locale,
    description: SITE_DESCRIPTION,
    dateModified: getLatestContentDate(),
    about: {
      "@type": "Person",
      name: SITE_NAME,
      url: absoluteUrl(locale, "/"),
    },
  };
}

export function serviceSchema(locale: SiteLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name:
      locale === "pl"
        ? "Systemy backendowe, API i automatyzacja"
        : "Backend systems, APIs, and automation",
    serviceType: [
      "Python backend development",
      "API development",
      "Automation engineering",
      "AI tooling",
    ],
    provider: {
      "@type": "Person",
      name: SITE_NAME,
      url: absoluteUrl(locale, "/"),
    },
    areaServed: "Europe",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl(locale, "/contact"),
    },
  };
}

export function faqPageSchema(
  items: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
