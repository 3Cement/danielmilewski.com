import Script from "next/script";
import { hasRealAnalyticsToken } from "@/lib/analytics";

interface AnalyticsBeaconProps {
  token: string | undefined;
}

export function AnalyticsBeacon({ token }: AnalyticsBeaconProps) {
  if (!hasRealAnalyticsToken(token)) {
    return null;
  }

  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
      strategy="lazyOnload"
    />
  );
}
