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
  const metas = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = await fsPromises.readFile(path.join(PROJECTS_DIR, filename), "utf8");
      const { data, content } = matter(raw);
      const contentHtml = await renderMdxToHtml(content, path.join(PROJECTS_DIR, filename));
      return { slug, ...data, content, contentHtml };
    }),
  );
  metas.sort((a, b) =>
    a.featured === b.featured ? 0 : a.featured ? -1 : 1,
  );
  const projectBySlug = Object.fromEntries(metas.map((p) => [p.slug, p]));
  const projectMetas = metas.map(stripContent);
  return { projectMetas, projectBySlug };
}

async function readPosts() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  const full = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = await fsPromises.readFile(path.join(BLOG_DIR, filename), "utf8");
      const { data, content } = matter(raw);
      const rt = readingTime(content);
      const contentHtml = await renderMdxToHtml(content, path.join(BLOG_DIR, filename));
      return {
        slug,
        ...data,
        content,
        contentHtml,
        readingTime: String(Math.ceil(rt.minutes)),
      };
    }),
  );
  full.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const postBySlug = Object.fromEntries(full.map((p) => [p.slug, p]));
  const postMetas = full.map(stripContent);
  return { postMetas, postBySlug };
}

const [projects, posts] = await Promise.all([readProjects(), readPosts()]);

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  OUT_FILE,
  JSON.stringify({ ...projects, ...posts }),
  "utf8",
);
console.log("Wrote", OUT_FILE);
