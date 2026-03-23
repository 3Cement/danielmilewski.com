import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { CredibilityStrip } from "@/components/home/CredibilityStrip";
import { SelectedProjects } from "@/components/home/SelectedProjects";
import { ExpertiseGrid } from "@/components/home/ExpertiseGrid";
import { AboutPreview } from "@/components/home/AboutPreview";
import { WritingPreview } from "@/components/home/WritingPreview";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getFeaturedProjects, getLatestPosts } from "@/lib/content";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { description: t("siteDescription") };
}

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
