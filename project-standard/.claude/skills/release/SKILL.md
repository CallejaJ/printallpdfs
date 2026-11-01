---
name: release
description: Prepare a release of the project (version bump, footer version, README, checks, pull request). Use when asked to release, publish or bump the version.
---

# Release

Follow `docs/runbooks/release.md`:

1. Ask which bump (patch, minor, major) if not given; default to patch.
2. Run `npm test` and `npm run build`; stop if either fails.
3. `npm version <bump> --no-git-tag-version`.
4. Update the version in `components/SiteFooter.tsx` (`v{version}`) and `softwareVersion` in `lib/seo.ts`. Keep the Beta label while the project is in beta.
5. Update README badges and Technology Stack versions if dependencies changed.
6. Commit `Release vX.Y.Z` on a branch and open a pull request with a short changelog table: Change | Area.
7. After merge, verify production: both themes, both languages, `/robots.txt`, `/sitemap.xml`, `/llms.txt`.
