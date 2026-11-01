# Migrating an Existing Project

Apply in this order, one commit per row, so each step can be reviewed and reverted alone.

| Step | Commit message | What changes |
|---|---|---|
| 1 | `Add project CLAUDE.md and docs skeleton` | `CLAUDE.md`, `docs/architecture.md`, `docs/decisions/`, `.claude/` |
| 2 | `Align design tokens with the shared design system` | `:root` and light-theme blocks in `globals.css` |
| 3 | `Match shared layout width and header` | 1600 px frame, 40 px padding, glass header, Beta badge, toggles |
| 4 | `Add shared footer` | `© year · Diseño Web Málaga · vX · Beta` |
| 5 | `Add favicon set and web manifest` | Icons and `site.webmanifest` |
| 6 | `Add SEO and GEO` | Metadata, robots, sitemap, `llms.txt`, JSON-LD, breadcrumbs |
| 7 | `Rewrite README to the shared structure` | README per `docs/readme-rules.md` |
| 8 | `Add CI workflow` | `.github/workflows/test.yml` |
