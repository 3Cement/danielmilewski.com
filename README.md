# Daniel Milewski — Portfolio

Personal portfolio site: Senior Python Developer (AI/LLM, backend, automation). Bilingual **English** (`/en`) and **Polish** (`/pl`).

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | **Next.js 16** (App Router, React 19) |
| Styling | **Tailwind CSS v4** |
| i18n | **next-intl** (middleware + `src/messages/*.json`) |
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
| `npm run preview` | `opennextjs-cloudflare build` + local Worker preview (Wrangler). |
| `npm run deploy` | OpenNext build + `opennextjs-cloudflare deploy` to Cloudflare. |
| `node scripts/generate-content-data.mjs` | Regenerate `content-data.json` only (used by `predev` / `prebuild`). |

---

## How routing and i18n work

- All user-facing pages live under **`src/app/[locale]/`** (`en`, `pl`).
- **`src/middleware.ts`** uses `next-intl/middleware` and `src/i18n/routing.ts` (locales, default `en`, locale detection).
- Visiting `/` redirects to a locale (e.g. `/en`).
- Copy lives in **`src/messages/en.json`** and **`src/messages/pl.json`**. Navigation uses **`src/i18n/navigation.ts`** (`Link`, `redirect`, etc.).
- Root **`src/app/layout.tsx`**: fonts, global metadata base, wraps children. Locale layout **`src/app/[locale]/layout.tsx`**: `NextIntlClientProvider`, navbar, footer, JSON-LD.

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
│   ├── layout.tsx              # Root: fonts, metadata base
│   ├── globals.css
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── icon.tsx, apple-icon.tsx, opengraph-image.tsx
│   └── [locale]/               # All localized routes
│       ├── layout.tsx          # next-intl provider, nav, footer
│       ├── page.tsx            # Home
│       ├── about/, blog/, contact/, main/, privacy/, projects/
│       └── ...
├── components/                 # layout/, home/, blog/, projects/, ui/, mdx/
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
├── middleware.ts
└── types/

open-next.config.ts             # OpenNext Cloudflare config
wrangler.jsonc                  # Worker name, routes, vars, assets, bindings
public/                         # Static files (CVs, images, _headers)
scripts/
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

**Wrangler vs dashboard:** `wrangler deploy` treats **`wrangler.jsonc` as source of truth**. If you add routes or vars only in the dashboard, the next CLI deploy can overwrite them. This repo keeps **`routes`** (apex + `www`) and **`vars`** in `wrangler.jsonc` so deploys stay consistent.

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
- Fonts: `src/app/layout.tsx` (`next/font`).

### Navigation

`src/components/layout/Navbar.tsx`, `Footer.tsx`, and message keys under navigation-related namespaces in `messages/*.json`.

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

---

## Optional: deploy on Vercel

Next.js runs on Vercel without OpenNext. You would still need **`prebuild`** to run so `content-data.json` exists (Vercel runs `npm run build` by default, which triggers `prebuild`). Set **`NEXT_PUBLIC_SITE_URL`** in the Vercel project environment. This repo’s primary documented path is **Cloudflare Workers + OpenNext**.
