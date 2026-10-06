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
    <article className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 space-y-8">
              {/* Outcome */}
              <div>
                <h2 className="label-caps mb-3">
                  {t("outcome")}
                </h2>
                <p className="border-l-4 border-[var(--color-signal)] pl-3 text-sm font-semibold leading-relaxed text-[var(--color-text-base)]">
                  {project.outcome}
                </p>
              </div>

              {/* Stack */}
              <div>
                <h2 className="label-caps mb-3">
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
                  <h2 className="label-caps mb-3">
                    {t("links")}
                  </h2>
                  <div className="flex flex-col items-start gap-3">
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-rule inline-block"
                      >
                        {t("viewRepo")}
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-rule inline-block"
                      >
                        {t("liveDemo")} <span aria-hidden="true">↗</span>
                        <span className="block text-sm font-normal text-[var(--color-text-muted)]">
                          {new URL(project.demo).host.replace(/^www\./, "")}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Related */}
              {relatedProjects && relatedProjects.length > 0 && (
                <div>
                  <h2 className="label-caps mb-3">
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
              className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-pre:rounded-none prose-a:text-[var(--color-accent)] prose-code:text-[var(--color-accent-light)] prose-pre:bg-[var(--color-surface-muted)] prose-img:mx-auto prose-img:max-h-[min(52rem,88vh)] prose-img:w-full prose-img:object-contain prose-img:bg-[var(--color-surface-muted)] prose-img:rounded-none prose-img:border prose-img:border-[var(--color-border)] prose-img:shadow-[0_30px_60px_-30px_rgba(13,14,40,0.45)]"
              dangerouslySetInnerHTML={{ __html: mdxContent }}
            />

            {relatedPosts && relatedPosts.length > 0 ? (
              <section className="mt-14">
                <h2 className="heading-rule">
                  {t("relatedPosts")}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {relatedPosts.map((post) => (
                    <article
                      key={post.slug}
                      className="panel-muted"
                    >
                      <h3 className="font-expanded text-lg font-extrabold leading-tight text-[var(--color-text-base)]">
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
        <div className="mt-16 border-t-[3px] border-[var(--color-text-base)] pt-8">
          <LocalizedLink
            locale={locale as "en" | "pl"}
            href="/projects"
            className="link-rule inline-flex items-center gap-2"
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
