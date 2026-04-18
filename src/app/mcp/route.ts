import {
  MCP_PROTOCOL_VERSION,
  MCP_SERVER_INFO,
  MCP_RESOURCES,
  getMcpResourceContents,
  isAllowedMcpOrigin,
} from "@/lib/mcp";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id",
};

function jsonRpcResult(id: string | number | null, result: unknown) {
  return Response.json(
    {
      jsonrpc: "2.0",
      id,
      result,
    },
    {
      headers: CORS_HEADERS,
    },
  );
}

function jsonRpcError(
  id: string | number | null,
  code: number,
  message: string,
  status = 400,
  data?: unknown,
) {
  return Response.json(
    {
      jsonrpc: "2.0",
      id,
      error: {
        code,
        message,
        ...(data === undefined ? {} : { data }),
      },
    },
    {
      status,
      headers: CORS_HEADERS,
    },
  );
}

function isJsonRpcRequest(
  body: unknown,
): body is { jsonrpc: string; id: string | number | null; method: string; params?: unknown } {
  return (
    typeof body === "object" &&
    body !== null &&
    (body as { jsonrpc?: unknown }).jsonrpc === "2.0" &&
    "id" in body &&
    typeof (body as { method?: unknown }).method === "string"
  );
}

function isJsonRpcNotification(body: unknown): body is { jsonrpc: string; method: string } {
  return (
    typeof body === "object" &&
    body !== null &&
    (body as { jsonrpc?: unknown }).jsonrpc === "2.0" &&
    !("id" in body) &&
    typeof (body as { method?: unknown }).method === "string"
  );
}

export async function GET() {
  return new Response(null, {
    status: 405,
    headers: {
      ...CORS_HEADERS,
      Allow: "POST, OPTIONS",
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(request: Request) {
  if (!isAllowedMcpOrigin(request.headers.get("Origin"))) {
    return new Response("Forbidden", { status: 403, headers: CORS_HEADERS });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonRpcError(null, -32700, "Parse error");
  }

  if (isJsonRpcNotification(body)) {
    return new Response(null, {
      status: 202,
      headers: CORS_HEADERS,
    });
  }

  if (!isJsonRpcRequest(body)) {
    return jsonRpcError(null, -32600, "Invalid Request");
  }

  switch (body.method) {
    case "initialize":
      return jsonRpcResult(body.id, {
        protocolVersion: MCP_PROTOCOL_VERSION,
        capabilities: {
          resources: {},
        },
        serverInfo: MCP_SERVER_INFO,
        instructions:
          "Use resources/list to discover available site metadata documents, then resources/read to retrieve them.",
      });
    case "ping":
      return jsonRpcResult(body.id, {});
    case "resources/list":
      return jsonRpcResult(body.id, {
        resources: [...MCP_RESOURCES],
      });
    case "resources/read": {
      const uri =
        typeof body.params === "object" &&
        body.params !== null &&
        "uri" in body.params &&
        typeof (body.params as { uri?: unknown }).uri === "string"
          ? (body.params as { uri: string }).uri
          : null;

      if (uri == null) {
        return jsonRpcError(body.id, -32602, "Invalid params");
      }

      const contents = getMcpResourceContents(uri);
      if (contents == null) {
        return jsonRpcError(body.id, -32602, "Unknown resource URI");
      }

      return jsonRpcResult(body.id, {
        contents: [contents],
      });
    }
    case "resources/templates/list":
      return jsonRpcResult(body.id, {
        resourceTemplates: [],
      });
    default:
      return jsonRpcError(body.id, -32601, "Method not found");
  }
}
