import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPostSlugs, getAllPosts } from "@/lib/content";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { extractHeadings } from "@/lib/headings";
import { Tag } from "@/components/ui/Tag";
import { BlogCard } from "@/components/blog/BlogCard";
import { buildMetadata } from "@/lib/metadata";
import { blogPostingSchema } from "@/lib/schema";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const headings = extractHeadings(post.content);
  const allPosts = getAllPosts();
  const related = allPosts
    .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 2);

  const schema = blogPostingSchema({
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    slug: post.slug,
    tags: post.tags,
  });

  const date = new Date(post.date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mdxContent = await MDXRemote({ source: post.content });

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

              {/* Author card */}
              <div className="mt-16 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                <p className="text-sm font-semibold text-[var(--color-text-base)] mb-1">
                  Daniel Milewski
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Senior Python Developer specializing in AI/LLM applications, backend engineering, and automation. Available for new projects.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-[var(--color-accent)] hover:gap-2.5 transition-all"
                >
                  Get in touch
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-lg font-semibold text-[var(--color-text-base)] mb-6">
                    Related posts
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
                  All posts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
