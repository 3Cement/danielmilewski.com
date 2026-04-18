import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "./metadata";

const API_CATALOG_PROFILE_URI = "https://www.rfc-editor.org/info/rfc9727";

interface LinkTarget {
  href: string;
  rel: string;
  type?: string;
  profile?: string;
}

export const AGENT_DISCOVERY_LINKS = [
  {
    href: "/.well-known/api-catalog",
    rel: "api-catalog",
    type: "application/linkset+json",
    profile: API_CATALOG_PROFILE_URI,
  },
  {
    href: "/.well-known/service-doc.json",
    rel: "service-doc",
    type: "application/json",
  },
  {
    href: "/llms.txt",
    rel: "describedby",
    type: "text/plain",
  },
] as const satisfies readonly LinkTarget[];

export function formatLinkHeader(links: readonly LinkTarget[]): string {
  return links
    .map(({ href, rel, type, profile }) => {
      const typeParam = type ? `; type="${type}"` : "";
      const profileParam = profile ? `; profile="${profile}"` : "";
      return `<${href}>; rel="${rel}"${typeParam}${profileParam}`;
    })
    .join(", ");
}

export const AGENT_DISCOVERY_LINK_HEADER = formatLinkHeader(AGENT_DISCOVERY_LINKS);

export function createHomepageAgentDiscoveryHeaders(locales: readonly string[]) {
  return ["/", ...locales.map((locale) => `/${locale}`)].map((source) => ({
    source,
    headers: [
      {
        key: "Link",
        value: AGENT_DISCOVERY_LINK_HEADER,
      },
    ],
  }));
}

export function buildAgentServiceDocument() {
  return {
    service: {
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
    },
    discovery: {
      apiCatalog: `${SITE_URL}/.well-known/api-catalog`,
      llms: `${SITE_URL}/llms.txt`,
      sitemap: `${SITE_URL}/sitemap.xml`,
      robots: `${SITE_URL}/robots.txt`,
      feed: `${SITE_URL}/feed.xml`,
      homepages: {
        en: absoluteUrl("en", "/"),
        pl: absoluteUrl("pl", "/"),
      },
    },
  };
}
