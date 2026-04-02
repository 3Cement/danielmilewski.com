import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/content";
import { CaseStudySection } from "@/components/projects/CaseStudySection";
import { buildMetadata, type SiteLocale } from "@/lib/metadata";
import { routing } from "@/i18n/routing";

export const dynamic = "force-static";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    description: project.shortProblem,
    pathWithoutLocale: `/projects/${slug}`,
    locale: locale as SiteLocale,
    type: "article",
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const relatedProjects = (project.relatedSlugs ?? [])
    .map((s) => getProjectBySlug(s))
    .filter(Boolean)
    .map((p) => ({ slug: p!.slug, title: p!.title }));

  return (
    <>
      <CaseStudySection
        project={project}
        mdxContent={project.contentHtml}
        relatedProjects={relatedProjects}
      />
    </>
  );
}
