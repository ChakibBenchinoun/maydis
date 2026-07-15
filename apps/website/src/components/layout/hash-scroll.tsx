"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { scrollToId } from "@/lib/scroll";

/**
 * Smooth-scroll to `location.hash` on load and hash changes.
 * Complements button-driven `scrollToId` for `/#visit`-style links (incl. iOS Safari).
 *
 * Debounced to a single rAF so Strict Mode / pathname+hashchange don't start
 * two competing scroll animations.
 */
export function HashScroll() {
  const pathname = usePathname();
  const rafRef = useRef(0);

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      // Wait a frame so layout/images don't shift the target
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        scrollToId(id);
      });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      window.removeEventListener("hashchange", scrollToHash);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pathname]);

  return null;
}
