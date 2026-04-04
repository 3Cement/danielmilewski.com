"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { COMPANY_NIP, SITE_NAME } from "@/lib/metadata";
import { TrackedAnchor } from "@/components/ui/TrackedLink";

export function Footer() {
  const tNav = useTranslations("nav");
  const tFoot = useTranslations("footer");
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
              <Link
                href="/"
                className="text-sm font-semibold text-[var(--color-text-base)] hover:text-[var(--color-accent)] transition-colors"
              >
                {SITE_NAME}
              </Link>
              <nav className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-2" aria-label="Footer navigation">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch
                    className="text-sm text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex justify-center sm:justify-end">
              <SocialLinks />
            </div>
          </div>
          <div className="flex justify-center sm:justify-start">
            <TrackedAnchor
              href="/feed.xml"
              analytics={{
                event: "cta_click",
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
