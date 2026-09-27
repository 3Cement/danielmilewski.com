import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { ProjectMeta } from "@/types/project";
import { LocalizedLink } from "@/components/ui/LocalizedLink";
import { SectionHeading } from "@/components/home/SectionHeading";

interface SelectedProjectsProps {
  projects: ProjectMeta[];
  locale: string;
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

export async function SelectedProjects({ projects, locale }: SelectedProjectsProps) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const siteLocale = locale as "en" | "pl";

  return (
    <section className="scroll-mt-24" id="projects">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("heading")}
          sub={t("sub")}
          link={{ href: "/projects", label: t("allProjects"), locale: siteLocale }}
        />

        {projects.map((project, index) => {
          const [name, subtitle] = splitTitle(project.title);
          const previewSrc = project.images?.[0];
          const host = hostOf(project.demo);
          const reversed = index % 2 === 1;

          return (
            <article
              key={project.slug}
              className="grid grid-cols-1 items-start gap-8 border-b border-[var(--color-border)] py-10 sm:py-16 lg:grid-cols-[1.4fr_1fr] lg:gap-14"
            >
              {previewSrc && (
                <figure
                  className={
                    "relative m-0 bg-[var(--color-surface-muted)] p-3 sm:p-6 " +
                    (reversed ? "lg:order-2" : "")
                  }
                >
                  {host && (
                    <span className="font-condensed absolute -top-3.5 left-3 z-10 bg-[var(--color-text-base)] px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-surface)] sm:left-6">
                      {t("liveLabel")} · {host}
                    </span>
                  )}
                  <Image
                    src={previewSrc}
                    alt={project.title}
                    width={1280}
                    height={800}
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className="block aspect-[16/10] w-full object-cover object-top shadow-[0_30px_60px_-30px_rgba(13,14,40,0.45)]"
                  />
                </figure>
              )}
              <div>
                <h3 className="font-expanded text-3xl font-extrabold leading-none tracking-tight text-[var(--color-text-base)] sm:text-4xl">
                  <LocalizedLink
                    locale={siteLocale}
                    href={`/projects/${project.slug}`}
                    className="hover:text-[var(--color-accent)] transition-colors"
                  >
                    {name}
                  </LocalizedLink>
                </h3>
                {subtitle && (
                  <p className="mt-2 font-semibold text-[var(--color-text-base)]">{subtitle}</p>
                )}
                <p className="mt-4 max-w-[48ch] leading-relaxed text-[var(--color-text-muted)]">
                  {project.shortProblem}
                </p>
                <dl className="mt-5 border-t-2 border-[var(--color-text-base)]">
                  <div className="border-b border-[var(--color-border)] py-3">
                    <dt className="font-condensed text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                      {t("roleLabel")}
                    </dt>
                    <dd className="mt-0.5 font-bold text-[var(--color-text-base)]">{project.role}</dd>
                  </div>
                </dl>
                <p className="sr-only">{t("stackLabel")}</p>
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
                  locale={siteLocale}
                  href={`/projects/${project.slug}`}
                  className="mt-6 inline-block border-b-[3px] border-[var(--color-cobalt)] pb-0.5 text-sm font-extrabold uppercase tracking-wider text-[var(--color-text-base)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {t("readCaseStudy")}
                  <span className="sr-only">: {name}</span>
                </LocalizedLink>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
