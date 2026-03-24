import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <div className="py-24 px-4">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-sm font-medium text-[var(--color-accent)] mb-2">404</p>
        <h1 className="text-2xl font-bold text-[var(--color-text-base)] mb-4">{t("notFoundTitle")}</h1>
        <p className="text-[var(--color-text-muted)] mb-8 leading-relaxed">{t("notFoundDescription")}</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-accent-muted)] transition-colors"
        >
          {t("notFoundHome")}
        </Link>
      </div>
    </div>
  );
}
