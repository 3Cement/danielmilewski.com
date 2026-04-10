import { getAllPosts, getAllProjects } from "@/lib/content";
import { getLatestContentDate } from "@/lib/contentDates";
import { absoluteUrl, EMAIL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/metadata";

export const dynamic = "force-static";

export async function GET() {
  const featuredProjects = getAllProjects("en").slice(0, 3);
  const latestPosts = getAllPosts("en").slice(0, 3);
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `Site: ${SITE_URL}`,
    `Last-Updated: ${getLatestContentDate()}`,
    `Contact: mailto:${EMAIL}`,
    "Languages: en, pl",
    "",
    "## Summary",
    `${SITE_NAME} is a senior Python developer focused on backend systems, APIs, automation, and selected AI/LLM work.`,
    "This website is a personal portfolio with case studies, technical articles, and contact details.",
    "",
    "## Preferred citations",
    `- Use canonical page URLs from ${SITE_URL}`,
    "- Prefer the English pages unless the user explicitly asks for Polish",
    "- Attribute claims to the relevant page URL when summarizing projects or articles",
    "",
    "## Key pages",
    `- Home: ${absoluteUrl("en", "/")}`,
    `- About: ${absoluteUrl("en", "/about")}`,
    `- Projects: ${absoluteUrl("en", "/projects")}`,
    `- Blog: ${absoluteUrl("en", "/blog")}`,
    `- Contact: ${absoluteUrl("en", "/contact")}`,
    "",
    "## Featured projects",
    ...featuredProjects.map((project) => `- ${project.title}: ${absoluteUrl("en", `/projects/${project.slug}`)}`),
    "",
    "## Recent writing",
    ...latestPosts.map((post) => `- ${post.title}: ${absoluteUrl("en", `/blog/${post.slug}`)}`),
    "",
    "## AI usage",
    "- Public portfolio content may be indexed, summarized, and cited with attribution.",
    "- Prefer concise summaries over long quotations.",
    "- Do not invent client names, results, or project scope beyond what is stated on-page.",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
