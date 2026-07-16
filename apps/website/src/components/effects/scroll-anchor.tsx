"use client";

import {
  useCallback,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/cn";
import { scrollToPageTop } from "@/lib/scroll";

export type ScrollToTopOptions = {
  /**
   * Wait for layout after a view swap (e.g. success panel mounts) before scrolling.
   * Default 0 — next animation frame only.
   */
  delayMs?: number;
};

/**
 * Scroll to the very top of the page (document y = 0, above the sticky header).
 *
 * @example
 * const { ref, scrollToTop } = useScrollAnchor();
 * return (
 *   <ScrollAnchor ref={ref}>
 *     ...
 *     <button type="button" onClick={() => { goNext(); scrollToTop(); }}>Continue</button>
 *   </ScrollAnchor>
 * );
 */
export function useScrollAnchor() {
  const ref = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback((options?: ScrollToTopOptions) => {
    const run = () => scrollToPageTop();
    const delayMs = options?.delayMs ?? 0;

    if (delayMs > 0) {
      window.setTimeout(() => {
        requestAnimationFrame(run);
      }, delayMs);
      return;
    }

    requestAnimationFrame(run);
  }, []);

  return { ref, scrollToTop };
}

export type ScrollAnchorProps = Omit<ComponentPropsWithoutRef<"div">, "ref"> & {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
};

/**
 * Optional markup wrapper for multi-step panels.
 * `scrollToTop` always goes to page top — not this element's offset.
 */
export function ScrollAnchor({ ref, className, children, ...props }: ScrollAnchorProps) {
  return (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  );
}
