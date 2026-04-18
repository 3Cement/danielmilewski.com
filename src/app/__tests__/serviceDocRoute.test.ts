import { describe, expect, it } from "vitest";
import { GET } from "@/app/.well-known/service-doc.json/route";

describe("GET /.well-known/service-doc.json", () => {
  it("returns machine-readable discovery resources for agents", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.headers.get("Content-Type")).toContain("application/json");
    expect(body.service.name).toBe("Daniel Milewski");
    expect(body.discovery.apiCatalog).toBe("https://danielmilewski.com/.well-known/api-catalog");
    expect(body.discovery.llms).toBe("https://danielmilewski.com/llms.txt");
    expect(body.discovery.sitemap).toBe("https://danielmilewski.com/sitemap.xml");
    expect(body.discovery.homepages.en).toBe("https://danielmilewski.com/en");
    expect(body.discovery.homepages.pl).toBe("https://danielmilewski.com/pl");
  });
});
