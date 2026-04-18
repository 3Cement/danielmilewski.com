import { describe, expect, it } from "vitest";
import {
  ANALYTICS_API_DOCS_URL,
  ANALYTICS_API_SPEC_URL,
  ANALYTICS_API_STATUS_URL,
  ANALYTICS_API_URL,
  buildApiCatalog,
  buildAnalyticsOpenApiSpec,
} from "@/lib/apiCatalog";

describe("api catalog helpers", () => {
  it("builds an RFC 9727 linkset entry for the analytics API", () => {
    const catalog = buildApiCatalog();
    const entry = catalog.linkset[0];

    expect(entry.anchor).toBe(ANALYTICS_API_URL);
    expect(entry["service-desc"][0]?.href).toBe(ANALYTICS_API_SPEC_URL);
    expect(entry["service-doc"][0]?.href).toBe(ANALYTICS_API_DOCS_URL);
    expect(entry.status[0]?.href).toBe(ANALYTICS_API_STATUS_URL);
  });

  it("builds an OpenAPI document for the analytics endpoint", () => {
    const spec = buildAnalyticsOpenApiSpec();

    expect(spec.openapi).toBe("3.1.0");
    expect(spec.paths["/api/analytics"]?.post).toBeDefined();
    expect(spec.paths["/api/analytics/status"]?.get).toBeDefined();
    expect(spec.paths["/api/analytics"]?.post?.security).toEqual([]);
    expect(spec.paths["/api/analytics/status"]?.get?.security).toEqual([]);
  });
});
