"use client";

import { motion } from "motion/react";

import type { MenuItem } from "@/data/menu";

type MenuGridProps = {
  items: MenuItem[];
  categoryKey: string;
  onSelect: (item: MenuItem) => void;
};

/**
 * Full-menu catalog grid — image + name + price only.
 * Description and details open in `MenuItemModal` on click.
 */
export function MenuGrid({ items, categoryKey, onSelect }: MenuGridProps) {
  return (
    <motion.div
      key={categoryKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28 }}
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4"
    >
      {items.map((item, i) => (
        <motion.button
          key={item.id}
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => onSelect(item)}
          className="group focus-visible:ring-primary flex flex-col text-left focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <div className="bg-secondary border-border/40 mb-3 overflow-hidden rounded-2xl border shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.name}
              className="aspect-square w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex min-w-0 items-baseline justify-between gap-2 px-0.5">
            <h3 className="font-display text-foreground line-clamp-2 text-sm leading-snug font-bold sm:text-[0.95rem]">
              {item.name}
            </h3>
            <span className="text-primary shrink-0 text-sm font-bold tabular-nums sm:text-[0.95rem]">
              {item.price}
            </span>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}
