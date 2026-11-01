# New Project Runbook

| Step | Action |
|---|---|
| 1 | Create the repo in kebab-case and run `npx create-next-app@latest --ts --app --no-tailwind --no-src-dir --import-alias "@/*"` |
| 2 | `npm i motion` and `npm i -D jest ts-jest @types/jest playwright` |
| 3 | Copy `project-standard/CLAUDE.md` to the root and fill in the Project block |
| 4 | Copy `project-standard/templates/*` over the project (app, components, lib, public, .github) |
| 5 | Copy `project-standard/.claude/` and `project-standard/docs/` (keep the templates, delete the examples) |
| 6 | Replace `ProjectName`, `project-name`, accent word and URLs in `lib/site.ts`, `lib/seo.ts`, `SiteHeader.tsx`, `site.webmanifest`, `llms.txt` |
| 7 | Generate the favicon set from `public/favicon.svg` (`tools/scripts/icons.mjs` pattern) and an `og.png` 1200×630 |
| 8 | Write the README from `templates/README.md` |
| 9 | Connect the repo to Vercel and set env vars from `.env.example` |
