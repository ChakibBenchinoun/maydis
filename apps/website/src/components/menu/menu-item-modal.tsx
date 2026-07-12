"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { MenuItem } from "@/data/menu";

type MenuItemModalProps = {
  item: MenuItem | null;
  onClose: () => void;
};

export function MenuItemModal({ item, onClose }: MenuItemModalProps) {
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [item]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card relative max-h-[min(90dvh,40rem)] w-full max-w-md overflow-hidden overflow-y-auto rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-secondary aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55"
              aria-label="Close"
            >
              <X size={17} />
            </button>
            <div className="p-7">
              {item.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-accent/12 text-accent rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h3 className="font-display text-foreground mb-3 text-2xl leading-snug font-bold">
                {item.name}
              </h3>
              <p className="text-muted-foreground mb-7 text-sm leading-relaxed">{item.details}</p>
              <div className="flex items-center justify-between">
                <span className="text-primary text-2xl font-bold">{item.price}</span>
                <button
                  onClick={onClose}
                  className="bg-primary rounded-full px-6 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-amber-500"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
