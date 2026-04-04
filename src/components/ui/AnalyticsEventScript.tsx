"use client";

import { useEffect } from "react";
import { shouldTrackConversionHost } from "@/lib/analytics";

function postAnalyticsPayload(payload: string) {
  if (typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon(
      "/api/analytics",
      new Blob([payload], { type: "application/json" }),
    );
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  });
}

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

      const payload = JSON.stringify({
        event: anchor.dataset.analyticsEvent,
        timestamp: new Date().toISOString(),
        pathname: window.location.pathname,
        locale: anchor.dataset.analyticsLocale || document.documentElement.lang || undefined,
        ctaId: anchor.dataset.analyticsCtaId || undefined,
        surface: anchor.dataset.analyticsSurface || undefined,
      });

      postAnalyticsPayload(payload);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
