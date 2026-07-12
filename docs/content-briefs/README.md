# Content briefs

Templates for the next case studies and blog posts, requested by the SEO/design
audit (`docs/content-briefs` is the biggest remaining lever — see the audit
report artifact for the full reasoning).

These files are **not** inside `src/content/`, so they are never picked up by
`scripts/generate-content-data.mjs` and can never accidentally ship as thin,
half-empty pages. They only become real pages once you fill them in and move
them.

## Workflow

1. Copy `case-study-template.mdx` (or `blog-post-template.mdx`) to
   `src/content/projects/<slug>.mdx` (or `src/content/blog/<slug>.mdx`).
2. Replace every `<<...>>` placeholder with real facts. Delete any bracketed
   guidance comments once you've used them — they're prompts, not content.
3. Write the Polish version as `<slug>.pl.mdx` in the same folder. It doesn't
   need to be a literal translation — match the tone, but write it the way
   you'd actually say it in Polish (see the existing `demarestudio.pl.mdx` /
   `investtracker.pl.mdx` for the level of adaptation that's normal here).
4. Run `npm run dev` or `npm run build` once locally — this regenerates
   `src/generated/content-data.json` from the new `.mdx` files.
5. Commit both the new `.mdx` files **and** the regenerated
   `content-data.json` together (per the main `README.md`).
6. If it's a project: decide `featured` / `featuredRank`, and whether it
   should link to a related blog post via `relatedPostSlugs`. If it's a post:
   set `relatedProjectSlugs` if it's a natural companion to a case study.
7. Ping me (or hand me the filled-in `.mdx`) and I'll proofread, wire up any
   cross-links, and double check metadata/SEO before it ships.

## Why this exists

The audit (and the site's own `TODO.md`) both flag the same thing: only 2
case studies and 3 posts exist per language, and that's the single biggest
gap versus the peer sites that were researched (Grinberg, Janetakis, Schlawack,
Willison, Yan) — all of whom win on the depth and specificity of real
technical writing, not on visual polish. I can't write these for you because
I don't have the real facts (what broke, what you tried, what the actual
numbers were) — but I can make sure the moment you do, it ships correctly:
right frontmatter, right structured data, right internal links, no format
guessing.
