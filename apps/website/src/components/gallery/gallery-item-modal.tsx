"use client";

import { useEffect } from "react";
import { Play, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
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
 * Lightbox for gallery photos / videos (same interaction pattern as menu modal).
 * Videos use Media Chrome controls (Skiper-inspired player shell).
 */
export function GalleryItemModal({ item, onClose }: GalleryItemModalProps) {
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  const isPlayableVideo = item?.type === "video" && Boolean(item.videoSrc);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={item.title ?? item.alt}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card relative max-h-[min(90dvh,42rem)] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={
                isPlayableVideo
                  ? "bg-secondary relative aspect-video"
                  : "bg-secondary relative aspect-[4/3]"
              }
            >
              {isPlayableVideo ? (
                <VideoPlayer className="h-full w-full">
                  <VideoPlayerContent
                    src={item.videoSrc}
                    poster={item.image}
                    autoPlay
                    muted={false}
                    className="h-full w-full object-cover"
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
                  <img src={item.image} alt={item.alt} className="h-full w-full object-cover" />
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
