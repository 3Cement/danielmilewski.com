import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function legacyMainRedirect(pathname: string): string | null {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === "/main") {
    return `/${routing.defaultLocale}`;
  }

  for (const locale of routing.locales) {
    if (normalizedPathname === `/${locale}/main`) {
      return `/${locale}`;
    }
  }

  return null;
}

export function proxy(request: NextRequest) {
  const redirectPath = legacyMainRedirect(request.nextUrl.pathname);

  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, request.url), 308);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    "/((?!_next|icon|apple-icon|opengraph-image|sitemap.xml|robots.txt|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)",
    "/(en|pl)(.*)",
  ],
};
