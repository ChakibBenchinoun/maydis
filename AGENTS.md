# Maydis — Agent Guidelines

Conventions for coding agents working in this monorepo.

## Stack

- Monorepo: pnpm + Turborepo
- Website: Next.js 16 App Router (`apps/website`)
- Styling: Tailwind CSS v4 + `src/styles/theme.css` tokens (do not invent a new palette)
- Animations: `motion` (`motion/react`)
- Icons: `lucide-react`
- Forms: **TanStack Form** + **Zod** (`lib/**/schema.ts`) for public + admin CRUDs
- Server data (admin lists later): prefer **TanStack Query** when touching admin fetch/mutations
- UI primitives: existing `components/ui/*`; adopt **shadcn/ui** when it fits (calendar, dialog, etc.) — do not replace brand sections wholesale. Project MCP: `.cursor/mcp.json` (`shadcn@latest mcp`); global Cursor config may also list shadcn.
- WhatsApp: free Baileys bot (`apps/whatsapp-bot`) — local `pnpm whatsapp:bot` on `:3100`; production on Railway + Vercel `WHATSAPP_BOT_*`. Owner alerts deep-link to production admin only (`site.productionOrigin` / `ADMIN_RESERVATIONS_URL`) — never `VERCEL_URL`.
- Admin: `/admin` — bootstrap `OWNER_EMAIL`, staff in UI (`staff_members`); see `docs/ADMIN.md`. Next focus: reservations + TanStack Query lists; menu/gallery CRUD later.


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
    layout/             # navbar, footer, public-shell, hash-scroll
    hero/
    menu/               # latest + full menu, grid, modal, carousels
    gallery/            # photos + videos, marquee, lightbox modal
    about/
    reviews/
    visit/
    qr/
    reserve/
    effects/            # portable motion: marquee, flip-fade-text, page-scroll-line, scroll-anchor
    ui/                 # button, link, image, typography, section, container, lightbox, …
    …
  data/                 # Static content / typed records (no React)
    menu.ts
    gallery.ts
    reviews.ts
  lib/                  # Shared non-UI helpers
    constants.ts        # site (incl. productionOrigin), nav, social, hours, section copy
    menu.ts             # getMenuItems, pickLatestMenuItems, categories
    fonts.ts
    scroll.ts           # rAF: scrollToId (nav offset) + scrollToPageTop (forms)
    whatsapp/           # messages (warm copy + production admin link) + send
  styles/               # Design system CSS
```

**Nav:** `homeNavLinks` in `constants.ts` — text sections + Menu/Reserve CTAs; scroll-spy + pathname current state in `navbar.tsx`. Always-on polish: `.grok/rules/ui-polish.md`.

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
9. **Extract only when repeated** — do not create a component for one-off static JSX. Extract at **2+** uses, for design-system primitives, or for non-trivial interactive units. Inline single-use static helpers; delete dead files.
10. **Name by capability, not place** — shared UI is portable and props-driven (`PageScrollLine`, `ScrollLineRegion`). Do **not** invent place-tied shells (`HomeBelowHero`, `MenuPageShell`) that only wrap a shared primitive. Domain folders hold domain UI; generic chrome lives in `ui/` / `effects/` / `layout/`.

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
- Reserve writes: RPC `create_reservation` via `/api/reserve` + Zod `lib/reservations/schema.ts`
- Menu reads: `lib/menu.ts` → RPC `get_menu_items` with static `data/menu.ts` fallback
- Staff table: `004_staff_members.sql`; reservation statuses: `003_admin_reservation_status.sql`
- Skill: **supabase-clean-setup** (project + global) — clean start over grant-patching
- Future changes: add `00N_*.sql`, do not rewrite applied production `001` without a new file
- **Migrations require approval** — do **not** create/edit/delete `supabase/migrations/*` unless the user explicitly approves in this chat. Propose SQL first; wait for yes. Always-on: `.grok/rules/database.md`.

## Agent skills in this repo

| Skill | Scope | Use for |
|-------|--------|---------|
| `component-structure` | project (+ global if installed) | Thin pages, section components, chrome/UI polish |
| `extract-when-repeated` | project + global | Extract only on repeat / primitives / non-trivial UI; scan dead wrappers |
| `supabase-clean-setup` | project + global | Clean Supabase/bootstrap/env |
| `forms-tanstack` | project | TanStack Form + Zod, multi-step wizards, validation UX |

Always-on rules: `.grok/rules/structure.md`, `database.md`, `ui-polish.md`, **`forms.md`**, **`admin.md`**.

Invoke: `/extract-when-repeated`, `/supabase-clean-setup`, `/forms-tanstack`, or describe the task.
