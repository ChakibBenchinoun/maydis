# UI polish rules (always on)

When refining design / motion in `apps/website` (nav, hero, sections):

1. Keep theme tokens in `src/styles/theme.css` — cream / gold / green, Playfair + DM Sans. Do not invent a new palette.
2. Polish in place inside existing section components; do not collapse back into a monolithic page.
3. **Navbar**
   - Transparent over home hero → solid cream on scroll / non-home / mobile menu open.
   - Full-page mobile menu: sibling of `<nav>`, opaque cream, body scroll lock, Escape closes, Menu/X fade with `AnimatePresence`.
   - Do not nest `fixed inset-0` panels inside elements with `backdrop-filter` / blur.
4. **Hero**
   - Staggered entrance; primary + secondary CTAs; demote tertiary actions (e.g. Instagram) under buttons.
   - Title uses `FlipFadeText` (`components/flip-fade-text.tsx`, Vengeance UI–style, `motion/react`); keep `sr-only` brand name for a11y; respect `reduceMotion`.
   - Scroll chevron should scroll to the next section (`#menu`).
   - Optional Ken Burns only when reduced-motion is off.
5. **Home “latest menu” vs full menu**
   - Home: `LatestMenuSection` + `pickLatestMenuItems()` — no category tabs; showcase only.
   - Below `lg`: `MenuSwipeCarousel` · `lg+`: `MenuScrollRow` · CTA “View full menu” below.
   - `/menu`: `MenuSection` — all categories + `MenuGrid`.
   - Copy in `lib/constants.ts` (`latestMenuCopy`); limit in `lib/menu.ts` (`LATEST_MENU_LIMIT`).
   - Attribution comment required for free Skiper components.
6. Motion ease of record: `[0.22, 1, 0.36, 1]` (`motion/react`).
7. After polish: `pnpm typecheck` (and visual check on mobile + desktop).
