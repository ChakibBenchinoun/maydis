"use client";

import {
  useCallback,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/cn";
import { scrollToElement } from "@/lib/scroll";

export type ScrollToTopOptions = {
  /**
   * Wait for layout after a view swap (e.g. success panel mounts) before scrolling.
   * Default 0 — next animation frame only.
   */
  delayMs?: number;
};

/**
 * Imperative scroll-to-anchor for multi-step forms, wizards, and page sections.
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
    const run = () => scrollToElement(ref.current);
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
  /**
   * Sticky-nav clearance via scroll-margin-top.
   * Default `scroll-mt-28` (~7rem) matches reserve form; override per page.
   */
  scrollMarginClassName?: string;
};

/**
 * Markup wrapper for {@link useScrollAnchor}'s ref.
 * Puts the scroll target at the top of a step / panel with nav-aware margin.
 */
export function ScrollAnchor({
  ref,
  className,
  scrollMarginClassName = "scroll-mt-28",
  children,
  ...props
}: ScrollAnchorProps) {
  return (
    <div ref={ref} className={cn(scrollMarginClassName, className)} {...props}>
      {children}
    </div>
  );
}
