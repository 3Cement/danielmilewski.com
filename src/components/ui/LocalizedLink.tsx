import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";
import { localizeHref, type AppLocale } from "@/lib/localeHref";

type LocalizedLinkProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href"
> & {
  href: string;
  locale: AppLocale;
};

export function LocalizedLink({
  locale,
  href,
  ...props
}: LocalizedLinkProps) {
  return <Link {...props} href={localizeHref(locale, href)} />;
}
