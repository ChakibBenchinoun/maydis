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
   - Title uses `FlipFadeText` (`components/effects/flip-fade-text.tsx`); **size box locked to all words** (grid sizers) so production webfonts don’t shift layout; `sr-only` brand; `reduceMotion`.
   - Content wrapped in `Container` (full-bleed bg stays outside).
   - Scroll chevron → `#menu`. Optional Ken Burns only when reduced-motion is off.
   - CTAs via `Button` / `Link` (mobile-compact sizes).
5. **Home “latest menu” vs full menu**
   - Home: `LatestMenuSection` + `pickLatestMenuItems()` — no category tabs; showcase only.
   - Below `lg`: `MenuSwipeCarousel` · `lg+`: `MenuScrollRow` (uses shared `effects/marquee`, interactive).
   - `/menu`: `MenuSection` — all categories + `MenuGrid`.
   - Copy in `lib/constants.ts` (`latestMenuCopy`); limit in `lib/menu.ts` (`LATEST_MENU_LIMIT`).
   - Attribution comment required for free Skiper components.
5b. **Gallery**
   - No separate Moments section — videos live in `data/gallery.ts` as `type: "video"`.
   - `GalleryMarquee` → dual rows via `effects/marquee` (`interactive={false}` for pan; tiles still clickable).
   - Click tile → `GalleryItemModal` (same lightbox pattern as menu modal).
   - Shared animation under `components/effects/`.
5c. **Marquee primitive** (`components/effects/marquee.tsx` + `use-marquee.ts`)
   - GPU `translate3d`; in-view autoplay; optional interactive pan.

6. Motion ease of record: `[0.22, 1, 0.36, 1]` (`motion/react`).
7. After polish: `pnpm typecheck` (and visual check on mobile + desktop).
