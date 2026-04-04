import { cache } from "react";
import contentData from "@/generated/content-data.json";
import type { Project, ProjectMeta } from "@/types/project";
import type { Post, PostMeta } from "@/types/post";
import type { AppLocale } from "@/lib/localeHref";

const { projectMetasByLocale, projectByLocaleAndSlug, postMetasByLocale, postByLocaleAndSlug } = contentData as {
  projectMetasByLocale: Record<AppLocale, ProjectMeta[]>;
  projectByLocaleAndSlug: Record<AppLocale, Record<string, Project>>;
  postMetasByLocale: Record<AppLocale, PostMeta[]>;
  postByLocaleAndSlug: Record<AppLocale, Record<string, Post>>;
};

function normalizeLocale(locale: string): AppLocale {
  return locale === "pl" ? "pl" : "en";
}

const readAllProjectsFromCache = cache((locale: AppLocale): ProjectMeta[] => {
  return projectMetasByLocale[locale] ?? [];
});

export function getAllProjects(locale: string): ProjectMeta[] {
  return readAllProjectsFromCache(normalizeLocale(locale));
}

export function getFeaturedProjects(locale: string): ProjectMeta[] {
  return getAllProjects(locale).filter((p) => p.featured);
}

export const getProjectBySlug = cache((locale: string, slug: string): Project | null => {
  const p = projectByLocaleAndSlug[normalizeLocale(locale)]?.[slug];
  return p ?? null;
});

export function getAllProjectSlugs(locale: string): string[] {
  return getAllProjects(locale).map((p) => p.slug);
}

const readAllPostsFromCache = cache((locale: AppLocale): PostMeta[] => {
  return postMetasByLocale[locale] ?? [];
});

export function getAllPosts(locale: string): PostMeta[] {
  return readAllPostsFromCache(normalizeLocale(locale));
}

export function getLatestPosts(locale: string, count = 3): PostMeta[] {
  return getAllPosts(locale).slice(0, count);
}

export const getPostBySlug = cache((locale: string, slug: string): Post | null => {
  const p = postByLocaleAndSlug[normalizeLocale(locale)]?.[slug];
  return p ?? null;
});

export function getAllPostSlugs(locale: string): string[] {
  return getAllPosts(locale).map((p) => p.slug);
}

export function getAllTags(locale: string): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts(locale)) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}
