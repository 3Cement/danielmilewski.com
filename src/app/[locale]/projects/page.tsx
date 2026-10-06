import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllProjects } from "@/lib/content";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { absoluteUrl, buildMetadata, type SiteLocale } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/PageHeader";
import { breadcrumbSchema } from "@/lib/schema";
import { StructuredDataScript } from "@/components/ui/StructuredDataScript";

export const dynamic = "force-static";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildMetadata({
    title: t("projectsTitle"),
    description: t("projectsDescription"),
    pathWithoutLocale: "/projects",
    locale: locale as SiteLocale,
  });
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const projects = getAllProjects(locale);
  const labels = {
    liveLabel: t("liveLabel"),
    roleLabel: t("roleLabel"),
    stackLabel: t("stackLabel"),
    readCaseStudy: t("readCaseStudy"),
  };

  const structuredData = JSON.stringify(
    breadcrumbSchema([
      { name: tNav("home"), item: absoluteUrl(locale as SiteLocale, "/") },
      {
        name: tNav("projects"),
        item: absoluteUrl(locale as SiteLocale, "/projects"),
      },
    ]),
  ).replace(/<\/script>/gi, "<\\/script>");

  return (
    <>
      <PageHeader
        locale={locale as "en" | "pl"}
        title={t("pageHeading")}
        sub={t("pageSub")}
        breadcrumbs={{
          ariaLabel: tCommon("breadcrumbsAriaLabel"),
          items: [{ label: tNav("home"), href: "/" }, { label: tNav("projects") }],
        }}
      />
      <StructuredDataScript id="projects-structured-data" json={structuredData} />
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        {projects.map((project, index) => (
          <ProjectShowcase
            key={project.slug}
            project={project}
            locale={locale as "en" | "pl"}
            labels={labels}
            reversed={index % 2 === 1}
            headingLevel="h2"
            eager={index === 0}
          />
        ))}
        {projects.length < 4 && (
          <div className="mt-12 border-2 border-dashed border-[var(--color-border)] p-8">
            <p className="font-expanded text-xl font-extrabold uppercase tracking-tight text-[var(--color-text-base)]">
              {t("comingSoon")}
            </p>
            <p className="mt-2 text-[var(--color-text-muted)]">{t("comingSoonSub")}</p>
          </div>
        )}
      </div>
    </>
  );
}
