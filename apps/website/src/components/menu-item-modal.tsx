"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

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
            className="relative bg-card rounded-3xl overflow-hidden max-w-md w-full max-h-[min(90dvh,40rem)] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[4/3] bg-secondary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/55 transition-colors"
              aria-label="Close"
            >
              <X size={17} />
            </button>
            <div className="p-7">
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent/12 text-accent font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h3 className="font-display text-2xl font-bold text-foreground mb-3 leading-snug">
                {item.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-7">{item.details}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary text-2xl">{item.price}</span>
                <button
                  onClick={onClose}
                  className="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase hover:bg-amber-500 transition-colors"
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
