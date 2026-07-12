import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllProjects } from "@/lib/content";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { absoluteUrl, buildMetadata, type SiteLocale } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { breadcrumbSchema } from "@/lib/schema";
import { StructuredDataScript } from "@/components/ui/StructuredDataScript";

export const dynamic = "force-static";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildMetadata({
    title: t("projectsTitle"),
    description: t("projectsDescription"),
    pathWithoutLocale: "/projects",
    locale: locale as SiteLocale,
  });
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const projects = getAllProjects(locale);
  const cardLabels = {
    problemLabel: t("problemLabel"),
    solutionLabel: t("solutionLabel"),
    readCaseStudy: t("readCaseStudy"),
  };

  const structuredData = JSON.stringify(
    breadcrumbSchema([
      { name: tNav("home"), item: absoluteUrl(locale as SiteLocale, "/") },
      {
        name: tNav("projects"),
        item: absoluteUrl(locale as SiteLocale, "/projects"),
      },
    ]),
  ).replace(/<\/script>/gi, "<\\/script>");

  return (
    <>
      <div className="px-4 pt-10">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs
            ariaLabel={tCommon("breadcrumbsAriaLabel")}
            locale={locale as "en" | "pl"}
            items={[
              { label: tNav("home"), href: "/" },
              { label: tNav("projects") },
            ]}
          />
        </div>
      </div>
      <StructuredDataScript id="projects-structured-data" json={structuredData} />
      <div className="py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-base)]">
            {t("pageHeading")}
          </h1>
          <p className="mt-3 text-lg text-[var(--color-text-muted)]">
            {t("pageSub")}
          </p>
        </div>
        <ProjectGrid
          locale={locale as "en" | "pl"}
          projects={projects}
          labels={cardLabels}
          headingLevel="h2"
        />
        {projects.length < 4 && (
          <div className="mt-8 p-6 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] text-center">
            <p className="text-sm font-medium text-[var(--color-text-muted)]">{t("comingSoon")}</p>
            <p className="text-xs text-[var(--color-text-faint)] mt-1">{t("comingSoonSub")}</p>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
