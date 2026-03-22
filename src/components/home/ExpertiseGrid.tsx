const expertise = [
  {
    icon: "🐍",
    title: "Python Backend Engineering",
    description:
      "Production-grade Python services built to last: FastAPI, SQLAlchemy, async patterns, clean architecture, tests, CI/CD. Opinionated about maintainability.",
  },
  {
    icon: "🤖",
    title: "AI / LLM Applications",
    description:
      "RAG pipelines, LLM agents, document intelligence, structured extraction. Built with reliability in mind — not just demos. Knows where models fail and plans for it.",
  },
  {
    icon: "⚙️",
    title: "Automation & Integrations",
    description:
      "Python workflows that replace manual, error-prone processes. Celery, scheduled jobs, API integrations, data pipelines. Built to run unattended with clear observability.",
  },
  {
    icon: "🔌",
    title: "APIs, Data Flows & System Design",
    description:
      "REST API design, async data pipelines, PostgreSQL, Redis, multi-tenant systems. Comfortable reasoning about scalability and making architectural tradeoffs explicit.",
  },
  {
    icon: "🖥️",
    title: "Frontend Delivery",
    description:
      "When the product requires it: Next.js, React, TypeScript, Tailwind. Not a designer, but builds interfaces that work well and don't embarrass the backend.",
  },
];

export function ExpertiseGrid() {
  return (
    <section className="py-24 px-4 bg-[var(--color-surface-muted)]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-base)]">
            What I work on
          </h2>
          <p className="mt-2 text-[var(--color-text-muted)] max-w-xl">
            The areas where I can take ownership from first line to production.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {expertise.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <span className="text-2xl mb-4 block" aria-hidden="true">
                {item.icon}
              </span>
              <h3 className="text-base font-semibold text-[var(--color-text-base)] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
