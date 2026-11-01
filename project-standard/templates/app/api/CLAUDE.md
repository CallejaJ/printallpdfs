# API Module

<!-- Example module note. Keep only when the project has server routes. Under 40 lines. -->

- Routes here run on Vercel functions; everything else in the app is static.
- Server-only keys (no `NEXT_PUBLIC_` prefix) are read only in this folder and never returned to the client.
- Validate every request body and return `400` with a short English message on bad input.
- Apply the rate limit helper from `lib/rateLimit.ts` to every public route.
- Each route has a Jest test in `__tests__/route.test.ts` that mocks external APIs.
