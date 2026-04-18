import {
  API_CATALOG_CONTENT_TYPE,
  API_CATALOG_PROFILE_URI,
  buildApiCatalog,
} from "@/lib/apiCatalog";

export const dynamic = "force-static";

const API_CATALOG_LINK_HEADER =
  `</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"; profile="${API_CATALOG_PROFILE_URI}"`;

export async function GET() {
  return new Response(JSON.stringify(buildApiCatalog(), null, 2), {
    headers: {
      "Content-Type": API_CATALOG_CONTENT_TYPE,
      Link: API_CATALOG_LINK_HEADER,
    },
  });
}

export async function HEAD() {
  return new Response(null, {
    headers: {
      "Content-Type": API_CATALOG_CONTENT_TYPE,
      Link: API_CATALOG_LINK_HEADER,
    },
  });
}
