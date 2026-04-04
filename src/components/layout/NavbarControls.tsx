"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface NavbarLink {
  href: string;
  label: string;
}

interface NavbarControlsProps {
  locale: "en" | "pl";
  navLinks: readonly NavbarLink[];
  toggleMenuLabel: string;
}

function isNavLinkActive(href: string, pathname: string): boolean {
  if (href === "/") {
    return pathname === "/" || pathname === "";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavbarControls({
  locale,
  navLinks,
  toggleMenuLabel,
}: NavbarControlsProps) {
  const pathname = usePathname() || "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <LanguageSwitcher locale={locale} />
        <ThemeToggle />
        <button
          className="md:hidden rounded-md p-2 text-[var(--color-text-faint)] hover:text-[var(--color-text-base)] hover:bg-[var(--color-surface-muted)] transition-colors"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label={toggleMenuLabel}
        >
          {mobileOpen ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <nav
          className="md:hidden border-t border-[var(--color-border)] py-3"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              onClick={() => setMobileOpen(false)}
              aria-current={isNavLinkActive(link.href, pathname) ? "page" : undefined}
              className={cn(
                "block px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isNavLinkActive(link.href, pathname)
                  ? "text-[var(--color-text-base)] bg-[var(--color-surface-muted)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] hover:bg-[var(--color-surface-muted)]",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
