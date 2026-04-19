import { describe, expect, it, vi } from "vitest";
import { SITE_URL } from "@/lib/metadata";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async ({ namespace }: { namespace: string }) => {
    if (namespace === "metadata") {
      return (key: string) => {
        const copy = {
          blogTitle: "Writing",
          blogDescription: "Essays on backend, AI, and automation.",
        } as const;

        return copy[key as keyof typeof copy];
      };
    }

    return (key: string) => key;
  }),
}));

import { generateMetadata } from "@/app/[locale]/blog/page";

describe("blog page metadata", () => {
  it("keeps the main blog index crawlable without a tag filter", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
      searchParams: Promise.resolve({}),
    });

    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/en/blog`);
  });

  it("marks tag-filtered blog URLs as noindex while keeping the canonical blog URL", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
      searchParams: Promise.resolve({ tag: "Backend" }),
    });

    expect(metadata.robots).toEqual({
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    });
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/en/blog`);
    expect(metadata.openGraph?.url).toBe(`${SITE_URL}/en/blog`);
  });
});
