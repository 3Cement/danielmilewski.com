"use client";

import { startTransition, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { AppLocale } from "@/lib/localeHref";
import {
  WEBMCP_HOME_SECTIONS,
  WEBMCP_PAGE_PATHS,
  getWebMcpHomeSectionHref,
  getWebMcpPageHref,
  replaceLocaleInPathname,
  type WebMcpRouteOption,
} from "@/lib/webmcp";

interface WebMcpToolDescriptor {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>, agent?: unknown) => unknown;
}

interface NavigatorWithModelContext extends Navigator {
  modelContext?: {
    provideContext: (context: { tools: WebMcpToolDescriptor[] }) => void;
  };
}

interface WebMcpProviderProps {
  locale: AppLocale;
  projectOptions: WebMcpRouteOption[];
  postOptions: WebMcpRouteOption[];
}

export function WebMcpProvider({
  locale,
  projectOptions,
  postOptions,
}: WebMcpProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const modelContext = (window.navigator as NavigatorWithModelContext).modelContext;
    if (!modelContext?.provideContext) {
      return;
    }

    const navigateTo = (href: string) => {
      startTransition(() => {
        router.push(href);
      });

      return href;
    };

    const tools: WebMcpToolDescriptor[] = [
      {
        name: "navigate-site-page",
        description:
          "Navigate to a high-level page on Daniel Milewski's portfolio site.",
        inputSchema: {
          type: "object",
          properties: {
            page: {
              type: "string",
              enum: Object.keys(WEBMCP_PAGE_PATHS),
              description:
                "The site page to open. Allowed values: home, about, projects, blog, contact, privacy.",
            },
          },
          required: ["page"],
        },
        execute: ({ page }) => {
          if (typeof page !== "string" || !(page in WEBMCP_PAGE_PATHS)) {
            throw new Error("Unsupported page.");
          }

          const href = getWebMcpPageHref(
            locale,
            page as keyof typeof WEBMCP_PAGE_PATHS,
          );
          navigateTo(href);

          return { ok: true, page, href, locale };
        },
      },
      {
        name: "open-project-case-study",
        description:
          "Open a specific project case study from Daniel Milewski's portfolio.",
        inputSchema: {
          type: "object",
          properties: {
            slug: {
              type: "string",
              enum: projectOptions.map((option) => option.slug),
              description: "The project slug to open.",
            },
          },
          required: ["slug"],
        },
        execute: ({ slug }) => {
          if (typeof slug !== "string") {
            throw new Error("Project slug must be a string.");
          }

          const target = projectOptions.find((option) => option.slug === slug);
          if (!target) {
            throw new Error("Unknown project slug.");
          }

          navigateTo(target.href);
          return { ok: true, slug: target.slug, title: target.title, href: target.href };
        },
      },
      {
        name: "open-blog-post",
        description:
          "Open a specific blog post written by Daniel Milewski.",
        inputSchema: {
          type: "object",
          properties: {
            slug: {
              type: "string",
              enum: postOptions.map((option) => option.slug),
              description: "The blog post slug to open.",
            },
          },
          required: ["slug"],
        },
        execute: ({ slug }) => {
          if (typeof slug !== "string") {
            throw new Error("Post slug must be a string.");
          }

          const target = postOptions.find((option) => option.slug === slug);
          if (!target) {
            throw new Error("Unknown blog post slug.");
          }

          navigateTo(target.href);
          return { ok: true, slug: target.slug, title: target.title, href: target.href };
        },
      },
      {
        name: "switch-site-language",
        description:
          "Switch the current page between English and Polish while keeping the current route.",
        inputSchema: {
          type: "object",
          properties: {
            locale: {
              type: "string",
              enum: ["en", "pl"],
              description: "The language to switch the current page to.",
            },
          },
          required: ["locale"],
        },
        execute: ({ locale: nextLocale }) => {
          if (nextLocale !== "en" && nextLocale !== "pl") {
            throw new Error("Unsupported locale.");
          }

          const href = `${replaceLocaleInPathname(pathname, nextLocale)}${window.location.search}${window.location.hash}`;
          navigateTo(href);

          return { ok: true, href, locale: nextLocale };
        },
      },
      {
        name: "scroll-home-section",
        description:
          "Jump to a named homepage section such as projects, writing, FAQ, or contact.",
        inputSchema: {
          type: "object",
          properties: {
            section: {
              type: "string",
              enum: [...WEBMCP_HOME_SECTIONS],
              description:
                "Homepage section to reveal. Allowed values: hero, trust, projects, expertise, about, writing, faq, contact.",
            },
          },
          required: ["section"],
        },
        execute: ({ section }) => {
          if (
            typeof section !== "string" ||
            !WEBMCP_HOME_SECTIONS.includes(section as (typeof WEBMCP_HOME_SECTIONS)[number])
          ) {
            throw new Error("Unsupported homepage section.");
          }

          const href = getWebMcpHomeSectionHref(
            locale,
            section as (typeof WEBMCP_HOME_SECTIONS)[number],
          );
          const isHomePath = pathname === `/${locale}`;

          if (isHomePath) {
            const element = document.getElementById(section);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
              window.history.replaceState(null, "", href);

              return { ok: true, href, section, scrolled: true };
            }
          }

          navigateTo(href);
          return { ok: true, href, section, scrolled: false };
        },
      },
    ];

    modelContext.provideContext({ tools });
  }, [locale, pathname, postOptions, projectOptions, router]);

  return null;
}
