import { cache } from "react";
import contentData from "@/generated/content-data.json";
import type { Project, ProjectMeta } from "@/types/project";
import type { Post, PostMeta } from "@/types/post";

const { projectMetas, projectBySlug, postMetas, postBySlug } = contentData as {
  projectMetas: ProjectMeta[];
  projectBySlug: Record<string, Project>;
  postMetas: PostMeta[];
  postBySlug: Record<string, Post>;
};

const readAllProjectsFromCache = cache((): ProjectMeta[] => projectMetas);

export function getAllProjects(): ProjectMeta[] {
  return readAllProjectsFromCache();
}

export function getFeaturedProjects(): ProjectMeta[] {
  return getAllProjects().filter((p) => p.featured);
}

export const getProjectBySlug = cache((slug: string): Project | null => {
  const p = projectBySlug[slug];
  return p ?? null;
});

export function getAllProjectSlugs(): string[] {
  return projectMetas.map((p) => p.slug);
}

const readAllPostsFromCache = cache((): PostMeta[] => postMetas);

export function getAllPosts(): PostMeta[] {
  return readAllPostsFromCache();
}

export function getLatestPosts(count = 3): PostMeta[] {
  return getAllPosts().slice(0, count);
}

export const getPostBySlug = cache((slug: string): Post | null => {
  const p = postBySlug[slug];
  return p ?? null;
});

export function getAllPostSlugs(): string[] {
  return postMetas.map((p) => p.slug);
}
