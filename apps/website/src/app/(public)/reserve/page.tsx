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
    <ScrollLineRegion as="main" className="bg-background flex min-h-0 flex-1 flex-col">
      {/*
        Same open cream layout as /menu — no floating app card.
        Header + form sit on the page surface.
      */}
      <section className="relative flex flex-1 flex-col py-28 md:py-32">
        <Container className="relative z-[1] w-full">
          <div className="mb-12 text-center md:mb-14">
            <SectionLabel>Events</SectionLabel>
            <h1 className="font-display text-foreground text-4xl font-bold md:text-5xl">
              Reserve for an event
            </h1>
            <SectionDivider />
            <p className="text-muted-foreground mx-auto mt-5 max-w-md text-sm leading-relaxed">
              Birthdays, gatherings, and private moments at {site.name}.
            </p>
            {/* Trust line — confirmation model up front (matches Visit / form copy) */}
            <p className="text-foreground/80 mx-auto mt-4 max-w-md text-sm leading-relaxed">
              We’ll confirm by{" "}
              <span className="text-foreground font-medium">WhatsApp or phone</span>
              {" — "}
              not instant auto-booking. Prefer to call?{" "}
              <a
                href={site.phoneHref}
                className="text-primary font-semibold hover:underline"
              >
                {site.phone}
              </a>
            </p>
          </div>

          <div className="mx-auto w-full min-w-0 max-w-lg">
            <ReserveForm />
          </div>
        </Container>
      </section>
    </ScrollLineRegion>
  );
}
