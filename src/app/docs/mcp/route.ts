import { buildMcpDocumentationHtml } from "@/lib/mcp";

export const dynamic = "force-static";

export async function GET() {
  return new Response(buildMcpDocumentationHtml(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
