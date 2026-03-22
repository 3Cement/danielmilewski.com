import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getProjectBySlug, getAllProjectSlugs, getProjectBySlug as getRelated } from "@/lib/content";
import { CaseStudySection } from "@/components/projects/CaseStudySection";
import { buildMetadata } from "@/lib/metadata";
import { softwareSchema } from "@/lib/schema";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    description: project.shortProblem,
    path: `/projects/${slug}`,
    type: "article",
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const relatedProjects = (project.relatedSlugs ?? [])
    .map((s) => getRelated(s))
    .filter(Boolean)
    .map((p) => ({ slug: p!.slug, title: p!.title }));

  const mdxContent = await MDXRemote({ source: project.content });

  const schema = softwareSchema({
    title: project.title,
    description: project.shortProblem,
    stack: project.stack,
    slug: project.slug,
    repo: project.repo,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CaseStudySection
        project={project}
        mdxContent={mdxContent}
        relatedProjects={relatedProjects}
      />
    </>
  );
}
