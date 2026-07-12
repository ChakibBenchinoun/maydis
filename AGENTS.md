# Maydis — Agent Guidelines

Conventions for coding agents working in this monorepo.

## Stack

- Monorepo: pnpm + Turborepo
- Website: Next.js 16 App Router (`apps/website`)
- Styling: Tailwind CSS v4 + `src/styles/theme.css` tokens (do not invent a new palette)
- Animations: `motion` (`motion/react`)
- Icons: `lucide-react`

## Commands

```bash
pnpm website:dev           # Next dev server
pnpm website:build         # Production build
pnpm typecheck             # Turbo typecheck
pnpm website:lint            # ESLint
pnpm website:format          # Prettier: import order + Tailwind class sort
pnpm website:format:check    # Prettier check only
pnpm website:format:fix      # format then eslint --fix
```

## Formatting & import order

Config: `apps/website/prettier.config.mjs`

| Concern | Tool |
|---------|------|
| **Import order** | `@ianvs/prettier-plugin-sort-imports` — types → react/next → packages → blank → `@/` → blank → relative |
| **Tailwind classes** | `prettier-plugin-tailwindcss` (must be **last** plugin) — stylesheet `src/styles/tailwind.css` (v4) |

Run `pnpm website:format`. Enable Prettier format-on-save in the editor for automatic class + import sorting.

## Project structure (`apps/website`)

Follow the **beauty-salon** style of composition:

```
src/
  app/                  # Routes only — thin pages that compose sections
    layout.tsx          # Shell: fonts, Navbar, Footer, global styles
    page.tsx            # Home: ordered section components
    menu/page.tsx
    reserve/page.tsx
  components/           # Feature folders; kebab-case files
    layout/             # navbar, footer
    hero/
    menu/               # latest + full menu, grid, modal, carousels
    gallery/            # photos + videos, marquee, lightbox modal
    about/
    reviews/            # section + star-rating
    visit/
    qr/
    reserve/
    effects/            # marquee, use-marquee, flip-fade-text
    ui/                 # button, link, image, typography, section, container, …
    …
  data/                 # Static content / typed records (no React)
    menu.ts
    gallery.ts
    reviews.ts
  lib/                  # Shared non-UI helpers
    constants.ts        # site, nav, social, hours, section copy
    menu.ts             # getMenuItems, pickLatestMenuItems, categories
    fonts.ts
    scroll.ts
  styles/               # Design system CSS
```

**Layout:** use `Container` (`@/components/ui/container`) for the same width as the navbar (`max-w-7xl` + horizontal padding). Sections put `py` / background on the outer element only.

## Coding workflow (required)

1. **Pages stay thin** — `app/**/page.tsx` imports and composes sections; no large JSX blocks.
2. **Extract by section** — each home section is its own component under `components/`.
3. **Shared chrome in layout** — `Navbar` + `Footer` live in `layout.tsx`.
4. **Data out of components** — menu/reviews/gallery/site copy in `data/` or `lib/constants.ts`.
5. **`"use client"` only when needed** — state, effects, Motion, browser APIs.
6. **Same visuals** — when refactoring, preserve classNames and Motion props; do not redesign.
7. **Files** — kebab-case filenames; named exports for components.
8. **No mega-files** — if a component grows past ~200 lines or owns multiple sections, split it.

## Design fidelity

- Source design: Maydi's single-page café prototype
- Theme tokens in `src/styles/theme.css` are the source of truth
- Prefer editing data/constants over hardcoding strings in JSX when the value is site-wide
- UI polish phase: elevate section-by-section (navbar → hero → …); keep Motion ease `[0.22, 1, 0.36, 1]`
- Full-page mobile menus must be **siblings** of blurred sticky headers (see `.grok/rules/ui-polish.md`)
- Image paths for chrome: `src/lib/images.ts`
## Database (Supabase)

- Guide: `docs/SUPABASE.md`
- Bootstrap SQL (empty project): `supabase/migrations/001_init.sql`
- Env: **`apps/website/.env.local`** only — `NEXT_PUBLIC_SUPABASE_URL` must be `https://…supabase.co`
- Reserve writes: RPC `create_reservation` via `/api/reserve`
- Menu reads: `lib/menu.ts` → RPC `get_menu_items` with static `data/menu.ts` fallback
- Skill: **supabase-clean-setup** (project + global) — clean start over grant-patching
- Future changes: add `002_*.sql`, do not rewrite applied production `001` without a new file

## Agent skills in this repo

| Skill | Scope | Use for |
|-------|--------|---------|
| `component-structure` | project (+ global if installed) | Thin pages, section components, chrome/UI polish |
| `supabase-clean-setup` | project + global | Clean Supabase/bootstrap/env |

Always-on rules: `.grok/rules/structure.md`, `database.md`, `ui-polish.md`.

Invoke: `/supabase-clean-setup` or describe “set up Supabase cleanly”.
