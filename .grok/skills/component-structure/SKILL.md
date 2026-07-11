---
name: component-structure
description: >
  Extract and organize React/Next.js UI into thin pages, section components, data modules,
  and lib helpers (beauty-salon style). Use when refactoring, extracting components,
  structuring a new page/section, cleaning a monolithic App/page file, or when the user
  mentions component structure, composition, or /component-structure.
---

# Component structure workflow

Apply this whenever building or refactoring UI in the Maydis monorepo (and similar Next apps).

## Goals

- Same behavior and visuals
- Thin routes, extracted sections, reusable primitives
- Clear split: **app (compose)** · **components (UI)** · **data (content)** · **lib (helpers)**

## Target layout

```
src/app/**/page.tsx          → compose sections only
src/app/layout.tsx           → fonts, Navbar, Footer, global CSS
src/components/<name>.tsx    → one section or UI concern each (kebab-case)
src/data/*.ts                → typed static content (no React)
src/lib/constants.ts         → site-wide config (name, phone, nav, social)
src/lib/*.ts                 → fonts, scroll, utils
```

## Steps when adding a section

1. Put copy/lists in `src/data/` or `src/lib/constants.ts` if reused.
2. Create `src/components/<section-name>.tsx` (e.g. `menu-section.tsx`).
3. Mark `"use client"` only if the section needs state, effects, or Motion.
4. Import the section into the thin `page.tsx` (or layout if global chrome).
5. Do **not** leave multi-section JSX inside a single page file.

## Steps when refactoring a monolith

1. Identify sections (hero, menu, gallery, footer, …) and shared primitives.
2. Extract data first (`data/`, `lib/constants.ts`).
3. Extract pure presentational pieces (labels, ratings, cards).
4. Extract stateful sections (menu tabs + modal, sticky nav).
5. Replace the monolith with a page that only composes imports.
6. Run `pnpm website:build` and confirm visuals/interactions unchanged.

## Rules of thumb

| Put it here | When |
|-------------|------|
| `app/.../page.tsx` | Routing + composition only |
| `components/` | JSX UI for a single concern |
| `data/` | Arrays/objects of content used by UI |
| `lib/constants.ts` | Brand, nav links, contact, hours |
| `lib/` | Fonts, helpers, non-UI logic |

- Prefer **named exports**.
- File names: **kebab-case**.
- Preserve Tailwind classNames and Motion animation props during extraction.
- Avoid porting unused UI kits “just in case”.

## Anti-patterns

- 500+ line `page.tsx` / `home-page.tsx` with every section inline
- Hardcoding site phone/address in multiple components instead of `lib/constants.ts`
- `"use client"` on a file that only renders static markup
- Mixing fetch/business logic inside presentational section components without a `lib/` boundary
