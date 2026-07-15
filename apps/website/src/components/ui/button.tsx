import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[0.12em] uppercase transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

/**
 * Mobile-first sizes (compact on small screens, larger from `sm`).
 */
const sizes = {
  sm: "px-4 py-2 text-[10px] sm:px-5 sm:py-2 sm:text-[11px]",
  md: "px-6 py-2.5 text-[10px] sm:px-9 sm:py-3.5 sm:text-[11px]",
  lg: "px-7 py-3 text-[11px] sm:px-10 sm:py-4 sm:text-xs",
  icon: "h-9 w-9 p-0 sm:h-10 sm:w-10",
} as const;

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-md hover:bg-amber-500 hover:shadow-lg focus-visible:ring-primary focus-visible:ring-offset-background",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary focus-visible:ring-primary focus-visible:ring-offset-background",
  outline:
    "border border-border bg-transparent text-foreground hover:border-primary hover:text-primary focus-visible:ring-primary focus-visible:ring-offset-background",
  /** Light outline for dark/hero backgrounds */
  outlineLight:
    "border border-white/50 bg-white/5 text-white backdrop-blur-sm hover:bg-white/12 focus-visible:ring-white/70 focus-visible:ring-offset-transparent",
  ghost:
    "bg-transparent text-foreground hover:bg-secondary/80 hover:text-primary focus-visible:ring-primary focus-visible:ring-offset-background",
  ghostLight:
    "bg-transparent text-white/70 hover:text-amber-200 focus-visible:ring-white/60 focus-visible:ring-offset-transparent",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children?: ReactNode;
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return cn(
    base,
    variants[variant],
    sizes[size],
    // min-w-0 prevents flex/grid parents from letting the pill grow past the card
    fullWidth && "box-border w-full min-w-0 max-w-full",
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, fullWidth, className })}
      {...props}
    >
      {children}
    </button>
  );
}
