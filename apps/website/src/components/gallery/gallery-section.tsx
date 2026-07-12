import { Instagram } from "lucide-react";

import { GalleryMarquee } from "@/components/gallery/gallery-marquee";
import { Container } from "@/components/ui/container";
import { SectionDivider } from "@/components/ui/section-divider";
import { SectionLabel } from "@/components/ui/section-label";
import { galleryPhotos } from "@/data/gallery";
import { socialLinks } from "@/lib/constants";

const instagram = socialLinks[0];

/**
 * Home gallery — header/CTA in Container, edge-to-edge marquee clipped
 * (no `100vw` — avoids horizontal page scroll).
 */
export function GallerySection() {
  return (
    <section id="gallery" className="bg-secondary/45 overflow-x-hidden py-24">
      <Container>
        <div className="mb-14 text-center">
          <SectionLabel>Through the lens</SectionLabel>
          <h2 className="font-display text-foreground text-4xl font-bold md:text-5xl">Gallery</h2>
          <SectionDivider />
          <p className="text-muted-foreground mx-auto mt-5 max-w-xs text-sm leading-relaxed">
            Bright food, warm corners, and moments that feel like a deep breath.
          </p>
        </div>
      </Container>

      {/* Clip strip to section width — marquee track scrolls inside, no page overflow */}
      <div className="w-full overflow-hidden">
        <GalleryMarquee photos={galleryPhotos} />
      </div>

      <Container>
        <div className="mt-12 text-center">
          <a
            href={instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary inline-flex items-center gap-2 rounded-full px-9 py-3.5 text-[11px] font-semibold tracking-[0.12em] text-white uppercase shadow-md transition-colors duration-200 hover:bg-amber-500"
          >
            <Instagram size={15} />
            Follow {instagram.handle}
          </a>
        </div>
      </Container>
    </section>
  );
}
