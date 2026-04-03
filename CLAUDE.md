**DEFAULT: implement directly. No agents, no planning, no maister — unless explicitly asked or task spans 5+ files.**

## Execution Strategy

- **Simple tasks** (≤2 files or ≤50 LOC): implement directly, no orchestration
- **Medium tasks** (3–5 files): minimal planning, no orchestration
- **Large tasks** (5+ files or architecture changes): orchestration allowed — but ASK first

## Maister — only on explicit request

Before invoking any maister orchestrator, ASK the user. Never auto-start.
Use only when user types `/maister:...` or confirms after being asked.

## Next.js

This version has breaking changes — APIs, conventions, and file structure may differ from training data.
Read `node_modules/next/dist/docs/` before writing any Next.js code. Heed deprecation notices.

## Project docs

`.maister/docs/INDEX.md` — read manually only for medium/large tasks, not for simple fixes.
