"use client";

/**
 * Media Chrome video controls — adapted from Skiper UI (Skiper 67) patterns.
 * Free use with attribution to Skiper UI / @gurvinder-singh02.
 * @see https://skiperui.com
 */

import type { ComponentProps } from "react";
import {
  MediaControlBar,
  MediaController,
  MediaMuteButton,
  MediaPlayButton,
  MediaTimeDisplay,
  MediaTimeRange,
} from "media-chrome/react";

import { cn } from "@/lib/cn";

export type VideoPlayerProps = ComponentProps<typeof MediaController>;

export function VideoPlayer({ style, className, ...props }: VideoPlayerProps) {
  return (
    <MediaController
      className={cn("block w-full overflow-hidden bg-black", className)}
      style={style}
      {...props}
    />
  );
}

export type VideoPlayerContentProps = ComponentProps<"video">;

export function VideoPlayerContent({ className, ...props }: VideoPlayerContentProps) {
  return (
    <video
      slot="media"
      className={cn("m-0 h-full w-full object-cover", className)}
      playsInline
      {...props}
    />
  );
}

export function VideoPlayerControlBar({
  className,
  ...props
}: ComponentProps<typeof MediaControlBar>) {
  return (
    <MediaControlBar
      className={cn(
        "absolute inset-x-0 bottom-0 flex w-full items-center gap-1 bg-linear-to-t from-black/70 to-transparent px-3 pt-8 pb-3",
        className,
      )}
      {...props}
    />
  );
}

export function VideoPlayerPlayButton({
  className,
  ...props
}: ComponentProps<typeof MediaPlayButton>) {
  return <MediaPlayButton className={cn("bg-transparent p-1.5 text-white", className)} {...props} />;
}

export function VideoPlayerTimeRange({
  className,
  ...props
}: ComponentProps<typeof MediaTimeRange>) {
  return (
    <MediaTimeRange
      className={cn(
        "flex-1 bg-transparent [--media-range-thumb-opacity:0] [--media-range-track-height:3px]",
        className,
      )}
      {...props}
    />
  );
}

export function VideoPlayerTimeDisplay({
  className,
  ...props
}: ComponentProps<typeof MediaTimeDisplay>) {
  return (
    <MediaTimeDisplay className={cn("px-1.5 text-xs text-white/90 tabular-nums", className)} {...props} />
  );
}

export function VideoPlayerMuteButton({
  className,
  ...props
}: ComponentProps<typeof MediaMuteButton>) {
  return <MediaMuteButton className={cn("bg-transparent p-1.5 text-white", className)} {...props} />;
}
