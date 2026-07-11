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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
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
          <div className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
            <div className="overflow-hidden bg-secondary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full object-cover aspect-video sm:aspect-square object-center transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-5">
              <h3 className="font-display font-bold text-foreground leading-snug mb-1.5">
                {item.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">{item.price}</span>
                <span className="text-xs text-muted-foreground/70 group-hover:text-primary transition-colors">
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
