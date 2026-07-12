import { ProjectCard, type ProjectCardLabels } from "./ProjectCard";
import type { ProjectMeta } from "@/types/project";
import { type AppLocale } from "@/lib/localeHref";

interface ProjectGridProps {
  locale: AppLocale;
  projects: ProjectMeta[];
  labels: ProjectCardLabels;
  headingLevel?: "h2" | "h3";
}

export function ProjectGrid({
  locale,
  projects,
  labels,
  headingLevel,
}: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 w-full">
      {projects.map((project) => (
        <ProjectCard
          key={project.slug}
          locale={locale}
          project={project}
          labels={labels}
          headingLevel={headingLevel}
        />
      ))}
    </div>
  );
}
