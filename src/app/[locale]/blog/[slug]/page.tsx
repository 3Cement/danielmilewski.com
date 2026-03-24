import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPostSlugs, getAllPosts } from "@/lib/content";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { extractHeadings } from "@/lib/headings";
import { Tag } from "@/components/ui/Tag";
import { BlogCard } from "@/components/blog/BlogCard";
import { buildMetadata, type SiteLocale } from "@/lib/metadata";
import { blogPostingSchema } from "@/lib/schema";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { mdxContentComponents } from "@/components/mdx/mdxContentComponents";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    pathWithoutLocale: `/blog/${slug}`,
    locale: locale as SiteLocale,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const headings = extractHeadings(post.content);
  const allPosts = getAllPosts();
  const related = allPosts
    .filter((p) => p.slug !== slug && p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 2);

  const schema = blogPostingSchema({
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    slug: post.slug,
    tags: post.tags,
    locale: locale as SiteLocale,
  });

  const date = new Date(post.date).toLocaleDateString(locale === "pl" ? "pl-PL" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mdxContent = await MDXRemote({
    source: post.content,
    components: mdxContentComponents,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* TOC sidebar */}
            <aside className="hidden lg:block lg:col-span-1 order-2">
              <div className="sticky top-24">
                <TableOfContents headings={headings} />
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
                  {date} · {post.readingTime}
                </p>
              </header>

              {/* Body */}
              <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-[var(--color-accent)] prose-code:text-[var(--color-accent-light)] prose-pre:bg-[var(--color-surface-muted)] prose-blockquote:border-[var(--color-accent)]">
                {mdxContent}
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-lg font-semibold text-[var(--color-text-base)] mb-6">
                    {t("relatedPosts")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {related.map((p) => (
                      <BlogCard key={p.slug} post={p} />
                    ))}
                  </div>
                </div>
              )}

              {/* Back link */}
              <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                  {t("allPosts")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
