import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { evaluate } from "@mdx-js/mdx";
import matter from "gray-matter";
import { createElement, isValidElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as runtime from "react/jsx-runtime";
import readingTime from "reading-time";

const LOCALES = ["en", "pl"];
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const PROJECTS_DIR = path.join(root, "src/content/projects");
const BLOG_DIR = path.join(root, "src/content/blog");
const OUT_DIR = path.join(root, "src/generated");
const OUT_FILE = path.join(OUT_DIR, "content-data.json");

function stripContent(entry) {
  const { content, ...meta } = entry;
  void content;
  return meta;
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const normalized = value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return normalized.length > 0 ? normalized : undefined;
}

function normalizeFeaturedRank(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function emptyLocaleBuckets() {
  return Object.fromEntries(LOCALES.map((locale) => [locale, []]));
}

function emptyLocaleMaps() {
  return Object.fromEntries(LOCALES.map((locale) => [locale, {}]));
}

function parseLocalizedFilename(filename) {
  const localizedMatch = filename.match(/^(.*)\.(en|pl)\.mdx$/);
  if (localizedMatch) {
    return { slug: localizedMatch[1], locale: localizedMatch[2] };
  }

  const defaultMatch = filename.match(/^(.*)\.mdx$/);
  if (!defaultMatch) {
    return null;
  }

  return { slug: defaultMatch[1], locale: "en" };
}

function plainTextFromChildren(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainTextFromChildren).join("");
  if (isValidElement(node)) {
    const { children } = node.props ?? {};
    if (children != null) {
      return plainTextFromChildren(children);
    }
  }
  return "";
}

function slugifyHeading(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const mdxBuildComponents = {
  h2: ({ children, id, ...rest }) => {
    void id;
    return createElement("h2", { ...rest, id: slugifyHeading(plainTextFromChildren(children)) }, children);
  },
  h3: ({ children, id, ...rest }) => {
    void id;
    return createElement("h3", { ...rest, id: slugifyHeading(plainTextFromChildren(children)) }, children);
  },
};

async function renderMdxToHtml(content, pathLabel) {
  const { default: MDXContent } = await evaluate(
    { path: pathLabel, value: content },
    { ...runtime, baseUrl: import.meta.url },
  );

  return renderToStaticMarkup(MDXContent({ components: mdxBuildComponents }))
    .replace(/<link rel="preload" as="image" href="[^"]+"\/>/g, "");
}

async function readProjects() {
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".mdx"));
  const localizedEntries = await Promise.all(
    files.map(async (filename) => {
      const parsed = parseLocalizedFilename(filename);
      if (!parsed) {
        return null;
      }

      const { slug, locale } = parsed;
      const raw = await fsPromises.readFile(path.join(PROJECTS_DIR, filename), "utf8");
      const { data, content } = matter(raw);
      const contentHtml = await renderMdxToHtml(content, path.join(PROJECTS_DIR, filename));
      return {
        slug,
        locale,
        ...data,
        featuredRank: normalizeFeaturedRank(data.featuredRank),
        relatedPostSlugs: normalizeStringArray(data.relatedPostSlugs),
        relatedSlugs: normalizeStringArray(data.relatedSlugs),
        content,
        contentHtml,
      };
    }),
  );
  const projectMetasByLocale = emptyLocaleBuckets();
  const projectByLocaleAndSlug = emptyLocaleMaps();

  for (const entry of localizedEntries.filter(Boolean)) {
    projectMetasByLocale[entry.locale].push(stripContent(entry));
    projectByLocaleAndSlug[entry.locale][entry.slug] = entry;
  }

  for (const locale of LOCALES) {
    projectMetasByLocale[locale].sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }

      const aRank = typeof a.featuredRank === "number" ? a.featuredRank : Number.POSITIVE_INFINITY;
      const bRank = typeof b.featuredRank === "number" ? b.featuredRank : Number.POSITIVE_INFINITY;
      if (aRank !== bRank) {
        return aRank - bRank;
      }

      return a.slug.localeCompare(b.slug);
    });
  }

  return { projectMetasByLocale, projectByLocaleAndSlug };
}

async function readPosts() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  const localizedEntries = await Promise.all(
    files.map(async (filename) => {
      const parsed = parseLocalizedFilename(filename);
      if (!parsed) {
        return null;
      }

      const { slug, locale } = parsed;
      const raw = await fsPromises.readFile(path.join(BLOG_DIR, filename), "utf8");
      const { data, content } = matter(raw);
      const rt = readingTime(content);
      const contentHtml = await renderMdxToHtml(content, path.join(BLOG_DIR, filename));
      return {
        slug,
        locale,
        ...data,
        relatedProjectSlugs: normalizeStringArray(data.relatedProjectSlugs),
        content,
        contentHtml,
        readingTime: String(Math.ceil(rt.minutes)),
      };
    }),
  );
  const postMetasByLocale = emptyLocaleBuckets();
  const postByLocaleAndSlug = emptyLocaleMaps();

  for (const entry of localizedEntries.filter(Boolean)) {
    postMetasByLocale[entry.locale].push(stripContent(entry));
    postByLocaleAndSlug[entry.locale][entry.slug] = entry;
  }

  for (const locale of LOCALES) {
    postMetasByLocale[locale].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  return { postMetasByLocale, postByLocaleAndSlug };
}

const [projects, posts] = await Promise.all([readProjects(), readPosts()]);

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  OUT_FILE,
  JSON.stringify({ ...projects, ...posts }),
  "utf8",
);
console.log("Wrote", OUT_FILE);
