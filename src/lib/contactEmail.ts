import { EMAIL, SITE_NAME, SITE_URL } from "@/lib/metadata";

export type ContactLocale = "en" | "pl";

export interface ContactSubmissionData {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}

export interface ContactEmailPayload {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  tags: Array<{ name: string; value: string }>;
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

export function buildOwnerNotificationEmail({
  from,
  to,
  locale,
  data,
  submittedAt,
}: {
  from: string;
  to: string;
  locale: ContactLocale;
  data: ContactSubmissionData;
  submittedAt: string;
}): ContactEmailPayload {
  const safeCompany = data.company || "—";
  const sourceUrl = `${SITE_URL}/${locale}/contact`;

  return {
    from,
    to,
    replyTo: data.email,
    subject: `[${SITE_NAME}] ${data.subject}`,
    text:
      `New portfolio contact form submission\n\n` +
      `Name: ${data.name}\n` +
      `Email: ${data.email}\n` +
      `Company: ${safeCompany}\n` +
      `Locale: ${locale}\n` +
      `Submitted at: ${submittedAt}\n` +
      `Source: ${sourceUrl}\n\n` +
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
            <tr><td style="padding: 6px 0; font-weight: 600;">Source</td><td style="padding: 6px 0;">${escapeHtml(sourceUrl)}</td></tr>
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
  };
}

export function buildAutoReplyEmail({
  from,
  to,
  locale,
  name,
}: {
  from: string;
  to: string;
  locale: ContactLocale;
  name: string;
}): ContactEmailPayload {
  const subject =
    locale === "pl" ? "Dziękuję za wiadomość" : "Thanks for your message";
  const greeting = locale === "pl" ? `Cześć ${name},` : `Hi ${name},`;
  const line1 =
    locale === "pl"
      ? "dziękuję za wiadomość przez formularz kontaktowy. Potwierdzam, że dotarła."
      : "thanks for reaching out through my contact form. This is a quick confirmation that your message arrived.";
  const line2 =
    locale === "pl"
      ? "Postaram się odpisać w ciągu kilku dni roboczych."
      : "I’ll get back to you within a few business days.";
  const line3 =
    locale === "pl"
      ? "Jeśli temat jest pilny, możesz po prostu odpowiedzieć na tego maila."
      : "If the matter is time-sensitive, you can simply reply to this email.";
  const signoff = locale === "pl" ? "Daniel Milewski" : "Daniel Milewski";

  return {
    from,
    to,
    replyTo: EMAIL,
    subject,
    text: `${greeting}\n\n${line1}\n${line2}\n${line3}\n\n${signoff}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
        <p style="margin: 0 0 16px;">${escapeHtml(greeting)}</p>
        <p style="margin: 0 0 12px;">${escapeHtml(line1)}</p>
        <p style="margin: 0 0 12px;">${escapeHtml(line2)}</p>
        <p style="margin: 0 0 16px;">${escapeHtml(line3)}</p>
        <p style="margin: 0;">${escapeHtml(signoff)}</p>
      </div>
    `,
    tags: [
      { name: "source", value: "portfolio-contact-autoreply" },
      { name: "locale", value: locale },
    ],
  };
}
