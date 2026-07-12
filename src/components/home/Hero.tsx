import { getTranslations } from "next-intl/server";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { TrackedLink } from "@/components/ui/TrackedLink";

interface HeroProps {
  locale: string;
}

export async function Hero({ locale }: HeroProps) {
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <section
      className="volt-dotgrid relative scroll-mt-24 border-b border-[var(--color-border)] py-24 sm:py-32 px-4"
      id="hero"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-[var(--color-accent)]/40 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
              {t("badgePrimary")}
            </span>
            <span className="inline-flex items-center rounded-full border border-[var(--color-accent-2)]/40 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-2)]">
              {t("badgeSecondary")}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text-base)] leading-[1.02] text-balance">
            {t("h1")}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
            {t("sub")}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <TrackedLink
              locale={locale as "en" | "pl"}
              href="/projects"
              analytics={{
                event: "cta_click",
                locale: locale as "en" | "pl",
                ctaId: "hero_view_projects",
                surface: "hero",
              }}
              className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-on-accent)] shadow-sm hover:bg-[var(--color-accent-muted)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              {t("cta1")}
            </TrackedLink>
            <TrackedLink
              locale={locale as "en" | "pl"}
              href="/contact"
              analytics={{
                event: "cta_click",
                locale: locale as "en" | "pl",
                ctaId: "hero_contact",
                surface: "hero",
              }}
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-[var(--color-text-base)] ring-1 ring-inset ring-[var(--color-border)] hover:bg-[var(--color-surface-muted)] transition-colors"
            >
              {t("cta2")}
            </TrackedLink>
          </div>
          <div className="mt-8">
            <SocialLinks />
          </div>
        </div>
      </div>
    </section>
  );
}
