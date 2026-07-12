import { Instagram } from "lucide-react";

import { Container } from "@/components/ui/container";
import { site, socialLinks } from "@/lib/constants";

export function Footer() {
  const instagram = socialLinks[0];

  return (
    <footer className="bg-foreground text-background pt-16 pb-10">
      <Container>
        <div className="mb-12 flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-primary mb-3 text-3xl font-bold tracking-[0.16em]">
              {site.nameDisplay}
            </h2>
            <p className="text-background/50 text-sm leading-relaxed">
              {site.addressLine1}
              <br />
              {site.addressLine2} · Crafted with love
            </p>
            <a
              href={site.phoneHref}
              className="text-primary mt-3 inline-block text-sm font-semibold transition-colors hover:text-amber-400"
            >
              {site.phone}
            </a>
          </div>
          <div className="flex flex-col gap-2.5 text-right">
            <a
              href={instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/60 hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors md:self-end"
            >
              <Instagram size={15} />
              {instagram.handle}
            </a>
            {socialLinks.slice(1).map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/60 hover:text-primary text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="border-background/10 flex flex-col items-center justify-between gap-3 border-t pt-8 md:flex-row">
          <p className="text-background/30 text-xs">
            &copy; {new Date().getFullYear()} {site.name} Café. All rights reserved.
          </p>
          <p className="text-background/30 text-xs">Made with warmth in Oran, Algeria</p>
        </div>
      </Container>
    </footer>
  );
}
