import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import type { PostMeta } from "@/types/post";

interface WritingPreviewProps {
  posts: PostMeta[];
}

export function WritingPreview({ posts }: WritingPreviewProps) {
  return (
    <section className="py-24 px-4 bg-[var(--color-surface-muted)]">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-base)]">
              Writing
            </h2>
            <p className="mt-2 text-[var(--color-text-muted)]">
              Notes from building real systems, not theory.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] transition-colors"
          >
            All posts
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
