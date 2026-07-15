"use client";

import { cn } from "@/lib/cn";
import { TIME_SLOTS } from "@/lib/reservations/options";

import { controlSurfaceClass } from "./reserve-field-styles";

export function ReserveTimeSlots({
  value,
  onChange,
}: {
  value: string;
  onChange: (time: string) => void;
}) {
  return (
    <div>
      <p className="text-muted-foreground mb-2.5 text-xs font-semibold tracking-wider uppercase">
        Time
      </p>
      <div className="flex flex-wrap gap-2" role="listbox" aria-label="Time slots">
        {TIME_SLOTS.map((t) => {
          const selected = value === t;
          return (
            <button
              key={t}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onChange(t)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-semibold tabular-nums transition-colors",
                selected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : cn(controlSurfaceClass, "text-foreground hover:border-primary/50"),
              )}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}
