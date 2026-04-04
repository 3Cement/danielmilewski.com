import type { MetadataRoute } from "next";
import { getAllProjectSlugs, getAllPostSlugs } from "@/lib/content";
import { absoluteUrl, type SiteLocale } from "@/lib/metadata";

const locales = ["en", "pl"] as const satisfies readonly SiteLocale[];

export default function sitemap(): MetadataRoute.Sitemap {
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
    getAllPostSlugs(locale).map((slug) => ({
      url: absoluteUrl(locale, `/blog/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
