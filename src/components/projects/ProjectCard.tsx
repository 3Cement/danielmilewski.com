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
    <article className="group flex flex-col md:flex-row md:items-stretch gap-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-accent)]/40 hover:shadow-lg transition-all duration-200">
      <div className="flex min-w-0 flex-1 flex-col order-2 md:order-1">
        <p className="text-xs font-medium text-[var(--color-accent)] uppercase tracking-wide mb-3">
          {project.role}
        </p>

        <h3 className="text-lg font-semibold text-[var(--color-text-base)] mb-3 group-hover:text-[var(--color-accent)] transition-colors">
          {project.title}
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

      {previewSrc ? (
        <div className="order-1 md:order-2 shrink-0 flex justify-center md:justify-end md:pt-1">
          <div className="relative w-[min(220px,72vw)] md:w-[200px] rounded-[1.25rem] bg-[var(--color-surface-muted)] p-1.5 ring-1 ring-[var(--color-border)] shadow-md">
            <Image
              src={previewSrc}
              alt={`${project.title} — mobile app screenshot`}
              width={1170}
              height={2532}
              className="rounded-[1rem] object-cover object-top w-full h-auto max-h-[min(320px,55vh)] md:max-h-[280px]"
              sizes="(max-width: 768px) 72vw, 200px"
            />
          </div>
        </div>
      ) : null}
    </article>
  );
}
