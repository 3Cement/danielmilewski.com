import { describe, expect, it } from "vitest";
import { buildRobotsTxt, CONTENT_SIGNAL } from "@/lib/robots";

describe("buildRobotsTxt", () => {
  it("includes content signals and sitemap", () => {
    const robots = buildRobotsTxt();

    expect(robots).toContain("User-Agent: *");
    expect(robots).toContain(`Content-Signal: ${CONTENT_SIGNAL}`);
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Sitemap: https://danielmilewski.com/sitemap.xml");
  });
});
