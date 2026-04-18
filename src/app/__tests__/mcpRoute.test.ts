import { describe, expect, it } from "vitest";
import { OPTIONS, POST } from "@/app/mcp/route";

describe("MCP route", () => {
  it("handles initialize requests", async () => {
    const response = await POST(
      new Request("http://localhost:3000/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: {
            protocolVersion: "2025-06-18",
            capabilities: {},
            clientInfo: {
              name: "test-client",
              version: "1.0.0",
            },
          },
        }),
      }),
    );

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.result.protocolVersion).toBe("2025-06-18");
    expect(body.result.serverInfo.name).toBe("danielmilewski-site");
  });

  it("lists static resources", async () => {
    const response = await POST(
      new Request("http://localhost:3000/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "resources/list",
        }),
      }),
    );

    const body = await response.json();
    expect(body.result.resources).toHaveLength(5);
    expect(body.result.resources[0].uri).toBe("mcp://server-card.json");
  });

  it("reads a static resource", async () => {
    const response = await POST(
      new Request("http://localhost:3000/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 3,
          method: "resources/read",
          params: {
            uri: "site://robots.txt",
          },
        }),
      }),
    );

    const body = await response.json();
    expect(body.result.contents[0].mimeType).toBe("text/plain");
    expect(body.result.contents[0].text).toContain("Content-Signal:");
  });

  it("returns CORS headers for preflight", async () => {
    const response = await OPTIONS();

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});
