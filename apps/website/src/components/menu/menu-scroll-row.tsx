"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

import type { MenuItem } from "@/data/menu";

type MenuScrollRowProps = {
  items: MenuItem[];
  categoryKey: string;
  onSelect: (item: MenuItem) => void;
  className?: string;
  /** Continuous horizontal auto-scroll. Default true. */
  autoplay?: boolean;
  /** Pixels per second while autoplaying. */
  speed?: number;
  /** How long to wait after user input before autoplay resumes (ms). */
  resumeDelayMs?: number;
};

type CardProps = {
  item: MenuItem;
  index: number;
  onSelect: (item: MenuItem) => void;
  animateIn: boolean;
};

function MenuCard({ item, index, onSelect, animateIn }: CardProps) {
  return (
    <li className="flex w-[260px] shrink-0 lg:w-[280px]">
      <motion.button
        type="button"
        initial={animateIn ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.38,
          delay: animateIn ? index * 0.05 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
        onClick={() => onSelect(item)}
        className="group bg-card border-border/50 focus-visible:ring-primary flex h-full w-full flex-col overflow-hidden rounded-2xl border text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <div className="bg-secondary relative h-[180px] w-full shrink-0 overflow-hidden lg:h-[200px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            draggable={false}
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex h-5 items-center">
            {item.tags[0] ? (
              <span className="bg-accent/12 text-accent inline-block rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                {item.tags[0]}
              </span>
            ) : (
              <span className="invisible px-2 py-0.5 text-[9px]" aria-hidden>
                —
              </span>
            )}
          </div>

          <h3 className="font-display text-foreground mb-1.5 line-clamp-2 min-h-[2.75rem] leading-snug font-bold">
            {item.name}
          </h3>

          <p className="text-muted-foreground line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed">
            {item.description}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2 pt-4">
            <span className="text-primary font-bold tabular-nums">{item.price}</span>
            <span className="text-muted-foreground/70 group-hover:text-primary text-xs transition-colors">
              View →
            </span>
          </div>
        </div>
      </motion.button>
    </li>
  );
}

/**
 * Large-screen home menu row: native horizontal scroll + seamless autoplay.
 * Users can wheel / trackpad / drag; autoplay pauses during interaction and resumes after idle.
 */
export function MenuScrollRow({
  items,
  categoryKey,
  onSelect,
  className = "",
  autoplay = true,
  speed = 36,
  resumeDelayMs = 2200,
}: MenuScrollRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [loopWidth, setLoopWidth] = useState(0);

  // Two copies for seamless infinite scroll via scrollLeft wrap
  const sequence = useMemo(
    () => [
      ...items.map((item) => ({ item, key: `a-${item.id}` })),
      ...items.map((item) => ({ item, key: `b-${item.id}` })),
    ],
    [items],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setLoopWidth(track.scrollWidth / 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ro = new ResizeObserver(() => measure());
    ro.observe(track);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) measure();
      },
      { threshold: 0.01 },
    );
    io.observe(track);

    measure();
    const t1 = window.setTimeout(measure, 50);
    const t2 = window.setTimeout(measure, 300);

    return () => {
      ro.disconnect();
      io.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [measure, items, categoryKey]);

  /** Pause autoplay; resume after the user stops interacting. */
  const pauseForUser = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
      resumeTimerRef.current = null;
    }, resumeDelayMs);
  }, [resumeDelayMs]);

  const pauseWhileHover = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const resumeAfterHover = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
      resumeTimerRef.current = null;
    }, 400);
  }, []);

  // Keep scroll position in the first half for seamless looping
  const normalizeScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || loopWidth <= 0) return;
    if (el.scrollLeft >= loopWidth) {
      el.scrollLeft -= loopWidth;
    } else if (el.scrollLeft < 0) {
      el.scrollLeft += loopWidth;
    }
  }, [loopWidth]);

  useEffect(() => {
    if (!autoplay || reduceMotion || loopWidth <= 0) return;
    const el = scrollerRef.current;
    if (!el) return;

    // Start near the beginning of the first copy
    if (el.scrollLeft === 0) {
      // leave at 0
    }

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(48, now - last) / 1000;
      last = now;

      if (!pausedRef.current) {
        el.scrollLeft += speed * dt;
        if (el.scrollLeft >= loopWidth) {
          el.scrollLeft -= loopWidth;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoplay, reduceMotion, speed, loopWidth, categoryKey]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center text-sm">
        No dishes in this category yet.
      </p>
    );
  }

  // Reduced motion: single centered row, no autoplay
  if (reduceMotion || !autoplay) {
    return (
      <motion.div
        key={categoryKey}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`relative w-full ${className}`}
      >
        <div
          className={[
            "overflow-x-auto overscroll-x-contain pt-3 pb-8",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          ].join(" ")}
        >
          <ul className="flex w-max min-w-full items-stretch justify-center gap-5 px-1 md:gap-6">
            {items.map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} onSelect={onSelect} animateIn />
            ))}
          </ul>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={categoryKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full ${className}`}
    >
      <div
        ref={scrollerRef}
        onScroll={normalizeScroll}
        onWheel={pauseForUser}
        onPointerDown={pauseForUser}
        onTouchStart={pauseForUser}
        onMouseEnter={pauseWhileHover}
        onMouseLeave={resumeAfterHover}
        className={[
          "cursor-grab overflow-x-auto overscroll-x-contain pt-3 pb-8 active:cursor-grabbing",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        ].join(" ")}
      >
        <ul ref={trackRef} className="flex w-max items-stretch gap-5 px-1 md:gap-6">
          {sequence.map(({ item, key }, i) => (
            <MenuCard
              key={key}
              item={item}
              index={i % items.length}
              onSelect={onSelect}
              animateIn={i < items.length}
            />
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
