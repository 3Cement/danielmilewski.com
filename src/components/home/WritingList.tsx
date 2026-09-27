import { getTranslations } from "next-intl/server";
import type { PostMeta } from "@/types/post";
import { LocalizedLink } from "@/components/ui/LocalizedLink";
import { SectionHeading } from "@/components/home/SectionHeading";

interface WritingListProps {
  posts: PostMeta[];
  locale: string;
}

export async function WritingList({ posts, locale }: WritingListProps) {
  const t = await getTranslations({ locale, namespace: "blog" });
  const siteLocale = locale as "en" | "pl";
  const dateLocale = siteLocale === "pl" ? "pl-PL" : "en-GB";

  return (
    <section className="scroll-mt-24" id="writing">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("heading")}
          sub={t("sub")}
          link={{ href: "/blog", label: t("allPosts"), locale: siteLocale }}
        />
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
                <h3 className="text-[clamp(1.35rem,2.6vw,2rem)] font-bold leading-tight tracking-tight text-[var(--color-text-base)] decoration-[3px] underline-offset-[6px] group-hover:text-[var(--color-accent)] group-hover:underline">
                  {post.title}
                </h3>
                <span className="text-sm text-[var(--color-text-muted)]">
                  {post.readingTime} {t("minRead")}
                </span>
              </LocalizedLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
