import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Tag } from "@/components/ui/Tag";
import type { ProjectMeta } from "@/types/project";

interface ProjectCardProps {
  project: ProjectMeta;
}

export async function ProjectCard({ project }: ProjectCardProps) {
  const t = await getTranslations("projects");
  const previewSrc = project.images?.[0];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-200 hover:border-[var(--color-accent)]/40 hover:shadow-lg">
      {previewSrc ? (
        <Link
          href={`/projects/${project.slug}`}
          className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden bg-[var(--color-surface-muted)] ring-1 ring-[var(--color-border)] ring-inset"
          aria-label={`${t("readCaseStudy")}: ${project.title}`}
        >
          <Image
            src={previewSrc}
            alt=""
            fill
            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, min(720px, 50vw)"
          />
        </Link>
      ) : null}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col p-6">
        <p className="text-xs font-medium text-[var(--color-accent)] uppercase tracking-wide mb-3">
          {project.role}
        </p>

        <h3 className="text-lg font-semibold text-[var(--color-text-base)] mb-3 group-hover:text-[var(--color-accent)] transition-colors">
          <Link href={`/projects/${project.slug}`} className="focus-visible:outline-none">
            {project.title}
          </Link>
        </h3>

        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-2">
          <span className="font-medium text-[var(--color-text-base)]">{t("problemLabel")}: </span>
          {project.shortProblem}
        </p>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
          <span className="font-medium text-[var(--color-text-base)]">{t("solutionLabel")}: </span>
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
          aria-label={`${t("readCaseStudy")}: ${project.title}`}
        >
          {t("readCaseStudy")}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
