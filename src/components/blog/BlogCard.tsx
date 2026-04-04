import { Tag } from "@/components/ui/Tag";
import type { PostMeta } from "@/types/post";
import { getTranslations } from "next-intl/server";
import { LocalizedLink } from "@/components/ui/LocalizedLink";

interface BlogCardProps {
  post: PostMeta;
  locale: string;
  compact?: boolean;
}

export async function BlogCard({ post, locale, compact = false }: BlogCardProps) {
  const t = await getTranslations({ locale, namespace: "blog" });
  const dateLocale = locale === "pl" ? "pl-PL" : "en-GB";
  const date = new Date(post.date).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (compact) {
    return (
      <article>
        <LocalizedLink
          locale={locale as "en" | "pl"}
          href={`/blog/${post.slug}`}
          className="group block"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-base font-medium text-[var(--color-text-base)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-faint)]">
                {date} · {post.readingTime} {t("minRead")}
              </p>
            </div>
            <svg
              className="shrink-0 mt-1 text-[var(--color-text-faint)] group-hover:text-[var(--color-accent)] transition-colors"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </LocalizedLink>
      </article>
    );
  }

  return (
    <article className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-accent)]/40 transition-all duration-200">
      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.tags.slice(0, 3).map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
      <LocalizedLink
        locale={locale as "en" | "pl"}
        href={`/blog/${post.slug}`}
      >
        <h3 className="text-lg font-semibold text-[var(--color-text-base)] group-hover:text-[var(--color-accent)] transition-colors mb-3 leading-snug">
          {post.title}
        </h3>
      </LocalizedLink>
      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-5 line-clamp-3">
        {post.excerpt}
      </p>
      <p className="text-xs text-[var(--color-text-faint)]">
        {date} · {post.readingTime} {t("minRead")}
      </p>
    </article>
  );
}
