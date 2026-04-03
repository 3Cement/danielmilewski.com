export function hasRealAnalyticsToken(token: string | undefined): boolean {
  return token != null && token !== "" && token !== "REPLACE_WITH_YOUR_TOKEN";
}
