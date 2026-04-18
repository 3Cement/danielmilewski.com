import { buildMcpServerCard } from "@/lib/mcp";

export const dynamic = "force-static";

export async function GET() {
  return new Response(JSON.stringify(buildMcpServerCard(), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
