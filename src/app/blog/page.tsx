import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import { BlogCard } from "@/components/blog/BlogCard";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Writing",
  description:
    "Notes on Python, AI engineering, LLM applications, FastAPI, automation, and building software that works in production.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-base)]">
            Writing
          </h1>
          <p className="mt-3 text-lg text-[var(--color-text-muted)] max-w-xl">
            Notes from building real systems. No fluff.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
