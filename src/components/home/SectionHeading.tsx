import { LocalizedLink } from "@/components/ui/LocalizedLink";

interface SectionHeadingProps {
  title: string;
  sub?: string;
  id?: string;
  link?: { href: string; label: string; locale: "en" | "pl" };
}

/** Oversized expanded heading with a heavy rule, shared by homepage sections. */
export function SectionHeading({ title, sub, id, link }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b-[3px] border-[var(--color-text-base)] pt-16 pb-6 sm:pt-28">
      <h2
        id={id}
        className="font-expanded max-w-[10em] text-[clamp(1.85rem,4.4vw,3.75rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-[var(--color-text-base)] text-balance"
      >
        {title}
      </h2>
      <div className="flex max-w-[17em] flex-col items-start gap-3">
        {sub && <p className="text-[var(--color-text-muted)]">{sub}</p>}
        {link && (
          <LocalizedLink
            locale={link.locale}
            href={link.href}
            prefetch
            className="text-sm font-bold uppercase tracking-wider text-[var(--color-accent)] hover:underline underline-offset-4"
          >
            {link.label} →
          </LocalizedLink>
        )}
      </div>
    </div>
  );
}
