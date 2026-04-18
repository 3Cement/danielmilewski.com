import { describe, expect, it } from "vitest";
import { GET } from "@/app/robots.txt/route";

describe("GET /robots.txt", () => {
  it("returns robots.txt with Content Signals", async () => {
    const response = await GET();
    const body = await response.text();

    expect(response.headers.get("Content-Type")).toContain("text/plain");
    expect(body).toContain("User-Agent: *");
    expect(body).toContain("Content-Signal: ai-train=no, search=yes, ai-input=yes");
    expect(body).toContain("Sitemap: https://danielmilewski.com/sitemap.xml");
  });
});
