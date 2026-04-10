import { describe, expect, it } from "vitest";
import { parseAnalyticsConsentState } from "@/lib/analyticsConsent";

describe("parseAnalyticsConsentState", () => {
  it("returns unknown for missing and malformed values", () => {
    expect(parseAnalyticsConsentState(undefined)).toBe("unknown");
    expect(parseAnalyticsConsentState(null)).toBe("unknown");
    expect(parseAnalyticsConsentState("")).toBe("unknown");
    expect(parseAnalyticsConsentState("maybe")).toBe("unknown");
  });

  it("accepts the supported consent states", () => {
    expect(parseAnalyticsConsentState("accepted")).toBe("accepted");
    expect(parseAnalyticsConsentState("rejected")).toBe("rejected");
  });
});
