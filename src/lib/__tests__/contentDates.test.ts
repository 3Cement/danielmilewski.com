import { describe, expect, it } from "vitest";
import { formatContentDate, getLatestContentDate } from "@/lib/contentDates";

describe("getLatestContentDate", () => {
  it("returns the latest post date from content", () => {
    expect(getLatestContentDate()).toBe("2024-11-15");
  });
});

describe("formatContentDate", () => {
  it("formats dates for Polish locale", () => {
    expect(formatContentDate("2024-11-15", "pl")).toContain("2024");
  });

  it("formats dates for English locale", () => {
    expect(formatContentDate("2024-11-15", "en")).toContain("2024");
  });
});
