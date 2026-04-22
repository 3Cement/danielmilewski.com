import { SITE_URL } from "@/lib/metadata";
import {
  analyticsConsentStorageKey,
  parseAnalyticsConsentState,
} from "@/lib/analyticsConsent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function hasRealAnalyticsToken(token: string | undefined): boolean {
  return token != null && token !== "" && token !== "REPLACE_WITH_YOUR_TOKEN";
}

export function hasRealGoogleAnalyticsMeasurementId(
  measurementId: string | undefined,
): boolean {
  return (
    measurementId != null &&
    measurementId !== "" &&
    /^G-[A-Z0-9]+$/i.test(measurementId)
  );
}

export function getProductionAnalyticsHosts(siteUrl: string): string[] {
  try {
    const configuredHost = new URL(siteUrl).hostname.toLowerCase();
    return configuredHost.startsWith("www.")
      ? [configuredHost, configuredHost.slice(4)]
      : [configuredHost, `www.${configuredHost}`];
  } catch {
    return [];
  }
}

export function isProductionAnalyticsHost(
  hostname: string | undefined,
  siteUrl: string,
): boolean {
  if (hostname == null || hostname === "") {
    return false;
  }

  const normalizedHostname = hostname.toLowerCase();
  const allowedHosts = new Set(getProductionAnalyticsHosts(siteUrl));
  return allowedHosts.has(normalizedHostname);
}

export const analyticsEventNames = [
  "contact_form_success",
  "contact_form_validation_error",
  "contact_form_captcha_failed",
  "contact_form_send_failed",
  "contact_form_config_error",
  "cta_click",
  "cv_download_click",
  "mailto_click",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

export interface AnalyticsEventPayload {
  event: AnalyticsEventName;
  timestamp: string;
  locale?: "en" | "pl";
  pathname?: string;
  ctaId?: string;
  surface?: string;
  referrerHost?: string;
  invalidFields?: string[];
}

export interface ClientAnalyticsEventInput {
  event: Extract<
    AnalyticsEventName,
    "cta_click" | "cv_download_click" | "mailto_click"
  >;
  locale?: "en" | "pl";
  ctaId?: string;
  surface?: string;
}

const MAX_TEXT_FIELD_LENGTH = 120;
const CONTACT_FIELD_NAMES = new Set<string>([
  "name",
  "email",
  "company",
  "subject",
  "message",
]);
const CLIENT_ANALYTICS_EVENT_NAMES = new Set<ClientAnalyticsEventInput["event"]>([
  "cta_click",
  "cv_download_click",
  "mailto_click",
]);

function isAnalyticsEventName(value: unknown): value is AnalyticsEventName {
  return (
    typeof value === "string" &&
    (analyticsEventNames as readonly string[]).includes(value)
  );
}

export function isClientAnalyticsEventName(
  value: unknown,
): value is ClientAnalyticsEventInput["event"] {
  return typeof value === "string" && CLIENT_ANALYTICS_EVENT_NAMES.has(
    value as ClientAnalyticsEventInput["event"],
  );
}

function sanitizeShortText(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed === "") {
    return undefined;
  }

  return trimmed.slice(0, MAX_TEXT_FIELD_LENGTH);
}

function sanitizeLocale(value: unknown): "en" | "pl" | undefined {
  return value === "en" || value === "pl" ? value : undefined;
}

export function parseClientAnalyticsLocale(
  value: unknown,
): "en" | "pl" | undefined {
  return sanitizeLocale(value);
}

function sanitizePathname(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return undefined;
  }

  return value.slice(0, 200);
}

export function getReferrerHost(referrer: string | null): string | undefined {
  if (referrer == null || referrer === "") {
    return undefined;
  }

  try {
    return new URL(referrer).host;
  } catch {
    return undefined;
  }
}

export function sanitizeAnalyticsEvent(
  input: Record<string, unknown>,
  referrer: string | null,
): AnalyticsEventPayload | null {
  if (!isAnalyticsEventName(input.event)) {
    return null;
  }

  const payload: AnalyticsEventPayload = {
    event: input.event,
    timestamp:
      typeof input.timestamp === "string" && input.timestamp !== ""
        ? input.timestamp
        : new Date().toISOString(),
  };

  const locale = sanitizeLocale(input.locale);
  if (locale) {
    payload.locale = locale;
  }

  const pathname = sanitizePathname(input.pathname);
  if (pathname) {
    payload.pathname = pathname;
  }

  const ctaId = sanitizeShortText(input.ctaId);
  if (ctaId) {
    payload.ctaId = ctaId;
  }

  const surface = sanitizeShortText(input.surface);
  if (surface) {
    payload.surface = surface;
  }

  if (Array.isArray(input.invalidFields)) {
    const invalidFields = input.invalidFields
      .filter((field): field is string => typeof field === "string")
      .filter((field) => CONTACT_FIELD_NAMES.has(field))
      .sort();

    if (invalidFields.length > 0) {
      payload.invalidFields = invalidFields;
    }
  }

  const referrerHost = getReferrerHost(referrer);
  if (referrerHost) {
    payload.referrerHost = referrerHost;
  }

  return payload;
}

export function shouldTrackConversionHost(hostname: string): boolean {
  return isProductionAnalyticsHost(hostname, SITE_URL);
}

function shouldSendGoogleAnalyticsClientEvent(): boolean {
  if (
    typeof window === "undefined" ||
    !shouldTrackConversionHost(window.location.hostname)
  ) {
    return false;
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (
    !hasRealGoogleAnalyticsMeasurementId(measurementId) ||
    typeof window.gtag !== "function"
  ) {
    return false;
  }

  const consentState = parseAnalyticsConsentState(
    window.localStorage.getItem(analyticsConsentStorageKey),
  );
  if (consentState !== "accepted") {
    return false;
  }

  const windowWithGaFlags = window as unknown as Record<string, boolean | undefined>;
  return windowWithGaFlags[`ga-disable-${measurementId}`] !== true;
}

function sendGoogleAnalyticsEvent(
  input: ClientAnalyticsEventInput,
  pathname: string,
): void {
  if (!shouldSendGoogleAnalyticsClientEvent()) {
    return;
  }

  window.gtag!("event", input.event, {
    cta_id: input.ctaId ?? "",
    locale: input.locale ?? document.documentElement.lang ?? "",
    surface: input.surface ?? "",
    pathname,
    page_path: pathname,
    page_location: window.location.href,
    page_title: document.title,
    host_name: window.location.hostname,
    transport_type: "beacon",
  });
}

export function sendAnalyticsEvent(
  input: ClientAnalyticsEventInput,
  pathname?: string,
): void {
  if (
    typeof window === "undefined" ||
    !shouldTrackConversionHost(window.location.hostname)
  ) {
    return;
  }

  const resolvedPathname = pathname ?? window.location.pathname;
  sendGoogleAnalyticsEvent(input, resolvedPathname);

  const payload = JSON.stringify({
    ...input,
    pathname: resolvedPathname,
    timestamp: new Date().toISOString(),
  });

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon("/api/analytics", blob);
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
    keepalive: true,
  });
}
