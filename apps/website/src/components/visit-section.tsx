import { Instagram, MapPin, Clock } from "lucide-react";

import { site, socialLinks, openingHours } from "@/lib/constants";
import { SectionLabel } from "@/components/section-label";
import { SectionDivider } from "@/components/section-divider";

export function VisitSection() {
  return (
    <section id="visit" className="py-24 bg-secondary/45 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <SectionLabel>Come find us</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Visit {site.name}
          </h2>
          <SectionDivider />
        </div>

        <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-xl border border-border/30 mb-8">
          <div className="relative aspect-[4/3] md:aspect-auto bg-secondary min-h-[300px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/gallery-01.jpg"
              alt="Maydi's warm interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-black/30 md:bg-gradient-to-l" />
          </div>

          <div className="bg-card px-8 md:px-12 py-10 md:py-12 flex flex-col justify-center gap-8">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-accent font-bold mb-2">
                Reserve a table
              </p>
              <a
                href={site.phoneHref}
                className="font-display text-3xl md:text-4xl font-bold text-primary hover:text-amber-500 transition-colors leading-tight"
              >
                {site.phone}
              </a>
            </div>

            <div className="w-full h-px bg-border" />

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm mb-1">Address</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {site.addressLine1}
                  <br />
                  {site.addressLine2}
                </p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs font-semibold text-primary hover:underline"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock size={18} className="text-primary" />
              </div>
              <div className="w-full">
                <p className="font-semibold text-foreground text-sm mb-3">Opening Hours</p>
                <div className="space-y-2">
                  {openingHours.map(({ day, hours }) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">{day}</span>
                      <span className="font-semibold text-foreground text-sm">{hours}</span>
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
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs font-semibold uppercase tracking-wide"
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
                className="text-muted-foreground hover:text-primary transition-colors text-xs font-semibold uppercase tracking-wide"
              >
                Guide Oran
              </a>
            </div>

            <a
              href="/reserve"
              className="inline-flex justify-center bg-primary text-white px-6 py-3 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase hover:bg-amber-500 transition-colors shadow-md w-full sm:w-auto text-center"
            >
              Reserve a table online
            </a>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-lg border border-border/30 mb-8 aspect-video md:aspect-[16/6]">
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
