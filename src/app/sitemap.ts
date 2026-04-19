import type { MetadataRoute } from "next";
import { getAllProjectSlugs, getAllPosts } from "@/lib/content";
import { getLatestContentDate } from "@/lib/contentDates";
import { absoluteUrl, type SiteLocale } from "@/lib/metadata";

const locales = ["en", "pl"] as const satisfies readonly SiteLocale[];

export default function sitemap(): MetadataRoute.Sitemap {
  const latestContentDate = getLatestContentDate();
  const staticPaths = [
    { path: "/", changeFrequency: "monthly" as const, priority: 1.0 },
    { path: "/projects", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/blog", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/contact", changeFrequency: "yearly" as const, priority: 0.6 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const staticRoutes = locales.flatMap((locale) =>
    staticPaths.map(({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(locale, path),
      changeFrequency,
      priority,
      lastModified: latestContentDate,
    }))
  );

  const projectRoutes = locales.flatMap((locale) =>
    getAllProjectSlugs(locale).map((slug) => ({
      url: absoluteUrl(locale, `/projects/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))
  );

  const blogRoutes = locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({
      url: absoluteUrl(locale, `/blog/${post.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      lastModified: post.date,
    }))
  );

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
