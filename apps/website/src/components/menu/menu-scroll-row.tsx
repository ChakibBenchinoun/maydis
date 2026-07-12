"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

import { MenuCard } from "@/components/menu/menu-card";
import { useMenuMarquee } from "@/components/menu/use-menu-marquee";
import type { MenuItem } from "@/data/menu";

const CARD_WIDTH_CLASS = "w-[260px] lg:w-[280px]";
const DEFAULT_SPEED = 36;
const DEFAULT_RESUME_MS = 2200;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

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

/** Duplicate the list so the marquee can loop seamlessly. */
function loopSequence(items: MenuItem[]) {
  return [
    ...items.map((item) => ({ item, key: `a-${item.id}` })),
    ...items.map((item) => ({ item, key: `b-${item.id}` })),
  ];
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduce;
}

type RowShellProps = {
  categoryKey: string;
  className: string;
  children: React.ReactNode;
};

function RowShell({ categoryKey, className, children }: RowShellProps) {
  return (
    <motion.div
      key={categoryKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className={`relative w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * Large-screen home menu row.
 * Autoplay uses GPU `translate3d` so motion stays smooth when partially in view.
 * Wheel / drag still pan the strip.
 */
export function MenuScrollRow({
  items,
  categoryKey,
  onSelect,
  className = "",
  autoplay = true,
  speed = DEFAULT_SPEED,
  resumeDelayMs = DEFAULT_RESUME_MS,
}: MenuScrollRowProps) {
  const reduceMotion = usePrefersReducedMotion();
  const marqueeEnabled = autoplay && !reduceMotion;
  const resetKey = `${categoryKey}:${items.length}`;

  const sequence = useMemo(() => loopSequence(items), [items]);
  const { rootRef, trackRef } = useMenuMarquee({
    enabled: marqueeEnabled,
    speed,
    resumeDelayMs,
    resetKey,
  });

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center text-sm">
        No dishes in this category yet.
      </p>
    );
  }

  // Static centered row (a11y / autoplay off)
  if (!marqueeEnabled) {
    return (
      <RowShell categoryKey={categoryKey} className={className}>
        <div
          className={[
            "overflow-x-auto overscroll-x-contain pt-3 pb-8",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          ].join(" ")}
        >
          <ul className="flex w-max min-w-full items-stretch justify-center gap-5 px-1 md:gap-6">
            {items.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onSelect={onSelect}
                className={CARD_WIDTH_CLASS}
              />
            ))}
          </ul>
        </div>
      </RowShell>
    );
  }

  return (
    <RowShell categoryKey={categoryKey} className={className}>
      <div
        ref={rootRef}
        className="cursor-grab overflow-hidden pt-3 pb-8 active:cursor-grabbing"
        style={{ touchAction: "pan-y" }}
      >
        <ul
          ref={trackRef}
          className="flex w-max items-stretch gap-5 px-1 will-change-transform md:gap-6"
          style={{ transform: "translate3d(0,0,0)", backfaceVisibility: "hidden" }}
        >
          {sequence.map(({ item, key }) => (
            <MenuCard key={key} item={item} onSelect={onSelect} className={CARD_WIDTH_CLASS} />
          ))}
        </ul>
      </div>
    </RowShell>
  );
}
