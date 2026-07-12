"use client";

import { useCallback, useEffect, useRef } from "react";

type UseMenuMarqueeOptions = {
  /** When false, refs still attach but no autoplay / pan handlers. */
  enabled: boolean;
  speed: number;
  resumeDelayMs: number;
  /** Remeasure / reset when this changes (e.g. categoryKey + item count). */
  resetKey: string;
};

type UseMenuMarqueeResult = {
  rootRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLUListElement | null>;
};

const DRAG_THRESHOLD_PX = 6;
const MAX_FRAME_MS = 24;
const VIEW_ROOT_MARGIN = "120px 0px";

/**
 * GPU marquee (`translate3d`) with wheel + drag pan.
 * Autoplay only advances while the strip is near the viewport.
 */
export function useMenuMarquee({
  enabled,
  speed,
  resumeDelayMs,
  resetKey,
}: UseMenuMarqueeOptions): UseMenuMarqueeResult {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const speedRef = useRef(speed);
  const pausedRef = useRef(false);
  const inViewRef = useRef(true);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const suppressClickRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTickRef = useRef(0);

  speedRef.current = speed;

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
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
      lastTickRef.current = performance.now();
      resumeTimerRef.current = null;
    }, resumeDelayMs);
  }, [resumeDelayMs]);

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
        offsetRef.current += speedRef.current * dt;
        if (offsetRef.current >= loopW) offsetRef.current -= loopW;
        applyTransform();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, resetKey, applyTransform]);

  // Wheel pan
  useEffect(() => {
    if (!enabled) return;
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
  }, [enabled, pauseForUser, normalizeOffset, applyTransform, resetKey]);

  // Drag pan
  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      draggingRef.current = false;
      dragStartXRef.current = e.clientX;
      dragStartOffsetRef.current = offsetRef.current;
      root.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!root.hasPointerCapture(e.pointerId)) return;
      const dx = e.clientX - dragStartXRef.current;
      if (!draggingRef.current && Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      draggingRef.current = true;
      pausedRef.current = true;
      offsetRef.current = dragStartOffsetRef.current - dx;
      normalizeOffset();
      applyTransform();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (root.hasPointerCapture(e.pointerId)) {
        root.releasePointerCapture(e.pointerId);
      }
      if (!draggingRef.current) return;
      draggingRef.current = false;
      suppressClickRef.current = true;
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
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerUp);
    root.addEventListener("click", onClickCapture, true);

    return () => {
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
      root.removeEventListener("click", onClickCapture, true);
    };
  }, [enabled, pauseForUser, normalizeOffset, applyTransform, resetKey]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  return { rootRef, trackRef };
}
