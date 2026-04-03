# Daniel Milewski — Portfolio

Personal portfolio site: Senior Python Developer (AI/LLM, backend, automation). Bilingual **English** (`/en`) and **Polish** (`/pl`).

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | **Next.js 16** (App Router, React 19) |
| Styling | **Tailwind CSS v4** |
| i18n | **next-intl** (`src/app/[locale]/` + `src/messages/*.json`) |
| Content | **MDX** (`next-mdx-remote`) + frontmatter (`gray-matter`) |
| Production host | **Cloudflare Workers** via **OpenNext** (`@opennextjs/cloudflare`) |
| Deploy CLI | **Wrangler** (`wrangler.jsonc`) |

Local `next dev` / `next start` use Node and a normal filesystem. **Cloudflare Workers do not ship your repo’s `src/content/` tree**, so MDX is compiled into a JSON bundle at build time (see [Content on Cloudflare](#content-on-cloudflare-workers) below).

---

## Requirements

- **Node.js 20+** (matches typical Next 16 setups)
- npm (or compatible client)
- For deploy: Cloudflare account and `npx wrangler login`

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Runs `predev` → regenerates `src/generated/content-data.json` → Next dev server (port 3000). |
| `npm run build` | Runs `prebuild` → regenerates JSON → `next build`. |
| `npm run start` | Production Next server after `npm run build`. |
| `npm run lint` | ESLint. |
| `npm run test` | `scripts/verify-messages.mjs` — checks EN/PL message key parity. |
| `npm run test:unit` | Vitest unit tests for helper logic. |
| `npm run test:e2e` | Playwright smoke tests on a local production build (`next build` + `next start` on port `3050`). |
| `npm run preview` | `opennextjs-cloudflare build` + local Worker preview (Wrangler). |
| `npm run deploy` | OpenNext build + `opennextjs-cloudflare deploy` to Cloudflare. |
| `node scripts/generate-content-data.mjs` | Regenerate `content-data.json` only (used by `predev` / `prebuild`). |
| `npm run generate:favicon` | Regenerate `src/app/favicon.ico` from the current SVG-based favicon source. |

---

## CI policy

- GitHub Actions are intentionally disabled in this repo for now.
- Reason: this project is kept lean and I do not want to pay for GitHub Actions at this stage.
- Validation happens locally before push/deploy via `npm run test`, `npm run lint`, `npm run build`, and when needed `npm run test:unit`.
- If GitHub still shows old failed checks on historical PRs, treat them as legacy noise rather than an active repo problem.
- Future CI alternatives are tracked in `TODO.md`.

---

## How routing and i18n work

- All user-facing pages live under **`src/app/[locale]/`** (`en`, `pl`).
- `src/i18n/routing.ts` defines locales and default locale, while `src/i18n/request.ts` loads the right message bundle for the active `[locale]` segment.
- Visiting `/` or `/main` redirects on the server to a locale homepage, preferring the `NEXT_LOCALE` cookie and then the browser's `Accept-Language` header.
- Legacy URLs like `/en/main` and `/pl/main` are handled as permanent redirects in `next.config.ts`, which keeps them edge-friendly on Cloudflare.
- Copy lives in **`src/messages/en.json`** and **`src/messages/pl.json`**. Navigation uses **`src/i18n/navigation.ts`** (`Link`, `redirect`, etc.).
- Root **`src/app/layout.tsx`**: local fonts, global metadata base, wraps children. Locale layout **`src/app/[locale]/layout.tsx`**: `NextIntlClientProvider`, navbar, footer, JSON-LD.

---

## Content on Cloudflare Workers

`src/lib/content.ts` **does not read the filesystem at runtime** on Workers (that caused `ENOENT` on paths like `/bundle/src/content/...`).

Instead:

1. **`scripts/generate-content-data.mjs`** scans `src/content/projects/*.mdx` and `src/content/blog/*.mdx`, parses frontmatter, computes reading time for posts, and writes **`src/generated/content-data.json`**.
2. **`predev`** and **`prebuild`** run that script automatically.
3. **`content.ts`** imports the JSON and exposes `getAllProjects`, `getPostBySlug`, etc.

**Workflow when you edit MDX**

- Use `npm run dev` or `npm run build` so the JSON stays in sync.
- Commit both the **`.mdx` files** and the updated **`content-data.json`** so CI and other machines match production.

---

## Project structure (overview)

```
src/
├── app/
│   ├── layout.tsx              # Root: local fonts, metadata base
│   ├── page.tsx                # Redirects / -> preferred locale
│   ├── main/page.tsx           # Redirects /main -> preferred locale
│   ├── globals.css
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── icon.tsx, apple-icon.tsx, opengraph-image.tsx
│   ├── favicon.ico
│   ├── actions/
│   │   └── sendContactMessage.ts
│   ├── fonts/
│   │   └── geist-*.woff2
│   └── [locale]/               # All localized routes
│       ├── layout.tsx          # next-intl provider, nav, footer
│       ├── page.tsx            # Home
│       ├── about/, blog/, contact/, privacy/, projects/
│       └── ...
├── components/                 # layout/, home/, blog/, projects/, contact/, ui/, mdx/
├── content/
│   ├── projects/*.mdx
│   └── blog/*.mdx
├── generated/
│   └── content-data.json       # Built by generate-content-data.mjs (commit this)
├── i18n/
│   ├── navigation.ts
│   ├── request.ts              # next-intl request config
│   └── routing.ts
├── lib/
│   ├── content.ts              # Data from generated JSON
│   ├── metadata.ts             # SITE_URL, SEO helpers (uses NEXT_PUBLIC_SITE_URL)
│   ├── schema.ts               # JSON-LD
│   └── ...
├── messages/
│   ├── en.json
│   └── pl.json
└── types/

open-next.config.ts             # OpenNext Cloudflare config
wrangler.jsonc                  # Worker name, routes, vars, assets, bindings
public/                         # Static files (CVs, images, _headers)
scripts/
├── generate-favicon.mjs
├── generate-content-data.mjs
└── verify-messages.mjs
```

---

## Configuration files

| File | Role |
|------|------|
| `next.config.ts` | Next config + `next-intl` plugin; `initOpenNextCloudflareForDev()` when `NODE_ENV === 'development'`. |
| `open-next.config.ts` | `defineCloudflareConfig({})` — optional R2 cache, etc. ([OpenNext Cloudflare docs](https://opennext.js.org/cloudflare)). |
| `wrangler.jsonc` | Worker entry (`.open-next/worker.js`), **assets**, **vars**, **routes** (custom domains), **IMAGES**, **WORKER_SELF_REFERENCE**. |
| `.dev.vars` | Local secrets / vars for Wrangler (not committed). Example: `NEXTJS_ENV=development`. |

---

## Environment variables

| Variable | Where | Notes |
|----------|--------|--------|
| `NEXT_PUBLIC_SITE_URL` | `wrangler.jsonc` → `vars`, and/or Cloudflare dashboard | **Must include the scheme**, e.g. `https://danielmilewski.com`. Used in `src/lib/metadata.ts` for `metadataBase`, canonical URLs, and absolute links. A value like `danielmilewski.com` (no `https://`) breaks `new URL(SITE_URL)`. |
| `NEXTJS_ENV` | Optional in `.dev.vars` for local preview | Local only; do not set `development` on production Workers unless you intend to. |
| `RESEND_API_KEY` | Local `.dev.vars`; production secret via `wrangler secret put RESEND_API_KEY` | Required for the contact form. Secret value from Resend dashboard. |
| `RESEND_FROM_EMAIL` | Local `.dev.vars`; production via Wrangler env or dashboard | Sender address for the contact form, e.g. `Daniel Milewski <hello@danielmilewski.com>`. In production this should use a verified Resend domain. |
| `CONTACT_FORM_TO_EMAIL` | Optional local `.dev.vars`; production via Wrangler env or dashboard | Inbox that receives form submissions. Defaults to the personal email configured in `src/lib/metadata.ts` if omitted. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional local `.dev.vars`; production via Wrangler env or dashboard | Public site key for Cloudflare Turnstile. When present together with `TURNSTILE_SECRET_KEY`, the contact form shows a captcha widget and verifies it server-side. |
| `TURNSTILE_SECRET_KEY` | Optional local `.dev.vars`; production secret via `wrangler secret put TURNSTILE_SECRET_KEY` | Secret key for Cloudflare Turnstile verification. Keep this out of git. |

**Wrangler vs dashboard:** `wrangler deploy` treats **`wrangler.jsonc` as source of truth**. If you add routes or vars only in the dashboard, the next CLI deploy can overwrite them. This repo keeps **`routes`** (apex + `www`) and **`vars`** in `wrangler.jsonc` so deploys stay consistent.

**Recommended split of config:**

- Local development: `.dev.vars`
- Production non-secrets: `wrangler.jsonc` → `vars`
- Production secrets: `npx wrangler secret put ...`

For this project, the intended split is:

- `.dev.vars`
  - `NEXTJS_ENV=development`
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `CONTACT_FORM_TO_EMAIL`
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `wrangler.jsonc`
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`
  - `RESEND_FROM_EMAIL`
  - `CONTACT_FORM_TO_EMAIL`
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- Wrangler secret
  - `RESEND_API_KEY`
  - `TURNSTILE_SECRET_KEY`

`NEXT_PUBLIC_CF_ANALYTICS_TOKEN` is optional. If it is missing or left as the placeholder value, the Cloudflare Web Analytics beacon is not rendered.

### Contact form / Resend setup

The contact page now includes a form powered by **Resend** via a Next.js Server Action.

For local development, add these values to `.dev.vars`:

```env
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL="Daniel Milewski <onboarding@resend.dev>"
CONTACT_FORM_TO_EMAIL=danielmilewski123@gmail.com
```

Optional anti-spam protection:

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAA...
TURNSTILE_SECRET_KEY=0x4AAAA...
```

For production on Cloudflare Workers:

1. Set the API key as a secret:
   `npx wrangler secret put RESEND_API_KEY`
2. Set `RESEND_FROM_EMAIL` and optionally `CONTACT_FORM_TO_EMAIL` in `wrangler.jsonc`.
3. Optionally enable anti-spam protection:
   - `npx wrangler secret put TURNSTILE_SECRET_KEY`
   - set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in `wrangler.jsonc`
4. Verify your sending domain in Resend before using a custom `from` address such as `contact@danielmilewski.com`.

On successful submission, the form:

1. sends the inquiry to `CONTACT_FORM_TO_EMAIL`
2. sends a short confirmation email back to the sender

The autoresponse is localized (`en` / `pl`) and is intentionally simple: it only confirms receipt and says that a reply should follow within a few business days.

If both Turnstile keys are configured, the form also requires a successful Cloudflare Turnstile verification before sending.

### Cloudflare Web Analytics

This project supports **Cloudflare Web Analytics** via `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`.

- The beacon is only rendered when the token is real.
- The beacon is only loaded on the real production hostnames (`danielmilewski.com` / `www.danielmilewski.com`), not on `localhost` or preview hosts.
- The placeholder value `REPLACE_WITH_YOUR_TOKEN` is treated as disabled.
- This keeps local development and production-safe defaults simple: no token, no analytics script.

### Privacy / data handling

Current site behavior that must stay reflected in the privacy page:

- Contact form submissions are delivered via **Resend**
- A confirmation email may be sent back to the sender
- Optional anti-spam verification may be handled via **Cloudflare Turnstile**
- The site may use **Cloudflare Web Analytics** for pageviews and basic performance data
- The site uses a functional `NEXT_LOCALE` cookie to remember the selected language

If you later add heavier analytics, event tracking, marketing pixels, or session replay, revisit the privacy copy and consent requirements instead of quietly extending the current setup.

### Testing the contact form

1. Local Next.js dev with `.dev.vars`:
   `npm run dev`
2. Local Worker-like preview with `wrangler.jsonc` + production secrets:
   `npm run preview`
3. Production deploy:
   `npm run deploy`

**Important:** In `next dev`, this project can read Resend env vars from both `process.env` and the Cloudflare dev context. This allows the same contact form action to work correctly with local `.dev.vars` and with Worker-style preview/deploy environments.

**Recommended verification flow:**

1. Test locally with `.dev.vars` via `npm run dev`
2. Test Worker preview via `npm run preview`
3. Deploy with `npm run deploy`
4. Submit a real production test from `/pl/contact` or `/en/contact`

### E2E smoke tests

Playwright smoke tests cover the current high-risk paths:

- home page render
- language switcher
- blog and project detail pages
- contact form submit in a test-only no-delivery mode

Run them with:

```bash
npm run test:e2e
```

**If port 3000 gets stuck during local dev:**

```bash
fuser -k 3000/tcp
```

If Next moved to another port, replace `3000` with the port shown in the terminal.

---

## Deploy to Cloudflare Workers

1. `npx wrangler login`
2. From the repo root: **`npm run deploy`**  
   (runs OpenNext build — including `npm run build` with `prebuild` — then uploads the Worker and assets.)
3. Custom domains are defined in **`wrangler.jsonc`** under `routes` with `custom_domain: true` and `zone_name` (DNS zone on Cloudflare).
4. If Wrangler prints a diff warning, align dashboard settings with `wrangler.jsonc` or rely on the file after deploy.

**Useful links**

- Worker: `https://<worker-name>.<subdomain>.workers.dev` (see Wrangler output).
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)

---

## Local OpenNext / Worker preview

```bash
npm run preview
```

Serves the built Worker locally (Wrangler). Use this to verify behavior close to production without deploying.

---

## Customize the site

### Site URL, name, social links

`src/lib/metadata.ts` — defaults and helpers. Production URL should match **`NEXT_PUBLIC_SITE_URL`** (full `https://` URL).

### Projects (MDX)

`src/content/projects/<slug>.mdx` — frontmatter fields match `src/types/project.ts` (`title`, `featured`, `shortProblem`, `stack`, `content`, etc.). Filename should match `slug`.

### Blog (MDX)

`src/content/blog/<slug>.mdx` — frontmatter per `src/types/post.ts` (`title`, `date`, `excerpt`, `tags`, …). Reading time is generated in `content-data.json`.

### Translations (UI strings)

`src/messages/en.json` and `src/messages/pl.json`. Run **`npm run test`** after edits to keep keys aligned.

### Theme / fonts

- Tokens: `src/app/globals.css` (`@theme`, `.dark`).
- Fonts: `src/app/layout.tsx` (`next/font/local`, committed WOFF2 files under `src/app/fonts/`).

### Navigation

`src/components/layout/Navbar.tsx`, `Footer.tsx`, and message keys under navigation-related namespaces in `messages/*.json`.

### Contact form

- UI: `src/components/contact/ContactForm.tsx`
- Action: `src/app/actions/sendContactMessage.ts`
- Provider: Resend (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, optional `CONTACT_FORM_TO_EMAIL`)

---

## SEO

- Per-route `generateMetadata` where defined; shared helpers in `src/lib/metadata.ts`.
- JSON-LD: `src/lib/schema.ts` (Person, WebSite, BlogPosting, etc.).
- `sitemap.ts` and `robots.ts` at app root.

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| **500** on Worker for `/en` or `/pl` | Stale or missing `content-data.json` for the deployed commit, or old Worker bundle before MDX JSON fix. Run `npm run build` locally, redeploy, ensure MDX changes committed with regenerated JSON. |
| Wrong canonical / OG URLs | `NEXT_PUBLIC_SITE_URL` missing `https://` or out of sync with real domain. |
| Wrangler “differs from dashboard” warning | Deploy updates remote to match `wrangler.jsonc`; keep vars/routes in the file (as in this repo) or re-apply dashboard settings after each deploy if you manage only from UI. |
| Old PR shows failed `ci` check on GitHub | Historical GitHub Actions run. Actions are intentionally disabled in this repo now; ignore old failures unless CI is reintroduced later. |

---

## Optional: deploy on Vercel

Next.js runs on Vercel without OpenNext. You would still need **`prebuild`** to run so `content-data.json` exists (Vercel runs `npm run build` by default, which triggers `prebuild`). Set **`NEXT_PUBLIC_SITE_URL`** in the Vercel project environment. This repo’s primary documented path is **Cloudflare Workers + OpenNext**.
