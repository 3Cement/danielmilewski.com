import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Tag } from "@/components/ui/Tag";
import { PageHeader } from "@/components/ui/PageHeader";
import { SocialLinks } from "@/components/ui/SocialLinks";
import {
  absoluteUrl,
  buildMetadata,
  COMPANY_REGISTRY_URL,
  CV_URL_EN,
  CV_URL_PL,
  PROFILE_IMAGE_640_PATH,
  SITE_NAME,
  type SiteLocale,
} from "@/lib/metadata";
import { TrackedAnchor, TrackedLink } from "@/components/ui/TrackedLink";
import { breadcrumbSchema, profilePageSchema } from "@/lib/schema";
import { StructuredDataScript } from "@/components/ui/StructuredDataScript";

export const dynamic = "force-static";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildMetadata({
    title: t("aboutTitle"),
    description: t("aboutDescription"),
    pathWithoutLocale: "/about",
    locale: locale as SiteLocale,
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tApproach = await getTranslations({ locale, namespace: "approach" });
  const approachTitles = (tApproach.raw("items") as Array<{ title: string }>).map((item) => item.title);
  const siteLocale = locale as "en" | "pl";

  const structuredData = JSON.stringify([
    profilePageSchema(locale as SiteLocale),
    breadcrumbSchema([
      { name: tNav("home"), item: absoluteUrl(locale as SiteLocale, "/") },
      { name: tNav("about"), item: absoluteUrl(locale as SiteLocale, "/about") },
    ]),
  ]).replace(/<\/script>/gi, "<\\/script>");

  const rawTechStack = t.raw("techStack");
  const techStack =
    rawTechStack != null &&
    typeof rawTechStack === "object" &&
    !Array.isArray(rawTechStack)
      ? (rawTechStack as Record<string, string[]>)
      : ({} as Record<string, string[]>);

  const rawExperience = t.raw("experience");
  const experience = Array.isArray(rawExperience)
    ? (rawExperience as Array<{
        period: string;
        company: string;
        companyUrl?: string;
        role: string;
        domain: string;
        note: string;
      }>)
    : [];

  const cvLinks = [
    { href: CV_URL_EN, label: t("cvEnglish"), ctaId: "about_cv_en" },
    { href: CV_URL_PL, label: t("cvPolish"), ctaId: "about_cv_pl" },
  ];
  const howItems = [t("how1"), t("how2"), t("how3")];

  return (
    <>
      <PageHeader
        locale={siteLocale}
        title={SITE_NAME}
        eyebrow={t("role")}
        sub={t("bio1")}
        breadcrumbs={{
          ariaLabel: tCommon("breadcrumbsAriaLabel"),
          items: [{ label: tNav("home"), href: "/" }, { label: tNav("about") }],
        }}
        aside={
          <figure className="relative m-0 self-end">
            <Image
              src={PROFILE_IMAGE_640_PATH}
              alt={SITE_NAME}
              width={600}
              height={750}
              priority
              unoptimized
              fetchPriority="high"
              sizes="(min-width: 1024px) 300px, 260px"
              className="block aspect-[4/5] w-full max-w-[260px] object-cover object-[50%_20%] lg:ml-auto lg:max-w-[300px]"
            />
            <figcaption className="font-condensed absolute bottom-5 left-0 max-w-[90%] bg-[var(--color-signal)] px-3 py-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[#16080a]">
              {t("availableText")}
            </figcaption>
          </figure>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          {cvLinks.map((cv) => (
            <TrackedAnchor
              key={cv.ctaId}
              href={cv.href}
              target="_blank"
              rel="noopener noreferrer"
              analytics={{ event: "cv_download_click", locale: siteLocale, ctaId: cv.ctaId, surface: "about_page" }}
              className="btn border-white text-white"
            >
              {cv.label}
            </TrackedAnchor>
          ))}
          <TrackedLink
            locale={siteLocale}
            href="/contact"
            analytics={{ event: "cta_click", locale: siteLocale, ctaId: "about_get_in_touch", surface: "about_page" }}
            className="btn border-white bg-white text-[var(--color-cobalt)]"
          >
            {t("getInTouch")}
          </TrackedLink>
        </div>
      </PageHeader>
      <StructuredDataScript id="about-structured-data" json={structuredData} />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-16 lg:px-8">
        <aside>
          <div className="space-y-8 lg:sticky lg:top-24">
            <div>
              <p className="label-caps mb-2">{t("availability")}</p>
              <p className="font-bold text-[var(--color-text-base)]">{t("availableText")}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{t("availabilityNote")}</p>
            </div>
            <div>
              <p className="label-caps mb-2">{t("location")}</p>
              <p className="font-bold text-[var(--color-text-base)]">{t("locationText")}</p>
            </div>
            <div>
              <p className="label-caps mb-3">{tCommon("getInTouch")}</p>
              <SocialLinks showEmail />
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-16">
          <section>
            <h2 className="heading-rule">{t("backgroundHeading")}</h2>
            <div className="max-w-[65ch] space-y-4 text-lg leading-relaxed text-[var(--color-text-muted)]">
              <p>{t("bio2")}</p>
              <p>{t("bio3")}</p>
              <p>{t("bio4")}</p>
            </div>
          </section>

          <section>
            <h2 className="heading-rule !mb-0">{t("experienceHeading")}</h2>
            <ol>
              {experience.map((item) => (
                <li
                  key={`${item.period}-${item.company}`}
                  className="grid grid-cols-1 gap-2 border-b border-[var(--color-border)] py-6 sm:grid-cols-[9rem_1fr] sm:gap-6"
                >
                  <p className="text-sm font-semibold tabular-nums text-[var(--color-text-muted)]">{item.period}</p>
                  <div>
                    <h3 className="font-expanded text-2xl font-extrabold leading-tight tracking-tight text-[var(--color-text-base)]">
                      {item.companyUrl ? (
                        <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent)] transition-colors">
                          {item.company}
                        </a>
                      ) : (
                        item.company
                      )}
                    </h3>
                    <p className="mt-1 font-bold text-[var(--color-text-base)]">{item.role}</p>
                    <p className="label-caps mt-1 normal-case tracking-normal">{item.domain}</p>
                    <p className="mt-3 max-w-[60ch] leading-relaxed text-[var(--color-text-muted)]">{item.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="heading-rule !mb-0">{t("techHeading")}</h2>
            <dl>
              {Object.entries(techStack).map(([category, techs]) => (
                <div
                  key={category}
                  className="grid grid-cols-1 gap-3 border-b border-[var(--color-border)] py-4 sm:grid-cols-[9rem_1fr] sm:gap-6"
                >
                  <dt className="label-caps pt-1">{category}</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {techs.map((tech: string) => (
                      <Tag key={tech} label={tech} />
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="heading-rule">{t("howHeading")}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {howItems.map((body, index) => (
                <article key={index} className="panel-muted">
                  {approachTitles[index] && (
                    <h3 className="font-expanded text-lg font-extrabold leading-tight text-[var(--color-text-base)]">
                      {approachTitles[index]}
                    </h3>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="heading-rule">{t("companyHeading")}</h2>
            <p className="mb-4 max-w-[65ch] whitespace-pre-line leading-relaxed text-[var(--color-text-muted)]">
              {t("companyBody")}
            </p>
            <a href={COMPANY_REGISTRY_URL} target="_blank" rel="noopener noreferrer" className="link-rule">
              {t("companyRegistryLink")}
            </a>
          </section>
        </div>
      </div>
    </>
  );
}
