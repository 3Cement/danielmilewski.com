import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  GITHUB_URL,
  LINKEDIN_URL,
  EMAIL,
} from "./metadata";

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
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

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    author: { "@type": "Person", name: SITE_NAME },
  };
}

export function blogPostingSchema({
  title,
  excerpt,
  date,
  slug,
  tags,
}: {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  tags: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    datePublished: date,
    url: `${SITE_URL}/blog/${slug}`,
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
    keywords: tags.join(", "),
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function softwareSchema({
  title,
  description,
  stack,
  slug,
  repo,
}: {
  title: string;
  description: string;
  stack: string[];
  slug: string;
  repo?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: title,
    description,
    url: `${SITE_URL}/projects/${slug}`,
    codeRepository: repo,
    programmingLanguage: stack,
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
