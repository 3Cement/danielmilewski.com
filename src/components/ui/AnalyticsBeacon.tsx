"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { SITE_URL } from "@/lib/metadata";
import {
  hasRealAnalyticsToken,
  isProductionAnalyticsHost,
} from "@/lib/analytics";

interface AnalyticsBeaconProps {
  token: string | undefined;
}

export function AnalyticsBeacon({ token }: AnalyticsBeaconProps) {
  const hostname = useSyncExternalStore(
    () => () => {},
    () => window.location.hostname,
    () => "",
  );
  const shouldLoad =
    hasRealAnalyticsToken(token) && isProductionAnalyticsHost(hostname, SITE_URL);

  if (!shouldLoad) {
    return null;
  }

  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
      strategy="afterInteractive"
    />
  );
}
