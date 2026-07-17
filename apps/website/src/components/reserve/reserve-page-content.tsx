"use client";

import { useCallback, useEffect, useState } from "react";

import { ReserveForm } from "@/components/reserve/reserve-form";
import { Container } from "@/components/ui/container";
import { SectionDivider } from "@/components/ui/section-divider";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/cn";

/**
 * Reserve page body — hides “Events / Reserve for an event” header on success
 * so the confirmation report is the full focus, vertically centered in the viewport.
 */
export function ReservePageContent() {
  const [success, setSuccess] = useState(false);
  const onSuccessChange = useCallback((next: boolean) => {
    setSuccess(next);
  }, []);

  // Success is a fixed, full-viewport panel — block document scroll on mobile.
  useEffect(() => {
    if (!success) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [success]);

  return (
    <section
      className={cn(
        "relative flex flex-col",
        // Success: lock to visual viewport (fixed) so mobile chrome / min-h-screen
        // never add a second scrollable band under the sticky nav.
        success
          ? "bg-background fixed inset-0 z-[1] justify-center overflow-hidden pt-14 pb-3 sm:pb-6"
          : "flex-1 py-28 md:py-32",
      )}
    >
      <Container
        className={cn(
          "relative z-[1] w-full",
          success && "flex min-h-0 flex-1 flex-col items-center justify-center",
        )}
      >
        {!success ? (
          <div className="mb-5 text-center md:mb-8">
            <SectionLabel>Events</SectionLabel>
            <h1 className="font-display text-foreground text-4xl font-bold md:text-5xl">
              Reserve for an event
            </h1>
            <SectionDivider />
          </div>
        ) : null}

        <div className={cn("mx-auto w-full min-w-0", success ? "max-w-md" : "max-w-lg")}>
          <ReserveForm onSuccessChange={onSuccessChange} />
        </div>
      </Container>
    </section>
  );
}
