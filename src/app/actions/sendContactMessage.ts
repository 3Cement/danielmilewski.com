"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { EMAIL } from "@/lib/metadata";
import { logger } from "@/lib/logger";
import { readServerEnv } from "@/lib/serverEnv";
import { isHCaptchaConfigured, verifyHCaptchaToken } from "@/lib/hcaptcha";
import { isTurnstileConfigured, verifyTurnstileToken } from "@/lib/turnstile";
import type {
  ContactField,
  ContactFormState,
  FieldErrorCode,
} from "@/components/contact/contactFormState";
import {
  buildAutoReplyEmail,
  buildOwnerNotificationEmail,
  type ContactEmailPayload,
  type ContactLocale,
} from "@/lib/contactEmail";

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function validateContactForm(data: Record<ContactField, string>) {
  const fieldErrors: Partial<Record<ContactField, FieldErrorCode>> = {};

  if (!data.name) {
    fieldErrors.name = "required";
  } else if (data.name.length < 2) {
    fieldErrors.name = "tooShort";
  } else if (data.name.length > 80) {
    fieldErrors.name = "tooLong";
  }

  if (!data.email) {
    fieldErrors.email = "required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    fieldErrors.email = "invalidEmail";
  } else if (data.email.length > 200) {
    fieldErrors.email = "tooLong";
  }

  if (data.company.length > 120) {
    fieldErrors.company = "tooLong";
  }

  if (!data.subject) {
    fieldErrors.subject = "required";
  } else if (data.subject.length < 3) {
    fieldErrors.subject = "tooShort";
  } else if (data.subject.length > 120) {
    fieldErrors.subject = "tooLong";
  }

  if (!data.message) {
    fieldErrors.message = "required";
  } else if (data.message.length < 20) {
    fieldErrors.message = "tooShort";
  } else if (data.message.length > 4000) {
    fieldErrors.message = "tooLong";
  }

  return fieldErrors;
}

async function sendEmailWithRetry({
  resend,
  payload,
  logPrefix,
}: {
  resend: Resend;
  payload: ContactEmailPayload;
  logPrefix: string;
}): Promise<boolean> {
  const backoff = [1000, 2000, 4000];
  let lastError: { statusCode: number | null; message: string } | null = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    if (attempt > 1) {
      await new Promise<void>((resolve) => setTimeout(resolve, backoff[attempt - 2]));
    }

    logger.info(`${logPrefix}_attempt`, { attempt });
    const { error } = await resend.emails.send(payload);
    if (!error) {
      return true;
    }

    lastError = {
      statusCode: error.statusCode,
      message: error.message,
    };
    logger.warn(`${logPrefix}_attempt_failed`, {
      attempt,
      statusCode: error.statusCode,
      message: error.message,
    });
  }

  logger.error(`${logPrefix}_failed`, {
    statusCode: lastError?.statusCode,
    message: lastError?.message,
  });
  return false;
}

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const honeypot = readField(formData, "website");
  if (honeypot) {
    return {
      status: "success",
      messageCode: "success",
    };
  }

  const rawLocale = readField(formData, "locale");
  const locale = (["en", "pl"] as const).includes(rawLocale as "en" | "pl")
    ? (rawLocale as ContactLocale)
    : "en";
  const data = {
    name: readField(formData, "name"),
    email: readField(formData, "email"),
    company: readField(formData, "company"),
    subject: readField(formData, "subject"),
    message: readField(formData, "message"),
  } satisfies Record<ContactField, string>;

  const fieldErrors = validateContactForm(data);
  if (Object.keys(fieldErrors).length > 0) {
    logger.warn("contact_form_validation_error", {
      locale,
      invalidFields: Object.keys(fieldErrors).sort(),
    });
    return {
      status: "error",
      fieldErrors,
    };
  }

  if (process.env.PLAYWRIGHT_TEST_MODE === "1") {
    logger.info("contact_form_test_mode_skip_delivery", { locale });
    return { status: "success", messageCode: "success" };
  }

  const hcaptchaToken = readField(formData, "h-captcha-response");
  const hcaptchaSiteKey = await readServerEnv("NEXT_PUBLIC_HCAPTCHA_SITE_KEY");
  const hcaptchaSecret = await readServerEnv("HCAPTCHA_SECRET_KEY");
  const turnstileSiteKey = await readServerEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY");
  const turnstileSecret = await readServerEnv("TURNSTILE_SECRET_KEY");
  const shouldVerifyHCaptcha = isHCaptchaConfigured(
    hcaptchaSiteKey,
    hcaptchaSecret,
  );
  const shouldVerifyTurnstile = isTurnstileConfigured(
    turnstileSiteKey,
    turnstileSecret,
  );

  if (shouldVerifyHCaptcha || shouldVerifyTurnstile) {
    const requestHeaders = await headers();
    const forwardedFor = requestHeaders.get("x-forwarded-for");
    const remoteIp =
      requestHeaders.get("cf-connecting-ip") ??
      forwardedFor?.split(",")[0]?.trim();

    const captchaPassed = shouldVerifyHCaptcha
      ? hcaptchaToken !== "" &&
        (await verifyHCaptchaToken({
          token: hcaptchaToken,
          secretKey: hcaptchaSecret!,
          remoteIp,
        }))
      : readField(formData, "cf-turnstile-response") !== "" &&
        (await verifyTurnstileToken({
          token: readField(formData, "cf-turnstile-response"),
          secretKey: turnstileSecret!,
          remoteIp,
        }));

    if (!captchaPassed) {
      logger.warn("contact_form_captcha_failed", {
        locale,
        provider: shouldVerifyHCaptcha ? "hcaptcha" : "turnstile",
        remoteIp,
      });
      return { status: "error", messageCode: "captchaError" };
    }
  }

  const apiKey = await readServerEnv("RESEND_API_KEY");
  const from = (await readServerEnv("RESEND_FROM_EMAIL")) ?? `Portfolio Contact <onboarding@resend.dev>`;
  const to = (await readServerEnv("CONTACT_FORM_TO_EMAIL")) ?? EMAIL;

  if (!apiKey || !from || !to) {
    logger.error("contact_form_config_error", {
      locale,
      hasApiKey: Boolean(apiKey),
      hasFrom: Boolean(from),
      hasTo: Boolean(to),
    });
    return {
      status: "error",
      messageCode: "configError",
    };
  }

  const resend = new Resend(apiKey);
  const submittedAt = new Date().toISOString();
  const ownerNotificationEmail = buildOwnerNotificationEmail({
    from,
    to,
    locale,
    data,
    submittedAt,
  });
  const ownerEmailSent = await sendEmailWithRetry({
    resend,
    payload: ownerNotificationEmail,
    logPrefix: "contact_form_email",
  });
  if (!ownerEmailSent) {
    logger.error("contact_form_send_failed", { locale });
    return { status: "error", messageCode: "sendError" };
  }

  const autoReplyEmail = buildAutoReplyEmail({
    from,
    to: data.email,
    locale,
    name: data.name,
  });
  await sendEmailWithRetry({
    resend,
    payload: autoReplyEmail,
    logPrefix: "contact_form_autoreply_email",
  });

  logger.info("contact_form_success", { locale });
  return { status: "success", messageCode: "success" };
}
