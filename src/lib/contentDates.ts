import { getAllPosts } from "@/lib/content";
import type { SiteLocale } from "@/lib/metadata";

export function getLatestContentDate(): string {
  const latestPostDate = getAllPosts("en")
    .map((post) => post.date)
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a))[0];

  return latestPostDate ?? "2024-01-01";
}

export function formatContentDate(date: string, locale: SiteLocale): string {
  return new Date(date).toLocaleDateString(locale === "pl" ? "pl-PL" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
