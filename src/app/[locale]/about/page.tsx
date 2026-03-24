import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Tag } from "@/components/ui/Tag";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { buildMetadata, PROFILE_IMAGE_PATH, SITE_NAME, type SiteLocale } from "@/lib/metadata";
import { Link } from "@/i18n/navigation";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildMetadata({
    title: locale === "pl" ? "O mnie" : "About",
    description: t("aboutDescription"),
    pathWithoutLocale: "/about",
    locale: locale as SiteLocale,
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  const techStack = t.raw("techStack") as Record<string, string[]>;
  const experience = t.raw("experience") as Array<{
    period: string;
    company: string;
    role: string;
    domain: string;
    note: string;
  }>;

  return (
    <div className="py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <div>
                <Image
                  src={PROFILE_IMAGE_PATH}
                  alt={SITE_NAME}
                  width={128}
                  height={128}
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-[var(--color-border)] mb-4"
                  priority
                />
                <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-base)] mb-1">
                  Daniel Milewski
                </h1>
                <p className="text-[var(--color-accent)] font-medium text-sm mb-4">
                  {t("role")}
                </p>
                <SocialLinks showEmail />
              </div>

              <div>
                <p className="text-xs font-semibold text-[var(--color-text-faint)] uppercase tracking-widest mb-3">
                  {t("availability")}
                </p>
                <div className="flex items-center gap-2">
                  <span className="block w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {t("availableText")}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[var(--color-text-faint)] uppercase tracking-widest mb-3">
                  {t("location")}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">{t("locationText")}</p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center w-full rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-accent-muted)] transition-colors"
              >
                {t("getInTouch")}
              </Link>
            </div>
          </aside>

          {/* Main */}
          <div className="lg:col-span-2 space-y-12">
            {/* Bio */}
            <section>
              <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-base)] mb-5">
                {t("backgroundHeading")}
              </h2>
              <div className="space-y-4 text-[var(--color-text-muted)] leading-relaxed">
                <p>{t("bio1")}</p>
                <p>{t("bio2")}</p>
                <p>{t("bio3")}</p>
                <p>{t("bio4")}</p>
              </div>
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-base)] mb-5">
                {t("experienceHeading")}
              </h2>
              <div className="space-y-6">
                {experience.map((item) => (
                  <div
                    key={item.company}
                    className="relative pl-5 border-l border-[var(--color-border)]"
                  >
                    <p className="text-xs text-[var(--color-text-faint)] mb-1">{item.period}</p>
                    <p className="text-base font-semibold text-[var(--color-text-base)]">
                      {item.role} <span className="text-[var(--color-accent)]">@ {item.company}</span>
                    </p>
                    <p className="text-sm text-[var(--color-text-faint)] mb-1">{item.domain}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{item.note}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tech */}
            <section>
              <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-base)] mb-5">
                {t("techHeading")}
              </h2>
              <div className="space-y-4">
                {Object.entries(techStack).map(([category, techs]) => (
                  <div key={category} className="flex flex-col sm:flex-row sm:items-start gap-2">
                    <p className="text-xs font-semibold text-[var(--color-text-faint)] uppercase tracking-wider sm:w-36 shrink-0 mt-0.5">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {techs.map((tech: string) => (
                        <Tag key={tech} label={tech} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* How I work */}
            <section>
              <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-base)] mb-5">
                {t("howHeading")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
                <p>{t("how1")}</p>
                <p>{t("how2")}</p>
                <p>{t("how3")}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
