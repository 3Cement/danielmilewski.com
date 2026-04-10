import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getAllProjectSlugs,
  getPostBySlug,
} from "@/lib/content";
import { CaseStudySection } from "@/components/projects/CaseStudySection";
import {
  absoluteUrl,
  buildMetadata,
  SITE_NAME,
  type SiteLocale,
} from "@/lib/metadata";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { breadcrumbSchema, softwareSchema } from "@/lib/schema";
import { localizeHtmlContent } from "@/lib/localizeHtmlContent";

export const dynamic = "force-static";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllProjectSlugs(locale).map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const project = getProjectBySlug(locale, slug);
  if (!project) return {};
  const metadata = buildMetadata({
    title: project.title,
    description: project.shortProblem,
    pathWithoutLocale: `/projects/${slug}`,
    locale: locale as SiteLocale,
    type: "article",
    image: absoluteUrl(
      locale as SiteLocale,
      `/projects/${slug}/opengraph-image`,
    ),
  });

  return {
    ...metadata,
    keywords: project.stack,
    authors: [{ name: SITE_NAME, url: absoluteUrl(locale as SiteLocale, "/") }],
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  const project = getProjectBySlug(locale, slug);
  if (!project) notFound();
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const relatedProjects = (project.relatedSlugs ?? [])
    .map((s) => getProjectBySlug(locale, s))
    .filter(Boolean)
    .map((p) => ({ slug: p!.slug, title: p!.title }));

  const relatedPosts = (project.relatedPostSlugs ?? [])
    .map((s) => getPostBySlug(locale, s))
    .filter(Boolean)
    .map((post) => ({
      slug: post!.slug,
      title: post!.title,
      excerpt: post!.excerpt,
    }));

  const localizedContentHtml = localizeHtmlContent(
    locale as "en" | "pl",
    project.contentHtml,
  );

  const structuredData = JSON.stringify([
    softwareSchema({
      title: project.title,
      description: project.shortProblem,
      stack: project.stack,
      slug,
      repo: project.repo,
      locale: locale as SiteLocale,
    }),
    breadcrumbSchema([
      { name: tNav("home"), item: absoluteUrl(locale as SiteLocale, "/") },
      {
        name: tNav("projects"),
        item: absoluteUrl(locale as SiteLocale, "/projects"),
      },
      {
        name: project.title,
        item: absoluteUrl(locale as SiteLocale, `/projects/${slug}`),
      },
    ]),
  ]).replace(/<\/script>/gi, "<\\/script>");

  return (
    <>
      <div className="px-4 pt-10">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs
            ariaLabel={tCommon("breadcrumbsAriaLabel")}
            locale={locale as "en" | "pl"}
            items={[
              { label: tNav("home"), href: "/" },
              { label: tNav("projects"), href: "/projects" },
              { label: project.title },
            ]}
          />
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <CaseStudySection
        locale={locale}
        project={project}
        mdxContent={localizedContentHtml}
        relatedProjects={relatedProjects}
        relatedPosts={relatedPosts}
      />
    </>
  );
}
