"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { sendContactMessage } from "@/app/actions/sendContactMessage";
import { initialContactFormState } from "@/components/contact/contactFormState";
import { HCaptchaWidget } from "@/components/contact/HCaptchaWidget";
import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@/components/contact/TurnstileWidget";

interface ContactFormProps {
  hcaptchaSiteKey?: string;
  turnstileSiteKey?: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("contactForm");

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-muted)] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? t("submitPending") : t("submit")}
    </button>
  );
}

export function ContactForm({
  hcaptchaSiteKey,
  turnstileSiteKey,
}: ContactFormProps) {
  const locale = useLocale();
  const t = useTranslations("contactForm");
  const [state, formAction] = useActionState(
    sendContactMessage,
    initialContactFormState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const pendingSubmitAfterCaptchaRef = useRef(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  useEffect(() => {
    if (!pendingSubmitAfterCaptchaRef.current || !turnstileToken) {
      return;
    }

    pendingSubmitAfterCaptchaRef.current = false;
    formRef.current?.requestSubmit();
  }, [turnstileToken]);

  const fieldError = (field: "name" | "email" | "company" | "subject" | "message") => {
    const code = state.fieldErrors?.[field];
    return code ? t(`errors.${code}`) : null;
  };

  const statusMessage = state.messageCode
    ? t(`messages.${state.messageCode}`)
    : null;
  const hcaptchaEnabled = Boolean(hcaptchaSiteKey);
  const turnstileEnabled = Boolean(turnstileSiteKey);
  const useTurnstileFallback = !hcaptchaEnabled && turnstileEnabled;
  const turnstileResetKey = `${state.status}:${state.messageCode ?? "idle"}`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!useTurnstileFallback || turnstileToken) {
      return;
    }

    event.preventDefault();
    pendingSubmitAfterCaptchaRef.current = true;
    turnstileRef.current?.execute();
  };

  return (
    <section className="mb-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--color-text-base)]">
          {t("heading")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
          {t("sub")}
        </p>
      </div>

      <form
        ref={formRef}
        action={formAction}
        className="space-y-5"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="locale" value={locale} />

        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">{t("websiteLabel")}</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label={t("nameLabel")}
            name="name"
            type="text"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            error={fieldError("name")}
            required
            minLength={2}
            maxLength={80}
          />
          <FormField
            label={t("emailLabel")}
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            error={fieldError("email")}
            required
            maxLength={200}
          />
        </div>

        <FormField
          label={t("companyLabel")}
          name="company"
          type="text"
          autoComplete="organization"
          placeholder={t("companyPlaceholder")}
          error={fieldError("company")}
          maxLength={120}
        />

        <FormField
          label={t("subjectLabel")}
          name="subject"
          type="text"
          placeholder={t("subjectPlaceholder")}
          error={fieldError("subject")}
          required
          minLength={3}
          maxLength={120}
        />

        <FormTextArea
          label={t("messageLabel")}
          name="message"
          placeholder={t("messagePlaceholder")}
          error={fieldError("message")}
          required
          minLength={20}
          maxLength={4000}
          rows={8}
        />

        {hcaptchaEnabled ? (
          <div>
            <HCaptchaWidget
              siteKey={hcaptchaSiteKey!}
              resetKey={turnstileResetKey}
              onTokenChange={setTurnstileToken}
            />
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-faint)]">
              {t("botProtectionNote")}
            </p>
          </div>
        ) : null}

        {useTurnstileFallback ? (
          <div>
            <TurnstileWidget
              ref={turnstileRef}
              siteKey={turnstileSiteKey!}
              locale={locale}
              resetKey={turnstileResetKey}
              onTokenChange={setTurnstileToken}
            />
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-faint)]">
              {t("botProtectionNote")}
            </p>
          </div>
        ) : null}

        {statusMessage ? (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={cn(
              "rounded-lg border px-4 py-3 text-sm",
              state.status === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800",
            )}
          >
            {statusMessage}
          </p>
        ) : null}

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-[var(--color-text-faint)]">
            {t("privacyNote")}
          </p>
          <SubmitButton />
        </div>
      </form>
    </section>
  );
}

interface BaseFieldProps {
  label: string;
  name: string;
  error: string | null;
}

interface InputFieldProps extends BaseFieldProps {
  type: string;
  autoComplete?: string;
  placeholder: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

function FormField({
  label,
  name,
  error,
  type,
  autoComplete,
  placeholder,
  required,
  minLength,
  maxLength,
}: InputFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--color-text-base)]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          "w-full rounded-xl border bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-base)] outline-none transition-colors placeholder:text-[var(--color-text-faint)]",
          error
            ? "border-red-400 focus:border-red-500"
            : "border-[var(--color-border)] focus:border-[var(--color-accent)]",
        )}
      />
      {error ? (
        <span id={`${name}-error`} className="mt-2 block text-xs text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}

interface TextAreaProps extends BaseFieldProps {
  placeholder: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  rows?: number;
}

function FormTextArea({
  label,
  name,
  error,
  placeholder,
  required,
  minLength,
  maxLength,
  rows = 6,
}: TextAreaProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--color-text-base)]">
        {label}
      </span>
      <textarea
        name={name}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          "w-full rounded-xl border bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-base)] outline-none transition-colors placeholder:text-[var(--color-text-faint)]",
          error
            ? "border-red-400 focus:border-red-500"
            : "border-[var(--color-border)] focus:border-[var(--color-accent)]",
        )}
      />
      {error ? (
        <span id={`${name}-error`} className="mt-2 block text-xs text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}
