import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllPosts, getAllTags } from "@/lib/content";
import { BlogCard } from "@/components/blog/BlogCard";
import { buildMetadata, type SiteLocale } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { TrackedAnchor } from "@/components/ui/TrackedLink";
import { LocalizedLink } from "@/components/ui/LocalizedLink";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string | string[] }>;
}

function getActiveTag(tag: string | string[] | undefined): string | undefined {
  return typeof tag === "string" ? tag : undefined;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const { tag } = await searchParams;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const metadata = buildMetadata({
    title: t("blogTitle"),
    description: t("blogDescription"),
    pathWithoutLocale: "/blog",
    locale: locale as SiteLocale,
  });

  if (!getActiveTag(tag)) {
    return metadata;
  }

  return {
    ...metadata,
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
  };
}

// searchParams intentionally opts this page out of static rendering — tag filtering
// is data-driven and the tag set is not known at build time.
export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { tag } = await searchParams;
  const activeTag = getActiveTag(tag);
  const t = await getTranslations({ locale, namespace: "blog" });
  const allPosts = getAllPosts(locale);
  const allTags = getAllTags(locale);

  const posts = activeTag
    ? allPosts.filter((p) => p.tags.includes(activeTag))
    : allPosts;

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

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <LocalizedLink
            locale={locale as "en" | "pl"}
            href="/blog"
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              !activeTag
                ? "bg-[var(--color-accent)] text-white"
                : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:text-[var(--color-text-base)]",
            )}
          >
            {t("filterAll")}
          </LocalizedLink>
          {allTags.map((t2) => (
            <LocalizedLink
              key={t2}
              locale={locale as "en" | "pl"}
              href={`/blog?tag=${encodeURIComponent(t2)}`}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                activeTag === t2
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:text-[var(--color-text-base)]",
              )}
            >
              {t2}
            </LocalizedLink>
          ))}
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
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
