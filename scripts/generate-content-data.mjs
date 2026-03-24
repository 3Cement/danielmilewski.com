import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import readingTime from "reading-time";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const PROJECTS_DIR = path.join(root, "src/content/projects");
const BLOG_DIR = path.join(root, "src/content/blog");
const OUT_DIR = path.join(root, "src/generated");
const OUT_FILE = path.join(OUT_DIR, "content-data.json");

function readProjects() {
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".mdx"));
  const metas = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, filename), "utf8");
    const { data, content } = matter(raw);
    return { slug, ...data, content };
  });
  metas.sort((a, b) =>
    a.featured === b.featured ? 0 : a.featured ? -1 : 1,
  );
  const projectBySlug = Object.fromEntries(metas.map((p) => [p.slug, p]));
  const projectMetas = metas.map(({ content: _c, ...meta }) => meta);
  return { projectMetas, projectBySlug };
}

function readPosts() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  const full = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
    const { data, content } = matter(raw);
    const rt = readingTime(content);
    return {
      slug,
      ...data,
      content,
      readingTime: rt.text,
    };
  });
  full.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const postBySlug = Object.fromEntries(full.map((p) => [p.slug, p]));
  const postMetas = full.map(({ content: _c, ...meta }) => meta);
  return { postMetas, postBySlug };
}

const projects = readProjects();
const posts = readPosts();

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  OUT_FILE,
  JSON.stringify({ ...projects, ...posts }),
  "utf8",
);
console.log("Wrote", OUT_FILE);
