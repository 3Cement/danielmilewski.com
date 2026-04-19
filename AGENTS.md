<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Ops Notes

- Google Search Console is available on Daniel's machine through a local MCP server named `gsc`, configured in the untracked `.mcp.json`.
- The main property for this site is `sc-domain:danielmilewski.com`.
- Prefer GSC via MCP for sitemap status, URL inspection, and search analytics before guessing about indexing state.
- Do not commit `.mcp.json` or any credentials paths/secrets. The service-account JSON lives outside the repo.
- Releasing SEO changes is not the same as Google reflecting them immediately. Always check live HTML first, then re-check GSC with recrawl timing in mind.

# Cloudflare

- A global Cloudflare MCP server named `cloudflare-api` is configured in Codex user config and should be preferred over per-project Cloudflare MCP entries.
- Use `cloudflare-api` for read-only inspection first: DNS, zones, Workers, Pages, deploy status, observability, and analytics.
- The current OAuth grant is read-only. Do not assume DNS or Worker mutations are available through MCP unless a separate write-enabled authorization is configured later.
- Treat Cloudflare production changes as explicit operations: inspect first, summarize intended mutations, and only then proceed with a write-capable path if one exists.
- For this project, the primary production zone is `danielmilewski.com`.
