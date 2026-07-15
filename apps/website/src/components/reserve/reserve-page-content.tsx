"use client";

import { useCallback, useState } from "react";

import { ReserveForm } from "@/components/reserve/reserve-form";
import { Container } from "@/components/ui/container";
import { SectionDivider } from "@/components/ui/section-divider";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/cn";

/**
 * Reserve page body — hides “Events / Reserve for an event” header on success
 * so the confirmation report is the full focus.
 */
export function ReservePageContent() {
  const [success, setSuccess] = useState(false);
  const onSuccessChange = useCallback((next: boolean) => {
    setSuccess(next);
  }, []);

  return (
    <section
      className={cn("relative flex flex-1 flex-col", success ? "py-20 md:py-24" : "py-28 md:py-32")}
    >
      <Container className="relative z-[1] w-full">
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
