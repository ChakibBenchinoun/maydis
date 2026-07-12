# Structure rules

When editing `apps/website`:

1. Keep `app/**/page.tsx` thin — compose imported section components.
2. Put new UI in `src/components/` as kebab-case files (one concern each).
3. Put site-wide strings (brand, phone, nav, social, hours) in `src/lib/constants.ts`.
4. Put menu/gallery/reviews content in `src/data/`.
5. Use `"use client"` only for state, effects, Motion, or browser APIs.
6. Do not reintroduce a monolithic home page component.
7. Prefer `lib/images.ts` paths over hardcoding `/images/...` in chrome sections (navbar, hero).
8. Full-page mobile overlays: render as a **sibling** of the sticky header bar (not inside a `backdrop-blur` / `backdrop-filter` parent), or fixed positioning will break and the panel can look transparent. Use an opaque `backgroundColor: var(--background)`.
9. Motion: reuse ease `[0.22, 1, 0.36, 1]`; respect `prefers-reduced-motion` for Ken Burns / loops.
10. Nav hierarchy: section anchors + secondary links as text; **Reserve** as primary pill CTA; Instagram icon-only on desktop when space is tight.
