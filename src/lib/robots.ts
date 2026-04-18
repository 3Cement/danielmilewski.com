import { SITE_URL } from "@/lib/metadata";

export const CONTENT_SIGNAL = "ai-train=no, search=yes, ai-input=yes";

export function buildRobotsTxt(): string {
  return [
    "# Content Signals preferences for automated processing.",
    "# search: search indexing and result snippets.",
    "# ai-input: real-time AI inputs such as RAG and grounding.",
    "# ai-train: AI model training and fine-tuning.",
    "User-Agent: *",
    `Content-Signal: ${CONTENT_SIGNAL}`,
    "Allow: /",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");
}
