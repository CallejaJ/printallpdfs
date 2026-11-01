# ProjectName

<div align="center">
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Motion-12-FFF312?style=for-the-badge&logo=framer&logoColor=black" alt="Motion" />
    <img src="https://img.shields.io/badge/Jest-30-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
    <img src="https://img.shields.io/badge/Playwright-E2E-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
    <img src="https://img.shields.io/badge/Vercel-Hosting-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<p align="center">
    <i>One-sentence description of what the project does and what makes it distinct.</i>
</p>

## [Core Domain Concept]

Brief intro to the domain concept (2 to 3 sentences).

| Entity | Attribute 1 | Attribute 2 | Attribute 3 |
|---|---|---|---|
| **Name** | value | value | value |
| **Name** | value | value | value |

## [Feature Section]

Brief explanation of the feature and its design rationale (2 to 4 sentences), with file paths and function names where useful.

| Behavior | Detail |
|---|---|
| **Item** | Description |

## System Architecture

| Component | Role |
|---|---|
| **App shell** (`app/layout.tsx`) | Metadata, theme script, JSON-LD, language and motion providers |
| **UI components** (`components/`) | Glass header, footer, toggles and feature components |
| **Core logic** (`lib/`) | Framework-free functions covered by unit tests |
| **Hosting** | Static export served by Vercel |

## Technology Stack

- **Frontend**: Next.js 16 (App Router, static export), React 19, TypeScript 5.5
- **Animation**: Motion 12
- **Styling**: Global CSS with design tokens, dark and light themes
- **Testing**: Jest 30 with ts-jest, Playwright for E2E
- **Deployment**: Vercel

## Key Features

1. **Feature name** — value proposition in one sentence
2. **Feature name** — value proposition in one sentence
3. **Bilingual interface** — Spanish and English with the choice remembered per browser
4. **Dark and light themes** — follows the system preference and remembers the user's choice
5. **Search and AI ready** — structured data, sitemap, robots rules for AI crawlers and `llms.txt`

## Testing Strategy

Describe how the project is tested (2 to 4 sentences): Jest unit tests in `lib/__tests__/`, Playwright E2E tests in `tests/e2e/`, and CI running `npm test` and `npm run build` on every pull request.

## Localization

Strings live in `lib/strings.ts` as `en` and `es` dictionaries with identical keys, enforced by TypeScript. `LanguageProvider` defaults to English, restores the stored choice from `localStorage`, and updates `<html lang>`.

## Project Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local`:

   ```env
   # Site
   NEXT_PUBLIC_SITE_URL=https://project-name.vercel.app
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000`

---

Built for [Platform / Ecosystem].
