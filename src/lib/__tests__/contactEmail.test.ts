import { describe, expect, it } from "vitest";
import {
  buildAutoReplyEmail,
  buildOwnerNotificationEmail,
} from "@/lib/contactEmail";

const submission = {
  name: "Jane Doe",
  email: "jane@example.com",
  company: "Acme",
  subject: "Backend support",
  message: "I need help with an API integration and deployment.",
};

describe("buildOwnerNotificationEmail", () => {
  it("builds the inbound notification email with reply-to and source metadata", () => {
    const email = buildOwnerNotificationEmail({
      from: "Daniel <contact@example.com>",
      to: "owner@example.com",
      locale: "pl",
      data: submission,
      submittedAt: "2026-04-02T12:00:00.000Z",
    });

    expect(email.replyTo).toBe("jane@example.com");
    expect(email.subject).toContain("Backend support");
    expect(email.text).toContain("Source: https://danielmilewski.com/pl/contact");
    expect(email.tags).toEqual([
      { name: "source", value: "portfolio-contact-form" },
      { name: "locale", value: "pl" },
    ]);
  });
});

describe("buildAutoReplyEmail", () => {
  it("builds an English confirmation email", () => {
    const email = buildAutoReplyEmail({
      from: "Daniel <contact@example.com>",
      to: "jane@example.com",
      locale: "en",
      name: "Jane",
    });

    expect(email.subject).toBe("Thanks for your message");
    expect(email.replyTo).toBe("danielmilewski123@gmail.com");
    expect(email.text).toContain("Hi Jane,");
    expect(email.text).toContain("within a few business days");
  });

  it("builds a Polish confirmation email", () => {
    const email = buildAutoReplyEmail({
      from: "Daniel <contact@example.com>",
      to: "jane@example.com",
      locale: "pl",
      name: "Jan",
    });

    expect(email.subject).toBe("Dziękuję za wiadomość");
    expect(email.text).toContain("Cześć Jan,");
    expect(email.text).toContain("w ciągu kilku dni roboczych");
    expect(email.tags).toEqual([
      { name: "source", value: "portfolio-contact-autoreply" },
      { name: "locale", value: "pl" },
    ]);
  });
});
