import type { Metadata } from "next";

import { ScrollLineRegion } from "@/components/effects/page-scroll-line";
import { PageHeader } from "@/components/layout/page-header";
import { ReserveForm } from "@/components/reserve/reserve-form";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/constants";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Reserve",
  description: `Book a private event or celebration at ${site.name} in Oran.`,
};

export default function ReservePage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col">
      {/* Header outside the line region so the line starts below it */}
      <PageHeader
        eyebrow="Events"
        title="Reserve for an event"
        description={`Birthdays, gatherings, and private moments at ${site.name}. Tell us your date and we will confirm by phone.`}
        descriptionClassName="max-w-xl"
        imageSrc={images.visit}
        imageAlt={`${site.name} café interior`}
      />

      {/*
        flex-1 grows to fill space above the footer (sticky footer layout).
        Line is clipped to this region — never draws over the footer.
      */}
      <ScrollLineRegion className="flex min-h-0 flex-1 flex-col">
        <Container className="flex flex-1 flex-col py-12 md:py-16">
          <div className="mx-auto flex w-full min-w-0 max-w-lg flex-1 flex-col">
            <div className="bg-card border-border/50 my-auto w-full rounded-2xl border p-6 shadow-sm sm:p-8">
              <ReserveForm />
            </div>
          </div>
        </Container>
      </ScrollLineRegion>
    </main>
  );
}
