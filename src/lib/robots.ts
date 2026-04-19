import { SITE_URL } from "@/lib/metadata";

export const CONTENT_SIGNAL = "ai-train=no, search=yes, ai-input=yes";

export function buildRobotsTxt(): string {
  return [
    "# Content Signals preferences for automated processing.",
    "# Documented as comments to keep robots.txt standards-compliant.",
    "# search: search indexing and result snippets.",
    "# ai-input: real-time AI inputs such as RAG and grounding.",
    "# ai-train: AI model training and fine-tuning.",
    `# Content-Signal: ${CONTENT_SIGNAL}`,
    "User-Agent: *",
    "Allow: /",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");
}
