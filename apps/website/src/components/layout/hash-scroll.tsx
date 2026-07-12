"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { scrollToId } from "@/lib/scroll";

/**
 * Smooth-scroll to `location.hash` on load and hash changes.
 * Complements button-driven `scrollToId` for `/#visit`-style links (incl. iOS Safari).
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      // Wait a frame so layout/images don't shift the target
      requestAnimationFrame(() => {
        scrollToId(id);
      });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [pathname]);

  return null;
}
