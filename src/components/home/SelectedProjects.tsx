import { getTranslations } from "next-intl/server";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { ProjectMeta } from "@/types/project";
import { LocalizedLink } from "@/components/ui/LocalizedLink";

interface SelectedProjectsProps {
  projects: ProjectMeta[];
  locale: string;
}

export async function SelectedProjects({ projects, locale }: SelectedProjectsProps) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const cardLabels = {
    problemLabel: t("problemLabel"),
    solutionLabel: t("solutionLabel"),
    readCaseStudy: t("readCaseStudy"),
  };

  return (
    <section className="scroll-mt-24 py-24 px-4" id="projects">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-base)]">
              {t("heading")}
            </h2>
            <p className="mt-2 text-[var(--color-text-muted)]">
              {t("sub")}
            </p>
          </div>
          <LocalizedLink
            locale={locale as "en" | "pl"}
            href="/projects"
            prefetch
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] transition-colors"
          >
            {t("allProjects")}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </LocalizedLink>
        </div>

        <div className="grid grid-cols-1 gap-8 w-full">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              locale={locale as "en" | "pl"}
              project={project}
              labels={cardLabels}
            />
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <LocalizedLink
            locale={locale as "en" | "pl"}
            href="/projects"
            prefetch
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] transition-colors"
          >
            {t("allProjects")}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}
