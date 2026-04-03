import { describe, expect, it } from "vitest";
import {
  hasRealAnalyticsToken,
  isProductionAnalyticsHost,
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
