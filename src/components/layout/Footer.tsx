import Link from "next/link";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { SITE_NAME } from "@/lib/metadata";

const footerLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link
              href="/"
              className="text-sm font-semibold text-[var(--color-text-base)] hover:text-[var(--color-accent)] transition-colors"
            >
              {SITE_NAME}
            </Link>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1" aria-label="Footer navigation">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <SocialLinks />
            <p className="text-sm text-[var(--color-text-faint)]">
              &copy; {year}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
