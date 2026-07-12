import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Vertical section rhythm (symmetric across the homepage):
 * - mobile: py-16
 * - sm: py-20
 * - md+: py-24
 */
export const sectionPaddingClass = "py-16 sm:py-20 md:py-24";

/** Standard gap under section headers (label + title + intro). */
export const sectionHeaderClass = "mb-10 text-center md:mb-14";

export type SectionTone = "default" | "muted";

type SectionProps = HTMLAttributes<HTMLElement> & {
  /** `muted` → cream secondary band */
  tone?: SectionTone;
  children?: ReactNode;
};

/**
 * Page section shell — keep vertical spacing consistent site-wide.
 * Put `Container` (or full-bleed media) inside; backgrounds/tone live here.
 */
export function Section({ tone = "default", className, children, ...props }: SectionProps) {
  return (
    <section
      className={cn(sectionPaddingClass, tone === "muted" && "bg-secondary/45", className)}
      {...props}
    >
      {children}
    </section>
  );
}
