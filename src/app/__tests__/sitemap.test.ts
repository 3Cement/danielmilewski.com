import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("includes lastModified for static and blog routes", () => {
    const entries = sitemap();
    const home = entries.find((entry) => entry.url === "https://danielmilewski.com/en");
    const blogPost = entries.find(
      (entry) =>
        entry.url === "https://danielmilewski.com/en/blog/llm-apps-in-production",
    );

    expect(home?.lastModified).toBe("2024-11-15");
    expect(blogPost?.lastModified).toBe("2024-11-15");
  });
});
