import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Senior Python Developer with a focus on AI, LLM applications, backend engineering, and automation. Based in Europe, working remotely.",
  path: "/about",
});

const techStack = {
  "Core languages": ["Python", "TypeScript"],
  "Backend": ["FastAPI", "SQLAlchemy", "Alembic", "Pydantic", "Celery", "ARQ"],
  "AI / ML": ["LangChain", "OpenAI API", "Anthropic API", "instructor", "Pinecone", "Chroma"],
  "Data": ["PostgreSQL", "Redis", "SQLite", "Pandas"],
  "Infrastructure": ["Docker", "GitHub Actions", "Vercel", "Linux"],
  "Frontend": ["Next.js", "React", "Tailwind CSS"],
};

const timeline = [
  {
    period: "2023 — Present",
    role: "Senior Python Developer",
    focus: "AI/LLM applications, backend systems, automation",
    note: "Working with various clients on production AI and backend projects.",
  },
  {
    period: "2020 — 2023",
    role: "Python Developer",
    focus: "Backend engineering, API development, data pipelines",
    note: "Built and maintained production Python services across multiple domains.",
  },
  {
    period: "2018 — 2020",
    role: "Software Developer",
    focus: "Full-stack development, automation scripting",
    note: "Started with Python automation and gradually moved into product engineering.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-base)] mb-1">
                  Daniel Milewski
                </h1>
                <p className="text-[var(--color-accent)] font-medium text-sm mb-4">
                  Senior Python Developer
                </p>
                <SocialLinks showEmail />
              </div>

              <div>
                <p className="text-xs font-semibold text-[var(--color-text-faint)] uppercase tracking-widest mb-3">
                  Availability
                </p>
                <div className="flex items-center gap-2">
                  <span className="block w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
                  <span className="text-sm text-[var(--color-text-muted)]">
                    Available for new projects
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[var(--color-text-faint)] uppercase tracking-widest mb-3">
                  Location
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">Europe · Remote-friendly</p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center w-full rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-accent-muted)] transition-colors"
              >
                Get in touch
              </Link>
            </div>
          </aside>

          {/* Main */}
          <div className="lg:col-span-2 space-y-12">
            {/* Bio */}
            <section>
              <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-base)] mb-5">
                Background
              </h2>
              <div className="space-y-4 text-[var(--color-text-muted)] leading-relaxed">
                <p>
                  I&apos;m a Python developer focused on building software that does something useful — not demos, not prototypes, but production systems that handle real workloads, real edge cases, and real users.
                </p>
                <p>
                  My work currently centers on AI and LLM applications, backend engineering, and automation. I&apos;ve built RAG pipelines, document intelligence systems, FastAPI services, and workflow automation that removed significant manual work from business operations.
                </p>
                <p>
                  I&apos;m comfortable owning a project end-to-end: from architecture decisions through implementation to deployment. When the product requires a frontend, I build it. I care about code quality, clear architecture, and making technical decisions that the next engineer can understand.
                </p>
                <p>
                  I work best with companies that have a clear problem, respect engineering, and want someone who communicates well with both technical and non-technical stakeholders. I&apos;m available for project-based and longer-term engagements.
                </p>
              </div>
            </section>

            {/* Timeline */}
            <section>
              <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-base)] mb-5">
                Experience
              </h2>
              <div className="space-y-6">
                {timeline.map((item) => (
                  <div
                    key={item.period}
                    className="relative pl-5 border-l border-[var(--color-border)]"
                  >
                    <p className="text-xs text-[var(--color-text-faint)] mb-1">{item.period}</p>
                    <p className="text-base font-semibold text-[var(--color-text-base)]">
                      {item.role}
                    </p>
                    <p className="text-sm text-[var(--color-accent)] mb-1">{item.focus}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{item.note}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tech */}
            <section>
              <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-base)] mb-5">
                Tools & technologies
              </h2>
              <div className="space-y-4">
                {Object.entries(techStack).map(([category, techs]) => (
                  <div key={category} className="flex flex-col sm:flex-row sm:items-start gap-2">
                    <p className="text-xs font-semibold text-[var(--color-text-faint)] uppercase tracking-wider sm:w-36 shrink-0 mt-0.5">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {techs.map((tech) => (
                        <Tag key={tech} label={tech} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* How I work */}
            <section>
              <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-base)] mb-5">
                How I work
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
                <p>
                  I start with the problem, not the stack. A good solution is one that fits the actual constraints — team size, operational maturity, timeline, budget — not the one that uses the most interesting technology.
                </p>
                <p>
                  I communicate clearly and early. If something is going to take longer than expected, you hear about it before it becomes a problem. If the requirements have a hidden complexity, I flag it in the planning phase.
                </p>
                <p>
                  I write code that other engineers can read. Good naming, clear structure, tests on the important paths. The kind of code that doesn&apos;t need a 30-minute explanation before you can contribute to it.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
