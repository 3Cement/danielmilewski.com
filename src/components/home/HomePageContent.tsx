import { Hero } from "@/components/home/Hero";
import { CredibilityStrip } from "@/components/home/CredibilityStrip";
import { SelectedProjects } from "@/components/home/SelectedProjects";
import { ExpertiseGrid } from "@/components/home/ExpertiseGrid";
import { AboutPreview } from "@/components/home/AboutPreview";
import { WritingPreview } from "@/components/home/WritingPreview";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getFeaturedProjects, getLatestPosts } from "@/lib/content";

export async function HomePageContent() {
  const projects = getFeaturedProjects();
  const posts = getLatestPosts(3);

  return (
    <>
      <Hero />
      <CredibilityStrip />
      <SelectedProjects projects={projects} />
      <ExpertiseGrid />
      <AboutPreview />
      <WritingPreview posts={posts} />
      <FinalCTA />
    </>
  );
}
