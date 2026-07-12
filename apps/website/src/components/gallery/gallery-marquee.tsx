"use client";

import { useMemo } from "react";

import { Marquee } from "@/components/effects/marquee";
import type { galleryPhotos } from "@/data/gallery";

type GalleryPhoto = (typeof galleryPhotos)[number];

type GalleryMarqueeProps = {
  photos: readonly GalleryPhoto[];
  /** Base autoplay speed px/s. Default 28. Bottom row is slightly slower. */
  speed?: number;
  className?: string;
};

/** Tile widths for a varied strip (cycled) — capped so mobile never feels oversized. */
const TILE_WIDTHS = [
  "w-[9.5rem] sm:w-[13rem] lg:w-[15rem]",
  "w-[11rem] sm:w-[15rem] lg:w-[17.5rem]",
  "w-[8.5rem] sm:w-[12rem] lg:w-[13.75rem]",
  "w-[12rem] sm:w-[16rem] lg:w-[18.75rem]",
] as const;

function GalleryTile({
  photo,
  index,
  keyPrefix,
}: {
  photo: GalleryPhoto;
  index: number;
  keyPrefix: string;
}) {
  return (
    <div
      key={`${keyPrefix}-${photo.url}-${index}`}
      className={[
        "bg-secondary relative h-[11.5rem] shrink-0 overflow-hidden rounded-2xl shadow-sm sm:h-[15rem] lg:h-[18rem]",
        TILE_WIDTHS[index % TILE_WIDTHS.length],
      ].join(" ")}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.url}
        alt={photo.alt}
        className="h-full w-full object-cover"
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}

/**
 * Two non-interactive gallery rows — opposite auto-scroll directions.
 * Animation: `@/components/effects/marquee` (`direction="left" | "right"`).
 */
export function GalleryMarquee({ photos, speed = 28, className = "" }: GalleryMarqueeProps) {
  const { topRow, bottomRow } = useMemo(() => {
    if (photos.length === 0)
      return { topRow: [] as GalleryPhoto[], bottomRow: [] as GalleryPhoto[] };
    const mid = Math.ceil(photos.length / 2);
    return {
      topRow: photos.slice(0, mid) as GalleryPhoto[],
      // Reverse bottom set so the two strips feel distinct
      bottomRow: [...photos.slice(mid)].reverse() as GalleryPhoto[],
    };
  }, [photos]);

  if (photos.length === 0) return null;

  // If very few photos, still fill both rows (reuse full set)
  const top = topRow.length > 0 ? topRow : (photos as GalleryPhoto[]);
  const bottom = bottomRow.length > 0 ? bottomRow : ([...photos].reverse() as GalleryPhoto[]);

  return (
    <div className={`flex flex-col gap-3 sm:gap-4 md:gap-5 ${className}`.trim()}>
      <Marquee
        autoplay
        interactive={false}
        direction="left"
        speed={speed}
        resetKey={`gallery-top-${top.length}`}
        trackClassName="gap-3 px-1 sm:gap-4 md:gap-5"
      >
        {top.map((photo, i) => (
          <GalleryTile key={`top-${photo.url}-${i}`} photo={photo} index={i} keyPrefix="top" />
        ))}
      </Marquee>

      <Marquee
        autoplay
        interactive={false}
        direction="right"
        speed={speed * 0.85}
        resetKey={`gallery-bottom-${bottom.length}`}
        trackClassName="gap-3 px-1 sm:gap-4 md:gap-5"
      >
        {bottom.map((photo, i) => (
          <GalleryTile
            key={`bottom-${photo.url}-${i}`}
            photo={photo}
            index={i + 1}
            keyPrefix="bottom"
          />
        ))}
      </Marquee>
    </div>
  );
}
