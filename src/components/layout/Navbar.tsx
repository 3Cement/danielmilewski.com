import { getTranslations } from "next-intl/server";
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
    <header className="on-cobalt sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <LocalizedLink
            locale={locale}
            href="/"
            prefetch
            className="font-expanded text-base lg:text-lg font-black uppercase tracking-tight text-[var(--color-text-base)] hover:text-[var(--color-signal)] transition-colors"
          >
            Daniel Milewski
          </LocalizedLink>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <LocalizedLink
                key={link.href}
                locale={locale}
                href={link.href}
                prefetch
                className="px-2 lg:px-3 py-2 text-xs lg:text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] hover:underline underline-offset-4 transition-colors"
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
