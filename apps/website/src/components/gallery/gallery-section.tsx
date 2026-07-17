"use client";

import { useState } from "react";
import { Instagram } from "lucide-react";

import { GalleryItemModal } from "@/components/gallery/gallery-item-modal";
import { GalleryMarquee } from "@/components/gallery/gallery-marquee";
import {
  Container,
  Heading,
  Link,
  Paragraph,
  Section,
  SectionDivider,
  sectionHeaderClass,
  SectionLabel,
} from "@/components/ui";
import type { GalleryItem } from "@/lib/gallery/schema";
import { socialLinks } from "@/lib/constants";

const instagram = socialLinks[0];

type GallerySectionProps = {
  items: GalleryItem[];
};

/**
 * Home gallery — photos + moments videos in dual marquees; click opens lightbox.
 * Items come from the server (`getGalleryItems`) with static fallback.
 */
export function GallerySection({ items }: GallerySectionProps) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  return (
    <>
      <Section id="gallery" tone="muted" className="overflow-x-hidden">
        <Container>
          <div className={sectionHeaderClass}>
            <SectionLabel>Through the lens</SectionLabel>
            <Heading>Gallery</Heading>
            <SectionDivider />
            <Paragraph size="sm" className="mx-auto mt-5 max-w-sm">
              Photos and moments from Maydi&apos;s — tap any frame to open it.
            </Paragraph>
          </div>
        </Container>

        <div className="w-full overflow-hidden">
          <GalleryMarquee items={items} onSelect={setSelected} />
        </div>

        <Container>
          <div className="mt-10 text-center md:mt-12">
            <Link external href={instagram.href} variant="primary">
              <Instagram size={15} />
              Follow {instagram.handle}
            </Link>
          </div>
        </Container>
      </Section>

      <GalleryItemModal item={selected} onClose={() => setSelected(null)} />
    </>
  );
}
