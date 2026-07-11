import { Instagram } from "lucide-react";

import { site, socialLinks } from "@/lib/constants";

export function Footer() {
  const instagram = socialLinks[0];

  return (
    <footer className="bg-foreground text-background pt-16 pb-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 mb-12">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-[0.16em] text-primary mb-3">
              {site.nameDisplay}
            </h2>
            <p className="text-background/50 text-sm leading-relaxed">
              {site.addressLine1}, Oran 31000
              <br />
              Algeria · Crafted with love
            </p>
          </div>
          <div className="flex flex-col gap-2.5 text-right">
            <a
              href={instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-background/60 hover:text-primary transition-colors text-sm font-medium md:self-end"
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
                className="text-background/60 hover:text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-background/30 text-xs">
            &copy; {new Date().getFullYear()} {site.name} Café. All rights reserved.
          </p>
          <p className="text-background/30 text-xs">Made with warmth in Oran, Algeria</p>
        </div>
      </div>
    </footer>
  );
}
