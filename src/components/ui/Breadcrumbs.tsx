import { LocalizedLink } from "@/components/ui/LocalizedLink";
import { type AppLocale } from "@/lib/localeHref";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  ariaLabel: string;
  locale: AppLocale;
}

export function Breadcrumbs({ items, ariaLabel, locale }: BreadcrumbsProps) {
  return (
    <nav aria-label={ariaLabel} className="mb-10">
      <ol className="font-condensed flex flex-wrap items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-text-faint)]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <LocalizedLink
                  locale={locale}
                  href={item.href}
                  className="hover:text-[var(--color-text-base)] hover:underline underline-offset-4 transition-colors"
                >
                  {item.label}
                </LocalizedLink>
              ) : (
                <span className={isLast ? "line-clamp-1 text-[var(--color-text-base)]" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
