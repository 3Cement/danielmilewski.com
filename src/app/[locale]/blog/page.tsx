import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllPosts } from "@/lib/content";
import { PostList } from "@/components/blog/PostList";
import { PageHeader } from "@/components/ui/PageHeader";
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
    <>
      <PageHeader locale={locale as "en" | "pl"} title={t("pageHeading")} sub={t("pageSub")}>
        <TrackedAnchor
          href={`/${locale}/feed.xml`}
          analytics={{
            event: "cta_click",
            locale: locale as "en" | "pl",
            ctaId: "blog_rss_feed",
            surface: "blog_index",
          }}
          className="mt-8 inline-block border-b-2 border-[var(--color-signal)] text-sm font-bold uppercase tracking-wider hover:text-[var(--color-signal)]"
        >
          {t("rssFeed")}
        </TrackedAnchor>
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-20 sm:px-6 lg:px-8">
        {allPosts.length > 0 ? (
          <PostList posts={allPosts} locale={locale} detailed headingLevel="h2" />
        ) : (
          <p className="py-10 text-[var(--color-text-faint)]">{t("noResults")}</p>
        )}
      </div>
    </>
  );
}
