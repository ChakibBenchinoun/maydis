"use client";

import { motion } from "motion/react";

import type { MenuItem } from "@/data/menu";

type MenuGridProps = {
  items: MenuItem[];
  categoryKey: string;
  onSelect: (item: MenuItem) => void;
};

/**
 * Full-menu catalog — photo cards with name + price on a bottom scrim.
 * Details open in the item modal on click.
 *
 * Overlay pattern: high-contrast type on a gradient so titles stay legible
 * on any food photo (common café / delivery-menu practice).
 */
export function MenuGrid({ items, categoryKey, onSelect }: MenuGridProps) {
  return (
    <motion.div
      key={categoryKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28 }}
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4"
    >
      {items.map((item, i) => (
        <motion.button
          key={item.id}
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: Math.min(i, 12) * 0.04, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => onSelect(item)}
          className="group focus-visible:ring-primary relative aspect-[4/5] w-full overflow-hidden rounded-2xl text-left shadow-md ring-1 ring-black/5 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />

          {/* Soft top fade so the card edge stays clean */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-linear-to-b from-black/15 to-transparent"
            aria-hidden
          />

          {/* Bottom scrim — name + price sit on the photo */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/45 to-transparent pt-14 pb-3 sm:pt-16 sm:pb-3.5">
            <div className="flex items-end justify-between gap-2 px-3 sm:px-3.5">
              <h3 className="font-display min-w-0 flex-1 text-[0.95rem] leading-snug font-bold text-white drop-shadow-sm sm:text-base">
                <span className="line-clamp-2">{item.name}</span>
              </h3>
              <span className="bg-primary text-primary-foreground shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold tracking-wide tabular-nums shadow-sm sm:px-2.5 sm:text-xs">
                {item.price}
              </span>
            </div>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}
