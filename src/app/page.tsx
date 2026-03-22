import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { CredibilityStrip } from "@/components/home/CredibilityStrip";
import { SelectedProjects } from "@/components/home/SelectedProjects";
import { ExpertiseGrid } from "@/components/home/ExpertiseGrid";
import { AboutPreview } from "@/components/home/AboutPreview";
import { WritingPreview } from "@/components/home/WritingPreview";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getFeaturedProjects } from "@/lib/content";
import { getLatestPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  description:
    "Senior Python Developer building AI-powered products, backend systems and smart automation. Available for project-based and long-term engagements.",
});

export default function HomePage() {
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
