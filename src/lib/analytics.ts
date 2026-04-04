import { SITE_URL } from "@/lib/metadata";

export function hasRealAnalyticsToken(token: string | undefined): boolean {
  return token != null && token !== "" && token !== "REPLACE_WITH_YOUR_TOKEN";
}

export function isProductionAnalyticsHost(
  hostname: string | undefined,
  siteUrl: string,
): boolean {
  if (hostname == null || hostname === "") {
    return false;
  }

  const normalizedHostname = hostname.toLowerCase();

  try {
    const configuredHost = new URL(siteUrl).hostname.toLowerCase();
    const allowedHosts = new Set([
      configuredHost,
      configuredHost.startsWith("www.")
        ? configuredHost.slice(4)
        : `www.${configuredHost}`,
    ]);

    return allowedHosts.has(normalizedHostname);
  } catch {
    return false;
  }
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

function isAnalyticsEventName(value: unknown): value is AnalyticsEventName {
  return (
    typeof value === "string" &&
    (analyticsEventNames as readonly string[]).includes(value)
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

  const payload = JSON.stringify({
    ...input,
    pathname: pathname ?? window.location.pathname,
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
