import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handler = createMiddleware(routing);

export function proxy(request: Request) {
  return handler(request as Parameters<typeof handler>[0]);
}

export const config = {
  matcher: [
    // Match all pathnames except static assets and Next.js internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(en|pl)(.*)",
  ],
};
