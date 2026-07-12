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
| `effects/` | Portable motion/scroll: `marquee`, `use-marquee`, `flip-fade-text`, `page-scroll-line` |
| `ui/` | `button`, `link`, `image`, `typography`, `container`, section label/divider |

Import: `@/components/menu/latest-menu-section` (not a flat root).

## Name by capability (required)

- Shared components: name for **what they do** (`PageScrollLine`, `ScrollLineRegion`, `PageHeader`), not **where first used** (`HomeBelowHero`, `MenuPageShell`).
- Make them **props-driven** (color, path, `as`, className) so any page can compose them.
- Domain folders hold domain UI only; generic chrome lives in `ui/` / `effects/` / `layout/`.
- If two routes need the same wrapper, **one** shared component + page composition — never two thin shells.

## Steps when adding a section

1. Put copy/lists in `src/data/` or `src/lib/constants.ts` if reused.
2. Prefer composing existing shared primitives before creating a new file.
3. Create `src/components/<domain>/<section-name>.tsx` only for domain-specific UI.
4. Mark `"use client"` only if the section needs state, effects, or Motion.
5. Import into thin `page.tsx` (or layout if global chrome).
6. Prefer `Button` / `Link` / `Heading` / `Paragraph` / `Container` / `ScrollLineRegion` from shared modules.

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
| `PageScrollLine` + `ScrollLineRegion` | Scroll-drawn decorative line (`svg-scroll-draw`); region wraps any band of content |

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

## Extract only when repeated

Do **not** create a component for static JSX used once. Extract when:

- Pattern appears **2+ times**, or
- It is a design-system primitive, or
- It is non-trivial interactive and would bloat the parent

Inline single-use static helpers; delete dead/unused files and thin re-exports.  
See skill **`extract-when-repeated`** and `.grok/rules/structure.md`.

## Anti-patterns

- Monolithic `page.tsx`
- Hardcoding phone/address outside `lib/constants.ts`
- `"use client"` on static-only files
- Nesting full-viewport fixed menus inside blurred sticky headers
- Duplicating marquee logic outside `effects/`
- Reintroducing a Moments section when videos belong in gallery
- One-off static markup forced into its own file “for cleanliness”
- Duplicate primitives (e.g. Eyebrow + SectionLabel with the same styles)
- Place-named shells that only wrap a shared primitive (`HomeBelowHero`, `MenuPageShell`)
- Tying portable effect names to one route (`MenuScrollVine` for a generic line)
