import { describe, expect, it } from "vitest";
import { hasRealAnalyticsToken } from "@/lib/analytics";

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
