# Daniel Milewski — Portfolio

Personal portfolio website for a Senior Python Developer specializing in AI/LLM applications, backend engineering, and automation.

**Tech stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · MDX · Vercel

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # lint check
```

---

## Project structure

```
src/
├── app/                  Pages (App Router)
│   ├── page.tsx          Home
│   ├── projects/         Projects index + [slug] case studies
│   ├── blog/             Blog index + [slug] posts
│   ├── about/            About page
│   ├── contact/          Contact page
│   ├── sitemap.ts        Auto-generated sitemap
│   └── robots.ts         robots.txt
├── components/
│   ├── layout/           Navbar, Footer
│   ├── home/             Home page sections
│   ├── projects/         ProjectCard, ProjectGrid, CaseStudySection
│   ├── blog/             BlogCard, TableOfContents
│   └── ui/               Tag, SocialLinks, ContactCTA, ThemeToggle
├── content/
│   ├── projects/         *.mdx — project case studies
│   └── blog/             *.mdx — blog posts
├── lib/
│   ├── content.ts        MDX content loading helpers
│   ├── metadata.ts       SEO helpers + site constants
│   ├── schema.ts         JSON-LD schema builders
│   ├── headings.ts       Blog ToC heading extractor
│   └── utils.ts          cn() helper
└── types/
    ├── project.ts
    └── post.ts
```

---

## Where to customize

### Personal info, social links, SEO defaults

Edit `src/lib/metadata.ts`:

```ts
export const SITE_URL = "https://danielmilewski.dev";   // your domain
export const SITE_NAME = "Daniel Milewski";
export const GITHUB_URL = "https://github.com/3Cement";
export const LINKEDIN_URL = "https://www.linkedin.com/in/daniel-milewski/";
export const EMAIL = "hello@danielmilewski.dev";
```

### Projects

Add or edit files in `src/content/projects/`. Each file is an MDX document with frontmatter:

```yaml
---
title: "Project Title"
slug: "project-slug"           # must match the filename
featured: true                 # shown on home page if true
shortProblem: "..."
shortSolution: "..."
stack: ["Python", "FastAPI"]
role: "Backend Engineer"
outcome: "..."
overview: "..."
repo: "https://github.com/..."   # optional
demo: "https://..."              # optional
relatedSlugs: ["other-slug"]     # optional
---

Your MDX content here...
```

### Blog posts

Add or edit files in `src/content/blog/`. Frontmatter:

```yaml
---
title: "Post Title"
slug: "post-slug"              # must match the filename
date: "2024-11-15"             # ISO format, used for sorting
excerpt: "Short description shown in cards and meta."
tags: ["Python", "FastAPI"]
---

Your MDX content here...
```

Reading time is computed automatically from the content.

### Colors and fonts

Colors are defined as CSS custom properties in `src/app/globals.css` inside `@theme inline { ... }`. Dark mode values are in `.dark { ... }`. Change `--color-accent` to update the brand color throughout the site.

Fonts are loaded via `next/font` in `src/app/layout.tsx`. Swap `Geist` for any Google Font by changing the import.

### Navigation links

Edit the `navLinks` array in `src/components/layout/Navbar.tsx` and the `footerLinks` array in `src/components/layout/Footer.tsx`.

### Hero copy and expertise grid

- Hero text: `src/components/home/Hero.tsx`
- Capability strip: `src/components/home/CredibilityStrip.tsx`
- Expertise blocks: `src/components/home/ExpertiseGrid.tsx`
- About preview: `src/components/home/AboutPreview.tsx`

### About page

Edit `src/app/about/page.tsx` — inline content (bio, timeline, tech stack). No MDX needed here.

---

## Deploy to Vercel

1. Push to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. No build configuration needed — Vercel detects Next.js automatically.
4. Set `NEXT_PUBLIC_SITE_URL` in Vercel environment variables to your production domain.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Your production URL, e.g. `https://danielmilewski.dev` |

---

## SEO

- Each route exports `generateMetadata()` with title, description, canonical, Open Graph, and Twitter Card tags.
- `layout.tsx` injects `Person` and `WebSite` JSON-LD on every page.
- Blog posts inject `BlogPosting` schema; project pages inject `SoftwareSourceCode` schema.
- `/sitemap.xml` and `/robots.txt` are auto-generated from content.
- Update `SITE_URL` in `src/lib/metadata.ts` before deploying.

---

## Content workflow

1. Write a new project case study → add `src/content/projects/my-project.mdx`
2. Write a new blog post → add `src/content/blog/my-post.mdx`
3. Run `npm run build` to verify everything compiles cleanly.
4. Deploy via `git push` — Vercel builds automatically.
