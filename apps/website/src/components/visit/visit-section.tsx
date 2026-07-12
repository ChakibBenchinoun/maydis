import { Clock, Instagram, MapPin } from "lucide-react";

import { SectionDivider } from "@/components/ui/section-divider";
import { SectionLabel } from "@/components/ui/section-label";
import { openingHours, site, socialLinks } from "@/lib/constants";

export function VisitSection() {
  return (
    <section id="visit" className="bg-secondary/45 px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <SectionLabel>Come find us</SectionLabel>
          <h2 className="font-display text-foreground text-4xl font-bold md:text-5xl">
            Visit {site.name}
          </h2>
          <SectionDivider />
        </div>

        <div className="border-border/30 mb-8 grid gap-0 overflow-hidden rounded-3xl border shadow-xl md:grid-cols-2">
          <div className="bg-secondary relative aspect-[4/3] min-h-[300px] md:aspect-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/gallery-01.jpg"
              alt="Maydi's warm interior"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-black/30 md:bg-gradient-to-l" />
          </div>

          <div className="bg-card flex flex-col justify-center gap-8 px-8 py-10 md:px-12 md:py-12">
            <div>
              <p className="text-accent mb-2 text-[10px] font-bold tracking-[0.3em] uppercase">
                Reserve a table
              </p>
              <a
                href={site.phoneHref}
                className="font-display text-primary text-3xl leading-tight font-bold transition-colors hover:text-amber-500 md:text-4xl"
              >
                {site.phone}
              </a>
            </div>

            <div className="bg-border h-px w-full" />

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
                <MapPin size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-foreground mb-1 text-sm font-semibold">Address</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {site.addressLine1}
                  <br />
                  {site.addressLine2}
                </p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary mt-2 inline-block text-xs font-semibold hover:underline"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
                <Clock size={18} className="text-primary" />
              </div>
              <div className="w-full">
                <p className="text-foreground mb-3 text-sm font-semibold">Opening Hours</p>
                <div className="space-y-2">
                  {openingHours.map(({ day, hours }) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">{day}</span>
                      <span className="text-foreground text-sm font-semibold">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
              {socialLinks.map((link, index) => (
                <span key={link.href} className="contents">
                  {index > 0 && <span className="text-border">·</span>}
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase transition-colors"
                  >
                    {link.label === "Instagram" && <Instagram size={15} />}
                    {link.label}
                  </a>
                </span>
              ))}
              <span className="text-border">·</span>
              <a
                href={site.guideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary text-xs font-semibold tracking-wide uppercase transition-colors"
              >
                Guide Oran
              </a>
            </div>

            <a
              href="/reserve"
              className="bg-primary inline-flex w-full justify-center rounded-full px-6 py-3 text-center text-[11px] font-semibold tracking-[0.12em] text-white uppercase shadow-md transition-colors hover:bg-amber-500 sm:w-auto"
            >
              Reserve a table online
            </a>
          </div>
        </div>

        <div className="border-border/30 mb-8 aspect-video overflow-hidden rounded-3xl border shadow-lg md:aspect-[16/6]">
          <iframe
            src={site.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Maydi's location in Oran, Algeria"
          />
        </div>
      </div>
    </section>
  );
}
