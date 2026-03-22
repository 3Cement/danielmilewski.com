import type { Metadata } from "next";
import { getAllProjects } from "@/lib/content";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Case studies from real projects: AI/LLM applications, Python backend systems, automation workflows, and FastAPI services.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-base)]">
            Projects
          </h1>
          <p className="mt-3 text-lg text-[var(--color-text-muted)] max-w-2xl">
            Selected work with full case studies. Each project description covers the problem, approach, technical decisions, and outcome.
          </p>
        </div>
        <ProjectGrid projects={projects} />
      </div>
    </div>
  );
}
