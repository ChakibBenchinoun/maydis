"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

import { useMarquee, type MarqueeDirection } from "@/components/effects/use-marquee";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  /** Autoplay speed px/s. Default 32. */
  speed?: number;
  /** Continuous auto-scroll. Default true. */
  autoplay?: boolean;
  /** Travel direction — `right` reverses the strip. Default `left`. */
  direction?: MarqueeDirection;
  /**
   * Wheel / drag pan. Default true (menu).
   * Set false for display-only strips (gallery).
   */
  interactive?: boolean;
  resumeDelayMs?: number;
  /** Remeasure key when content identity changes. */
  resetKey?: string;
};

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduce;
}

/** Prefix React keys for the duplicated marquee half. */
function withCopyKeys(nodes: ReactNode[], copy: "a" | "b"): ReactNode[] {
  return nodes.map((child, i) => {
    if (!isValidElement(child)) {
      return <span key={`${copy}-frag-${i}`}>{child}</span>;
    }
    const el = child as ReactElement<{ key?: string }>;
    return cloneElement(el, { key: `${copy}-${el.key ?? i}` });
  });
}

/**
 * Horizontal infinite marquee — shared animation primitive.
 *
 * @example
 * // Interactive (menu)
 * <Marquee interactive speed={36}>{cards}</Marquee>
 *
 * // Display only (gallery)
 * <Marquee interactive={false} speed={28}>{photos}</Marquee>
 */
export function Marquee({
  children,
  className = "",
  trackClassName = "",
  speed = 32,
  autoplay = true,
  direction = "left",
  interactive = true,
  resumeDelayMs = 2200,
  resetKey,
}: MarqueeProps) {
  const reduceMotion = usePrefersReducedMotion();
  const childList = useMemo(() => Children.toArray(children), [children]);
  const key = resetKey ?? `n-${childList.length}`;
  const animate = autoplay && !reduceMotion && childList.length > 0;

  const { rootRef, trackRef } = useMarquee({
    enabled: animate,
    speed,
    direction,
    interactive: interactive && animate,
    resumeDelayMs,
    resetKey: key,
  });

  if (childList.length === 0) return null;

  // Static fallback (reduced motion / autoplay off)
  if (!animate) {
    return (
      <div
        className={[
          "overflow-x-auto overscroll-x-contain",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          className,
        ].join(" ")}
      >
        <div
          className={`flex w-max min-w-full items-stretch justify-center gap-4 md:gap-5 ${trackClassName}`}
        >
          {childList}
        </div>
      </div>
    );
  }

  const looped = [...withCopyKeys(childList, "a"), ...withCopyKeys(childList, "b")];

  return (
    <div
      ref={rootRef}
      className={[
        "overflow-hidden",
        interactive ? "cursor-grab active:cursor-grabbing" : "pointer-events-none select-none",
        className,
      ].join(" ")}
      style={interactive ? { touchAction: "pan-y" } : undefined}
      aria-hidden={!interactive ? true : undefined}
    >
      <div
        ref={trackRef as React.RefObject<HTMLDivElement>}
        className={`flex w-max items-stretch will-change-transform ${trackClassName}`}
        style={{ transform: "translate3d(0,0,0)", backfaceVisibility: "hidden" }}
      >
        {looped}
      </div>
    </div>
  );
}
