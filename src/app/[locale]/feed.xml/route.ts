import { getAllPosts } from "@/lib/content";
import { buildRssFeed } from "@/lib/rss";

export const dynamic = "force-static";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function GET(_request: Request, { params }: Props) {
  const { locale } = await params;
  const siteLocale = locale === "pl" ? "pl" : "en";
  const posts = getAllPosts(siteLocale);
  const rss = buildRssFeed(siteLocale, posts);

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
