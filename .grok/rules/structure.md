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

## Component domains (`src/components/`)

| Folder | Put here |
|--------|----------|
| `layout/` | Navbar, Footer (global chrome) |
| `hero/` | Home hero |
| `menu/` | Latest + full menu, cards, modal, carousel |
| `gallery/` | Gallery section, marquee, item modal (photos + videos). **No `moments/`.** |
| `about/` | About / story section |
| `reviews/` | Reviews section + star rating |
| `visit/` | Visit / contact section |
| `qr/` | QR section + QR SVG |
| `reserve/` | Reservation form |
| `effects/` | Motion primitives: `marquee`, `use-marquee`, `flip-fade-text` |
| `ui/` | Design system: `button`, `link`, `image`, `typography`, `container`, section label/divider |

Import as `@/components/<domain>/<file>` (no flat root component files for features).

## Layout container

- Shared width lives in `components/ui/container.tsx` — same as navbar: `max-w-7xl` + `px-6 md:px-10`.
- Sections keep vertical padding / background on `<section>`; wrap content in `<Container>`.
- Navbar / footer use `Container` for the same horizontal bounds.
- Full-bleed blocks (hero image, mobile menu overlay) stay outside `Container`.


## UI primitives (`components/ui/`)

Prefer these over one-off Tailwind on CTAs and copy:

| Component | Use for |
|-----------|---------|
| `Button` | Native buttons / form actions |
| `Link` | Internal (`next/link`) or `external` anchors; same variants as Button |
| `Image` | `next/image` or `mode="native"` for plain img |
| `Heading` / `Paragraph` / `Eyebrow` | Section titles and body copy |
| `Container` | Page width aligned to navbar |

Button/Link sizes are **mobile-compact** by default (`text-[10px]` + tighter padding → larger from `sm`).

## Formatting (always on)

1. **Import order + Tailwind class order** — Prettier (`apps/website/prettier.config.mjs`):
   - `@ianvs/prettier-plugin-sort-imports`
   - `prettier-plugin-tailwindcss` (last; stylesheet `src/styles/tailwind.css`)
2. Run `pnpm website:format` (or format-on-save).
3. Do not hand-sort large class strings or import blocks; let Prettier rewrite them.
