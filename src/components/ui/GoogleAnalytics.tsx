"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  hasRealGoogleAnalyticsMeasurementId,
  isProductionAnalyticsHost,
} from "@/lib/analytics";
import {
  analyticsConsentChangeEvent,
  analyticsConsentStorageKey,
  parseAnalyticsConsentState,
  type AnalyticsConsentState,
} from "@/lib/analyticsConsent";
import { SITE_URL } from "@/lib/metadata";

interface GoogleAnalyticsProps {
  measurementId: string | undefined;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const [consentState, setConsentState] = useState<AnalyticsConsentState | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const windowWithGaFlags = window as unknown as Record<string, boolean>;

    function syncConsentState(state: AnalyticsConsentState) {
      setConsentState(state);

      if (measurementId && hasRealGoogleAnalyticsMeasurementId(measurementId)) {
        windowWithGaFlags[`ga-disable-${measurementId}`] = state !== "accepted";
      }
    }

    syncConsentState(
      parseAnalyticsConsentState(
        window.localStorage.getItem(analyticsConsentStorageKey),
      ),
    );

    function handleStorage(event: StorageEvent) {
      if (event.key !== analyticsConsentStorageKey) {
        return;
      }

      syncConsentState(parseAnalyticsConsentState(event.newValue));
    }

    function handleConsentChange(event: Event) {
      syncConsentState(
        parseAnalyticsConsentState(
          (event as CustomEvent<{ state?: string }>).detail?.state,
        ),
      );
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(analyticsConsentChangeEvent, handleConsentChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(analyticsConsentChangeEvent, handleConsentChange);
    };
  }, [measurementId]);

  const shouldLoad =
    consentState === "accepted" &&
    measurementId != null &&
    hasRealGoogleAnalyticsMeasurementId(measurementId) &&
    typeof window !== "undefined" &&
    isProductionAnalyticsHost(window.location.hostname, SITE_URL);

  if (!shouldLoad) {
    return null;
  }

  return (
    <>
      <Script
        id="google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window['ga-disable-${measurementId}'] = false;
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
