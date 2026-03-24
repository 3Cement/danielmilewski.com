import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllProjects } from "@/lib/content";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { buildMetadata, type SiteLocale } from "@/lib/metadata";

export const dynamic = "force-static";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildMetadata({
    title: locale === "pl" ? "Projekty" : "Projects",
    description: t("projectsDescription"),
    pathWithoutLocale: "/projects",
    locale: locale as SiteLocale,
  });
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  const projects = getAllProjects();
  const cardLabels = {
    problemLabel: t("problemLabel"),
    solutionLabel: t("solutionLabel"),
    readCaseStudy: t("readCaseStudy"),
  };

  return (
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
        <ProjectGrid projects={projects} labels={cardLabels} />
        {projects.length < 4 && (
          <div className="mt-8 p-6 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] text-center">
            <p className="text-sm font-medium text-[var(--color-text-muted)]">{t("comingSoon")}</p>
            <p className="text-xs text-[var(--color-text-faint)] mt-1">{t("comingSoonSub")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
