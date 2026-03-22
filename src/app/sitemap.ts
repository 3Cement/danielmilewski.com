import type { MetadataRoute } from "next";
import { getAllProjectSlugs, getAllPostSlugs } from "@/lib/content";
import { SITE_URL } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: SITE_URL, changeFrequency: "monthly" as const, priority: 1.0 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly" as const, priority: 0.6 },
  ];

  const projectRoutes = getAllProjectSlugs().map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogRoutes = getAllPostSlugs().map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
