import { ProjectCard } from "./ProjectCard";
import type { ProjectMeta } from "@/types/project";

interface ProjectGridProps {
  projects: ProjectMeta[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
