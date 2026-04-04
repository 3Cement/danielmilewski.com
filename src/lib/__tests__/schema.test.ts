import { describe, expect, it } from "vitest";
import { breadcrumbSchema } from "@/lib/schema";

describe("breadcrumbSchema", () => {
  it("builds ordered list items with positions", () => {
    expect(
      breadcrumbSchema([
        { name: "Home", item: "https://example.com/en" },
        { name: "Blog", item: "https://example.com/en/blog" },
      ]),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://example.com/en",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: "https://example.com/en/blog",
        },
      ],
    });
  });
});
