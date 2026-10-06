import { Hero } from "@/components/home/Hero";
import { TrustSection } from "@/components/home/TrustSection";
import { SelectedProjects } from "@/components/home/SelectedProjects";
import { ApproachSection } from "@/components/home/ApproachSection";
import { WritingList } from "@/components/home/WritingList";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { HireCTA } from "@/components/home/HireCTA";
import { getFeaturedProjects, getLatestPosts } from "@/lib/content";

interface HomePageContentProps {
  locale: string;
}

export async function HomePageContent({ locale }: HomePageContentProps) {
  const projects = getFeaturedProjects(locale);
  const posts = getLatestPosts(locale, 3);

  return (
    <>
      <Hero locale={locale} />
      <TrustSection locale={locale} />
      <SelectedProjects projects={projects} locale={locale} />
      <ApproachSection locale={locale} />
      <WritingList posts={posts} locale={locale} />
      <HomeFAQ locale={locale as "en" | "pl"} />
      <HireCTA locale={locale} />
    </>
  );
}
