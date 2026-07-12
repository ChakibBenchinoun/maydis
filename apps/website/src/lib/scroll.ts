/** Matches `scroll-padding-top` in theme.css (fixed navbar offset). */
const FALLBACK_NAV_OFFSET_PX = 72;

let activeScrollRaf = 0;

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
 * Animate window scroll with rAF.
 * CSS `scroll-behavior: smooth` and `scrollTo({ behavior: "smooth" })` are unreliable
 * on iOS Safari (especially with overflow clipping on body) — rAF is consistent.
 */
function animateScrollTo(targetY: number) {
  if (activeScrollRaf) {
    cancelAnimationFrame(activeScrollRaf);
    activeScrollRaf = 0;
  }

  const startY = window.scrollY;
  const delta = targetY - startY;
  if (Math.abs(delta) < 1) return;

  // Distance-aware duration, clamped for short/long jumps
  const duration = Math.min(1100, Math.max(380, Math.abs(delta) * 0.55));
  let startTime: number | null = null;

  const step = (now: number) => {
    if (startTime === null) startTime = now;
    const t = Math.min(1, (now - startTime) / duration);
    window.scrollTo(0, startY + delta * easeInOutCubic(t));
    if (t < 1) {
      activeScrollRaf = requestAnimationFrame(step);
    } else {
      activeScrollRaf = 0;
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
    if (activeScrollRaf) {
      cancelAnimationFrame(activeScrollRaf);
      activeScrollRaf = 0;
    }
    window.scrollTo(0, y);
    return;
  }

  animateScrollTo(y);
}
