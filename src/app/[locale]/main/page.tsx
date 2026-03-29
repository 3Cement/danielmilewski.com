import { notFound, permanentRedirect } from "next/navigation";
import { routing } from "@/i18n/routing";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function LegacyLocaleMainRedirectPage({ params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "pl")) {
    notFound();
  }

  permanentRedirect(`/${locale}`);
}
