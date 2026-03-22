import Link from "next/link";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Hero() {
  return (
    <section className="relative py-24 sm:py-32 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-[var(--color-accent)] mb-4 tracking-wide uppercase">
            Available for new projects
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-text-base)] leading-[1.1]">
            Senior Python Developer building AI-powered products, backend systems and smart automation.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
            I design and ship practical software in Python — from APIs and automation to LLM-powered workflows and product-grade web apps.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-accent-muted)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              View selected work
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-[var(--color-text-base)] ring-1 ring-inset ring-[var(--color-border)] hover:bg-[var(--color-surface-muted)] transition-colors"
            >
              Contact me
            </Link>
          </div>
          <div className="mt-8">
            <SocialLinks />
          </div>
        </div>
      </div>
    </section>
  );
}
