"use client";

import { useMemo } from "react";
import { motion } from "motion/react";

import { Marquee } from "@/components/effects/marquee";
import { MenuCard } from "@/components/menu/menu-card";
import type { MenuItem } from "@/data/menu";

const CARD_WIDTH_CLASS = "w-[220px] lg:w-[240px]";
const DEFAULT_SPEED = 36;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type MenuScrollRowProps = {
  items: MenuItem[];
  categoryKey: string;
  onSelect: (item: MenuItem) => void;
  className?: string;
  autoplay?: boolean;
  speed?: number;
  resumeDelayMs?: number;
};

/**
 * Large-screen home menu row — interactive marquee of dish cards.
 * Animation: `@/components/effects/marquee` (+ `use-marquee`).
 */
export function MenuScrollRow({
  items,
  categoryKey,
  onSelect,
  className = "",
  autoplay = true,
  speed = DEFAULT_SPEED,
  resumeDelayMs = 2200,
}: MenuScrollRowProps) {
  const cards = useMemo(
    () =>
      items.map((item) => (
        <MenuCard key={item.id} item={item} onSelect={onSelect} className={CARD_WIDTH_CLASS} />
      )),
    [items, onSelect],
  );

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center text-sm">
        No dishes in this category yet.
      </p>
    );
  }

  return (
    <motion.div
      key={categoryKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className={`relative w-full ${className}`}
    >
      <Marquee
        autoplay={autoplay}
        interactive
        speed={speed}
        resumeDelayMs={resumeDelayMs}
        resetKey={categoryKey}
        className="pt-3 pb-8"
        trackClassName="gap-5 px-1 md:gap-6"
      >
        {cards}
      </Marquee>
    </motion.div>
  );
}
