import { Clock, MapPin } from "lucide-react";

import {
  Container,
  Link,
  Section,
  SectionDivider,
  sectionHeaderClass,
  SectionLabel,
  SocialIcon,
} from "@/components/ui";
import { openingHours, reserveLink, site, socialLinks } from "@/lib/constants";

export function VisitSection() {
  return (
    <Section id="visit">
      <Container>
        <div className={sectionHeaderClass}>
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
              <div className="min-w-0 flex-1">
                <p className="text-foreground mb-2 text-sm font-semibold">Opening Hours</p>
                {/* Tight day/hours columns — not full-width justify-between */}
                <div className="inline-grid grid-cols-[auto_auto] gap-x-5 gap-y-1 text-sm">
                  {openingHours.map(({ day, hours }) => (
                    <div key={day} className="contents">
                      <span className="text-muted-foreground">{day}</span>
                      <span className="text-foreground text-right font-semibold tabular-nums">
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="text-muted-foreground hover:text-primary border-border/60 hover:border-primary/40 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
                >
                  <SocialIcon label={link.label} size={16} />
                </a>
              ))}
              <a
                href={site.guideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary text-xs font-semibold tracking-wide uppercase transition-colors"
              >
                Guide Oran
              </a>
            </div>

            <Link href={reserveLink.href} variant="primary" fullWidth className="sm:w-auto">
              Reserve a table online
            </Link>
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
      </Container>
    </Section>
  );
}
