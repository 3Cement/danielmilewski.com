import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initialContactFormState } from "@/components/contact/contactFormState";

const mocks = vi.hoisted(() => ({
  headers: vi.fn(),
  headersGet: vi.fn(),
  readServerEnv: vi.fn(),
  isHCaptchaConfigured: vi.fn(),
  verifyHCaptchaToken: vi.fn(),
  isTurnstileConfigured: vi.fn(),
  verifyTurnstileToken: vi.fn(),
  resendSend: vi.fn(),
  loggerInfo: vi.fn(),
  loggerWarn: vi.fn(),
  loggerError: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: mocks.headers,
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = {
      send: mocks.resendSend,
    };
  },
}));

vi.mock("@/lib/serverEnv", () => ({
  readServerEnv: mocks.readServerEnv,
}));

vi.mock("@/lib/hcaptcha", () => ({
  isHCaptchaConfigured: mocks.isHCaptchaConfigured,
  verifyHCaptchaToken: mocks.verifyHCaptchaToken,
}));

vi.mock("@/lib/turnstile", () => ({
  isTurnstileConfigured: mocks.isTurnstileConfigured,
  verifyTurnstileToken: mocks.verifyTurnstileToken,
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    info: mocks.loggerInfo,
    warn: mocks.loggerWarn,
    error: mocks.loggerError,
  },
}));

import { sendContactMessage } from "@/app/actions/sendContactMessage";

function buildValidFormData() {
  const formData = new FormData();
  formData.set("locale", "en");
  formData.set("name", "Jane Doe");
  formData.set("email", "jane@example.com");
  formData.set("company", "Acme");
  formData.set("subject", "Backend help needed");
  formData.set(
    "message",
    "I need help with a backend project and API integration next month.",
  );
  formData.set("website", "");
  return formData;
}

describe("sendContactMessage", () => {
  beforeEach(() => {
    mocks.headers.mockResolvedValue({
      get: mocks.headersGet,
    });
    mocks.headersGet.mockReturnValue(null);
    mocks.readServerEnv.mockImplementation(async (name: string) => {
      const values: Record<string, string | undefined> = {
        HCAPTCHA_SECRET_KEY: "h-secret",
        NEXT_PUBLIC_HCAPTCHA_SITE_KEY: "h-site",
        TURNSTILE_SECRET_KEY: "t-secret",
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: "t-site",
        RESEND_API_KEY: "resend-key",
        RESEND_FROM_EMAIL: "Daniel <contact@example.com>",
        CONTACT_FORM_TO_EMAIL: "owner@example.com",
      };
      return values[name];
    });
    mocks.isHCaptchaConfigured.mockReturnValue(false);
    mocks.verifyHCaptchaToken.mockResolvedValue(false);
    mocks.isTurnstileConfigured.mockReturnValue(false);
    mocks.verifyTurnstileToken.mockResolvedValue(false);
    mocks.resendSend.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("skips delivery in Playwright smoke mode after validation", async () => {
    vi.stubEnv("PLAYWRIGHT_TEST_MODE", "1");

    await expect(
      sendContactMessage(initialContactFormState, buildValidFormData()),
    ).resolves.toEqual({
      status: "success",
      messageCode: "success",
    });

    expect(mocks.verifyHCaptchaToken).not.toHaveBeenCalled();
    expect(mocks.verifyTurnstileToken).not.toHaveBeenCalled();
    expect(mocks.resendSend).not.toHaveBeenCalled();
  });

  it("verifies hCaptcha first when it is configured", async () => {
    mocks.isHCaptchaConfigured.mockReturnValue(true);
    mocks.verifyHCaptchaToken.mockResolvedValue(true);
    mocks.headersGet.mockImplementation((name: string) => {
      if (name === "cf-connecting-ip") {
        return "203.0.113.7";
      }
      return null;
    });

    const formData = buildValidFormData();
    formData.set("h-captcha-response", "h-token");
    formData.set("cf-turnstile-response", "t-token");

    await expect(
      sendContactMessage(initialContactFormState, formData),
    ).resolves.toEqual({
      status: "success",
      messageCode: "success",
    });

    expect(mocks.verifyHCaptchaToken).toHaveBeenCalledWith({
      token: "h-token",
      secretKey: expect.any(String),
      remoteIp: "203.0.113.7",
    });
    expect(mocks.verifyTurnstileToken).not.toHaveBeenCalled();
    expect(mocks.resendSend).toHaveBeenCalledTimes(2);
  });

  it("falls back to Turnstile when hCaptcha is not configured", async () => {
    mocks.isTurnstileConfigured.mockReturnValue(true);
    mocks.verifyTurnstileToken.mockResolvedValue(true);
    mocks.headersGet.mockImplementation((name: string) => {
      if (name === "x-forwarded-for") {
        return "198.51.100.42, 10.0.0.1";
      }
      return null;
    });

    const formData = buildValidFormData();
    formData.set("cf-turnstile-response", "t-token");

    await expect(
      sendContactMessage(initialContactFormState, formData),
    ).resolves.toEqual({
      status: "success",
      messageCode: "success",
    });

    expect(mocks.verifyHCaptchaToken).not.toHaveBeenCalled();
    expect(mocks.verifyTurnstileToken).toHaveBeenCalledWith({
      token: "t-token",
      secretKey: expect.any(String),
      remoteIp: "198.51.100.42",
    });
  });

  it("returns captchaError when configured hCaptcha verification fails", async () => {
    mocks.isHCaptchaConfigured.mockReturnValue(true);

    const formData = buildValidFormData();
    formData.set("h-captcha-response", "bad-token");

    await expect(
      sendContactMessage(initialContactFormState, formData),
    ).resolves.toEqual({
      status: "error",
      messageCode: "captchaError",
    });

    expect(mocks.loggerWarn).toHaveBeenCalledWith(
      "contact_form_captcha_failed",
      expect.objectContaining({
        provider: "hcaptcha",
      }),
    );
    expect(mocks.resendSend).not.toHaveBeenCalled();
  });
});
