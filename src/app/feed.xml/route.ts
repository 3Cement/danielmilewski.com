import { getAllPosts } from "@/lib/content";
import {
  absoluteUrl,
  EMAIL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/metadata";

export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${absoluteUrl("en", `/blog/${post.slug}`)}</link>
      <guid isPermaLink="true">${absoluteUrl("en", `/blog/${post.slug}`)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      ${post.tags.map((tag) => `<category>${tag}</category>`).join("\n      ")}
    </item>`,
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${absoluteUrl("en", "/blog")}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en</language>
    <managingEditor>${EMAIL} (${SITE_NAME})</managingEditor>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
