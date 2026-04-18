import { describe, expect, it } from "vitest";
import {
  WEBMCP_HOME_SECTIONS,
  getWebMcpHomeSectionHref,
  getWebMcpPageHref,
  replaceLocaleInPathname,
} from "@/lib/webmcp";
import { buildWebMcpPostOptions, buildWebMcpProjectOptions } from "@/lib/webmcpContent";

describe("webmcp helpers", () => {
  it("builds localized page and section hrefs", () => {
    expect(getWebMcpPageHref("en", "contact")).toBe("/en/contact");
    expect(getWebMcpPageHref("pl", "home")).toBe("/pl");
    expect(getWebMcpHomeSectionHref("en", "projects")).toBe("/en#projects");
  });

  it("replaces the active locale in localized pathnames", () => {
    expect(replaceLocaleInPathname("/en/projects/investtracker", "pl")).toBe(
      "/pl/projects/investtracker",
    );
    expect(replaceLocaleInPathname("/pl", "en")).toBe("/en");
    expect(replaceLocaleInPathname("/contact", "pl")).toBe("/pl/contact");
  });

  it("builds project and post tool options from site content", () => {
    const projectOptions = buildWebMcpProjectOptions("en");
    const postOptions = buildWebMcpPostOptions("en");

    expect(projectOptions.length).toBeGreaterThan(0);
    expect(postOptions.length).toBeGreaterThan(0);
    expect(projectOptions[0]).toEqual(
      expect.objectContaining({
        slug: expect.any(String),
        title: expect.any(String),
        href: expect.stringMatching(/^\/en\/projects\//),
      }),
    );
    expect(postOptions[0]).toEqual(
      expect.objectContaining({
        slug: expect.any(String),
        title: expect.any(String),
        href: expect.stringMatching(/^\/en\/blog\//),
      }),
    );
  });

  it("keeps the homepage section list stable", () => {
    expect(WEBMCP_HOME_SECTIONS).toEqual([
      "hero",
      "trust",
      "projects",
      "expertise",
      "about",
      "writing",
      "faq",
      "contact",
    ]);
  });
});
