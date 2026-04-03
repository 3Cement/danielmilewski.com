import { getCloudflareContext } from "@opennextjs/cloudflare";

export type ServerEnvName =
  | "RESEND_API_KEY"
  | "RESEND_FROM_EMAIL"
  | "CONTACT_FORM_TO_EMAIL"
  | "HCAPTCHA_SECRET_KEY"
  | "NEXT_PUBLIC_HCAPTCHA_SITE_KEY"
  | "TURNSTILE_SECRET_KEY"
  | "NEXT_PUBLIC_TURNSTILE_SITE_KEY";

export async function readServerEnv(
  name: ServerEnvName,
): Promise<string | undefined> {
  const directValue = process.env[name];
  if (directValue) {
    return directValue;
  }

  try {
    const { env } = await getCloudflareContext({ async: true });
    const value = (env as Record<string, unknown>)[name];
    return typeof value === "string" && value ? value : undefined;
  } catch {
    return undefined;
  }
}
