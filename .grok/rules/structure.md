# Structure rules

When editing `apps/website`:

1. Keep `app/**/page.tsx` thin — compose imported section components.
2. Put UI under `src/components/<domain>/` (feature folders), kebab-case files, one concern each.
3. Put site-wide strings (brand, phone, nav, social, hours, section copy) in `src/lib/constants.ts`.
4. Put menu/gallery/reviews content in `src/data/`.
5. Use `"use client"` only for state, effects, Motion, or browser APIs.
6. Do not reintroduce a monolithic home page component.
7. Prefer `lib/images.ts` paths over hardcoding `/images/...` in chrome sections (navbar, hero).
8. Full-page mobile overlays: render as a **sibling** of the sticky header bar (not inside a `backdrop-blur` / `backdrop-filter` parent), or fixed positioning will break and the panel can look transparent. Use an opaque `backgroundColor: var(--background)`.
9. Motion: reuse ease `[0.22, 1, 0.36, 1]`; respect `prefers-reduced-motion` for Ken Burns / loops.
10. Nav hierarchy: section anchors + secondary links as text; **Reserve** as primary pill CTA; Instagram icon-only on desktop when space is tight.

## Extract only when repeated (or non-trivial)

**Do not** create a new component for static JSX used in **one** place.

| Extract when | Leave inline when |
|--------------|-------------------|
| Same markup/pattern appears **2+ times** | Used once and is static/simple |
| Shared design-system primitive (Button, Link, Container, SectionLabel, …) | Tiny helper only one parent needs (e.g. stars in one review card) |
| Non-trivial interactive unit that would bloat a parent (~80+ lines / own state) | Thin re-export / alias of another module |
| Reusable capability (e.g. scroll-drawn line, page header) | Place-specific one-line wrappers (`HomeBelowHero`, `MenuPageShell`) |

Delete unused files; prefer deleting deprecated re-exports over keeping “compat” shims.

## Name by capability, not by place of use

Reusable UI must be **generic, configurable, and portable**:

| Do | Don't |
|----|--------|
| `PageScrollLine`, `ScrollLineRegion` | `HomeBelowHero`, `MenuPageShell` |
| `PageHeader` (eyebrow, title, description props) | `MenuPageHeader` / `ReservePageHeader` as separate files |
| Props for color, path, `as`, className | Hardcoded only for one route |
| Put shared primitives in `ui/` or `effects/` | Copy the same wrapper into `home/`, `menu/`, … |

1. If the same pattern is needed on 2+ routes, extract **one** shared component named for **what it does**.
2. Pages **compose** that component; do not invent a new shell file per feature folder.
3. Domain folders (`menu/`, `gallery/`) hold **domain UI** (cards, forms, sections) — not generic layout chrome renamed for that page.
4. Prefer extending props on the shared component over a second near-duplicate.

## Component domains (`src/components/`)

| Folder | Put here |
|--------|----------|
| `layout/` | Navbar, Footer, PageHeader, HashScroll |
| `hero/` | Home hero |
| `menu/` | Latest + full menu, cards, modal, carousel |
| `gallery/` | Gallery section, marquee, item modal (photos + videos). **No `moments/`.** |
| `about/` | About / story section |
| `reviews/` | Reviews section |
| `visit/` | Visit / contact section |
| `qr/` | QR section |
| `reserve/` | Reservation form |
| `effects/` | Portable motion/scroll primitives: `marquee`, `use-marquee`, `flip-fade-text`, `page-scroll-line` |
| `ui/` | Design system: `button`, `link`, `image`, `typography`, `container`, section label/divider |

Import as `@/components/<domain>/<file>` (no flat root component files for features).

## Layout container & section rhythm

- Shared width: `components/ui/container.tsx` — `max-w-7xl` + `px-6 md:px-10`.
- Shared vertical rhythm: `components/ui/section.tsx` — `py-16 sm:py-20 md:py-24` (+ optional `tone="muted"`).
- Section headers: `sectionHeaderClass` → `mb-10 md:mb-14 text-center`.
- Prefer `<Section>` + `<Container>` over ad-hoc `py-24` / `bg-secondary/45` on every file.
- Full-bleed media (hero, gallery marquee) stays outside Container; clip overflow as needed.

## Band alternation (home)

Prefer alternating tones so consecutive muted blocks don’t stack:

`menu (default)` → `gallery (muted)` → `about (default)` → `reviews (muted)` → `visit (default)` → `qr (muted)`.


## UI primitives (`components/ui/`)

Prefer these over one-off Tailwind on CTAs and copy:

| Component | Use for |
|-----------|---------|
| `Button` | Native buttons / form actions |
| `Link` | Internal (`next/link`) or `external` anchors; same variants as Button |
| `Image` | `next/image` or `mode="native"` for plain img |
| `Heading` / `Paragraph` / `SectionLabel` | Section titles, body copy, accent kickers |
| `Container` | Page width aligned to navbar |

Button/Link sizes are **mobile-compact** by default (`text-[10px]` + tighter padding → larger from `sm`).

## Formatting (always on)

1. **Import order + Tailwind class order** — Prettier (`apps/website/prettier.config.mjs`):
   - `@ianvs/prettier-plugin-sort-imports`
   - `prettier-plugin-tailwindcss` (last; stylesheet `src/styles/tailwind.css`)
2. Run `pnpm website:format` (or format-on-save).
3. Do not hand-sort large class strings or import blocks; let Prettier rewrite them.
