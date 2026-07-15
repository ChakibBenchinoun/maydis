"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/cn";
import { GUESTS_MAX, GUESTS_MIN } from "@/lib/reservations/options";

import { controlSurfaceClass } from "./reserve-field-styles";

/**
 * Compact guest count control — slightly smaller than default field height.
 */
export function ReserveGuestStepper({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (next: string) => void;
  id?: string;
}) {
  const n = Math.min(GUESTS_MAX, Math.max(GUESTS_MIN, Number(value) || GUESTS_MIN));

  function set(next: number) {
    const clamped = Math.min(GUESTS_MAX, Math.max(GUESTS_MIN, next));
    onChange(String(clamped));
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Fewer guests"
        disabled={n <= GUESTS_MIN}
        onClick={() => set(n - 1)}
        className={cn(
          controlSurfaceClass,
          "text-foreground hover:border-primary flex h-9 w-9 items-center justify-center rounded-md transition-colors",
          "disabled:pointer-events-none disabled:opacity-40",
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <div
        id={id}
        className={cn(controlSurfaceClass, "min-w-[4.75rem] rounded-md px-2.5 py-1.5 text-center")}
        aria-live="polite"
      >
        <span className="text-foreground text-base font-semibold tabular-nums">{n}</span>
        <span className="text-muted-foreground ml-1 text-xs">{n === 1 ? "guest" : "guests"}</span>
      </div>
      <button
        type="button"
        aria-label="More guests"
        disabled={n >= GUESTS_MAX}
        onClick={() => set(n + 1)}
        className={cn(
          controlSurfaceClass,
          "text-foreground hover:border-primary flex h-9 w-9 items-center justify-center rounded-md transition-colors",
          "disabled:pointer-events-none disabled:opacity-40",
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
