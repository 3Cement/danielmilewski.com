import { getTranslations } from "next-intl/server";
import type { PostMeta } from "@/types/post";
import { LocalizedLink } from "@/components/ui/LocalizedLink";

interface PostListProps {
  posts: PostMeta[];
  locale: string;
  /** Show excerpt and tags under each title (blog index). */
  detailed?: boolean;
  headingLevel?: "h2" | "h3";
}

/** Poster-style post rows: date, large title, reading time. */
export async function PostList({ posts, locale, detailed = false, headingLevel = "h3" }: PostListProps) {
  const t = await getTranslations({ locale, namespace: "blog" });
  const siteLocale = locale as "en" | "pl";
  const dateLocale = siteLocale === "pl" ? "pl-PL" : "en-GB";
  const Heading = headingLevel;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug} className="border-b border-[var(--color-border)]">
          <LocalizedLink
            locale={siteLocale}
            href={`/blog/${post.slug}`}
            className="group grid grid-cols-1 items-baseline gap-1.5 py-6 md:grid-cols-[8rem_1fr_auto] md:gap-6"
          >
            <time
              dateTime={post.date}
              className="text-sm font-semibold tabular-nums text-[var(--color-text-muted)]"
            >
              {new Date(post.date).toLocaleDateString(dateLocale, {
                year: "numeric",
                month: "short",
              })}
            </time>
            <div className="min-w-0">
              <Heading className="text-[clamp(1.35rem,2.6vw,2rem)] font-bold leading-tight tracking-tight text-[var(--color-text-base)] decoration-[3px] underline-offset-[6px] group-hover:text-[var(--color-accent)] group-hover:underline">
                {post.title}
              </Heading>
              {detailed && (
                <>
                  <p className="mt-2 max-w-[65ch] leading-relaxed text-[var(--color-text-muted)]">
                    {post.excerpt}
                  </p>
                  <p className="font-condensed mt-3 text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-text-faint)]">
                    {post.tags.join(" · ")}
                  </p>
                </>
              )}
            </div>
            <span className="text-sm text-[var(--color-text-muted)]">
              {post.readingTime} {t("minRead")}
            </span>
          </LocalizedLink>
        </li>
      ))}
    </ul>
  );
}
