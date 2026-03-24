import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { ProjectMeta } from "@/types/project";

interface SelectedProjectsProps {
  projects: ProjectMeta[];
}

export async function SelectedProjects({ projects }: SelectedProjectsProps) {
  const t = await getTranslations("projects");

  return (
    <section className="py-24 px-4" id="projects">
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
          <Link
            href="/projects"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] transition-colors"
          >
            {t("allProjects")}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 w-full">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] transition-colors"
          >
            {t("allProjects")}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
