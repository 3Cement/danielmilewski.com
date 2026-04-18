import { analyticsEventNames } from "./analytics";
import { SITE_NAME, SITE_URL } from "./metadata";

export const API_CATALOG_PROFILE_URI = "https://www.rfc-editor.org/info/rfc9727";
export const API_CATALOG_CONTENT_TYPE =
  `application/linkset+json; profile="${API_CATALOG_PROFILE_URI}"`;
export const OPENAPI_CONTENT_TYPE = "application/vnd.oai.openapi+json;version=3.1";

export const ANALYTICS_API_URL = `${SITE_URL}/api/analytics`;
export const ANALYTICS_API_STATUS_URL = `${SITE_URL}/api/analytics/status`;
export const ANALYTICS_API_SPEC_URL = `${SITE_URL}/api/analytics/openapi.json`;
export const ANALYTICS_API_DOCS_URL = `${SITE_URL}/docs/api/analytics`;

export function buildApiCatalog() {
  return {
    linkset: [
      {
        anchor: ANALYTICS_API_URL,
        "service-desc": [
          {
            href: ANALYTICS_API_SPEC_URL,
            type: OPENAPI_CONTENT_TYPE,
          },
        ],
        "service-doc": [
          {
            href: ANALYTICS_API_DOCS_URL,
            type: "text/html",
          },
        ],
        status: [
          {
            href: ANALYTICS_API_STATUS_URL,
            type: "application/json",
          },
        ],
      },
    ],
  };
}

export function buildAnalyticsOpenApiSpec() {
  return {
    openapi: "3.1.0",
    info: {
      title: `${SITE_NAME} Analytics API`,
      version: "1.0.0",
      description:
        "Privacy-limited event ingestion endpoint used by the website to record selected analytics events from approved production hosts.",
    },
    servers: [{ url: SITE_URL }],
    paths: {
      "/api/analytics": {
        post: {
          summary: "Record a website analytics event",
          operationId: "recordAnalyticsEvent",
          description:
            "Accepts a sanitized analytics payload and returns 204 whether the event is recorded or ignored. This endpoint does not use OAuth 2.0 or OpenID Connect.",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    event: {
                      type: "string",
                      enum: [...analyticsEventNames],
                    },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                    },
                    locale: {
                      type: "string",
                      enum: ["en", "pl"],
                    },
                    pathname: {
                      type: "string",
                    },
                    ctaId: {
                      type: "string",
                    },
                    surface: {
                      type: "string",
                    },
                    invalidFields: {
                      type: "array",
                      items: {
                        type: "string",
                        enum: ["name", "email", "company", "subject", "message"],
                      },
                    },
                  },
                  required: ["event"],
                },
              },
            },
          },
          responses: {
            "204": {
              description: "Event accepted or intentionally ignored.",
            },
          },
        },
      },
      "/api/analytics/status": {
        get: {
          summary: "Get analytics API health status",
          operationId: "getAnalyticsApiStatus",
          description:
            "Returns a simple health response for the public analytics endpoint. This endpoint does not use OAuth 2.0 or OpenID Connect.",
          security: [],
          responses: {
            "200": {
              description: "Analytics API status information.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        enum: ["ok"],
                      },
                      service: {
                        type: "string",
                      },
                      endpoint: {
                        type: "string",
                        format: "uri",
                      },
                    },
                    required: ["status", "service", "endpoint"],
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

export function buildAnalyticsApiDocumentationHtml() {
  const examplePayload = JSON.stringify(
    {
      event: "cta_click",
      timestamp: "2026-04-18T17:00:00.000Z",
      locale: "en",
      pathname: "/en",
      ctaId: "hero-contact",
      surface: "hero",
    },
    null,
    2,
  );

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${SITE_NAME} Analytics API</title>
  </head>
  <body>
    <main>
      <h1>${SITE_NAME} Analytics API</h1>
      <p>This endpoint accepts a small set of privacy-limited website event payloads.</p>
      <h2>Endpoint</h2>
      <p><code>POST ${ANALYTICS_API_URL}</code></p>
      <h2>Behavior</h2>
      <ul>
        <li>Requests are accepted only from approved production hosts.</li>
        <li>The endpoint returns <code>204 No Content</code> whether an event is recorded or ignored.</li>
        <li>Payloads are sanitized server-side before logging.</li>
        <li>No OAuth 2.0 or OpenID Connect flow is used for this endpoint.</li>
      </ul>
      <h2>Authentication</h2>
      <p>This site does not currently expose any OAuth- or OIDC-protected APIs, so it does not publish <code>/.well-known/openid-configuration</code> or <code>/.well-known/oauth-authorization-server</code>.</p>
      <h2>Example payload</h2>
      <pre><code>${examplePayload}</code></pre>
      <h2>Related resources</h2>
      <ul>
        <li><a href="${ANALYTICS_API_SPEC_URL}">OpenAPI description</a></li>
        <li><a href="${ANALYTICS_API_STATUS_URL}">Status endpoint</a></li>
      </ul>
    </main>
  </body>
</html>`;
}
