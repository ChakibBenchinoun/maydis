import type { Metadata } from "next";
import Link from "next/link";

import { ReserveForm } from "@/components/reserve-form";
import { site, openingHours } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Reserve",
  description: `Reserve a table at ${site.name} in Oran.`,
};

export default function ReservePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="bg-secondary/60 border-b border-border pt-24 pb-10 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            ← Back to {site.name}
          </Link>
          <p className="text-[10px] tracking-[0.35em] uppercase text-accent font-bold mb-3">
            Book a table
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Reserve at {site.name}
          </h1>
          <p className="text-muted-foreground text-sm mt-3 max-w-xl leading-relaxed">
            Tell us when you would like to visit. We confirm by phone as soon as we can.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border/50 p-7 shadow-sm">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Before you book
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <li>
                  · Requests are confirmed by our team — not instant auto-booking.
                </li>
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

            <div className="bg-card rounded-2xl border border-border/50 p-7 shadow-sm">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Opening hours
              </h2>
              <div className="space-y-2">
                {openingHours.map(({ day, hours }) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{day}</span>
                    <span className="font-semibold text-foreground">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-7">
              <ReserveForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
