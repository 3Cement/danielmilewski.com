import type { Metadata } from "next";
import { connection } from "next/server";
import { getMessages, getTranslations } from "next-intl/server";
import { SocialLinks, EmailIcon, GitHubIcon, LinkedInIcon, XIcon } from "@/components/ui/SocialLinks";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactExpectations } from "@/components/contact/ContactExpectations";
import { isHCaptchaConfigured } from "@/lib/hcaptcha";
import { absoluteUrl, buildMetadata, CV_URL_EN, CV_URL_PL, EMAIL, GITHUB_URL, LINKEDIN_URL, X_URL, type SiteLocale } from "@/lib/metadata";
import { readServerEnv } from "@/lib/serverEnv";
import { isTurnstileConfigured } from "@/lib/turnstile";
import { TrackedAnchor } from "@/components/ui/TrackedLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { CopyEmailButton } from "@/components/home/CopyEmailButton";
import { breadcrumbSchema } from "@/lib/schema";
import { StructuredDataScript } from "@/components/ui/StructuredDataScript";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildMetadata({
    title: t("contactTitle"),
    description: t("contactDescription"),
    pathWithoutLocale: "/contact",
    locale: locale as SiteLocale,
  });
}

export default async function ContactPage({ params }: Props) {
  await connection();
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tHire = await getTranslations({ locale, namespace: "hire" });
  const messages = await getMessages({ locale });
  const hcaptchaSiteKey = await readServerEnv("NEXT_PUBLIC_HCAPTCHA_SITE_KEY");
  const hcaptchaSecret = await readServerEnv("HCAPTCHA_SECRET_KEY");
  const turnstileSiteKey = await readServerEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY");
  const turnstileSecret = await readServerEnv("TURNSTILE_SECRET_KEY");
  const activeHCaptchaSiteKey = isHCaptchaConfigured(
    hcaptchaSiteKey,
    hcaptchaSecret,
  )
    ? hcaptchaSiteKey
    : undefined;
  const activeTurnstileSiteKey =
    !activeHCaptchaSiteKey &&
    isTurnstileConfigured(turnstileSiteKey, turnstileSecret)
      ? turnstileSiteKey
      : undefined;

  const lookingItems = t.raw("lookingItems") as string[];

  const structuredData = JSON.stringify(
    breadcrumbSchema([
      { name: tNav("home"), item: absoluteUrl(locale as SiteLocale, "/") },
      {
        name: tNav("contact"),
        item: absoluteUrl(locale as SiteLocale, "/contact"),
      },
    ]),
  ).replace(/<\/script>/gi, "<\\/script>");

  return (
    <>
      <PageHeader
        locale={locale as "en" | "pl"}
        title={t("heading")}
        sub={t("sub")}
        breadcrumbs={{
          ariaLabel: tCommon("breadcrumbsAriaLabel"),
          items: [{ label: tNav("home"), href: "/" }, { label: tNav("contact") }],
        }}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <TrackedAnchor
            href={CV_URL_EN}
            target="_blank"
            rel="noopener noreferrer"
            analytics={{
              event: "cv_download_click",
              locale: locale as "en" | "pl",
              ctaId: "contact_cv_en",
              surface: "contact_page",
            }}
            className="btn border-white text-white"
          >
            {t("cvEnglish")}
          </TrackedAnchor>
          <TrackedAnchor
            href={CV_URL_PL}
            target="_blank"
            rel="noopener noreferrer"
            analytics={{
              event: "cv_download_click",
              locale: locale as "en" | "pl",
              ctaId: "contact_cv_pl",
              surface: "contact_page",
            }}
            className="btn border-white text-white"
          >
            {t("cvPolish")}
          </TrackedAnchor>
        </div>
      </PageHeader>
      <StructuredDataScript id="contact-structured-data" json={structuredData} />
      <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="min-w-0">
            <ContactForm
              locale={locale as "en" | "pl"}
              messages={messages.contactForm}
              hcaptchaSiteKey={activeHCaptchaSiteKey}
              turnstileSiteKey={activeTurnstileSiteKey}
            />
          </div>

          <div className="min-w-0 xl:pt-2">
            <div className="space-y-8 xl:sticky xl:top-24">
              <ContactExpectations locale={locale} compact />

              <div className="on-ink p-6">
                <p className="font-expanded mb-2 text-xl font-extrabold uppercase">
                  {t("emailHeading")}
                </p>
                <p className="mb-4 text-sm text-[var(--color-text-muted)]">
                  {t("emailSub")}
                </p>
                <TrackedAnchor
                  href={`mailto:${EMAIL}`}
                  analytics={{
                    event: "mailto_click",
                    locale: locale as "en" | "pl",
                    ctaId: "contact_direct_email",
                    surface: "contact_page",
                  }}
                  className="inline-flex items-center gap-2 break-all font-bold hover:text-[var(--color-signal)]"
                >
                  <EmailIcon size={16} />
                  {EMAIL}
                </TrackedAnchor>
                <CopyEmailButton
                  email={EMAIL}
                  label={tHire("copy")}
                  copiedLabel={tHire("copied")}
                  className="font-condensed mt-4 block cursor-pointer bg-[var(--color-signal)] px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#16080a]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border-2 border-[var(--color-text-base)] p-4 transition-[transform,box-shadow] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--color-signal)]"
                >
                  <LinkedInIcon />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-base)]">
                      LinkedIn
                    </p>
                    <p className="text-xs text-[var(--color-text-faint)]">
                      {t("linkedinConnect")}
                    </p>
                  </div>
                </a>

                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border-2 border-[var(--color-text-base)] p-4 transition-[transform,box-shadow] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--color-signal)]"
                >
                  <GitHubIcon />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-base)]">
                      GitHub
                    </p>
                    <p className="text-xs text-[var(--color-text-faint)]">
                      {t("githubSee")}
                    </p>
                  </div>
                </a>

                <a
                  href={X_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border-2 border-[var(--color-text-base)] p-4 transition-[transform,box-shadow] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--color-signal)]"
                >
                  <XIcon />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-base)]">
                      X
                    </p>
                    <p className="text-xs text-[var(--color-text-faint)]">
                      {t("xFollow")}
                    </p>
                  </div>
                </a>
              </div>

              <div>
                <h2 className="heading-rule">
                  {t("lookingHeading")}
                </h2>
                <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                  {lookingItems.map((item: string) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        className="mt-1.5 block h-2 w-2 shrink-0 bg-[var(--color-signal)]"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-[var(--color-border)] pt-8">
                <SocialLinks showEmail />
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
