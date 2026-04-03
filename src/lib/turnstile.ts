export function isTurnstileConfigured(
  siteKey: string | undefined,
  secretKey: string | undefined,
): boolean {
  return Boolean(siteKey && secretKey);
}

export async function verifyTurnstileToken({
  token,
  secretKey,
  remoteIp,
}: {
  token: string;
  secretKey: string;
  remoteIp?: string;
}): Promise<boolean> {
  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
    },
  );

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as { success?: boolean };
  return data.success === true;
}
