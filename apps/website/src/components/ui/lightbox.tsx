"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/cn";

const easeOut = [0.22, 1, 0.36, 1] as const;

type LightboxProps = {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog */
  label?: string;
  /** Max width of the panel (Tailwind max-w-*) */
  panelClassName?: string;
  children: ReactNode;
};

/**
 * Full-viewport modal shell — portaled to `document.body` so the dimmed
 * overlay covers everything including the fixed navbar (z-50).
 */
export function Lightbox({ open, onClose, label, panelClassName, children }: LightboxProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          {/* Full-screen wash — covers nav, footer, and page content */}
          <div className="absolute inset-0 bg-[#1a1410]/72 backdrop-blur-[3px]" aria-hidden />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.26, ease: easeOut }}
            className={cn(
              // Centered in the viewport; media inside uses object-cover object-center
              "bg-card relative z-[1] mx-auto my-auto max-h-[min(90dvh,42rem)] w-full overflow-hidden overflow-y-auto rounded-3xl shadow-2xl",
              panelClassName ?? "max-w-md",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
