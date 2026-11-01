# Release Runbook

| Step | Command or action |
|---|---|
| 1. Check | `npm test && npm run build` |
| 2. Bump version | `npm version patch|minor|major --no-git-tag-version` |
| 3. Footer | Update `v{version}` in `components/SiteFooter.tsx` and `softwareVersion` in `lib/seo.ts` |
| 4. README | Update badges, stack versions and features if they changed |
| 5. Commit | `Release vX.Y.Z` |
| 6. Pull request | Open against `main`, wait for CI |
| 7. Deploy | Merge; Vercel deploys `main` automatically |
| 8. Verify | Open the production URL in both themes and both languages; check `/robots.txt`, `/sitemap.xml`, `/llms.txt` |
