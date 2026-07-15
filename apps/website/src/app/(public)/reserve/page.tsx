import type { Metadata } from "next";

import { ScrollLineRegion } from "@/components/effects/page-scroll-line";
import { ReserveForm } from "@/components/reserve/reserve-form";
import { Container } from "@/components/ui/container";
import { SectionDivider } from "@/components/ui/section-divider";
import { SectionLabel } from "@/components/ui/section-label";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Reserve",
  description: `Book a private event or celebration at ${site.name} in Oran.`,
};

export default function ReservePage() {
  return (
    <ScrollLineRegion
      as="main"
      className="bg-background flex min-h-0 flex-1 flex-col"
    >
      {/* Same header rhythm as /menu — centered label, title, divider, description */}
      <section className="relative flex flex-1 flex-col py-28 md:py-32">
        <Container className="relative z-[1] flex flex-1 flex-col">
          <div className="mb-14 text-center">
            <SectionLabel>Events</SectionLabel>
            <h1 className="font-display text-foreground text-4xl font-bold md:text-5xl">
              Reserve for an event
            </h1>
            <SectionDivider />
            <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-sm leading-relaxed">
              Birthdays, gatherings, and private moments at {site.name}. Tell us your date
              and we will confirm by phone.
            </p>
          </div>

          <div className="mx-auto flex w-full min-w-0 max-w-lg flex-1 flex-col">
            <div className="bg-card border-border/50 my-auto w-full rounded-2xl border p-6 shadow-sm sm:p-8">
              <ReserveForm />
            </div>
          </div>
        </Container>
      </section>
    </ScrollLineRegion>
  );
}
