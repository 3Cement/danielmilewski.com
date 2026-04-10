import { describe, expect, it } from "vitest";
import { breadcrumbSchema, faqPageSchema, homePageSchema, serviceSchema } from "@/lib/schema";

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

describe("faqPageSchema", () => {
  it("maps question and answer items into FAQPage schema", () => {
    expect(
      faqPageSchema([
        { question: "What do you build?", answer: "Backend systems and APIs." },
      ]),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What do you build?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Backend systems and APIs.",
          },
        },
      ],
    });
  });
});

describe("homePageSchema", () => {
  it("describes the homepage as a localized WebPage", () => {
    expect(homePageSchema("pl")).toMatchObject({
      "@type": "WebPage",
      inLanguage: "pl",
      url: expect.stringContaining("/pl"),
      dateModified: "2024-11-15",
    });
  });
});

describe("serviceSchema", () => {
  it("describes the primary service offering", () => {
    expect(serviceSchema("en")).toMatchObject({
      "@type": "Service",
      provider: {
        "@type": "Person",
        name: "Daniel Milewski",
      },
      areaServed: "Europe",
    });
  });
});
