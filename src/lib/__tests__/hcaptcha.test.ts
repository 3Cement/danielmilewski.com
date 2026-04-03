import { afterEach, describe, expect, it, vi } from "vitest";
import { isHCaptchaConfigured, verifyHCaptchaToken } from "@/lib/hcaptcha";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("isHCaptchaConfigured", () => {
  it("returns true only when both site key and secret are present", () => {
    expect(isHCaptchaConfigured("site", "secret")).toBe(true);
    expect(isHCaptchaConfigured("site", undefined)).toBe(false);
    expect(isHCaptchaConfigured(undefined, "secret")).toBe(false);
  });
});

describe("verifyHCaptchaToken", () => {
  it("returns true when the verification endpoint confirms success", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );

    await expect(
      verifyHCaptchaToken({
        token: "token",
        secretKey: "secret",
        remoteIp: "127.0.0.1",
      }),
    ).resolves.toBe(true);
  });

  it("returns false on unsuccessful responses", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: false }), { status: 200 }),
    );

    await expect(
      verifyHCaptchaToken({
        token: "token",
        secretKey: "secret",
      }),
    ).resolves.toBe(false);
  });

  it("returns false when the endpoint response is not ok", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response("bad request", { status: 400 }),
    );

    await expect(
      verifyHCaptchaToken({
        token: "token",
        secretKey: "secret",
      }),
    ).resolves.toBe(false);
  });
});
