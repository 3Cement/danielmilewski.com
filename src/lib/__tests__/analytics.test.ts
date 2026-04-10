import { describe, expect, it } from "vitest";
import {
  hasRealAnalyticsToken,
  hasRealGoogleAnalyticsMeasurementId,
  isProductionAnalyticsHost,
  sanitizeAnalyticsEvent,
  shouldTrackConversionHost,
} from "@/lib/analytics";

describe("hasRealAnalyticsToken", () => {
  it("returns false for missing values", () => {
    expect(hasRealAnalyticsToken(undefined)).toBe(false);
    expect(hasRealAnalyticsToken("")).toBe(false);
  });

  it("returns false for the placeholder token", () => {
    expect(hasRealAnalyticsToken("REPLACE_WITH_YOUR_TOKEN")).toBe(false);
  });

  it("returns true for a real token", () => {
    expect(hasRealAnalyticsToken("cf-real-token")).toBe(true);
  });
});

describe("hasRealGoogleAnalyticsMeasurementId", () => {
  it("returns false for missing and malformed values", () => {
    expect(hasRealGoogleAnalyticsMeasurementId(undefined)).toBe(false);
    expect(hasRealGoogleAnalyticsMeasurementId("")).toBe(false);
    expect(hasRealGoogleAnalyticsMeasurementId("UA-12345")).toBe(false);
    expect(hasRealGoogleAnalyticsMeasurementId("G-")).toBe(false);
  });

  it("returns true for GA4 measurement ids", () => {
    expect(hasRealGoogleAnalyticsMeasurementId("G-9XHYRXZ4WK")).toBe(true);
  });
});

describe("isProductionAnalyticsHost", () => {
  it("accepts the primary production hostname", () => {
    expect(
      isProductionAnalyticsHost("danielmilewski.com", "https://danielmilewski.com"),
    ).toBe(true);
  });

  it("accepts the www production hostname", () => {
    expect(
      isProductionAnalyticsHost(
        "www.danielmilewski.com",
        "https://danielmilewski.com",
      ),
    ).toBe(true);
  });

  it("rejects localhost and preview hosts", () => {
    expect(
      isProductionAnalyticsHost("localhost", "https://danielmilewski.com"),
    ).toBe(false);
    expect(
      isProductionAnalyticsHost(
        "danielmilewskicom.your-account.workers.dev",
        "https://danielmilewski.com",
      ),
    ).toBe(false);
  });

  it("rejects invalid site urls defensively", () => {
    expect(isProductionAnalyticsHost("danielmilewski.com", "not-a-url")).toBe(
      false,
    );
  });
});

describe("sanitizeAnalyticsEvent", () => {
  it("keeps only the approved analytics fields", () => {
    expect(
      sanitizeAnalyticsEvent(
        {
          event: "cta_click",
          locale: "en",
          pathname: "/en/blog",
          ctaId: "hero_contact",
          surface: "hero",
          email: "jane@example.com",
        },
        "https://google.com/search?q=portfolio",
      ),
    ).toEqual(
      expect.objectContaining({
        event: "cta_click",
        locale: "en",
        pathname: "/en/blog",
        ctaId: "hero_contact",
        surface: "hero",
        referrerHost: "google.com",
      }),
    );
  });

  it("filters invalid contact fields and rejects unknown events", () => {
    expect(
      sanitizeAnalyticsEvent(
        {
          event: "contact_form_validation_error",
          invalidFields: ["message", "email", "unknown"],
        },
        null,
      ),
    ).toEqual(
      expect.objectContaining({
        event: "contact_form_validation_error",
        invalidFields: ["email", "message"],
      }),
    );

    expect(sanitizeAnalyticsEvent({ event: "pageview" }, null)).toBeNull();
  });
});

describe("shouldTrackConversionHost", () => {
  it("tracks only the production hostnames", () => {
    expect(shouldTrackConversionHost("danielmilewski.com")).toBe(true);
    expect(shouldTrackConversionHost("www.danielmilewski.com")).toBe(true);
    expect(shouldTrackConversionHost("localhost")).toBe(false);
  });
});
