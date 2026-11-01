# Project Standard

<p align="center">
    <i>The single standard for Jorge Calleja's projects: repository structure, README rules, design system and SEO/GEO, with templates ready to copy.</i>
</p>

## Contents

| Path | What it is |
|---|---|
| `CLAUDE.md` | Master standard. Copy to the root of each project and fill in the Project block |
| `docs/structure.md` | Repository layout, module `CLAUDE.md` rules and naming |
| `docs/readme-rules.md` | README section order and formatting (from `cursor-rules.md`) |
| `docs/design-system.md` | Color tokens, layout, typography, components and motion |
| `docs/seo-geo.md` | Metadata, favicon set, robots, sitemap, `llms.txt`, JSON-LD |
| `docs/architecture.md` | Architecture template |
| `docs/decisions/` | Decision record template and the first shared decision |
| `docs/runbooks/` | New project, migrating an existing project, and release |
| `.claude/` | `settings.json`, the `check.sh` hook and the `code-review`, `refactor` and `release` skills |
| `tools/` | Icon generation script and reusable prompts |
| `templates/` | Starter files: `globals.css`, header, footer, toggles, providers, `lib/`, SEO routes, `public/`, CI, README |

## Usage

| Case | Steps |
|---|---|
| **New project** | Follow `docs/runbooks/new-project.md` |
| **Existing project** | Follow `docs/runbooks/migrate-existing.md`, one commit per step |
| **Asking Claude or Cursor** | Point it to `CLAUDE.md`; it references the rest |

## Sources

Tokens and components were extracted from `CallejaJ/printallpdfs` and `CallejaJ/route-planner-andalucia`, which share the same palette, header, footer and 1600 px layout.

---

Built for Diseño Web Málaga projects.
