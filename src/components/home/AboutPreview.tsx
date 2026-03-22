import Link from "next/link";

export function AboutPreview() {
  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-base)] mb-6">
            About me
          </h2>
          <div className="space-y-4 text-[var(--color-text-muted)] leading-relaxed">
            <p>
              I&apos;m a Python developer focused on building useful software, not demo-only experiments. My work sits at the intersection of backend engineering, AI applications, and product delivery.
            </p>
            <p>
              I&apos;m comfortable owning the core system end-to-end and shipping the frontend when needed. I care about code that can be maintained, systems that behave predictably, and software that solves actual problems for real users.
            </p>
            <p>
              I work with companies that need someone who can think about architecture, ship quickly, and communicate clearly with non-technical stakeholders.
            </p>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 mt-8 text-sm font-medium text-[var(--color-accent)] hover:gap-2.5 transition-all"
          >
            More about me
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
