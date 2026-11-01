# lib Module

- Framework-free logic: no React imports except `i18n.tsx`.
- `strings.ts` holds every UI string in `en` and `es`; adding a key to one language without the other is a type error.
- `site.ts` is the only place for the URL, brand, version, author and geo data.
- Every exported function with logic has a test in `__tests__/`.
