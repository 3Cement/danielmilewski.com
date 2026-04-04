import { absoluteUrl, EMAIL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/metadata";
import type { PostMeta } from "@/types/post";
import type { AppLocale } from "@/lib/localeHref";

const FEED_META: Record<
  AppLocale,
  { title: string; description: string; language: string }
> = {
  en: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    language: "en",
  },
  pl: {
    title: `${SITE_NAME} (PL)`,
    description: "Notatki o Pythonie, inżynierii backendowej i oprogramowaniu, które działa.",
    language: "pl",
  },
};

export function buildRssFeed(locale: AppLocale, posts: PostMeta[]): string {
  const meta = FEED_META[locale];
  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${absoluteUrl(locale, `/blog/${post.slug}`)}</link>
      <guid isPermaLink="true">${absoluteUrl(locale, `/blog/${post.slug}`)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      ${post.tags.map((tag) => `<category>${tag}</category>`).join("\n      ")}
    </item>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${meta.title}</title>
    <link>${absoluteUrl(locale, "/blog")}</link>
    <description>${meta.description}</description>
    <language>${meta.language}</language>
    <managingEditor>${EMAIL} (${SITE_NAME})</managingEditor>
    <atom:link href="${SITE_URL}/${locale}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}
