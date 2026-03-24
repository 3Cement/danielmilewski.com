import { ProjectCard, type ProjectCardLabels } from "./ProjectCard";
import type { ProjectMeta } from "@/types/project";

interface ProjectGridProps {
  projects: ProjectMeta[];
  labels: ProjectCardLabels;
}

export function ProjectGrid({ projects, labels }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 w-full">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} labels={labels} />
      ))}
    </div>
  );
}
