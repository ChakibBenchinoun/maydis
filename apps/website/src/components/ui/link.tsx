import type { ComponentProps, ReactNode } from "react";
import NextLink from "next/link";

import { buttonClassName, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const textVariants = {
  default:
    "cursor-pointer text-foreground hover:text-primary active:text-primary active:opacity-80 font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-sm",
  muted:
    "cursor-pointer text-muted-foreground hover:text-primary active:text-primary active:opacity-80 text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-sm",
  nav: "cursor-pointer text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 hover:text-primary active:text-primary active:opacity-80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-sm",
  underline:
    "cursor-pointer underline-offset-4 hover:underline active:opacity-80 text-primary font-semibold",
} as const;

export type LinkTextVariant = keyof typeof textVariants;

type Common = {
  children?: ReactNode;
  className?: string;
  /**
   * Visual style:
   * - button variants → pill CTA
   * - text variants → plain / muted / nav links
   */
  variant?: ButtonVariant | "text" | "textMuted" | "textNav" | "textUnderline";
  size?: ButtonSize;
  fullWidth?: boolean;
};

type InternalLinkProps = Common &
  Omit<ComponentProps<typeof NextLink>, "className" | "children"> & {
    external?: false;
  };

type ExternalLinkProps = Common &
  Omit<ComponentProps<"a">, "className" | "children" | "href"> & {
    href: string;
    external: true;
  };

export type LinkProps = InternalLinkProps | ExternalLinkProps;

function resolveClassName({ variant = "primary", size = "md", fullWidth, className }: Common) {
  if (variant === "text") return cn(textVariants.default, className);
  if (variant === "textMuted") return cn(textVariants.muted, className);
  if (variant === "textNav") return cn(textVariants.nav, className);
  if (variant === "textUnderline") return cn(textVariants.underline, className);

  return buttonClassName({
    variant: variant as ButtonVariant,
    size,
    fullWidth,
    className,
  });
}

/**
 * App link — Next.js route or external URL.
 * Use `variant` for CTA pills (same as Button) or text styles.
 */
export function Link(props: LinkProps) {
  const { children, className, variant = "primary", size = "md", fullWidth, ...rest } = props;
  const classes = resolveClassName({ variant, size, fullWidth, className });

  if ("external" in props && props.external) {
    const { external: _e, href, ...anchorRest } = rest as ExternalLinkProps;
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...anchorRest}>
        {children}
      </a>
    );
  }

  const { external: _e, ...linkRest } = rest as InternalLinkProps;
  return (
    <NextLink className={classes} {...linkRest}>
      {children}
    </NextLink>
  );
}
