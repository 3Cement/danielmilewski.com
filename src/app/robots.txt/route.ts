import { buildRobotsTxt } from "@/lib/robots";

export const dynamic = "force-static";

export async function GET() {
  return new Response(buildRobotsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
