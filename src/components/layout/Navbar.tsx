import { getTranslations } from "next-intl/server";
import Image from "next/image";
import {
  NavbarControls,
  type NavbarLink,
} from "@/components/layout/NavbarControls";
import { LocalizedLink } from "@/components/ui/LocalizedLink";

interface NavbarProps {
  locale: "en" | "pl";
}

export async function Navbar({ locale }: NavbarProps) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const navLinks: readonly NavbarLink[] = [
    { href: "/", label: t("home") },
    { href: "/projects", label: t("projects") },
    { href: "/blog", label: t("blog") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <LocalizedLink
            locale={locale}
            href="/"
            prefetch
            className="group inline-flex items-center gap-3 text-sm font-semibold text-[var(--color-text-base)] hover:text-[var(--color-accent)] transition-colors"
          >
            <Image
              src="/logo.svg"
              alt="Daniel Milewski logo"
              width={120}
              height={86}
              priority
              className="relative top-px h-7 w-auto shrink-0"
            />
            <span className="leading-none">Daniel Milewski</span>
          </LocalizedLink>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <LocalizedLink
                key={link.href}
                locale={locale}
                href={link.href}
                prefetch
                className="px-3 py-2 rounded-md text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] hover:bg-[var(--color-surface-muted)] transition-colors"
              >
                {link.label}
              </LocalizedLink>
            ))}
          </nav>

          <NavbarControls
            locale={locale}
            navLinks={navLinks}
            toggleMenuLabel={t("toggleMenu")}
          />
        </div>
      </div>
    </header>
  );
}
