"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { todayIsoLocal } from "@/lib/reservations/options";
import { cn } from "@/lib/cn";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;

function toIso(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseIso(iso: string): { y: number; m: number; d: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d };
}

export function ReserveCalendar({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  const today = todayIsoLocal();
  const initial = parseIso(value) ?? parseIso(today)!;
  const [viewYear, setViewYear] = useState(initial.y);
  const [viewMonth, setViewMonth] = useState(initial.m);

  const cells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    // Monday-first: JS getDay() Sun=0 → map to 0=Mon
    const startPad = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const out: Array<{ iso: string; day: number; inMonth: boolean } | null> = [];
    for (let i = 0; i < startPad; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      out.push({ iso: toIso(viewYear, viewMonth, d), day: d, inMonth: true });
    }
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [viewYear, viewMonth]);

  const title = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  }

  const todayParsed = parseIso(today)!;
  const canGoPrev =
    viewYear > todayParsed.y || (viewYear === todayParsed.y && viewMonth > todayParsed.m);

  return (
    <div className="border-border bg-card rounded-xl border p-3">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="text-foreground hover:bg-secondary disabled:text-muted-foreground/40 rounded-lg p-1.5 disabled:pointer-events-none"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-display text-foreground text-sm font-bold">{title}</p>
        <button
          type="button"
          onClick={nextMonth}
          className="text-foreground hover:bg-secondary rounded-lg p-1.5"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-0.5">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="text-muted-foreground py-1 text-center text-[10px] font-semibold tracking-wide uppercase"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5" role="grid" aria-label="Choose date">
        {cells.map((cell, i) => {
          if (!cell) {
            return <div key={`e-${i}`} className="aspect-square" />;
          }
          const disabled = cell.iso < today;
          const selected = cell.iso === value;
          const isToday = cell.iso === today;
          return (
            <button
              key={cell.iso}
              type="button"
              disabled={disabled}
              onClick={() => onChange(cell.iso)}
              className={cn(
                "aspect-square rounded-lg text-sm font-medium transition-colors",
                disabled && "text-muted-foreground/35 cursor-not-allowed",
                !disabled && !selected && "text-foreground hover:bg-secondary",
                selected && "bg-primary text-primary-foreground shadow-sm",
                isToday && !selected && "ring-primary/40 ring-1 ring-inset",
              )}
              aria-pressed={selected}
              aria-label={cell.iso}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
