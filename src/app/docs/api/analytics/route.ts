import { buildAnalyticsApiDocumentationHtml } from "@/lib/apiCatalog";

export const dynamic = "force-static";

export async function GET() {
  return new Response(buildAnalyticsApiDocumentationHtml(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
