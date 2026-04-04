import { describe, it, expect } from "vitest";
import { absoluteUrl, buildMetadata, profileImageAbsoluteUrl, SITE_URL, SITE_NAME } from "@/lib/metadata";

describe("absoluteUrl", () => {
  it("prepends /en for en locale root path", () => {
    expect(absoluteUrl("en", "/")).toBe(`${SITE_URL}/en`);
  });

  it("prepends /en for en locale paths", () => {
    expect(absoluteUrl("en", "/about")).toBe(`${SITE_URL}/en/about`);
  });

  it("prepends /pl for pl locale", () => {
    expect(absoluteUrl("pl", "/about")).toBe(`${SITE_URL}/pl/about`);
  });

  it("prepends /pl for pl locale with root path", () => {
    expect(absoluteUrl("pl", "/")).toBe(`${SITE_URL}/pl`);
  });
});

describe("profileImageAbsoluteUrl", () => {
  it("returns absolute URL without trailing slash before path", () => {
    const result = profileImageAbsoluteUrl();
    expect(result).toMatch(/^https?:\/\//);
    expect(result).toContain("daniel-milewski.webp");
    expect(result).not.toContain("//daniel-milewski");
  });
});

describe("buildMetadata", () => {
  it("sets title and description", () => {
    const meta = buildMetadata({
      title: "About",
      description: "About page",
      pathWithoutLocale: "/about",
      locale: "en",
    });
    expect(meta.title).toBe("About");
    expect(meta.description).toBe("About page");
  });

  it("includes SITE_NAME in openGraph title", () => {
    const meta = buildMetadata({
      title: "About",
      pathWithoutLocale: "/about",
      locale: "en",
    });
    expect((meta.openGraph?.title as string)).toContain(SITE_NAME);
    expect((meta.openGraph?.title as string)).toContain("About");
  });

  it("uses SITE_DESCRIPTION when no description provided", () => {
    const meta = buildMetadata({ pathWithoutLocale: "/about", locale: "en" });
    expect(meta.description).toBeTruthy();
  });

  it("sets canonical for en locale", () => {
    const meta = buildMetadata({ pathWithoutLocale: "/about", locale: "en" });
    expect((meta.alternates?.canonical as string)).toBe(`${SITE_URL}/en/about`);
  });

  it("sets canonical with /pl prefix for pl locale", () => {
    const meta = buildMetadata({ pathWithoutLocale: "/about", locale: "pl" });
    expect((meta.alternates?.canonical as string)).toBe(`${SITE_URL}/pl/about`);
  });

  it("sets alternateLocale correctly", () => {
    const metaEn = buildMetadata({ pathWithoutLocale: "/about", locale: "en" });
    expect(metaEn.openGraph?.alternateLocale).toBe("pl");

    const metaPl = buildMetadata({ pathWithoutLocale: "/about", locale: "pl" });
    expect(metaPl.openGraph?.alternateLocale).toBe("en");
  });

  it("uses canonicalPathWithoutLocale when provided", () => {
    const meta = buildMetadata({
      pathWithoutLocale: "/blog/my-post",
      canonicalPathWithoutLocale: "/blog",
      locale: "en",
    });
    expect((meta.alternates?.canonical as string)).toBe(`${SITE_URL}/en/blog`);
  });

  it("sets localized alternate language URLs", () => {
    const meta = buildMetadata({ pathWithoutLocale: "/about", locale: "en" });
    expect(meta.alternates?.languages).toEqual({
      en: `${SITE_URL}/en/about`,
      pl: `${SITE_URL}/pl/about`,
      "x-default": `${SITE_URL}/en/about`,
    });
  });

  it("sets robots to index and follow", () => {
    const meta = buildMetadata({ pathWithoutLocale: "/about", locale: "en" });
    expect(meta.robots).toEqual({ index: true, follow: true });
  });

  it("uses the provided custom image", () => {
    const meta = buildMetadata({
      pathWithoutLocale: "/blog/my-post",
      locale: "en",
      image: `${SITE_URL}/en/blog/my-post/opengraph-image`,
    });

    expect(meta.openGraph?.images).toEqual([
      {
        url: `${SITE_URL}/en/blog/my-post/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Python Developer`,
      },
    ]);
  });
});
