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
    <main className="bg-background min-h-screen">
      {/* Header outside the line region so the line starts below it */}
      <PageHeader
        eyebrow="Events"
        title="Reserve for an event"
        description={`Birthdays, gatherings, and private moments at ${site.name}. Tell us your date and we will confirm by phone.`}
        descriptionClassName="max-w-xl"
        imageSrc={images.visit}
        imageAlt={`${site.name} café interior`}
      />

      {/* Line runs from end of header → start of footer (home-page pattern) */}
      <ScrollLineRegion>
        <Container className="py-12 md:py-16">
          <div className="mx-auto min-w-0 max-w-lg">
            <div className="bg-card border-border/50 rounded-2xl border p-6 shadow-sm sm:p-8">
              <ReserveForm />
            </div>
          </div>
        </Container>
      </ScrollLineRegion>
    </main>
  );
}
