import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllPosts } from "@/lib/content";
import { BlogCard } from "@/components/blog/BlogCard";
import { buildMetadata, type SiteLocale } from "@/lib/metadata";
import { TrackedAnchor } from "@/components/ui/TrackedLink";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildMetadata({
    title: t("blogTitle"),
    description: t("blogDescription"),
    pathWithoutLocale: "/blog",
    locale: locale as SiteLocale,
  });
}

export const dynamic = "force-static";

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const allPosts = getAllPosts(locale);

  return (
    <div className="py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-base)]">
            {t("pageHeading")}
          </h1>
          <p className="mt-3 text-lg text-[var(--color-text-muted)] max-w-xl">
            {t("pageSub")}
          </p>
          <TrackedAnchor
            href={`/${locale}/feed.xml`}
            analytics={{
              event: "cta_click",
              locale: locale as "en" | "pl",
              ctaId: "blog_rss_feed",
              surface: "blog_index",
            }}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:underline"
          >
            {t("rssFeed")}
          </TrackedAnchor>
        </div>

        {allPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allPosts.map((post) => (
              <BlogCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-faint)]">
            {t("noResults")}
          </p>
        )}
      </div>
    </div>
  );
}
