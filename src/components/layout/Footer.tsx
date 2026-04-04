import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { COMPANY_NIP, SITE_NAME } from "@/lib/metadata";
import { TrackedAnchor } from "@/components/ui/TrackedLink";
import { LocalizedLink } from "@/components/ui/LocalizedLink";

interface FooterProps {
  locale: "en" | "pl";
}

export async function Footer({ locale }: FooterProps) {
  const [tNav, tFoot] = await Promise.all([
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "footer" }),
  ]);
  const year = new Date().getFullYear();

  const footerLinks = [
    { href: "/", label: tNav("home") },
    { href: "/projects", label: tNav("projects") },
    { href: "/blog", label: tNav("blog") },
    { href: "/about", label: tNav("about") },
    { href: "/contact", label: tNav("contact") },
    { href: "/privacy", label: tFoot("privacy") },
  ];

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <LocalizedLink
                locale={locale}
                href="/"
                className="inline-flex items-center gap-3 text-sm font-semibold text-[var(--color-text-base)] hover:text-[var(--color-accent)] transition-colors"
              >
                <Image
                  src="/logo.svg"
                  alt="Daniel Milewski logo"
                  width={120}
                  height={86}
                  className="relative top-px h-6 w-auto shrink-0"
                />
                <span className="leading-none">{SITE_NAME}</span>
              </LocalizedLink>
              <nav className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-2" aria-label="Footer navigation">
                {footerLinks.map((link) => (
                  <LocalizedLink
                    key={link.href}
                    locale={locale}
                    href={link.href}
                    prefetch
                    className="text-sm text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)] transition-colors"
                  >
                    {link.label}
                  </LocalizedLink>
                ))}
              </nav>
            </div>
            <div className="flex justify-center sm:justify-end">
              <SocialLinks />
            </div>
          </div>
          <div className="flex justify-center sm:justify-start">
            <TrackedAnchor
              href={`/${locale}/feed.xml`}
              analytics={{
                event: "cta_click",
                locale,
                ctaId: "footer_rss_feed",
                surface: "footer",
              }}
              className="text-sm text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)] transition-colors"
            >
              {tFoot("rss")}
            </TrackedAnchor>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-[var(--color-border-muted)] text-xs text-[var(--color-text-faint)]">
            <p>{tFoot("copyright", { year })}</p>
            <p>{tFoot("legalLine", { nip: COMPANY_NIP })}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
