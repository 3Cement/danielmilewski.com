import { describe, expect, it } from "vitest";
import {
  MCP_ENDPOINT_PATH,
  MCP_RESOURCES,
  buildMcpServerCard,
  getMcpResourceContents,
} from "@/lib/mcp";

describe("MCP helpers", () => {
  it("builds a server card with streamable-http transport", () => {
    const card = buildMcpServerCard();

    expect(card.transport.type).toBe("streamable-http");
    expect(card.transport.endpoint).toBe(MCP_ENDPOINT_PATH);
    expect(card.serverInfo.name).toBe("danielmilewski-site");
    expect(card.capabilities.resources).toEqual({});
    expect(card.resources).toEqual([...MCP_RESOURCES]);
  });

  it("returns contents for the published MCP resources", () => {
    const content = getMcpResourceContents("mcp://server-card.json");

    expect(content?.mimeType).toBe("application/json");
    expect(content?.text).toContain('"protocolVersion": "2025-06-18"');
  });
});
