import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Shared admin page title + optional actions row.
 */
export function AdminPageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", className)}
    >
      <div className="min-w-0">
        <h1 className="font-display text-foreground text-2xl font-bold md:text-3xl">{title}</h1>
        {description ? (
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
