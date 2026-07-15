/** Matches `scroll-padding-top` in theme.css (fixed navbar offset). */
const FALLBACK_NAV_OFFSET_PX = 72;

let activeScrollRaf = 0;
/** Bumped on each new programmatic scroll so stale rAF frames exit. */
let scrollGeneration = 0;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function navOffsetPx() {
  const raw = getComputedStyle(document.documentElement).scrollPaddingTop;
  const n = parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : FALLBACK_NAV_OFFSET_PX;
}

function targetScrollY(el: HTMLElement) {
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - navOffsetPx());
}

/**
 * Instant jump — must bypass CSS `html { scroll-behavior: smooth }`.
 * Without this, each rAF frame of a programmatic scroll is re-smoothed by the
 * browser and the animation stalls / fights itself mid-way.
 */
function scrollInstant(y: number) {
  const maxY = Math.max(
    0,
    (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight,
  );
  const clamped = Math.min(Math.max(0, y), maxY);

  // Prefer the explicit "instant" option (CSSOM View).
  try {
    window.scrollTo({ top: clamped, left: 0, behavior: "instant" as ScrollBehavior });
    return;
  } catch {
    /* older engines */
  }

  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, clamped);
  if (prev) {
    root.style.scrollBehavior = prev;
  } else {
    root.style.removeProperty("scroll-behavior");
  }
}

function cancelProgrammaticScroll() {
  scrollGeneration += 1;
  if (activeScrollRaf) {
    cancelAnimationFrame(activeScrollRaf);
    activeScrollRaf = 0;
  }
}

/**
 * Animate window scroll with rAF.
 * CSS `scroll-behavior: smooth` and `scrollTo({ behavior: "smooth" })` are unreliable
 * on iOS Safari (especially with overflow clipping on body) — rAF is consistent.
 * Positions are applied with `scrollInstant` so they never re-enter CSS smooth.
 */
function animateScrollTo(targetY: number) {
  cancelProgrammaticScroll();
  const gen = scrollGeneration;

  const startY = window.scrollY;
  const delta = targetY - startY;
  if (Math.abs(delta) < 1) return;

  // Distance-aware duration, clamped for short/long jumps
  const duration = Math.min(900, Math.max(320, Math.abs(delta) * 0.45));
  let startTime: number | null = null;

  const step = (now: number) => {
    if (gen !== scrollGeneration) return;

    if (startTime === null) startTime = now;
    const t = Math.min(1, (now - startTime) / duration);
    scrollInstant(startY + delta * easeInOutCubic(t));

    if (t < 1) {
      activeScrollRaf = requestAnimationFrame(step);
    } else {
      activeScrollRaf = 0;
      // Final snap in case layout shifted during the animation
      scrollInstant(targetY);
    }
  };

  activeScrollRaf = requestAnimationFrame(step);
}

/** Smooth-scroll to an element by id (SPA section anchors). */
export function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;

  const y = targetScrollY(el);
  if (prefersReducedMotion()) {
    cancelProgrammaticScroll();
    scrollInstant(y);
    return;
  }

  animateScrollTo(y);
}
