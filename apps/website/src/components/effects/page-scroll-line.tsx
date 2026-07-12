"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import { ScrollDraw } from "svg-scroll-draw/react";

import { cn } from "@/lib/cn";

/** Soft accent green — readable through for body copy */
const DEFAULT_COLOR = "#a8c9a5";

/**
 * Default meandering path (viewBox 0 0 1000 1000).
 * Starts near top (slightly left of center), ends at the bottom edge.
 */
export const DEFAULT_SCROLL_LINE_PATH =
  "M 420 0 " +
  "C 140 70, 60 150, 280 230 " +
  "C 540 310, 800 370, 620 450 " +
  "C 400 530, 80 570, 160 670 " +
  "C 260 770, 700 790, 740 870 " +
  "C 780 930, 520 980, 420 1000";

export type PageScrollLineProps = {
  className?: string;
  /** Stroke color (default soft accent green). */
  color?: string;
  /** Path `d` in viewBox 0 0 1000 1000. */
  path?: string;
  /** Stroke width in SVG units. */
  strokeWidth?: number;
  /** 0–1 line opacity. */
  opacity?: number;
  /** ScrollDraw speed multiplier. */
  speed?: number;
  /** ScrollDraw easing name. */
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | "spring";
  /**
   * Reverse when scrolling up. Default false — iOS touch bounce + autoReverse
   * causes visible flicker; scroll progress still scrubs the draw.
   */
  autoReverse?: boolean;
  /** When the draw starts / finishes relative to the line box. */
  trigger?: { start?: string; end?: string };
};

function documentTop(el: Element) {
  const rect = el.getBoundingClientRect();
  // Avoid iOS overscroll jitter in the sum
  const y = window.scrollY || window.pageYOffset || 0;
  return rect.top + Math.max(0, y);
}

/**
 * Decorative line that draws as the user scrolls.
 * Height is measured once (and on resize) to the footer — not on every scroll frame.
 * Place inside a `relative` parent — or use `ScrollLineRegion`.
 *
 * @see https://svg-scroll-draw.vercel.app/
 */
export function PageScrollLine({
  className,
  color = DEFAULT_COLOR,
  path = DEFAULT_SCROLL_LINE_PATH,
  strokeWidth = 2,
  opacity = 0.28,
  speed = 1.1,
  easing = "ease-out",
  autoReverse = false,
  trigger = { start: "top 85%", end: "bottom bottom" },
}: PageScrollLineProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  const heightRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const region = root?.parentElement;
    if (!root || !region) return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let raf = 0;

    const measure = () => {
      const footer = document.querySelector("footer");
      const top = documentTop(region);
      const end = footer ? documentTop(footer) : top + region.scrollHeight;
      const next = Math.max(Math.ceil(end - top), region.scrollHeight, 1);

      // Ignore sub-pixel / rubber-band noise (avoids remount flicker)
      if (heightRef.current !== null && Math.abs(heightRef.current - next) < 12) {
        return;
      }
      heightRef.current = next;
      setHeight(next);
    };

    const schedule = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(measure);
      }, 80);
    };

    measure();
    // After images/fonts settle
    const t1 = window.setTimeout(measure, 200);
    const t2 = window.setTimeout(measure, 800);

    window.addEventListener("resize", schedule, { passive: true });
    // Only observe the content region — not the absolute line (avoids feedback loops)
    const ro = new ResizeObserver(schedule);
    ro.observe(region);
    const footer = document.querySelector("footer");
    if (footer) ro.observe(footer);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        // Keep behind content; never capture touch (critical on iOS)
        "pointer-events-none absolute top-0 right-0 left-0 z-0 overflow-visible select-none",
        className,
      )}
      style={{ height: height ?? "100%" }}
      aria-hidden
    >
      {/* Wait for stable height so ScrollDraw doesn't re-init mid-scroll */}
      {height !== null ? (
        <ScrollDraw
          key={height}
          className="block h-full w-full"
          style={{ height: "100%", width: "100%", pointerEvents: "none" }}
          easing={easing}
          speed={speed}
          autoReverse={autoReverse}
          strokeColor={color}
          trigger={trigger}
          // JS engine is more predictable on iOS Safari than view() timeline
          native={false}
        >
          <svg
            viewBox="0 0 1000 1000"
            className="pointer-events-none block h-full w-full overflow-visible"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={opacity}
            />
          </svg>
        </ScrollDraw>
      ) : null}
    </div>
  );
}

type ScrollLineRegionProps<T extends ElementType = "div"> = {
  as?: T;
  children?: ReactNode;
  className?: string;
  /** Hide the line (region still provides relative stacking). */
  line?: boolean;
  lineProps?: PageScrollLineProps;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/**
 * Relative region with an optional full-height scroll-drawn line behind content.
 * Portable — any page/band can compose it.
 */
export function ScrollLineRegion<T extends ElementType = "div">({
  as,
  children,
  className,
  line = true,
  lineProps,
  ...rest
}: ScrollLineRegionProps<T>) {
  const Comp = (as ?? "div") as ElementType;
  return (
    <Comp className={cn("relative", className)} {...rest}>
      {line ? <PageScrollLine {...lineProps} /> : null}
      <div className="relative z-[1]">{children}</div>
    </Comp>
  );
}
