import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/home/SectionHeading";

interface ApproachItem {
  title: string;
  body: string;
}

interface ApproachSectionProps {
  locale: string;
}

export async function ApproachSection({ locale }: ApproachSectionProps) {
  const t = await getTranslations({ locale, namespace: "approach" });
  const items = t.raw("items") as ApproachItem[];

  return (
    <section className="mt-16 scroll-mt-24 bg-[var(--color-surface-muted)] sm:mt-28" id="approach">
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-28 lg:px-8">
        <SectionHeading title={t("heading")} sub={t("sub")} />
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="border-b border-[var(--color-border)] py-7 last:border-b-0 lg:border-b-0 lg:border-l lg:px-7 lg:first:border-l-0 lg:first:pl-0"
            >
              <h3 className="font-expanded text-2xl font-extrabold leading-tight tracking-tight text-[var(--color-text-base)]">
                {item.title}
              </h3>
              <p className="mt-2.5 leading-relaxed text-[var(--color-text-muted)]">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
