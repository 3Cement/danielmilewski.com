"use client";

import { useEffect } from "react";
import {
  isClientAnalyticsEventName,
  parseClientAnalyticsLocale,
  sendAnalyticsEvent,
  shouldTrackConversionHost,
} from "@/lib/analytics";

export function AnalyticsEventScript() {
  useEffect(() => {
    if (!shouldTrackConversionHost(window.location.hostname)) {
      return;
    }

    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a[data-analytics-event]");
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (!isClientAnalyticsEventName(anchor.dataset.analyticsEvent)) {
        return;
      }

      sendAnalyticsEvent({
        event: anchor.dataset.analyticsEvent,
        locale: parseClientAnalyticsLocale(
          anchor.dataset.analyticsLocale || document.documentElement.lang,
        ),
        ctaId: anchor.dataset.analyticsCtaId || undefined,
        surface: anchor.dataset.analyticsSurface || undefined,
      });
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
