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

### High priority

- Add `2-4` more case studies in `src/content/projects/` later, not now. This remains the biggest proof-of-work gap, but it is intentionally postponed until after the current analytics, anti-spam, and quality-of-life improvements are done.
- Add stronger trust signals on home/contact: testimonials, company logos if available, concrete outcomes, years of experience, and short credibility metrics.
- Enable real analytics on production and measure at least pageviews, referrers, top landing pages, and contact-form success.
- Harden the contact form with anti-spam controls such as rate limiting and/or Cloudflare Turnstile.
- Add a small E2E smoke suite for the highest-risk flows: locale redirects, language switcher, blog/project detail pages, and contact form submit.

### Medium priority

- Add FAQ blocks on home or contact to address common objections: budget, scope, delivery speed, and collaboration model.
- Extend the contact form with light lead qualification fields such as timeline, project type, or budget range.
- Expose RSS/feed more clearly in the UI.
- Improve blog/project detail pages with related content and stronger internal linking.
- Add dynamic Open Graph images for posts and projects.

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
