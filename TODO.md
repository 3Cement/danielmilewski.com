# TODO

## CI / delivery

- Current policy: GitHub Actions are intentionally disabled in this repo.
- Reason: avoid paying for GitHub Actions at the current project stage.
- Current workflow: validate locally with `npm run test`, `npm run lint`, `npm run build`, optional `npm run test:unit`, then deploy with `npm run deploy`.

## Future options to revisit

- Add a lightweight pre-push or release script that runs the full local validation bundle automatically.
- Use a self-hosted runner only if maintenance cost stays lower than GitHub Actions billing.
- Move CI to another platform if a free tier is enough and setup stays simple.
- Add deploy-only automation from Cloudflare or another external system instead of full GitHub-hosted CI.
- Re-enable GitHub Actions later only if the repo needs enforced remote checks badly enough to justify the cost.

## Product backlog

### Done recently

- Add stronger trust signals on home/contact: credibility strip, working-context section, concrete company environments, CV access, and clearer contact expectations.
- Harden the contact form with honeypot plus hCaptcha / Turnstile fallback.
- Add a small E2E smoke suite for the highest-risk flows: locale redirects, language switcher, blog/project detail pages, and contact form submit.
- Re-enable real `next/image` optimization through Cloudflare Images instead of the global `unoptimized` fallback.
- Reduce the `next-intl` client payload to the namespaces actually needed by client components.

### Blocked on content

- Add `2-4` more case studies in `src/content/projects/` once the source material is ready. This is still the biggest proof-of-work gap, but it is blocked by missing write-up assets rather than engineering work.

### Current focus

- Domknąć analitykę konwersji w modelu privacy-first na darmowym Cloudflare:
  - Cloudflare Web Analytics for pageviews, referrers, top landing pages, and performance.
  - Structured application events/logs for contact-form outcomes and key CTA clicks.
- Wzmocnić linkowanie wewnętrzne i SEO:
  - expose RSS/feed more clearly in the UI
  - add breadcrumbs + BreadcrumbList schema on blog/project detail pages
  - connect blog posts and project pages with explicit related-content links

### Next

- Add dynamic Open Graph images for posts and projects.
- Add FAQ blocks on home or contact to address common objections: budget, scope, delivery speed, and collaboration model.
- Run a stricter production performance pass:
  - collect Lighthouse / Core Web Vitals style measurements
  - verify image optimization behavior on the live domain
  - fix the biggest measured bottlenecks instead of guessing
- Unblock full GA4 reporting access for local MCP analysis:
  - enable `Google Analytics Admin API` in the Google Cloud project used by the local `google-analytics` MCP server
  - enable `Google Analytics Data API` in the same Google Cloud project so `run_report` / `run_realtime_report` can execute
  - confirm the service account behind MCP has at least read access to the GA4 property for `danielmilewski.com`
  - record the numeric GA4 `property_id` somewhere local and untracked for future MCP runs
  - reminder: `property_id` is the numeric GA4 property identifier from Google Analytics Admin -> Property Settings, not the `G-XXXXXXXXXX` Measurement ID from Data Streams

### Lower priority

- Add a `uses` / `toolbox` page for stack, workflow, and developer setup.
- Improve the 404 page with recovery links to projects, blog, and contact.
- Add a simple release/runbook section for deploy, rollback, secret rotation, and contact-form debugging.
- Create a periodic content review checklist to keep case studies and posts current.

### Explicitly not a priority right now

- CMS
- comments
- authentication
- database-backed admin tooling
- heavy animation work
- a full cookie banner while analytics remain privacy-first and minimal
- more contact-form qualification fields for now
