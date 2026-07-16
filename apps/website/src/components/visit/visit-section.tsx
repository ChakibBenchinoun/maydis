import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";

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

        <div className="border-border/30 mx-auto grid w-full max-w-5xl gap-0 overflow-hidden rounded-3xl border shadow-xl md:grid-cols-2">
          <div className="bg-card flex w-full max-w-full min-w-0 flex-col justify-center gap-8 overflow-hidden px-5 py-10 sm:px-8 md:px-12 md:py-12">
            <div className="flex min-w-0 items-start gap-4">
              <div className="bg-primary/10 mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                <Phone size={18} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-foreground mb-1 text-sm font-semibold">Phone</p>
                <p className="text-muted-foreground text-sm leading-relaxed tabular-nums">
                  {site.phone}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <a
                    href={site.phoneHref}
                    className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                  >
                    <Phone size={12} strokeWidth={2.25} />
                    Call
                  </a>
                  <a
                    href={site.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                  >
                    <MessageCircle size={12} strokeWidth={2.25} />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="flex min-w-0 items-start gap-4">
              <div className="bg-primary/10 mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                <MapPin size={18} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-foreground mb-1 text-sm font-semibold">Address</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {site.addressLine1}
                  <br />
                  {site.addressLine2}
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-start gap-4">
              <div className="bg-primary/10 mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                <Clock size={18} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground mb-2 text-sm font-semibold">Opening Hours</p>
                {/* Tight day/hours columns — not full-width justify-between */}
                <div className="inline-grid max-w-full grid-cols-[auto_auto] gap-x-5 gap-y-1 text-sm">
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

            <div className="flex min-w-0 flex-wrap items-center gap-3 pt-1">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="text-muted-foreground hover:text-primary border-border/60 hover:border-primary/40 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors"
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

            {/* Stay within card: full width, tight padding, no sm:w-auto growth */}
            <div className="w-full max-w-full min-w-0">
              <Link
                href={reserveLink.href}
                variant="primary"
                fullWidth
                className="box-border w-full max-w-full !px-4 !tracking-[0.08em] whitespace-normal"
              >
                Book an event
              </Link>
            </div>
          </div>

          <div className="bg-secondary relative aspect-[4/3] min-h-[280px] min-w-0 md:aspect-auto md:min-h-0">
            <iframe
              src={site.mapEmbedUrl}
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Maydi's location in Oran, Algeria"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
