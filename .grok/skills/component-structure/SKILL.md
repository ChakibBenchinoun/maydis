---
name: component-structure
description: >
  Extract and organize React/Next.js UI into thin pages, section components, data modules,
  and lib helpers (beauty-salon / Maydis style). Use when refactoring, extracting components,
  structuring a new page/section, cleaning a monolithic App/page file, or /component-structure.
---

# Component structure workflow

Apply this whenever building or refactoring UI in the Maydis monorepo (and similar Next apps).

## Goals

- Same behavior and visuals (unless the task is a redesign)
- Thin routes, extracted sections, reusable primitives
- Clear split: **app (compose)** · **components (UI)** · **data (content)** · **lib (helpers)**

## Target layout

```
src/app/**/page.tsx                    → compose sections only
src/app/layout.tsx                     → fonts, Navbar, Footer, global CSS
src/components/<domain>/<name>.tsx     → feature folders (kebab-case files)
src/data/*.ts                          → typed static content (no React)
src/lib/constants.ts                   → site-wide config + section copy
src/lib/*.ts                           → fonts, scroll, menu helpers, cn
```

### Component domains (Maydis)

| Folder | Examples |
|--------|----------|
| `layout/` | `navbar`, `footer` |
| `hero/` | `hero` |
| `menu/` | latest + full menu, grid, card, modal, swipe carousel, scroll row |
| `gallery/` | section, marquee, item modal — **photos + videos** (no Moments section) |
| `about/`, `reviews/`, `visit/`, `qr/`, `reserve/` | feature sections |
| `effects/` | `marquee`, `use-marquee`, `flip-fade-text` |
| `ui/` | `button`, `link`, `image`, `typography`, `container`, section label/divider |

Import: `@/components/menu/latest-menu-section` (not a flat root).

## Steps when adding a section

1. Put copy/lists in `src/data/` or `src/lib/constants.ts` if reused.
2. Create `src/components/<domain>/<section-name>.tsx`.
3. Mark `"use client"` only if the section needs state, effects, or Motion.
4. Import into thin `page.tsx` (or layout if global chrome).
5. Prefer `Button` / `Link` / `Heading` / `Paragraph` / `Container` from `@/components/ui`.

## UI kit (required for CTAs)

- **Button** / **Link** — shared variants; **mobile-compact** sizes by default.
- **Link** supports `external` for off-site URLs.
- **Image** — Next Image or `mode="native"`.
- **Typography** — `Heading`, `Paragraph`, `Eyebrow`.
- **Container** — `max-w-7xl` + `px-6 md:px-10` (same as navbar).

## Motion primitives (`effects/`)

| Primitive | Use |
|-----------|-----|
| `Marquee` + `useMarquee` | Horizontal GPU strip; `interactive` for wheel/drag; `direction` left/right |
| `FlipFadeText` | Cycling title; **grid-size all words** so block size never jumps (prod fonts) |

- Gallery dual rows: two `Marquee`s, opposite `direction`, `interactive={false}` but tiles still clickable.
- Menu large-screen row: `Marquee` with `interactive`.
- Ease of record: `[0.22, 1, 0.36, 1]`.

## Product patterns (Maydis)

1. **Home menu** — `LatestMenuSection` + `pickLatestMenuItems()`; no category tabs.
2. **Full menu** — `/menu` only: `MenuSection` + tabs + grid.
3. **Gallery** — photos + videos in `data/gallery.ts`; lightbox `GalleryItemModal` (like menu modal). **No Moments section.**
4. Always-on rules: `.grok/rules/structure.md`, `ui-polish.md`, `database.md`.

## Formatting

- Prettier: import sort (`@ianvs/prettier-plugin-sort-imports`) + Tailwind class order (`prettier-plugin-tailwindcss` last).
- `pnpm website:format`

## Anti-patterns

- Monolithic `page.tsx`
- Hardcoding phone/address outside `lib/constants.ts`
- `"use client"` on static-only files
- Nesting full-viewport fixed menus inside blurred sticky headers
- Duplicating marquee logic outside `effects/`
- Reintroducing a Moments section when videos belong in gallery
