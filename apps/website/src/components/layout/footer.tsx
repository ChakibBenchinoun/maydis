import { Container, SocialIcon } from "@/components/ui";
import { site, socialLinks } from "@/lib/constants";

/**
 * Site footer — brand + phone, Follow us + socials, copyright.
 * Content constrained with shared Container (navbar width).
 */
export function Footer() {
  return (
    <footer className="bg-foreground text-background w-full pt-10 pb-8 sm:pt-12 md:pt-14">
      <Container>
        <div className="mb-8 flex flex-row items-start justify-between gap-8 sm:mb-10 sm:items-end">
          <div>
            <h2 className="font-display text-primary mb-2 text-2xl font-bold tracking-[0.16em] sm:text-3xl">
              {site.nameDisplay}
            </h2>
            <a
              href={site.phoneHref}
              className="text-primary text-sm font-semibold transition-colors hover:text-amber-400"
            >
              {site.phone}
            </a>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <p className="text-background/40 text-right text-[10px] font-bold tracking-[0.2em] uppercase">
              Follow us
            </p>
            <div className="order-first flex flex-wrap items-center gap-2 md:order-last md:justify-end">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={"handle" in link ? link.handle : link.label}
                  className="text-background/60 hover:text-primary border-background/12 hover:border-primary/40 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
                >
                  <SocialIcon label={link.label} size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-background/10 flex flex-col items-center justify-between gap-2 border-t pt-6 sm:flex-row">
          <p className="text-background/30 text-xs">
            &copy; {new Date().getFullYear()} {site.name} Café. All rights reserved.
          </p>
          <p className="text-background/30 text-xs">Made with warmth in Oran, Algeria</p>
        </div>
      </Container>
    </footer>
  );
}
