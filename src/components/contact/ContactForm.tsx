"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { submitContactForm } from "@/app/actions/contact";

type FormStatus = "idle" | "success" | "error" | "validation";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement)
      .value;

    // Silently succeed if honeypot field is filled (bot submission)
    if (honeypot) {
      setStatus("success");
      return;
    }

    const name = (
      form.elements.namedItem("name") as HTMLInputElement
    ).value.trim();
    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    const message = (
      form.elements.namedItem("message") as HTMLTextAreaElement
    ).value.trim();

    startTransition(async () => {
      const result = await submitContactForm({ name, email, message });
      setStatus(
        result.success
          ? "success"
          : result.error === "validation"
            ? "validation"
            : "error",
      );
    });
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/20">
        <p className="text-sm text-green-800 dark:text-green-400">
          {t("success")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Honeypot — hidden from real users, filled by bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
        autoComplete="off"
      />

      <div>
        <label
          htmlFor="contact-name"
          className="mb-1.5 block text-sm font-medium text-[var(--color-text-base)]"
        >
          {t("nameLabel")}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          placeholder={t("namePlaceholder")}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-base)] placeholder:text-[var(--color-text-faint)] transition-colors focus:border-[var(--color-accent)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="mb-1.5 block text-sm font-medium text-[var(--color-text-base)]"
        >
          {t("emailLabel")}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder={t("emailPlaceholder")}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-base)] placeholder:text-[var(--color-text-faint)] transition-colors focus:border-[var(--color-accent)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-sm font-medium text-[var(--color-text-base)]"
        >
          {t("messageLabel")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder={t("messagePlaceholder")}
          className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-base)] placeholder:text-[var(--color-text-faint)] transition-colors focus:border-[var(--color-accent)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
        />
      </div>

      {(status === "error" || status === "validation") && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {t(status === "validation" ? "validationError" : "error")}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-muted)] disabled:opacity-60"
      >
        {isPending ? (
          <>
            <svg
              className="animate-spin"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            {t("sending")}
          </>
        ) : (
          t("submit")
        )}
      </button>
    </form>
  );
}
