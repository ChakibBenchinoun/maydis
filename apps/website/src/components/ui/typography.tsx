import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

const headingSizes = {
  /** Hero display title */
  display:
    "font-display font-bold leading-none tracking-[0.1em] text-6xl sm:text-7xl md:text-[100px]",
  /** Page / section titles */
  section: "font-display font-bold text-foreground text-4xl md:text-5xl",
  /** Card / subsection */
  subsection: "font-display font-bold text-foreground text-xl md:text-2xl",
  /** Small card title */
  card: "font-display font-bold text-foreground text-lg leading-snug",
} as const;

const paragraphSizes = {
  sm: "text-xs sm:text-sm leading-relaxed",
  md: "text-sm md:text-base leading-relaxed",
  lg: "text-base md:text-lg leading-relaxed",
} as const;

export type HeadingSize = keyof typeof headingSizes;
export type ParagraphSize = keyof typeof paragraphSizes;

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: HeadingSize;
  children?: ReactNode;
};

export function Heading({
  as: Tag = "h2",
  size = "section",
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Tag className={cn(headingSizes[size], className)} {...props}>
      {children}
    </Tag>
  );
}

type ParagraphProps = HTMLAttributes<HTMLParagraphElement> & {
  size?: ParagraphSize;
  muted?: boolean;
  children?: ReactNode;
};

export function Paragraph({
  size = "md",
  muted = true,
  className,
  children,
  ...props
}: ParagraphProps) {
  return (
    <p
      className={cn(
        paragraphSizes[size],
        muted ? "text-muted-foreground" : "text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

/** Uppercase accent kicker — same role as SectionLabel. */
export function Eyebrow({
  as: Tag = "p",
  className,
  children,
  ...props
}: {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
} & HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={cn(
        "text-accent mb-3 text-[10px] font-bold tracking-[0.35em] uppercase",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
