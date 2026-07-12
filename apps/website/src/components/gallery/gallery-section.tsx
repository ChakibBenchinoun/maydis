import { Instagram } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionDivider } from "@/components/ui/section-divider";
import { SectionLabel } from "@/components/ui/section-label";
import { galleryPhotos } from "@/data/gallery";
import { socialLinks } from "@/lib/constants";

const instagram = socialLinks[0];

export function GallerySection() {
  return (
    <section id="gallery" className="bg-secondary/45 py-24">
      <Container>
        <div className="mb-14 text-center">
          <SectionLabel>Through the lens</SectionLabel>
          <h2 className="font-display text-foreground text-4xl font-bold md:text-5xl">Gallery</h2>
          <SectionDivider />
          <p className="text-muted-foreground mx-auto mt-5 max-w-xs text-sm leading-relaxed">
            Bright food, warm corners, and moments that feel like a deep breath.
          </p>
        </div>

        <div className="columns-2 gap-4 [column-gap:1rem] md:columns-3 lg:columns-4">
          {galleryPhotos.map((photo, i) => (
            <div
              key={i}
              className={`bg-secondary mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-2xl shadow-sm transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md ${
                i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

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
