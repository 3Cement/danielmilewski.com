import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";
import { type ClientAnalyticsEventInput } from "@/lib/analytics";
import { localizeHref, type AppLocale } from "@/lib/localeHref";

type BaseTrackedProps = {
  analytics: ClientAnalyticsEventInput;
};

type TrackedLinkProps = BaseTrackedProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "onClick"> & {
    href: string;
    locale: AppLocale;
  };

export function TrackedLink({
  analytics,
  locale,
  href,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      href={localizeHref(locale, href)}
      data-analytics-event={analytics.event}
      data-analytics-locale={analytics.locale}
      data-analytics-cta-id={analytics.ctaId}
      data-analytics-surface={analytics.surface}
    />
  );
}

type TrackedAnchorProps = BaseTrackedProps &
  Omit<ComponentPropsWithoutRef<"a">, "onClick">;

export function TrackedAnchor({ analytics, ...props }: TrackedAnchorProps) {
  return (
    <a
      {...props}
      data-analytics-event={analytics.event}
      data-analytics-locale={analytics.locale}
      data-analytics-cta-id={analytics.ctaId}
      data-analytics-surface={analytics.surface}
    />
  );
}
