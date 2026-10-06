import { getTranslations } from "next-intl/server";
import type { PostMeta } from "@/types/post";
import { PostList } from "@/components/blog/PostList";
import { SectionHeading } from "@/components/home/SectionHeading";

interface WritingListProps {
  posts: PostMeta[];
  locale: string;
}

export async function WritingList({ posts, locale }: WritingListProps) {
  const t = await getTranslations({ locale, namespace: "blog" });
  const siteLocale = locale as "en" | "pl";

  return (
    <section className="scroll-mt-24" id="writing">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("heading")}
          sub={t("sub")}
          link={{ href: "/blog", label: t("allPosts"), locale: siteLocale }}
        />
        <PostList posts={posts} locale={locale} />
      </div>
    </section>
  );
}
