# UI polish rules (always on)

When refining design / motion in `apps/website` (nav, hero, sections):

1. Keep theme tokens in `src/styles/theme.css` — cream / gold / green, Playfair + DM Sans. Do not invent a new palette.
2. Polish in place inside existing section components; do not collapse back into a monolithic page.
3. **Navbar** (`components/layout/navbar.tsx` + `lib/constants.ts` `homeNavLinks`)
   - Transparent over home hero → solid cream on scroll / non-home / mobile menu open.
   - Full-page mobile menu: sibling of `<nav>`, opaque cream, body scroll lock, Escape closes, Menu/X fade with `AnimatePresence`.
   - Do not nest `fixed inset-0` panels inside elements with `backdrop-filter` / blur.
   - **Text links** = section anchors from `mainNavLinks` (Home, Gallery, Our Story, Visit, Share Our Menu, …). **CTAs** = Menu (outline) + Reserve (primary by default). No Instagram in the bar (socials live in footer / Visit).
   - **Current location:** scroll-spy on home (`activeSectionId` via section tops vs nav offset); pathname for `/menu` and `/reserve`. Gold `text-primary` + `aria-current`. Only **one** CTA primary at a time — on Menu page Menu is primary and Reserve demotes to outline (and vice versa).
   - **Pointer / hover:** Tailwind v4 does not give buttons `cursor-pointer` by default — keep it on nav links, `button` base, and text `Link` variants. Hover → gold; current section stays gold.
   - **Section scroll:** always use `scrollToId` from `lib/scroll.ts` (rAF). Apply positions with **instant** scroll so CSS `html { scroll-behavior: smooth }` does not re-smooth every frame (that stalls mid-animation). `HashScroll` debounces to one rAF; throttle scroll-spy setState with rAF.
4. **Hero**
   - Staggered entrance; primary + secondary CTAs; demote tertiary actions (e.g. QR) under buttons.
   - Title uses `FlipFadeText` (`components/effects/flip-fade-text.tsx`); **size box locked to all words** (grid sizers) so production webfonts don’t shift layout; `sr-only` brand; `reduceMotion`.
   - Content wrapped in `Container` (full-bleed bg stays outside).
   - Scroll chevron / “Explore the latest” → `#latest` (home latest menu section). Optional Ken Burns only when reduced-motion is off.
   - CTAs via `Button` / `Link` (mobile-compact sizes).
4b. **Visit**
   - Content column first, map second (`md:grid-cols-2`) — map embed **in the card**, not a second full-width block below.
   - Card content width matches Avis Clients: `max-w-5xl mx-auto` inside `Container`.
   - Phone / Address / Hours as matching icon rows; Call + WhatsApp under phone (`site.phoneHref`, `site.whatsappHref`). No giant phone headline.
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
5d. **QR (Share Our Menu)**
   - Generated with high error correction (`H`) so a centre logo can cover modules.
   - Logo: `images.logo` on a white circular pad, centred over the code.
   - Display URL under the code: strip `https://` / `http://` for a friendly label; QR payload stays a full absolute URL.
5e. **Lightboxes** (`components/ui/lightbox.tsx`)
   - Portal to `document.body`, `z-[100]` above sticky nav (`z-50`); full-viewport dim.
   - Media: `object-cover object-center` in the frame.
5f. **Scroll primitives**
   - Section anchors / nav: `scrollToId` / `scrollToElement` (nav-offset) in `lib/scroll.ts`.
   - Multi-step form step changes: `scrollToPageTop` + `useScrollAnchor` (`effects/scroll-anchor.tsx`) — absolute page top.

6. Motion ease of record: `[0.22, 1, 0.36, 1]` (`motion/react`).
7. After polish: `pnpm typecheck` (and visual check on mobile + desktop).
