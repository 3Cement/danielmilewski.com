import { getTranslations } from "next-intl/server";
import { Tag } from "@/components/ui/Tag";
import type { Project } from "@/types/project";
import { LocalizedLink } from "@/components/ui/LocalizedLink";

interface CaseStudySectionProps {
  locale: string;
  project: Project;
  mdxContent: string;
  relatedProjects?: Array<{ slug: string; title: string }>;
  relatedPosts?: Array<{ slug: string; title: string; excerpt: string }>;
}

export async function CaseStudySection({
  locale,
  project,
  mdxContent,
  relatedProjects,
  relatedPosts,
}: CaseStudySectionProps) {
  const t = await getTranslations({ locale, namespace: "caseStudy" });

  return (
    <article className="py-16 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <div className="max-w-3xl mb-16">
          <p className="text-sm font-medium text-[var(--color-accent)] uppercase tracking-wide mb-4">
            {project.role}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-text-base)] leading-tight mb-6">
            {project.title}
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed">
            {project.overview}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 space-y-8">
              {/* Outcome */}
              <div>
                <h2 className="text-xs font-semibold text-[var(--color-text-faint)] uppercase tracking-widest mb-3">
                  {t("outcome")}
                </h2>
                <p className="text-sm text-[var(--color-accent)] font-medium leading-relaxed">
                  {project.outcome}
                </p>
              </div>

              {/* Stack */}
              <div>
                <h2 className="text-xs font-semibold text-[var(--color-text-faint)] uppercase tracking-widest mb-3">
                  {t("stack")}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <Tag key={tech} label={tech} />
                  ))}
                </div>
              </div>

              {/* Links */}
              {(project.repo || project.demo) && (
                <div>
                  <h2 className="text-xs font-semibold text-[var(--color-text-faint)] uppercase tracking-widest mb-3">
                    {t("links")}
                  </h2>
                  <div className="space-y-2">
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[var(--color-accent)] hover:underline"
                      >
                        {t("viewRepo")}
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[var(--color-accent)] hover:underline"
                      >
                        {t("liveDemo")}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Related */}
              {relatedProjects && relatedProjects.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-[var(--color-text-faint)] uppercase tracking-widest mb-3">
                    {t("related")}
                  </h2>
                  <div className="space-y-2">
                    {relatedProjects.map((p) => (
                      <LocalizedLink
                        locale={locale as "en" | "pl"}
                        key={p.slug}
                        href={`/projects/${p.slug}`}
                        className="block text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                      >
                        {p.title}
                      </LocalizedLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div
              className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-[var(--color-accent)] prose-code:text-[var(--color-accent-light)] prose-pre:bg-[var(--color-surface-muted)] prose-img:rounded-xl prose-img:border prose-img:border-[var(--color-border)] prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: mdxContent }}
            />

            {relatedPosts && relatedPosts.length > 0 ? (
              <section className="mt-12 border-t border-[var(--color-border)] pt-8">
                <h2 className="text-lg font-semibold text-[var(--color-text-base)] mb-6">
                  {t("relatedPosts")}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {relatedPosts.map((post) => (
                    <article
                      key={post.slug}
                      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5"
                    >
                      <h3 className="text-base font-semibold text-[var(--color-text-base)]">
                        <LocalizedLink
                          locale={locale as "en" | "pl"}
                          href={`/blog/${post.slug}`}
                          className="hover:text-[var(--color-accent)] transition-colors"
                        >
                          {post.title}
                        </LocalizedLink>
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                        {post.excerpt}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-[var(--color-border)]">
          <LocalizedLink
            locale={locale as "en" | "pl"}
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            {t("allProjects")}
          </LocalizedLink>
        </div>
      </div>
    </article>
  );
}
