# 0002. Hide Visible Breadcrumbs

- **Date**: 2026-11-07
- **Status**: Accepted

## Context

The page intro showed the trail "Jorge Calleja › PrintAllPDFs" above the legend. Jorge asked to stop showing it on screen, while the trail still helps screen readers and search engines understand the site hierarchy.

## Decision

Keep the `Breadcrumbs` component and the `BreadcrumbList` structured data, but hide the trail visually with a screen-reader-only style on `.breadcrumbs`.

## Alternatives

| Option | Why not |
|---|---|
| **Delete the component** | Loses the accessible trail and leaves `BreadcrumbList` without matching markup |
| **`display: none`** | Also hides the trail from screen readers |

## Consequences

- The page intro starts directly with the legend
- The master standard still shows breadcrumbs; this project deviates on purpose
