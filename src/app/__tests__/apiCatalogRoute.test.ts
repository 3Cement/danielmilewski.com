import { describe, expect, it } from "vitest";
import { GET, HEAD } from "@/app/.well-known/api-catalog/route";

describe("GET /.well-known/api-catalog", () => {
  it("returns an api-catalog linkset document", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.headers.get("Content-Type")).toContain("application/linkset+json");
    expect(response.headers.get("Content-Type")).toContain(
      'profile="https://www.rfc-editor.org/info/rfc9727"',
    );
    expect(body.linkset[0]?.anchor).toBe("https://danielmilewski.com/api/analytics");
    expect(body.linkset[0]?.["service-desc"][0]?.href).toBe(
      "https://danielmilewski.com/api/analytics/openapi.json",
    );
    expect(body.linkset[0]?.["service-doc"][0]?.href).toBe(
      "https://danielmilewski.com/docs/api/analytics",
    );
    expect(body.linkset[0]?.status[0]?.href).toBe(
      "https://danielmilewski.com/api/analytics/status",
    );
  });
});

describe("HEAD /.well-known/api-catalog", () => {
  it("advertises the api-catalog relation in the Link header", async () => {
    const response = await HEAD();

    expect(response.headers.get("Link")).toContain('rel="api-catalog"');
    expect(response.headers.get("Link")).toContain("</.well-known/api-catalog>");
  });
});
