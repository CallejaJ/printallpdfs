# Architecture

<!-- Template. Copy to each project's docs/architecture.md and fill it in. Tables, no diagrams. -->

## Overview

Two to four sentences: what runs where (browser, Vercel functions, external APIs) and why.

## Components

| Component | Location | Role |
|---|---|---|
| **App shell** | `app/layout.tsx` | Metadata, theme script, JSON-LD, providers, header and footer |
| **Page** | `app/page.tsx` | Main screen |
| **UI components** | `components/` | Header, footer, toggles and feature components |
| **Core logic** | `lib/` | Framework-free functions covered by unit tests |
| **API** | `app/api/` | Server routes (only when the project needs secrets or server work) |

## Data Flow

| Step | From | To | Data |
|---|---|---|---|
| 1 | User | Component | Input |
| 2 | Component | `lib/` function | Parsed data |
| 3 | `lib/` | UI | Result |

## External Services

| Service | Used for | Key | Where it is restricted |
|---|---|---|---|
| **Vercel** | Hosting and analytics | none | n/a |

## Constraints

- Constraint and the reason for it (browser limits, quotas, privacy).
