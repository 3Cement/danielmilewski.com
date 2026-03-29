"use server";

import { Resend } from "resend";
import { EMAIL, SITE_NAME, SITE_URL } from "@/lib/metadata";
import type {
  ContactField,
  ContactFormState,
  FieldErrorCode,
} from "@/components/contact/contactFormState";

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatMultilineHtml(value: string): string {
  return escapeHtml(value).replaceAll("\n", "<br />");
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

  const locale = readField(formData, "locale") || "en";
  const data = {
    name: readField(formData, "name"),
    email: readField(formData, "email"),
    company: readField(formData, "company"),
    subject: readField(formData, "subject"),
    message: readField(formData, "message"),
  } satisfies Record<ContactField, string>;

  const fieldErrors = validateContactForm(data);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      fieldErrors,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? `Portfolio Contact <onboarding@resend.dev>`;
  const to = process.env.CONTACT_FORM_TO_EMAIL ?? EMAIL;

  if (!apiKey || !from || !to) {
    return {
      status: "error",
      messageCode: "configError",
    };
  }

  const resend = new Resend(apiKey);
  const submittedAt = new Date().toISOString();
  const safeCompany = data.company || "—";
  const emailSubject = `[${SITE_NAME}] ${data.subject}`;

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject: emailSubject,
    text:
      `New portfolio contact form submission\n\n` +
      `Name: ${data.name}\n` +
      `Email: ${data.email}\n` +
      `Company: ${safeCompany}\n` +
      `Locale: ${locale}\n` +
      `Submitted at: ${submittedAt}\n` +
      `Source: ${SITE_URL}/${locale}/contact\n\n` +
      `Message:\n${data.message}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
        <h1 style="font-size: 20px; margin: 0 0 16px;">New portfolio contact form submission</h1>
        <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
          <tbody>
            <tr><td style="padding: 6px 0; font-weight: 600;">Name</td><td style="padding: 6px 0;">${escapeHtml(data.name)}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Email</td><td style="padding: 6px 0;">${escapeHtml(data.email)}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Company</td><td style="padding: 6px 0;">${escapeHtml(safeCompany)}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Locale</td><td style="padding: 6px 0;">${escapeHtml(locale)}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Submitted at</td><td style="padding: 6px 0;">${escapeHtml(submittedAt)}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Source</td><td style="padding: 6px 0;">${escapeHtml(`${SITE_URL}/${locale}/contact`)}</td></tr>
          </tbody>
        </table>
        <h2 style="font-size: 16px; margin: 0 0 8px;">Subject</h2>
        <p style="margin: 0 0 16px;">${escapeHtml(data.subject)}</p>
        <h2 style="font-size: 16px; margin: 0 0 8px;">Message</h2>
        <p style="margin: 0;">${formatMultilineHtml(data.message)}</p>
      </div>
    `,
    tags: [
      { name: "source", value: "portfolio-contact-form" },
      { name: "locale", value: locale },
    ],
  });

  if (error) {
    console.error("Contact form email failed", error);
    return {
      status: "error",
      messageCode: "sendError",
    };
  }

  return {
    status: "success",
    messageCode: "success",
  };
}
