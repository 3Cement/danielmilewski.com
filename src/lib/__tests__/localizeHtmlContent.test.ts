import { describe, expect, it } from "vitest";
import { localizeHtmlContent } from "@/lib/localizeHtmlContent";
import { localizeHref, shouldLocalizeHref } from "@/lib/localeHref";

describe("shouldLocalizeHref", () => {
  it("accepts internal application routes", () => {
    expect(shouldLocalizeHref("/")).toBe(true);
    expect(shouldLocalizeHref("/blog")).toBe(true);
    expect(shouldLocalizeHref("/contact?via=post")).toBe(true);
  });

  it("skips assets and non-localized site files", () => {
    expect(shouldLocalizeHref("/images/hero.webp")).toBe(false);
    expect(shouldLocalizeHref("/cv/cv-pl.pdf")).toBe(false);
    expect(shouldLocalizeHref("/feed.xml")).toBe(false);
    expect(shouldLocalizeHref("https://example.com")).toBe(false);
  });
});

describe("localizeHref", () => {
  it("prefixes internal routes with the active locale", () => {
    expect(localizeHref("pl", "/contact")).toBe("/pl/contact");
    expect(localizeHref("pl", "/blog?tag=python")).toBe("/pl/blog?tag=python");
  });

  it("leaves already-localized and static paths unchanged", () => {
    expect(localizeHref("pl", "/pl/blog")).toBe("/pl/blog");
    expect(localizeHref("pl", "/images/post.webp")).toBe("/images/post.webp");
  });
});

describe("localizeHtmlContent", () => {
  it("localizes internal anchor href values inside rendered html", () => {
    const html =
      '<p><a href="/contact">Contact</a> <a href="https://example.com">External</a></p>';

    expect(localizeHtmlContent("pl", html)).toBe(
      '<p><a href="/pl/contact">Contact</a> <a href="https://example.com">External</a></p>',
    );
  });

  it("keeps asset links unchanged", () => {
    const html = '<p><a href="/cv/cv-en.pdf">CV</a><img src="/images/test.webp" alt="test"/></p>';

    expect(localizeHtmlContent("pl", html)).toContain('href="/cv/cv-en.pdf"');
    expect(localizeHtmlContent("pl", html)).toContain('src="/images/test.webp"');
  });
});
