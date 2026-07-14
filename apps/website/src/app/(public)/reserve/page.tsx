import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { ReserveForm } from "@/components/reserve/reserve-form";
import { Container } from "@/components/ui/container";
import { openingHours, site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Reserve",
  description: `Book a private event or celebration at ${site.name} in Oran.`,
};

export default function ReservePage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        eyebrow="Events"
        title="Reserve for an event"
        description={`Birthdays, gatherings, and private moments at ${site.name}. Tell us your date and we will confirm by phone.`}
        descriptionClassName="max-w-xl"
      />

      <Container className="py-12 md:py-16">
        <div className="grid min-w-0 items-start gap-10 lg:grid-cols-[1fr_420px]">
          <div className="min-w-0 space-y-6">
            <div className="bg-card border-border/50 rounded-2xl border p-5 shadow-sm sm:p-7">
              <h2 className="font-display text-foreground mb-4 text-xl font-bold">
                Before you book
              </h2>
              <ul className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                <li>· Event requests are confirmed by our team — not instant auto-booking.</li>
                <li>
                  · Same-day or larger celebrations: call{" "}
                  <a href={site.phoneHref} className="text-primary font-semibold hover:underline">
                    {site.phone}
                  </a>
                  .
                </li>
                <li>
                  · Find us on{" "}
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold hover:underline"
                  >
                    Google Maps
                  </a>
                  .
                </li>
              </ul>
            </div>

            <div className="bg-card border-border/50 rounded-2xl border p-5 shadow-sm sm:p-7">
              <h2 className="font-display text-foreground mb-4 text-xl font-bold">Opening hours</h2>
              <div className="space-y-2">
                {openingHours.map(({ day, hours }) => (
                  <div key={day} className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">{day}</span>
                    <span className="text-foreground shrink-0 font-semibold tabular-nums">
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:sticky lg:top-24">
            <div className="bg-card border-border/50 rounded-2xl border p-5 shadow-sm sm:p-7">
              <ReserveForm />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
