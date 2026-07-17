"use client";

import { useMemo } from "react";
import { Play } from "lucide-react";

import { Marquee } from "@/components/effects/marquee";
import type { GalleryItem } from "@/lib/gallery/schema";
import { cn } from "@/lib/cn";

type GalleryMarqueeProps = {
  items: readonly GalleryItem[];
  onSelect: (item: GalleryItem) => void;
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
  item,
  index,
  onSelect,
}: {
  item: GalleryItem;
  index: number;
  onSelect: (item: GalleryItem) => void;
}) {
  const isVideo = item.type === "video" && Boolean(item.videoSrc);

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={cn(
        "bg-secondary group focus-visible:ring-primary relative h-[11.5rem] shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden sm:h-[15rem] lg:h-[18rem]",
        TILE_WIDTHS[index % TILE_WIDTHS.length],
      )}
      aria-label={item.title ?? item.alt}
    >
      {isVideo ? (
        <video
          src={item.videoSrc}
          poster={item.image}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          // Decorative preview — full audio/controls open in the modal
          aria-hidden
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={item.alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          draggable={false}
        />
      )}

      {item.type === "video" ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-200 group-hover:scale-110 sm:h-14 sm:w-14">
              <Play size={18} className="text-primary ml-0.5" fill="currentColor" />
            </div>
          </div>
          {item.title || item.description ? (
            <p className="absolute right-2 bottom-2 left-2 truncate text-left text-[9px] font-bold tracking-wider text-white uppercase opacity-90 sm:text-[10px]">
              {item.title ?? item.description}
            </p>
          ) : null}
        </>
      ) : null}
    </button>
  );
}

/**
 * Two gallery rows — opposite auto-scroll; tiles open the lightbox on click.
 * Video tiles: muted autoplay loop preview (Skiper-style); click opens full player.
 * Animation: `@/components/effects/marquee` (no wheel/drag pan).
 */
export function GalleryMarquee({
  items,
  onSelect,
  speed = 28,
  className = "",
}: GalleryMarqueeProps) {
  const { topRow, bottomRow } = useMemo(() => {
    if (items.length === 0) return { topRow: [] as GalleryItem[], bottomRow: [] as GalleryItem[] };
    const mid = Math.ceil(items.length / 2);
    return {
      topRow: items.slice(0, mid) as GalleryItem[],
      bottomRow: [...items.slice(mid)].reverse() as GalleryItem[],
    };
  }, [items]);

  if (items.length === 0) return null;

  const top = topRow.length > 0 ? topRow : (items as GalleryItem[]);
  const bottom = bottomRow.length > 0 ? bottomRow : ([...items].reverse() as GalleryItem[]);

  return (
    <div className={`flex flex-col gap-3 sm:gap-4 md:gap-5 ${className}`.trim()}>
      <Marquee
        autoplay
        interactive={false}
        direction="left"
        speed={speed}
        resetKey={`gallery-top-${top.map((i) => i.id).join("-")}`}
        trackClassName="gap-3 px-1 sm:gap-4 md:gap-5"
      >
        {top.map((item, i) => (
          <GalleryTile key={`top-${item.id}`} item={item} index={i} onSelect={onSelect} />
        ))}
      </Marquee>

      <Marquee
        autoplay
        interactive={false}
        direction="right"
        speed={speed * 0.85}
        resetKey={`gallery-bottom-${bottom.map((i) => i.id).join("-")}`}
        trackClassName="gap-3 px-1 sm:gap-4 md:gap-5"
      >
        {bottom.map((item, i) => (
          <GalleryTile key={`bottom-${item.id}`} item={item} index={i + 1} onSelect={onSelect} />
        ))}
      </Marquee>
    </div>
  );
}
