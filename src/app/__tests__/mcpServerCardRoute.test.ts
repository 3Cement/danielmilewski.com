import { describe, expect, it } from "vitest";
import { GET } from "@/app/.well-known/mcp/server-card.json/route";

describe("GET /.well-known/mcp/server-card.json", () => {
  it("returns a server card with discovery headers", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.headers.get("Content-Type")).toContain("application/json");
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=3600");
    expect(body.transport.endpoint).toBe("/mcp");
    expect(body.capabilities.resources).toEqual({});
  });
});
