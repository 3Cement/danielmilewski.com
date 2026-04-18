import {
  OPENAPI_CONTENT_TYPE,
  buildAnalyticsOpenApiSpec,
} from "@/lib/apiCatalog";

export const dynamic = "force-static";

export async function GET() {
  return new Response(JSON.stringify(buildAnalyticsOpenApiSpec(), null, 2), {
    headers: {
      "Content-Type": OPENAPI_CONTENT_TYPE,
    },
  });
}
