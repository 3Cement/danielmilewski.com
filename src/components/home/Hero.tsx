import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { TrackedAnchor, TrackedLink } from "@/components/ui/TrackedLink";
import { CV_URL_EN, CV_URL_PL, PROFILE_IMAGE_640_PATH } from "@/lib/metadata";

interface HeroProps {
  locale: string;
}

export async function Hero({ locale }: HeroProps) {
  const t = await getTranslations({ locale, namespace: "hero" });
  const h1Lines = t.raw("h1Lines") as string[];
  const siteLocale = locale as "en" | "pl";

  return (
    <section className="on-cobalt relative scroll-mt-24 overflow-hidden" id="hero">
      <div className="mx-auto grid max-w-6xl items-end gap-8 px-4 pt-12 sm:px-6 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:gap-16 lg:px-8">
        <div>
          {/* Single line: the fallback font has no condensed width, so wrapping here shifted the hero (CLS) while Archivo loaded. */}
          <p className="font-condensed flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em]">
            <span
              className="block h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-signal)] ring-4 ring-white/20"
              aria-hidden="true"
            />
            <span className="min-w-0 truncate">{t("eyebrow")}</span>
          </p>
          <h1 className="font-expanded mt-6 text-[clamp(2.25rem,5.4vw,4.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.035em]">
            {h1Lines.map((line) => (
              <span key={line} className="hero-line">
                {line}{" "}
              </span>
            ))}
          </h1>
          <p className="mt-7 max-w-[18em] text-lg leading-snug sm:text-xl">
            {t("sub")}
          </p>
          <div className="mt-8 mb-10 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap lg:mb-20">
            <TrackedLink
              locale={siteLocale}
              href="/projects"
              analytics={{
                event: "cta_click",
                locale: siteLocale,
                ctaId: "hero_view_projects",
                surface: "hero",
              }}
              className="inline-flex items-center border-2 border-white bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-[var(--color-cobalt)] transition-[transform,box-shadow] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--color-signal)]"
            >
              {t("cta1")}
            </TrackedLink>
            <TrackedAnchor
              href={siteLocale === "pl" ? CV_URL_PL : CV_URL_EN}
              target="_blank"
              rel="noopener"
              analytics={{
                event: "cta_click",
                locale: siteLocale,
                ctaId: "hero_download_cv",
                surface: "hero",
              }}
              className="inline-flex items-center border-2 border-white px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-[transform,box-shadow] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--color-signal)]"
            >
              {t("cta2")}
            </TrackedAnchor>
          </div>
        </div>
        <figure className="relative self-end">
          <Image
            src={PROFILE_IMAGE_640_PATH}
            alt={t("photoAlt")}
            width={440}
            height={550}
            priority
            unoptimized
            fetchPriority="high"
            sizes="(min-width: 1024px) 360px, 320px"
            className="ml-auto block aspect-[4/5] w-full max-w-[320px] object-cover object-[50%_20%] lg:max-w-[360px]"
          />
          <figcaption className="font-condensed absolute bottom-6 left-0 bg-[var(--color-signal)] px-3 py-2 text-sm font-extrabold uppercase tracking-[0.08em] text-[#16080a]">
            {t("status")}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
