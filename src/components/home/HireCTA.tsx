import { getTranslations } from "next-intl/server";
import { CopyEmailButton } from "@/components/home/CopyEmailButton";
import { TrackedAnchor, TrackedLink } from "@/components/ui/TrackedLink";
import { EMAIL, GITHUB_URL, LINKEDIN_URL, X_URL } from "@/lib/metadata";

interface HireCTAProps {
  locale: string;
}

export async function HireCTA({ locale }: HireCTAProps) {
  const t = await getTranslations({ locale, namespace: "hire" });
  const siteLocale = locale as "en" | "pl";
  const socials = [
    { href: LINKEDIN_URL, label: "LinkedIn" },
    { href: GITHUB_URL, label: "GitHub" },
    { href: X_URL, label: "X" },
  ];
  const linkClass =
    "border-b-2 border-[var(--color-signal)] text-sm font-bold uppercase tracking-wider text-[var(--color-text-base)] hover:text-[var(--color-signal)] transition-colors";

  return (
    <section className="on-ink mt-16 scroll-mt-24 sm:mt-28" id="contact">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-28 lg:px-8">
        <h2 className="font-expanded max-w-[16ch] text-[clamp(1.85rem,4.4vw,3.75rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-balance">
          {t("heading")}
        </h2>
        <p className="mt-5 max-w-[44ch] text-lg text-[var(--color-text-muted)]">{t("sub")}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <TrackedAnchor
            href={`mailto:${EMAIL}`}
            analytics={{ event: "cta_click", locale: siteLocale, ctaId: "home_hire_email", surface: "hire_cta" }}
            className="font-expanded break-all text-[clamp(1.25rem,3.6vw,2.75rem)] font-extrabold leading-tight tracking-tight hover:text-[var(--color-signal)] transition-colors"
          >
            {EMAIL}
          </TrackedAnchor>
          <CopyEmailButton
            email={EMAIL}
            label={t("copy")}
            copiedLabel={t("copied")}
            className="font-condensed cursor-pointer bg-[var(--color-signal)] px-4 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[#16080a]"
          />
        </div>
        <div className="mt-10 flex flex-wrap gap-6">
          {socials.map((social) => (
            <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {social.label}
            </a>
          ))}
          <TrackedLink
            locale={siteLocale}
            href="/contact"
            analytics={{ event: "cta_click", locale: siteLocale, ctaId: "home_hire_contact_form", surface: "hire_cta" }}
            className={linkClass}
          >
            {t("contactForm")}
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
