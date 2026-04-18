import { createHash } from "node:crypto";
import {
  MCP_ENDPOINT_PATH,
  MCP_SERVER_CARD_PATH,
  MCP_SERVER_CARD_URL,
} from "./mcp";
import { SITE_URL } from "./metadata";

const AGENT_SKILLS_SCHEMA_URL =
  "https://schemas.agentskills.io/discovery/0.2.0/schema.json";
const AGENT_SKILLS_BASE_PATH = "/.well-known/agent-skills";

interface SkillDocument {
  slug: string;
  description: string;
  content: string;
}

function createSkillContent({
  name,
  description,
  body,
}: {
  name: string;
  description: string;
  body: string;
}) {
  return `---
name: ${name}
description: ${description}
---

${body}
`;
}

export const AGENT_SKILL_DOCUMENTS = [
  {
    slug: "site-discovery",
    description:
      "Discover the site's machine-readable resources, preferred citation sources, API catalog, and public metadata before answering questions about Daniel Milewski's portfolio site.",
    content: createSkillContent({
      name: "site-discovery",
      description:
        "Use when an agent needs authoritative, machine-readable discovery paths for danielmilewski.com, including llms.txt, service-doc.json, api-catalog, robots.txt, and the public analytics API documentation.",
      body: `# Site Discovery

Use this skill when you need reliable machine-readable entry points for \`${SITE_URL}\`.

## Workflow

1. Start with \`${SITE_URL}/llms.txt\` for the site's self-description, preferred citation guidance, and key page URLs.
2. Use \`${SITE_URL}/.well-known/service-doc.json\` for the site's discovery summary. It links to the API catalog, sitemap, robots policy, feed, and localized homepages.
3. Use \`${SITE_URL}/.well-known/api-catalog\` for the public API surface. The current catalog lists the analytics API and links to:
   - the OpenAPI description at \`${SITE_URL}/api/analytics/openapi.json\`
   - the human docs at \`${SITE_URL}/docs/api/analytics\`
   - the health/status endpoint at \`${SITE_URL}/api/analytics/status\`
4. Use \`${SITE_URL}/robots.txt\` to inspect crawl and Content-Signal preferences before large-scale ingestion.
5. Prefer English canonical pages unless the task explicitly asks for Polish content.

## Notes

- The site is a portfolio and publishing surface, not a general-purpose API platform.
- The public analytics API is intentionally narrow and is not OAuth protected.
- Quote or cite canonical URLs from the site whenever possible.`,
    }),
  },
  {
    slug: "mcp-discovery",
    description:
      "Connect to the site's MCP server over Streamable HTTP and use resources/list and resources/read to fetch discovery metadata programmatically.",
    content: createSkillContent({
      name: "mcp-discovery",
      description:
        "Use when an MCP-capable agent wants to programmatically discover danielmilewski.com's machine-readable metadata via the site's Streamable HTTP MCP server.",
      body: `# MCP Discovery

Use this skill when you can speak MCP and want to inspect \`${SITE_URL}\` programmatically.

## Endpoint

- Server card: \`${MCP_SERVER_CARD_URL}\`
- Streamable HTTP endpoint: \`${SITE_URL}${MCP_ENDPOINT_PATH}\`
- Protocol version: \`2025-06-18\`

## Supported Methods

- \`initialize\`
- \`ping\`
- \`resources/list\`
- \`resources/read\`
- \`resources/templates/list\` (currently empty)

## Recommended Flow

1. Fetch the server card from \`${MCP_SERVER_CARD_PATH}\` to confirm transport and capabilities.
2. Send \`initialize\` to \`${MCP_ENDPOINT_PATH}\`.
3. Call \`resources/list\` to discover the published static resources.
4. Call \`resources/read\` for any of these URIs:
   - \`mcp://server-card.json\`
   - \`site://llms.txt\`
   - \`site://service-doc.json\`
   - \`site://api-catalog\`
   - \`site://robots.txt\`

## Notes

- The server currently exposes resources only. It does not publish MCP tools or prompts.
- Authentication is not required.
- The MCP resource set mirrors the site's main machine-readable discovery documents, so it is a good fallback if you already have an MCP client session open.`,
    }),
  },
] as const satisfies readonly SkillDocument[];

function sha256Digest(content: string) {
  return `sha256:${createHash("sha256").update(content, "utf8").digest("hex")}`;
}

export function getAgentSkill(slug: string) {
  return AGENT_SKILL_DOCUMENTS.find((skill) => skill.slug === slug) ?? null;
}

export function buildAgentSkillsIndex() {
  return {
    $schema: AGENT_SKILLS_SCHEMA_URL,
    skills: AGENT_SKILL_DOCUMENTS.map((skill) => ({
      name: skill.slug,
      type: "skill-md",
      description: skill.description,
      url: `${AGENT_SKILLS_BASE_PATH}/skills/${skill.slug}/SKILL.md`,
      digest: sha256Digest(skill.content),
    })),
  };
}
