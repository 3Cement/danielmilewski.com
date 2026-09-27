import { getLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LocalizedLink } from "@/components/ui/LocalizedLink";

export default async function NotFound() {
  const resolved = await getLocale();
  const locale = (
    routing.locales.includes(resolved as "en" | "pl") ? resolved : routing.defaultLocale
  ) as "en" | "pl";
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "errors" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const recoveryLinks = [
    { href: "/projects", label: tNav("projects") },
    { href: "/blog", label: tNav("blog") },
    { href: "/contact", label: tNav("contact") },
  ];

  return (
    <section className="on-cobalt">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <p className="font-expanded text-[clamp(5rem,18vw,12rem)] font-extrabold leading-none tracking-[-0.04em]" aria-hidden="true">
          404
        </p>
        <h1 className="font-expanded mt-4 max-w-[20ch] text-[clamp(1.75rem,4vw,3rem)] font-extrabold uppercase leading-none tracking-tight">
          {t("notFoundTitle")}
        </h1>
        <p className="mt-5 max-w-[48ch] text-lg">{t("notFoundDescription")}</p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <LocalizedLink
            locale={locale}
            href="/"
            className="btn border-white bg-white text-[var(--color-cobalt)]"
          >
            {t("notFoundHome")}
          </LocalizedLink>
          {recoveryLinks.map((link) => (
            <LocalizedLink
              key={link.href}
              locale={locale}
              href={link.href}
              className="border-b-2 border-[var(--color-signal)] text-sm font-bold uppercase tracking-wider hover:text-[var(--color-signal)]"
            >
              {link.label}
            </LocalizedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
