import type { Metadata } from "next";
import { connection } from "next/server";
import { getMessages, getTranslations } from "next-intl/server";
import { SocialLinks, EmailIcon, GitHubIcon, LinkedInIcon } from "@/components/ui/SocialLinks";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactExpectations } from "@/components/contact/ContactExpectations";
import { isHCaptchaConfigured } from "@/lib/hcaptcha";
import { buildMetadata, CV_URL_EN, CV_URL_PL, EMAIL, GITHUB_URL, LINKEDIN_URL, type SiteLocale } from "@/lib/metadata";
import { readServerEnv } from "@/lib/serverEnv";
import { isTurnstileConfigured } from "@/lib/turnstile";
import { TrackedAnchor } from "@/components/ui/TrackedLink";

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

  return (
    <div className="py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] xl:gap-12">
          <div className="min-w-0">
            <div className="max-w-3xl">
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text-base)] sm:text-4xl">
                {t("heading")}
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-[var(--color-text-muted)]">
                {t("sub")}
              </p>

              <div className="mb-10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-faint)]">
                  {t("cvHeading")}
                </p>
                <div className="flex flex-wrap gap-3">
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
                    className="inline-flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2 text-sm font-medium text-[var(--color-text-base)] transition-colors hover:border-[var(--color-accent)]/50"
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
                    className="inline-flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2 text-sm font-medium text-[var(--color-text-base)] transition-colors hover:border-[var(--color-accent)]/50"
                  >
                    {t("cvPolish")}
                  </TrackedAnchor>
                </div>
              </div>
            </div>

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

              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6">
                <p className="mb-2 text-sm font-semibold text-[var(--color-text-base)]">
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
                  className="inline-flex items-center gap-2 font-medium text-[var(--color-accent)] hover:underline"
                >
                  <EmailIcon size={16} />
                  {EMAIL}
                </TrackedAnchor>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] p-4 transition-all hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-muted)]"
                >
                  <LinkedInIcon />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-base)]">
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
                  className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] p-4 transition-all hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-muted)]"
                >
                  <GitHubIcon />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-base)]">
                      GitHub
                    </p>
                    <p className="text-xs text-[var(--color-text-faint)]">
                      {t("githubSee")}
                    </p>
                  </div>
                </a>
              </div>

              <div>
                <h2 className="mb-4 text-base font-semibold text-[var(--color-text-base)]">
                  {t("lookingHeading")}
                </h2>
                <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                  {lookingItems.map((item: string) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
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
  );
}
