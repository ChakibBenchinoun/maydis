import type { ImgHTMLAttributes } from "react";
import NextImage, { type ImageProps as NextImageProps } from "next/image";

import { cn } from "@/lib/cn";

type NextMode = Omit<NextImageProps, "className"> & {
  className?: string;
  /**
   * `next` — optimized Next.js Image (default for local static assets).
   * `native` — plain `<img>` when you need full CSS freedom / data URLs.
   */
  mode?: "next";
};

type NativeMode = Omit<ImgHTMLAttributes<HTMLImageElement>, "className" | "src" | "alt"> & {
  className?: string;
  mode: "native";
  src: string;
  alt: string;
};

export type ImageProps = NextMode | NativeMode;

/**
 * Site image primitive — prefers Next.js Image; use `mode="native"` for cases
 * that already rely on plain img (dynamic QR data URLs, etc.).
 */
export function Image(props: ImageProps) {
  if (props.mode === "native") {
    const { mode: _mode, className, alt, src, ...imgRest } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={cn(className)} {...imgRest} />
    );
  }

  const { mode: _mode, className, ...nextProps } = props;
  return <NextImage className={cn(className)} {...nextProps} />;
}
