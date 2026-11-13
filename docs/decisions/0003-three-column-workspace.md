# 0003. Three-Column Workspace

- **Date**: 2026-11-13
- **Status**: Accepted

## Context

On wide screens the workspace had two columns: files on the left (1.4fr) and every print setting plus the totals and actions on the right. With an empty or short queue the files card stayed short and wide, and a large empty area opened under it next to the tall options card. Jorge found the files card width unbalanced and suggested adding a column.

## Decision

Split the right column in two. `PrintOptions` keeps order, batches, duplex and copies. A new `PrintJob` panel holds the totals, size warning, batch list, print and download buttons, status and the privacy note. Layout by width:

| Width | Layout |
|---|---|
| **> 1280 px** | Files, options and job side by side (`1.25fr 1fr 0.85fr`); the job column sticks under the header |
| **901 to 1280 px** | Files across the full width, options and job below in two columns |
| **≤ 900 px** | One column, same order as before |

## Alternatives

| Option | Why not |
|---|---|
| **Narrow the files column only** | Leaves the tall options card and the empty area under the files |
| **Two columns inside the options card** | Crowds the segmented controls and hides the print button low on the card |

## Consequences

- The print button sits near the top of the page and stays visible while scrolling a long queue
- Element ids used by the E2E tests are unchanged
