import type { ProjectMeta } from "@/types/project";
import { LocalizedLink } from "@/components/ui/LocalizedLink";
import { type AppLocale } from "@/lib/localeHref";
import { previewSrcSet, previewVariant } from "@/lib/previewImages";

export interface ProjectShowcaseLabels {
  liveLabel: string;
  roleLabel: string;
  stackLabel: string;
  readCaseStudy: string;
}

interface ProjectShowcaseProps {
  project: ProjectMeta;
  locale: AppLocale;
  labels: ProjectShowcaseLabels;
  /** Alternate rows put the screenshot on the right. */
  reversed?: boolean;
  headingLevel?: "h2" | "h3";
  /** Load the screenshot eagerly when the row is above the fold (LCP). */
  eager?: boolean;
}

/** "InvestTracker — Personal Wealth…" → ["InvestTracker", "Personal Wealth…"] */
function splitTitle(title: string): [string, string | undefined] {
  const [name, ...rest] = title.split(" — ");
  return [name, rest.length ? rest.join(" — ") : undefined];
}

function hostOf(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

/**
 * Large screenshot-first case study row used on the homepage and /projects.
 * The title link stretches over the whole row, so the full panel is clickable.
 */
export function ProjectShowcase({
  project,
  locale,
  labels,
  reversed = false,
  headingLevel = "h3",
  eager = false,
}: ProjectShowcaseProps) {
  const [name, subtitle] = splitTitle(project.title);
  const previewSrc = project.images?.[0];
  const host = hostOf(project.demo);
  const Heading = headingLevel;

  return (
    <article
      className="group relative grid grid-cols-1 items-start gap-8 border-b border-[var(--color-border)] py-10 sm:py-16 lg:grid-cols-[1.4fr_1fr] lg:gap-14"
    >
      {previewSrc && (
        <figure
          className={
            "relative m-0 bg-[var(--color-surface-muted)] p-3 sm:p-6 " +
            (reversed ? "lg:order-2" : "")
          }
        >
          {host && (
            // Sits above the stretched title link, so it opens the live site instead of the case study.
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="font-condensed absolute -top-3.5 left-3 z-30 bg-[var(--color-text-base)] px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-surface)] transition-colors hover:bg-[var(--color-cobalt)] hover:text-[var(--color-on-cobalt)] sm:left-6"
            >
              {labels.liveLabel} · {host} <span aria-hidden="true">↗</span>
            </a>
          )}
          {/* Static srcset variants instead of next/image: /_next/image on OpenNext is slow and uncached. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewVariant(previewSrc, 1280)}
            srcSet={previewSrcSet(previewSrc)}
            alt={project.title}
            width={1280}
            height={800}
            // Measured rendered widths: padding/gutters eat 56px below sm, 96px below lg; capped at 554px from lg.
            sizes="(min-width: 1024px) 554px, (min-width: 640px) calc(100vw - 96px), calc(100vw - 56px)"
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
            decoding="async"
            className="block aspect-[16/10] w-full object-cover object-top shadow-[0_30px_60px_-30px_rgba(13,14,40,0.45)] transition-transform duration-300 group-hover:-translate-y-1"
          />
        </figure>
      )}
      <div>
        <Heading className="font-expanded text-3xl font-extrabold leading-none tracking-tight text-[var(--color-text-base)] sm:text-4xl">
          <LocalizedLink
            locale={locale}
            href={`/projects/${project.slug}`}
            className="transition-colors group-hover:text-[var(--color-accent)] after:absolute after:inset-0 after:z-20 after:content-['']"
          >
            {name}
          </LocalizedLink>
        </Heading>
        {subtitle && (
          <p className="mt-2 font-semibold text-[var(--color-text-base)]">{subtitle}</p>
        )}
        <p className="mt-4 max-w-[24em] leading-relaxed text-[var(--color-text-muted)]">
          {project.shortProblem}
        </p>
        <dl className="mt-5 border-t-2 border-[var(--color-text-base)]">
          <div className="border-b border-[var(--color-border)] py-3">
            <dt className="font-condensed text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
              {labels.roleLabel}
            </dt>
            <dd className="mt-0.5 font-bold text-[var(--color-text-base)]">{project.role}</dd>
          </div>
        </dl>
        <p className="sr-only">{labels.stackLabel}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 6).map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-base)]"
            >
              {tech}
            </li>
          ))}
        </ul>
        <LocalizedLink
          locale={locale}
          href={`/projects/${project.slug}`}
          className="mt-6 inline-block border-b-[3px] border-[var(--color-cobalt)] pb-0.5 text-sm font-extrabold uppercase tracking-wider text-[var(--color-text-base)] transition-colors group-hover:text-[var(--color-accent)]"
        >
          {labels.readCaseStudy}
          <span className="sr-only">: {name}</span>
        </LocalizedLink>
      </div>
    </article>
  );
}
