import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getPostBySlug,
  getAllPostSlugs,
  getAllPosts,
  getProjectBySlug,
} from "@/lib/content";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { extractHeadings } from "@/lib/headings";
import { Tag } from "@/components/ui/Tag";
import { BlogCard } from "@/components/blog/BlogCard";
import {
  absoluteUrl,
  buildMetadata,
  type SiteLocale,
} from "@/lib/metadata";
import { routing } from "@/i18n/routing";
import { ContactCTA } from "@/components/ui/ContactCTA";
import {
  blogPostingSchema,
  breadcrumbSchema,
} from "@/lib/schema";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LocalizedLink } from "@/components/ui/LocalizedLink";
import { localizeHtmlContent } from "@/lib/localizeHtmlContent";

export const dynamic = "force-static";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllPostSlugs(locale).map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getPostBySlug(locale, slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    pathWithoutLocale: `/blog/${slug}`,
    locale: locale as SiteLocale,
    type: "article",
    image: absoluteUrl(
      locale as SiteLocale,
      `/blog/${slug}/opengraph-image`,
    ),
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPostBySlug(locale, slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const headings = extractHeadings(post.content);
  const localizedContentHtml = localizeHtmlContent(
    locale as "en" | "pl",
    post.contentHtml,
  );
  const allPosts = getAllPosts(locale);
  const related = allPosts
    .filter((p) => p.slug !== slug && p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 2);
  const relatedProjects = (post.relatedProjectSlugs ?? [])
    .map((relatedSlug) => getProjectBySlug(locale, relatedSlug))
    .filter(Boolean);

  const date = new Date(post.date).toLocaleDateString(locale === "pl" ? "pl-PL" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const structuredData = JSON.stringify([
    blogPostingSchema({
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      slug,
      tags: post.tags,
      locale: locale as SiteLocale,
    }),
    breadcrumbSchema([
      { name: tNav("home"), item: absoluteUrl(locale as SiteLocale, "/") },
      { name: tNav("blog"), item: absoluteUrl(locale as SiteLocale, "/blog") },
      {
        name: post.title,
        item: absoluteUrl(locale as SiteLocale, `/blog/${slug}`),
      },
    ]),
  ]).replace(/<\/script>/gi, "<\\/script>");

  return (
    <>
      <div className="px-4 pt-10">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs
            ariaLabel={tCommon("breadcrumbsAriaLabel")}
            locale={locale as "en" | "pl"}
            items={[
              { label: tNav("home"), href: "/" },
              { label: tNav("blog"), href: "/blog" },
              { label: post.title },
            ]}
          />
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <div className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* TOC sidebar */}
            <aside className="hidden lg:block lg:col-span-1 order-2">
              <div className="sticky top-24">
                <TableOfContents
                  headings={headings}
                  tocHeading={t("tocHeading")}
                />
              </div>
            </aside>

            {/* Main content */}
            <div className="lg:col-span-3 order-1">
              {/* Header */}
              <header className="mb-10">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-base)] leading-tight mb-4">
                  {post.title}
                </h1>
                <p className="text-sm text-[var(--color-text-faint)]">
                  {date} · {post.readingTime} {t("minRead")}
                </p>
              </header>

              {/* Body */}
              <div
                className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-[var(--color-accent)] prose-code:text-[var(--color-accent-light)] prose-pre:bg-[var(--color-surface-muted)] prose-blockquote:border-[var(--color-accent)]"
                dangerouslySetInnerHTML={{ __html: localizedContentHtml }}
              />

              {relatedProjects.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-lg font-semibold text-[var(--color-text-base)] mb-6">
                    {t("relatedProjects")}
                  </h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {relatedProjects.map((project) => (
                      <article
                        key={project!.slug}
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5"
                      >
                        <h3 className="text-base font-semibold text-[var(--color-text-base)]">
                          <LocalizedLink
                            locale={locale as "en" | "pl"}
                            href={`/projects/${project!.slug}`}
                            className="hover:text-[var(--color-accent)] transition-colors"
                          >
                            {project!.title}
                          </LocalizedLink>
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                          {project!.shortProblem}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Related posts */}
              {related.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-lg font-semibold text-[var(--color-text-base)] mb-6">
                    {t("relatedPosts")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {related.map((p) => (
                      <BlogCard key={p.slug} post={p} locale={locale} />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="mt-12 border-t border-[var(--color-border)]">
                <ContactCTA locale={locale} />
              </div>

              {/* Back link */}
              <div className="pt-2 border-t border-[var(--color-border)]">
                <LocalizedLink
                  locale={locale as "en" | "pl"}
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                  {t("allPosts")}
                </LocalizedLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
