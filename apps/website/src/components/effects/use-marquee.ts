"use client";

import { useCallback, useEffect, useRef } from "react";

export type MarqueeDirection = "left" | "right";

export type UseMarqueeOptions = {
  /** When false, no rAF / observers / listeners. */
  enabled: boolean;
  /** Autoplay speed in px/s (always positive). */
  speed: number;
  /**
   * Content travel direction.
   * - `left` — strip moves left (default)
   * - `right` — strip moves right (reversed)
   */
  direction?: MarqueeDirection;
  /**
   * Allow wheel + drag to pan the strip.
   * When false, motion is display-only (gallery).
   */
  interactive?: boolean;
  /** Pause autoplay this long after user pan (ms). Only used when interactive. */
  resumeDelayMs?: number;
  /** Remeasure when this changes. */
  resetKey: string;
};

export type UseMarqueeResult = {
  rootRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLElement | null>;
};

const DRAG_THRESHOLD_PX = 6;
const MAX_FRAME_MS = 24;
const VIEW_ROOT_MARGIN = "120px 0px";
const DEFAULT_RESUME_MS = 2200;

/**
 * Shared GPU marquee (`translate3d`).
 * - Autoplay while near the viewport
 * - Optional wheel / drag pan (`interactive`)
 */
export function useMarquee({
  enabled,
  speed,
  direction = "left",
  interactive = true,
  resumeDelayMs = DEFAULT_RESUME_MS,
  resetKey,
}: UseMarqueeOptions): UseMarqueeResult {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLElement>(null);

  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const speedRef = useRef(speed);
  const directionRef = useRef(direction);
  const pausedRef = useRef(false);
  const inViewRef = useRef(true);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const suppressClickRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTickRef = useRef(0);

  speedRef.current = speed;
  directionRef.current = direction;

  const applyTransform = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  }, []);

  const normalizeOffset = useCallback(() => {
    const w = loopWidthRef.current;
    if (w <= 0) return;
    let o = offsetRef.current % w;
    if (o < 0) o += w;
    offsetRef.current = o;
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    if (half <= 0) return;
    loopWidthRef.current = half;
    normalizeOffset();
    applyTransform();
  }, [applyTransform, normalizeOffset]);

  const pauseForUser = useCallback(() => {
    if (!interactive) return;
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
      lastTickRef.current = performance.now();
      resumeTimerRef.current = null;
    }, resumeDelayMs);
  }, [interactive, resumeDelayMs]);

  // Track size
  useEffect(() => {
    if (!enabled) return;
    const track = trackRef.current;
    if (!track) return;

    const ro = new ResizeObserver(() => measure());
    ro.observe(track);
    measure();
    const t1 = window.setTimeout(measure, 50);
    const t2 = window.setTimeout(measure, 250);

    return () => {
      ro.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [enabled, measure, resetKey]);

  // Viewport gate
  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = Boolean(entry?.isIntersecting);
        if (entry?.isIntersecting) {
          lastTickRef.current = performance.now();
          measure();
        }
      },
      { root: null, rootMargin: VIEW_ROOT_MARGIN, threshold: 0 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [enabled, measure, resetKey]);

  // Autoplay loop
  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    lastTickRef.current = performance.now();

    const tick = (now: number) => {
      const last = lastTickRef.current || now;
      const dt = Math.min(MAX_FRAME_MS, Math.max(0, now - last)) / 1000;
      lastTickRef.current = now;

      const loopW = loopWidthRef.current;
      const running =
        !pausedRef.current &&
        !draggingRef.current &&
        inViewRef.current &&
        loopW > 0 &&
        document.visibilityState === "visible";

      if (running) {
        const sign = directionRef.current === "right" ? -1 : 1;
        offsetRef.current += sign * speedRef.current * dt;
        // Keep offset in [0, loopW) for seamless loop either direction
        if (offsetRef.current >= loopW) offsetRef.current -= loopW;
        else if (offsetRef.current < 0) offsetRef.current += loopW;
        applyTransform();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, resetKey, applyTransform]);

  // Wheel pan (interactive only)
  useEffect(() => {
    if (!enabled || !interactive) return;
    const root = rootRef.current;
    if (!root) return;

    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      e.preventDefault();
      pauseForUser();
      offsetRef.current += delta;
      normalizeOffset();
      applyTransform();
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [enabled, interactive, pauseForUser, normalizeOffset, applyTransform, resetKey]);

  // Drag pan (interactive only).
  // Important: do NOT setPointerCapture on every pointerdown — that steals clicks from cards.
  // Capture only after the drag threshold so taps still open the modal.
  useEffect(() => {
    if (!enabled || !interactive) return;
    const root = rootRef.current;
    if (!root) return;

    let activePointerId: number | null = null;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      activePointerId = e.pointerId;
      draggingRef.current = false;
      suppressClickRef.current = false;
      dragStartXRef.current = e.clientX;
      dragStartOffsetRef.current = offsetRef.current;
      // Freeze autoplay so the card stays under the cursor during a click
      pausedRef.current = true;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (activePointerId !== e.pointerId) return;
      const dx = e.clientX - dragStartXRef.current;

      if (!draggingRef.current) {
        if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
        draggingRef.current = true;
        try {
          root.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }

      offsetRef.current = dragStartOffsetRef.current - dx;
      normalizeOffset();
      applyTransform();
    };

    const endPointer = (e: PointerEvent) => {
      if (activePointerId !== e.pointerId) return;
      activePointerId = null;

      if (root.hasPointerCapture(e.pointerId)) {
        try {
          root.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }

      if (draggingRef.current) {
        draggingRef.current = false;
        // Only suppress click after a real drag
        suppressClickRef.current = true;
        pauseForUser();
        return;
      }

      // Pure click / tap — let the button onClick run, then resume autoplay soon
      pauseForUser();
    };

    const onClickCapture = (e: MouseEvent) => {
      if (!suppressClickRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      suppressClickRef.current = false;
    };

    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", endPointer);
    root.addEventListener("pointercancel", endPointer);
    root.addEventListener("click", onClickCapture, true);

    return () => {
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", endPointer);
      root.removeEventListener("pointercancel", endPointer);
      root.removeEventListener("click", onClickCapture, true);
    };
  }, [enabled, interactive, pauseForUser, normalizeOffset, applyTransform, resetKey]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  return { rootRef, trackRef };
}
