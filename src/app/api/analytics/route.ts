import { headers } from "next/headers";
import { logger } from "@/lib/logger";
import {
  isProductionAnalyticsHost,
  sanitizeAnalyticsEvent,
} from "@/lib/analytics";
import { SITE_URL } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");

  if (!isProductionAnalyticsHost(host ?? undefined, SITE_URL)) {
    return new Response(null, { status: 204 });
  }

  let body: Record<string, unknown> | null = null;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(null, { status: 204 });
  }

  if (body == null) {
    return new Response(null, { status: 204 });
  }

  const payload = sanitizeAnalyticsEvent(
    body,
    requestHeaders.get("referer"),
  );

  if (payload) {
    logger.info("analytics_event", payload as unknown as Record<string, unknown>);
  }

  return new Response(null, { status: 204 });
}
