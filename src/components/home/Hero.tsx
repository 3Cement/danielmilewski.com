import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SocialLinks } from "@/components/ui/SocialLinks";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative py-24 sm:py-32 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-[var(--color-accent)] mb-4 tracking-wide uppercase">
            {t("badge")}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-text-base)] leading-[1.1]">
            {t("h1")}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
            {t("sub")}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-accent-muted)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              {t("cta1")}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-[var(--color-text-base)] ring-1 ring-inset ring-[var(--color-border)] hover:bg-[var(--color-surface-muted)] transition-colors"
            >
              {t("cta2")}
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
