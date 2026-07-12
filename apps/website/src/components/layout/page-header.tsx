import type { ReactNode } from "react";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  /** Small uppercase label above the title */
  eyebrow: string;
  title: string;
  description?: ReactNode;
  /** Width constraint for the description line (default `max-w-md`) */
  descriptionClassName?: string;
};

/**
 * Shared interior-page header — back link, eyebrow, title, optional description.
 * Used by `/menu`, `/reserve`, etc.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  descriptionClassName = "max-w-md",
}: PageHeaderProps) {
  return (
    <div className="bg-secondary/60 border-border border-b pt-24 pb-10">
      <Container>
        <p className="text-accent mb-3 text-[10px] font-bold tracking-[0.35em] uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display text-foreground text-4xl font-bold md:text-5xl">{title}</h1>
        {description ? (
          <p
            className={cn(
              "text-muted-foreground mt-3 text-sm leading-relaxed",
              descriptionClassName,
            )}
          >
            {description}
          </p>
        ) : null}
      </Container>
    </div>
  );
}
