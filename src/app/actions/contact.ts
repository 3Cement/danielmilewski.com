"use server";

import { EMAIL } from "@/lib/metadata";

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactActionResult {
  success: boolean;
  error?: "validation" | "send";
}

export async function submitContactForm(
  data: ContactFormData,
): Promise<ContactActionResult> {
  const { name, email, message } = data;

  if (
    !name.trim() ||
    !email.trim() ||
    !message.trim() ||
    message.trim().length < 10 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return { success: false, error: "validation" };
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Dev / staging without key configured — log and succeed silently
    console.warn("[contact] RESEND_API_KEY not set, skipping email delivery");
    console.info("[contact] form submission:", { name, email, message });
    return { success: true };
  }

  try {
    // Requires danielmilewski.com to be verified as a sending domain in Resend.
    // See: https://resend.com/docs/dashboard/domains/introduction
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "contact@danielmilewski.com",
        to: [EMAIL],
        reply_to: email,
        subject: `Portfolio contact from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!res.ok) {
      console.error("[contact] Resend error", res.status, await res.text());
      return { success: false, error: "send" };
    }

    return { success: true };
  } catch (err) {
    console.error("[contact] Network error", err);
    return { success: false, error: "send" };
  }
}
