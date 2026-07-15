"use client";

import { Check } from "lucide-react";

import { RESERVE_STEPS } from "@/lib/reservations/schema";
import { cn } from "@/lib/cn";

type StepStatus = "complete" | "current" | "upcoming";

function statusFor(index: number, current: number): StepStatus {
  if (index < current) return "complete";
  if (index === current) return "current";
  return "upcoming";
}

/** Form steps only — Info is shown before progress appears. */
const PROGRESS_STEPS = RESERVE_STEPS.filter((s) => s.id !== "info");

/**
 * Circle steps + connecting line (Tailwind Plus progress pattern).
 * Full width; connectors animate fill when a step completes.
 */
export function ReserveStepper({
  /** Index into full RESERVE_STEPS (1 = Contact … 4 = Review). */
  currentStep,
}: {
  currentStep: number;
}) {
  const progressIndex = Math.max(0, currentStep - 1);

  return (
    <nav aria-label="Progress" className="mb-8 w-full">
      <ol className="flex w-full items-center">
        {PROGRESS_STEPS.map((step, stepIdx) => {
          const status = statusFor(stepIdx, progressIndex);
          const isLast = stepIdx === PROGRESS_STEPS.length - 1;
          // Line after this circle fills once we've moved past this step
          const lineComplete = stepIdx < progressIndex;

          return (
            <li
              key={step.id}
              className={cn("relative flex items-center", !isLast && "min-w-0 flex-1")}
            >
              {/* Circle — bright card fill so progress reads clearly on cream */}
              {status === "complete" ? (
                <span
                  className={cn(
                    "bg-primary relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full shadow-sm",
                    "transition-all duration-300 ease-out",
                  )}
                >
                  <Check
                    className="text-primary-foreground size-4 transition-opacity duration-300"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <span className="sr-only">{step.label} — complete</span>
                </span>
              ) : status === "current" ? (
                <span
                  aria-current="step"
                  className={cn(
                    "border-primary bg-card relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 shadow-sm",
                    "ring-primary/20 ring-2 ring-offset-2 ring-offset-background",
                    "transition-all duration-300 ease-out",
                  )}
                >
                  <span
                    aria-hidden
                    className="bg-primary size-2.5 scale-100 rounded-full transition-transform duration-300 ease-out"
                  />
                  <span className="sr-only">{step.label} — current</span>
                </span>
              ) : (
                <span
                  className={cn(
                    "border-border bg-card relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2",
                    "transition-all duration-300 ease-out",
                  )}
                >
                  <span aria-hidden className="bg-secondary size-2.5 rounded-full" />
                  <span className="sr-only">{step.label} — upcoming</span>
                </span>
              )}

              {/* Connector — bright track + gold fill */}
              {!isLast ? (
                <div
                  aria-hidden
                  className="bg-card relative mx-2 h-1.5 min-w-0 flex-1 overflow-hidden rounded-full border border-border/60 sm:mx-3"
                >
                  <div
                    className={cn(
                      "bg-primary absolute inset-y-0 left-0 w-full origin-left rounded-full",
                      "transition-transform duration-500 ease-out motion-reduce:transition-none",
                      lineComplete ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      <p className="text-muted-foreground mt-3 text-center text-xs font-medium transition-opacity duration-300">
        <span className="text-foreground font-semibold">
          {PROGRESS_STEPS[progressIndex]?.label}
        </span>
        {" · "}
        Step {progressIndex + 1} of {PROGRESS_STEPS.length}
      </p>
    </nav>
  );
}
