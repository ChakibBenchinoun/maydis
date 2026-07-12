"use client";

import { motion } from "motion/react";

import type { MenuItem } from "@/data/menu";

type MenuGridProps = {
  items: MenuItem[];
  categoryKey: string;
  onSelect: (item: MenuItem) => void;
};

export function MenuGrid({ items, categoryKey, onSelect }: MenuGridProps) {
  return (
    <motion.div
      key={categoryKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28 }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
    >
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="group cursor-pointer"
          onClick={() => onSelect(item)}
        >
          <div className="bg-card border-border/50 overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
            <div className="bg-secondary overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="aspect-video w-full object-cover object-center transition-transform duration-500 group-hover:scale-110 sm:aspect-square"
              />
            </div>
            <div className="p-5">
              <h3 className="font-display text-foreground mb-1.5 leading-snug font-bold">
                {item.name}
              </h3>
              <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-primary font-bold">{item.price}</span>
                <span className="text-muted-foreground/70 group-hover:text-primary text-xs transition-colors">
                  View →
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
