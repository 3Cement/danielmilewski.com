import { buildAgentServiceDocument } from "./agentDiscovery";
import { buildApiCatalog, API_CATALOG_CONTENT_TYPE } from "./apiCatalog";
import { buildRobotsTxt } from "./robots";
import { SITE_NAME, SITE_URL } from "./metadata";

export const MCP_PROTOCOL_VERSION = "2025-06-18";
export const MCP_ENDPOINT_PATH = "/mcp";
export const MCP_SERVER_CARD_SCHEMA =
  "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json";
export const MCP_SERVER_CARD_PATH = "/.well-known/mcp/server-card.json";
export const MCP_SERVER_CARD_URL = `${SITE_URL}${MCP_SERVER_CARD_PATH}`;
export const MCP_DOCS_URL = `${SITE_URL}/docs/mcp`;

export const MCP_SERVER_INFO = {
  name: "danielmilewski-site",
  title: "Daniel Milewski Site Discovery MCP",
  version: "1.0.0",
} as const;

export const MCP_RESOURCES = [
  {
    uri: "mcp://server-card.json",
    name: "server-card",
    title: "MCP Server Card",
    description: "Discovery metadata for this MCP server.",
    mimeType: "application/json",
  },
  {
    uri: "site://llms.txt",
    name: "llms",
    title: "llms.txt",
    description: "LLM-facing site summary and usage guidance.",
    mimeType: "text/plain",
  },
  {
    uri: "site://service-doc.json",
    name: "service-doc",
    title: "Service Discovery Document",
    description: "Machine-readable discovery summary for the site.",
    mimeType: "application/json",
  },
  {
    uri: "site://api-catalog",
    name: "api-catalog",
    title: "API Catalog",
    description: "RFC 9727 API catalog for the public site API surface.",
    mimeType: API_CATALOG_CONTENT_TYPE,
  },
  {
    uri: "site://robots.txt",
    name: "robots",
    title: "robots.txt",
    description: "Robots and Content Signals policy for the site.",
    mimeType: "text/plain",
  },
] as const;

export function buildMcpServerCard() {
  return {
    $schema: MCP_SERVER_CARD_SCHEMA,
    version: "1.0",
    protocolVersion: MCP_PROTOCOL_VERSION,
    serverInfo: MCP_SERVER_INFO,
    description:
      "Minimal MCP server for discovering machine-readable site metadata and public API discovery documents.",
    documentationUrl: MCP_DOCS_URL,
    transport: {
      type: "streamable-http",
      endpoint: MCP_ENDPOINT_PATH,
    },
    capabilities: {
      resources: {},
    },
    authentication: {
      required: false,
      schemes: [],
    },
    instructions:
      "Use resources/list to discover the published site metadata documents, then resources/read to retrieve their current contents.",
    resources: [...MCP_RESOURCES],
    tools: [],
    prompts: [],
  };
}

export function buildMcpDocumentationHtml() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${SITE_NAME} MCP Server</title>
  </head>
  <body>
    <main>
      <h1>${SITE_NAME} MCP Server</h1>
      <p>This site publishes a minimal MCP server over Streamable HTTP at <code>${SITE_URL}${MCP_ENDPOINT_PATH}</code>.</p>
      <h2>Capabilities</h2>
      <ul>
        <li><code>initialize</code></li>
        <li><code>ping</code></li>
        <li><code>resources/list</code></li>
        <li><code>resources/read</code></li>
      </ul>
      <p>The server does not currently expose any MCP tools or prompts and does not require authentication.</p>
      <h2>Discovery</h2>
      <ul>
        <li><a href="${MCP_SERVER_CARD_URL}">MCP Server Card</a></li>
        <li><a href="${SITE_URL}${MCP_ENDPOINT_PATH}">MCP endpoint</a></li>
      </ul>
    </main>
  </body>
</html>`;
}

function stringifyJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function getMcpResourceContents(uri: string) {
  switch (uri) {
    case "mcp://server-card.json":
      return {
        uri,
        mimeType: "application/json",
        text: stringifyJson(buildMcpServerCard()),
      };
    case "site://llms.txt":
      return {
        uri,
        mimeType: "text/plain",
        text: `See ${SITE_URL}/llms.txt`,
      };
    case "site://service-doc.json":
      return {
        uri,
        mimeType: "application/json",
        text: stringifyJson(buildAgentServiceDocument()),
      };
    case "site://api-catalog":
      return {
        uri,
        mimeType: API_CATALOG_CONTENT_TYPE,
        text: stringifyJson(buildApiCatalog()),
      };
    case "site://robots.txt":
      return {
        uri,
        mimeType: "text/plain",
        text: buildRobotsTxt(),
      };
    default:
      return null;
  }
}

export function isAllowedMcpOrigin(origin: string | null): boolean {
  if (origin == null || origin === "") {
    return true;
  }

  try {
    const url = new URL(origin);
    const allowedHosts = new Set([
      new URL(SITE_URL).host,
      "localhost:3000",
      "127.0.0.1:3000",
      "localhost:3050",
      "127.0.0.1:3050",
    ]);
    return allowedHosts.has(url.host);
  } catch {
    return false;
  }
}
