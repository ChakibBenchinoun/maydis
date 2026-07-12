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

/** Default theme accent green */
const DEFAULT_COLOR = "#6b9b67";

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
  /** Stroke color (default theme accent green). */
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
  /** Reverse draw when scrolling up. */
  autoReverse?: boolean;
  /** When the draw starts / finishes relative to the line box. */
  trigger?: { start?: string; end?: string };
};

/**
 * Decorative green (or custom) line that draws as the user scrolls.
 * Absolute-fills its positioned ancestor; height extends to the site footer.
 * Place inside a `relative` parent — or use `ScrollLineRegion`.
 *
 * @see https://svg-scroll-draw.vercel.app/
 */
export function PageScrollLine({
  className,
  color = DEFAULT_COLOR,
  path = DEFAULT_SCROLL_LINE_PATH,
  strokeWidth = 3,
  opacity = 0.55,
  speed = 1.15,
  easing = "ease-out",
  autoReverse = true,
  trigger = { start: "top 85%", end: "bottom bottom" },
}: PageScrollLineProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      const footer = document.querySelector("footer");
      const top = root.getBoundingClientRect().top + window.scrollY;
      const end = footer
        ? footer.getBoundingClientRect().top + window.scrollY
        : top + (root.parentElement?.scrollHeight ?? root.offsetHeight);
      const next = Math.max(
        end - top,
        root.parentElement?.offsetHeight ?? 0,
        window.innerHeight,
      );
      setHeight(next);
    };

    measure();
    const t = window.setTimeout(measure, 100);
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    if (root.parentElement) ro.observe(root.parentElement);
    const footer = document.querySelector("footer");
    if (footer) ro.observe(footer);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn("pointer-events-none absolute top-0 right-0 left-0 z-0 overflow-visible", className)}
      style={height ? { height } : { bottom: 0 }}
      aria-hidden
    >
      <ScrollDraw
        className="block h-full w-full"
        style={{ height: "100%", width: "100%" }}
        easing={easing}
        speed={speed}
        autoReverse={autoReverse}
        strokeColor={color}
        trigger={trigger}
      >
        <svg
          viewBox="0 0 1000 1000"
          className="block h-full w-full overflow-visible"
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
 * Use on any page/band — not tied to home or menu.
 *
 * @example
 * <ScrollLineRegion as="main" className="min-h-screen">…</ScrollLineRegion>
 * <ScrollLineRegion>…sections under hero…</ScrollLineRegion>
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
