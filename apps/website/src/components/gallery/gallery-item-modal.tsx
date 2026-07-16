"use client";

import { Play, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/ui/lightbox";
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
} from "@/components/ui/video-player";
import type { GalleryItem } from "@/data/gallery";

type GalleryItemModalProps = {
  item: GalleryItem | null;
  onClose: () => void;
};

/**
 * Lightbox for gallery photos / videos.
 * Videos use Media Chrome controls (Skiper-inspired player shell).
 */
export function GalleryItemModal({ item, onClose }: GalleryItemModalProps) {
  const isPlayableVideo = item?.type === "video" && Boolean(item.videoSrc);

  return (
    <Lightbox
      open={Boolean(item)}
      onClose={onClose}
      label={item?.title ?? item?.alt}
      panelClassName="max-w-2xl"
    >
      {item ? (
        <>
          <div
            className={
              isPlayableVideo
                ? "bg-secondary relative aspect-video overflow-hidden"
                : "bg-secondary relative aspect-[4/3] overflow-hidden"
            }
          >
            {isPlayableVideo ? (
              <VideoPlayer className="absolute inset-0 h-full w-full">
                <VideoPlayerContent
                  src={item.videoSrc}
                  poster={item.image}
                  autoPlay
                  muted={false}
                  className="h-full w-full object-cover object-center"
                />
                <VideoPlayerControlBar>
                  <VideoPlayerPlayButton />
                  <VideoPlayerTimeRange />
                  <VideoPlayerTimeDisplay />
                  <VideoPlayerMuteButton />
                </VideoPlayerControlBar>
              </VideoPlayer>
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.alt}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-xl">
                      <Play size={22} className="text-primary ml-1" fill="currentColor" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55"
            aria-label="Close"
          >
            <X size={17} />
          </button>

          <div className="p-6 sm:p-7">
            {item.episode ? (
              <p className="text-muted-foreground mb-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                {item.episode}
              </p>
            ) : null}
            <h3 className="font-display text-foreground mb-2 text-2xl leading-snug font-bold">
              {item.title ?? item.alt}
            </h3>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{item.alt}</p>
            <div className="flex justify-end">
              <Button size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </Lightbox>
  );
}
