import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// SSG pages are prerendered at build time. The static-assets cache serves
// those results from the asset bundle, and cache interception returns them
// before the Next.js server is loaded. Revalidation is not used.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
