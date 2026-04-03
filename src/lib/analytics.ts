export function hasRealAnalyticsToken(token: string | undefined): boolean {
  return token != null && token !== "" && token !== "REPLACE_WITH_YOUR_TOKEN";
}

export function isProductionAnalyticsHost(
  hostname: string | undefined,
  siteUrl: string,
): boolean {
  if (hostname == null || hostname === "") {
    return false;
  }

  const normalizedHostname = hostname.toLowerCase();

  try {
    const configuredHost = new URL(siteUrl).hostname.toLowerCase();
    const allowedHosts = new Set([
      configuredHost,
      configuredHost.startsWith("www.")
        ? configuredHost.slice(4)
        : `www.${configuredHost}`,
    ]);

    return allowedHosts.has(normalizedHostname);
  } catch {
    return false;
  }
}
