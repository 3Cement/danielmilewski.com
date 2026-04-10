export const analyticsConsentStorageKey = "dm_analytics_consent";
export const analyticsConsentChangeEvent = "dm:analytics-consent-change";
export const analyticsConsentOpenEvent = "dm:analytics-consent-open";

export type AnalyticsConsentState = "unknown" | "accepted" | "rejected";

export function parseAnalyticsConsentState(
  value: string | null | undefined,
): AnalyticsConsentState {
  return value === "accepted" || value === "rejected" ? value : "unknown";
}
