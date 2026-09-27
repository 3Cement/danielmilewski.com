import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { type AppLocale } from "@/lib/localeHref";

interface PageHeaderProps {
  locale: AppLocale;
  title: string;
  eyebrow?: string;
  sub?: string;
  breadcrumbs?: { ariaLabel: string; items: Array<{ label: string; href?: string }> };
  /** "page" = short uppercase poster title; "article" = long post/case-study title. */
  variant?: "page" | "article";
  aside?: React.ReactNode;
  children?: React.ReactNode;
}

/** Cobalt band that opens every subpage, matching the homepage hero. */
export function PageHeader({
  locale,
  title,
  eyebrow,
  sub,
  breadcrumbs,
  variant = "page",
  aside,
  children,
}: PageHeaderProps) {
  const titleClass =
    variant === "page"
      ? "text-[clamp(2.5rem,7vw,5.5rem)] uppercase leading-[0.9] tracking-[-0.035em]"
      : "text-[clamp(1.9rem,4.2vw,3.5rem)] leading-[1.02] tracking-[-0.025em]";

  return (
    <header className="on-cobalt">
      <div
        className={
          "mx-auto grid max-w-6xl items-end gap-8 px-4 pt-8 pb-12 sm:px-6 sm:pb-16 lg:px-8 " +
          (aside ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:pb-0" : "")
        }
      >
        <div className={aside ? "lg:pb-16" : undefined}>
          {breadcrumbs && (
            <Breadcrumbs ariaLabel={breadcrumbs.ariaLabel} locale={locale} items={breadcrumbs.items} />
          )}
          {eyebrow && (
            <p className="font-condensed mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em]">
              <span className="block h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-signal)]" aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          <h1 className={"font-expanded max-w-[22ch] font-extrabold text-balance " + titleClass}>{title}</h1>
          {sub && <p className="mt-6 max-w-[52ch] text-lg leading-snug sm:text-xl">{sub}</p>}
          {children}
        </div>
        {aside}
      </div>
    </header>
  );
}
