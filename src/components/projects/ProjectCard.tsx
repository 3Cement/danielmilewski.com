import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Tag } from "@/components/ui/Tag";
import type { ProjectMeta } from "@/types/project";

export interface ProjectCardLabels {
  problemLabel: string;
  solutionLabel: string;
  readCaseStudy: string;
}

interface ProjectCardProps {
  project: ProjectMeta;
  labels: ProjectCardLabels;
}

export function ProjectCard({ project, labels }: ProjectCardProps) {
  const { problemLabel, solutionLabel, readCaseStudy } = labels;
  const previewSrc = project.images?.[0];

  const body = (
    <>
      <p className="text-xs font-medium text-[var(--color-accent)] uppercase tracking-wide mb-3">
        {project.role}
      </p>

      <h3 className="text-lg font-semibold text-[var(--color-text-base)] mb-3 group-hover:text-[var(--color-accent)] transition-colors">
        <Link href={`/projects/${project.slug}`} className="focus-visible:outline-none">
          {project.title}
        </Link>
      </h3>

      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-2">
        <span className="font-medium text-[var(--color-text-base)]">{problemLabel}: </span>
        {project.shortProblem}
      </p>
      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
        <span className="font-medium text-[var(--color-text-base)]">{solutionLabel}: </span>
        {project.shortSolution}
      </p>

      <p className="text-sm text-[var(--color-accent)] font-medium mb-5 leading-relaxed">
        {project.outcome}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
        {project.stack.slice(0, 5).map((tech) => (
          <Tag key={tech} label={tech} />
        ))}
        {project.stack.length > 5 && (
          <Tag label={`+${project.stack.length - 5}`} variant="muted" />
        )}
      </div>

      <Link
        href={`/projects/${project.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] hover:gap-2.5 transition-all"
        aria-label={`${readCaseStudy}: ${project.title}`}
      >
        {readCaseStudy}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </>
  );

  if (!previewSrc) {
    return (
      <article className="group flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-200 hover:border-[var(--color-accent)]/40 hover:shadow-lg">
        {body}
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-200 hover:border-[var(--color-accent)]/40 hover:shadow-lg">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col xl:flex-row xl:items-stretch">
        <div className="flex w-full min-w-0 flex-col border-b border-[var(--color-border)] p-6 sm:p-8 xl:w-[42%] xl:border-b-0 xl:border-r">
          {body}
        </div>

        <div className="relative w-full min-h-[220px] shrink-0 overflow-hidden bg-[var(--color-surface-muted)] xl:flex-1 xl:min-h-[280px] xl:self-stretch">
          <Link
            href={`/projects/${project.slug}`}
            className="absolute inset-0 z-10 block cursor-pointer outline-offset-[-2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
            aria-label={`${readCaseStudy}: ${project.title}`}
          >
            <Image
              src={previewSrc}
              alt=""
              fill
              className="pointer-events-none object-cover object-left-top transition-[filter] duration-200 ease-out brightness-100 group-hover:brightness-[1.06] dark:group-hover:brightness-[0.92]"
              sizes="(max-width: 1280px) 100vw, 58vw"
              priority={false}
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
