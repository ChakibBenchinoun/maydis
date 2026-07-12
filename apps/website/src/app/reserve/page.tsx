import type { Metadata } from "next";
import Link from "next/link";

import { ReserveForm } from "@/components/reserve/reserve-form";
import { Container } from "@/components/ui/container";
import { openingHours, site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Reserve",
  description: `Reserve a table at ${site.name} in Oran.`,
};

export default function ReservePage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="bg-secondary/60 border-border border-b pt-24 pb-10">
        <Container>
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary mb-6 inline-flex text-sm transition-colors"
          >
            ← Back to {site.name}
          </Link>
          <p className="text-accent mb-3 text-[10px] font-bold tracking-[0.35em] uppercase">
            Book a table
          </p>
          <h1 className="font-display text-foreground text-4xl font-bold md:text-5xl">
            Reserve at {site.name}
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
            Tell us when you would like to visit. We confirm by phone as soon as we can.
          </p>
        </Container>
      </div>

      <Container className="py-12 md:py-16">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <div className="bg-card border-border/50 rounded-2xl border p-7 shadow-sm">
              <h2 className="font-display text-foreground mb-4 text-xl font-bold">
                Before you book
              </h2>
              <ul className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                <li>· Requests are confirmed by our team — not instant auto-booking.</li>
                <li>
                  · Same-day or large groups: call{" "}
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

            <div className="bg-card border-border/50 rounded-2xl border p-7 shadow-sm">
              <h2 className="font-display text-foreground mb-4 text-xl font-bold">Opening hours</h2>
              <div className="space-y-2">
                {openingHours.map(({ day, hours }) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{day}</span>
                    <span className="text-foreground font-semibold">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="bg-card border-border/50 rounded-2xl border p-7 shadow-sm">
              <ReserveForm />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
