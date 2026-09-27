import { getTranslations } from "next-intl/server";
import type { ProjectMeta } from "@/types/project";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { SectionHeading } from "@/components/home/SectionHeading";

interface SelectedProjectsProps {
  projects: ProjectMeta[];
  locale: string;
}

export async function SelectedProjects({ projects, locale }: SelectedProjectsProps) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const siteLocale = locale as "en" | "pl";
  const labels = {
    liveLabel: t("liveLabel"),
    roleLabel: t("roleLabel"),
    stackLabel: t("stackLabel"),
    readCaseStudy: t("readCaseStudy"),
  };

  return (
    <section className="scroll-mt-24" id="projects">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("heading")}
          sub={t("sub")}
          link={{ href: "/projects", label: t("allProjects"), locale: siteLocale }}
        />

        {projects.map((project, index) => (
          <ProjectShowcase
            key={project.slug}
            project={project}
            locale={siteLocale}
            labels={labels}
            reversed={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}
