import { redirect } from "next/navigation";
import { getRequestLocale } from "@/i18n/requestLocale";

export default async function LegacyMainRedirectPage() {
  redirect(`/${await getRequestLocale()}`);
}
