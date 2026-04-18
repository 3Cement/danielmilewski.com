import { ANALYTICS_API_URL } from "@/lib/apiCatalog";

export const dynamic = "force-static";

export async function GET() {
  return Response.json({
    status: "ok",
    service: "analytics-api",
    endpoint: ANALYTICS_API_URL,
  });
}
