# Structure rules

When editing `apps/website`:

1. Keep `app/**/page.tsx` thin — compose imported section components.
2. Put new UI in `src/components/` as kebab-case files (one concern each).
3. Put site-wide strings (brand, phone, nav, social, hours) in `src/lib/constants.ts`.
4. Put menu/gallery/reviews content in `src/data/`.
5. Use `"use client"` only for state, effects, Motion, or browser APIs.
6. Do not reintroduce a monolithic home page component.
