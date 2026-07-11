import { Instagram } from "lucide-react";

import { galleryPhotos } from "@/data/gallery";
import { socialLinks } from "@/lib/constants";
import { SectionLabel } from "@/components/section-label";
import { SectionDivider } from "@/components/section-divider";

const instagram = socialLinks[0];

export function GallerySection() {
  return (
    <section id="gallery" className="py-24 bg-secondary/45 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <SectionLabel>Through the lens</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Gallery
          </h2>
          <SectionDivider />
          <p className="text-muted-foreground text-sm mt-5 max-w-xs mx-auto leading-relaxed">
            Bright food, warm corners, and moments that feel like a deep breath.
          </p>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-gap:1rem]">
          {galleryPhotos.map((photo, i) => (
            <div
              key={i}
              className={`mb-4 break-inside-avoid rounded-2xl overflow-hidden bg-secondary shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-250 cursor-pointer ${
                i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href={instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white px-9 py-3.5 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase hover:bg-amber-500 transition-colors duration-200 shadow-md"
          >
            <Instagram size={15} />
            Follow {instagram.handle}
          </a>
        </div>
      </div>
    </section>
  );
}
