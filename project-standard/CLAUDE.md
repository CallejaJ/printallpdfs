# Jorge Calleja Project Standard

This file is the master standard for every project by **Jorge Calleja** (Diseño Web Málaga). Copy it into the root of a new project as `CLAUDE.md`, fill in the **Project** block, and delete what does not apply. When modifying an existing project, bring it closer to this standard in the same change only when the change touches that area; larger migrations go in their own commit.

It unifies four sources:

| Source | What it defines | Detailed rules |
|---|---|---|
| **Repository structure** | Folders, `CLAUDE.md` per module, `.claude/` skills and hooks | `docs/structure.md` |
| **README rules** | Section order and formatting of every `README.md` | `docs/readme-rules.md` |
| **Design system** | Colors, layout, header, footer, toggles, buttons, motion | `docs/design-system.md` |
| **SEO and GEO** | Metadata, favicon set, robots, sitemap, `llms.txt`, JSON-LD | `docs/seo-geo.md` |

Reference implementations: `CallejaJ/printallpdfs` and `CallejaJ/route-planner-andalucia`. When this file and those repos disagree, this file wins and the repo should be updated.

---

## Project

<!-- Fill this block in every project. Keep it under 15 lines. -->

- **Name**: ProjectName (brand name, PascalCase words, e.g. `PrintAllPDFs`)
- **Purpose**: One sentence on what it does and for whom.
- **URL**: https://project-name.vercel.app
- **Status**: Beta | Stable
- **Version**: 0.1.0 (shown in the footer, kept in sync with `package.json`)
- **Languages**: ES + EN
- **Module notes**: see `CLAUDE.md` inside each module folder

## Working Rules

- **Language**: talk to Jorge in Spanish. Code, comments, commit messages, README and docs are written in **English**. UI strings exist in both languages.
- **Commits**: imperative sentence in English, capitalized, no prefix, no trailing period (`Add favicon.ico, PNG app icons and web manifest`). One logical change per commit.
- **Branches**: work on a feature branch and open a pull request; never push straight to `main` unless Jorge asks.
- **Before pushing**: run `npm test` and `npm run build` (the build also type-checks). Both must pass.
- **Scope**: do what was asked. Do not add libraries, sections or features that the standard does not list without asking.
- **Decisions**: any choice that changes architecture, a dependency or the design system gets a short record in `docs/decisions/` (see `docs/decisions/0000-template.md`).
- **Secrets**: never commit `.env*` files except `.env.example`. Browser keys use `NEXT_PUBLIC_` and must be restricted by referrer; server keys stay server-side.

## Default Stack

| Layer | Choice | Notes |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | `output: "export"` when the app has no server code |
| **UI** | React 19 + TypeScript 5 (strict) | Path alias `@/*` to the project root |
| **Animation** | Motion 12 (`motion/react`) | Wrapped in `MotionProvider` with `reducedMotion="user"` |
| **Styling** | One global stylesheet `app/globals.css` with CSS variables | No Tailwind, no CSS-in-JS, no UI kit |
| **i18n** | Own `LanguageProvider` + `lib/strings.ts` | Default `en`, stored in `localStorage("lang")` |
| **Testing** | Jest 30 + ts-jest for logic, Playwright for E2E | Tests live next to the code in `__tests__/` |
| **CI** | GitHub Actions: `npm ci`, `npm test`, `npm run build` on Node 22 | `.github/workflows/test.yml` |
| **Hosting** | Vercel | `vercel.json` with `nosniff` and `no-referrer` headers |
| **Analytics** | Vercel Analytics, optional Google Analytics | Only when the project needs it |

## Repository Layout

```
project/
├── CLAUDE.md                 # this file, filled in
├── README.md                 # follows docs/readme-rules.md
├── .env.example              # every variable, grouped and commented
├── docs/
│   ├── architecture.md       # components, data flow, external services
│   ├── decisions/            # one ADR per decision: 0001-short-title.md
│   └── runbooks/             # deploy, release, incident and setup guides
├── .claude/
│   ├── settings.json         # permissions and hooks
│   ├── hooks/                # scripts called by hooks (check.sh)
│   └── skills/
│       ├── code-review/SKILL.md
│       ├── refactor/SKILL.md
│       └── release/SKILL.md
├── tools/
│   ├── scripts/              # one-off and maintenance scripts
│   └── prompts/              # reusable prompts (LinkedIn posts, covers, copy)
├── app/                      # Next.js routes, layout, globals.css, robots.ts, sitemap.ts
├── components/               # UI components, one per file, PascalCase
├── lib/                      # framework-free logic, strings, site config, SEO
│   └── CLAUDE.md             # module notes when the module has rules of its own
├── public/                   # favicon set, og.png, llms.txt, site.webmanifest, images/
└── tests/                    # E2E tests and the static test server
```

The `src/api/` and `src/persistence/` folders from the generic layout map to `app/api/` and `lib/` in Next.js projects. Add a `CLAUDE.md` inside a module only when that module has rules a newcomer would get wrong; keep each under 40 lines. Full rules in `docs/structure.md`.

## Design Rules (summary)

- **Palette**: slate backgrounds and turquoise accent. Dark theme is the default; light theme via `html[data-theme="light"]`. Use only the tokens in `docs/design-system.md`; never hard-code a color in a component.
- **Background**: dot grid on `body` (`radial-gradient` of `--grid-dot`, 16 px).
- **Layout**: content width `max-width: 1600px`, side padding `40px` (16 px under 640 px). Header, page intro, main and footer share that frame.
- **Header**: sticky glass bar with logo, brand name with the accent part in `--accent`, **Beta** badge, then the ES/EN toggle and the theme toggle on the right.
- **Page intro**: breadcrumbs (Jorge Calleja › Project) and a one-paragraph legend under the header.
- **Footer**: `© {year} · Diseño Web Málaga · v{version} · {Beta label}`, with "Diseño Web Málaga" linking to `https://jorgecalleja.dev`.
- **Shapes**: radius 12 px on panels, 8 to 10 px on inputs and rows, `999px` on pills, badges and primary buttons.
- **Primary button**: turquoise gradient pill; on hover, the Google-colors conic border spins (`--gmaps-angle`).
- **Motion**: subtle springs on mount and toggles; everything respects `prefers-reduced-motion`.
- **Font**: system stack (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`). No web fonts.

Copy `templates/` to start: it holds `globals.css`, the header, footer, toggles, motion provider, `lib/site.ts`, `robots.ts`, `sitemap.ts`, `site.webmanifest` and `llms.txt`.

## SEO and GEO Rules (summary)

Every public project ships: full `metadata` in `app/layout.tsx` (title template, description, canonical, Open Graph 1200×630 `og.png`, Twitter card, robots), geo meta tags for Málaga (`ES-AN`), the full favicon set (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`), `app/robots.ts` allowing search and AI crawlers, `app/sitemap.ts`, `public/llms.txt`, and a JSON-LD `@graph` with `WebSite`, `Person`, the app type, `BreadcrumbList` and, when there is content for it, `HowTo` and `FAQPage`. Details in `docs/seo-geo.md`.

## README Rules (summary)

Title = brand name, 6 to 10 shields.io `for-the-badge` badges, one-line italic tagline, then: domain concept sections (tables), feature sections, **System Architecture** (Component | Role table), **Technology Stack**, **Key Features** (numbered, 5 to 10), **Testing Strategy**, **Localization**, **Project Setup**, and a `Built for X` footer. No Mermaid, no emoji, no marketing words. Details in `docs/readme-rules.md`.

## Definition of Done

- [ ] `npm test` and `npm run build` pass
- [ ] UI works in dark and light themes and in ES and EN
- [ ] Layout checked at 1600 px, 900 px, 640 px and 375 px wide, no horizontal scroll
- [ ] New strings added to both languages in `lib/strings.ts`
- [ ] README updated if a feature, stack item or setup step changed
- [ ] Footer version and `package.json` version match when releasing
- [ ] Decision record added if architecture, dependencies or design tokens changed
