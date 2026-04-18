import { getAllPosts, getAllProjects } from "@/lib/content";
import {
  getWebMcpPostHref,
  getWebMcpProjectHref,
  type WebMcpRouteOption,
} from "@/lib/webmcp";
import type { AppLocale } from "@/lib/localeHref";

export function buildWebMcpProjectOptions(locale: AppLocale): WebMcpRouteOption[] {
  return getAllProjects(locale).map((project) => ({
    slug: project.slug,
    title: project.title,
    href: getWebMcpProjectHref(locale, project.slug),
  }));
}

export function buildWebMcpPostOptions(locale: AppLocale): WebMcpRouteOption[] {
  return getAllPosts(locale).map((post) => ({
    slug: post.slug,
    title: post.title,
    href: getWebMcpPostHref(locale, post.slug),
  }));
}
