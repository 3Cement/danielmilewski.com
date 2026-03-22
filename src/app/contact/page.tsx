import type { Metadata } from "next";
import Link from "next/link";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { buildMetadata } from "@/lib/metadata";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Daniel Milewski. Available for senior Python development, AI/LLM applications, backend systems, and automation projects.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-base)] mb-4">
            Get in touch
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-10">
            I&apos;m available for project-based and longer-term engagements. If you have a Python, AI, or automation project in mind — or just want to explore whether there&apos;s a fit — the best way is a short email.
          </p>

          {/* Primary CTA */}
          <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] mb-8">
            <p className="text-sm font-semibold text-[var(--color-text-base)] mb-2">
              Send me an email
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Tell me briefly what you&apos;re working on and what kind of help you&apos;re looking for. I reply within 1–2 business days.
            </p>
            <Link
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 text-[var(--color-accent)] font-medium hover:underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              {EMAIL}
            </Link>
          </div>

          {/* Secondary channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <Link
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-muted)] transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--color-accent)]" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-base)]">LinkedIn</p>
                <p className="text-xs text-[var(--color-text-faint)]">Connect or message</p>
              </div>
            </Link>

            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-muted)] transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--color-accent)]" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-base)]">GitHub</p>
                <p className="text-xs text-[var(--color-text-faint)]">See public work</p>
              </div>
            </Link>
          </div>

          {/* What I'm looking for */}
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text-base)] mb-4">
              What I&apos;m looking for
            </h2>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              {[
                "Python-first projects (backend, AI/LLM, automation)",
                "Teams that value engineering quality and clear communication",
                "Project-based or longer-term engagements (open to both)",
                "Remote or hybrid, Europe timezone preferred",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 pt-8 border-t border-[var(--color-border)]">
            <SocialLinks showEmail />
          </div>
        </div>
      </div>
    </div>
  );
}
