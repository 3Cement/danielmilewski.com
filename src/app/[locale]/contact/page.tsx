import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SocialLinks, EmailIcon, GitHubIcon, LinkedInIcon } from "@/components/ui/SocialLinks";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactExpectations } from "@/components/contact/ContactExpectations";
import { buildMetadata, CV_URL_EN, CV_URL_PL, EMAIL, GITHUB_URL, LINKEDIN_URL, type SiteLocale } from "@/lib/metadata";

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
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  const lookingItems = t.raw("lookingItems") as string[];

  return (
    <div className="py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-base)] mb-4">
            {t("heading")}
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-8">
            {t("sub")}
          </p>

          <div className="mb-10">
            <p className="text-xs font-semibold text-[var(--color-text-faint)] uppercase tracking-widest mb-3">
              {t("cvHeading")}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={CV_URL_EN}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2 text-sm font-medium text-[var(--color-text-base)] hover:border-[var(--color-accent)]/50 transition-colors"
              >
                {t("cvEnglish")}
              </a>
              <a
                href={CV_URL_PL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2 text-sm font-medium text-[var(--color-text-base)] hover:border-[var(--color-accent)]/50 transition-colors"
              >
                {t("cvPolish")}
              </a>
            </div>
          </div>

          <ContactForm />
          <ContactExpectations />

          <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] mb-8">
            <p className="text-sm font-semibold text-[var(--color-text-base)] mb-2">
              {t("emailHeading")}
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              {t("emailSub")}
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 text-[var(--color-accent)] font-medium hover:underline"
            >
              <EmailIcon size={16} />
              {EMAIL}
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-muted)] transition-all"
            >
              <LinkedInIcon />
              <div>
                <p className="text-sm font-medium text-[var(--color-text-base)]">LinkedIn</p>
                <p className="text-xs text-[var(--color-text-faint)]">{t("linkedinConnect")}</p>
              </div>
            </a>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-muted)] transition-all"
            >
              <GitHubIcon />
              <div>
                <p className="text-sm font-medium text-[var(--color-text-base)]">GitHub</p>
                <p className="text-xs text-[var(--color-text-faint)]">{t("githubSee")}</p>
              </div>
            </a>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--color-text-base)] mb-4">
              {t("lookingHeading")}
            </h2>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              {lookingItems.map((item: string) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 pt-8 border-t border-[var(--color-border)]">
            <SocialLinks showEmail />
          </div>
        </div>
      </div>
    </div>
  );
}
