import { Hero } from "@/components/home/Hero";
import { CredibilityStrip } from "@/components/home/CredibilityStrip";
import { TrustSection } from "@/components/home/TrustSection";
import { SelectedProjects } from "@/components/home/SelectedProjects";
import { ExpertiseGrid } from "@/components/home/ExpertiseGrid";
import { AboutPreview } from "@/components/home/AboutPreview";
import { WritingPreview } from "@/components/home/WritingPreview";
import { FinalCTA } from "@/components/home/FinalCTA";
import { HomeFAQ } from "@/components/home/HomeFAQ";
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
      <CredibilityStrip locale={locale} />
      <TrustSection locale={locale} />
      <SelectedProjects projects={projects} locale={locale} />
      <ExpertiseGrid locale={locale} />
      <AboutPreview locale={locale} />
      <WritingPreview posts={posts} locale={locale} />
      <HomeFAQ locale={locale as "en" | "pl"} />
      <FinalCTA locale={locale} />
    </>
  );
}
