import { Instagram } from "lucide-react";

import { GalleryMarquee } from "@/components/gallery/gallery-marquee";
import { Container, Heading, Link, Paragraph, SectionDivider, SectionLabel } from "@/components/ui";
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
          <Heading>Gallery</Heading>
          <SectionDivider />
          <Paragraph size="sm" className="mx-auto mt-5 max-w-xs">
            Bright food, warm corners, and moments that feel like a deep breath.
          </Paragraph>
        </div>
      </Container>

      {/* Clip strip to section width — marquee track scrolls inside, no page overflow */}
      <div className="w-full overflow-hidden">
        <GalleryMarquee photos={galleryPhotos} />
      </div>

      <Container>
        <div className="mt-12 text-center">
          <Link external href={instagram.href} variant="primary">
            <Instagram size={15} />
            Follow {instagram.handle}
          </Link>
        </div>
      </Container>
    </section>
  );
}
