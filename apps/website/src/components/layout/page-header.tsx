import type { ReactNode } from "react";

import { Image } from "@/components/ui/image";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  /** Small uppercase label above the title */
  eyebrow: string;
  title: string;
  description?: ReactNode;
  /** Width constraint for the description line (default `max-w-md`) */
  descriptionClassName?: string;
  /** Optional full-bleed background image behind the header */
  imageSrc?: string;
  imageAlt?: string;
};

/**
 * Shared interior-page header — eyebrow, title, optional description.
 * When `imageSrc` is set, the image sits full-bleed behind the text (with overlay).
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  descriptionClassName = "max-w-md",
  imageSrc,
  imageAlt = "",
}: PageHeaderProps) {
  const hasImage = Boolean(imageSrc);

  return (
    <div
      className={cn(
        "border-border relative overflow-hidden border-b pt-24 pb-10",
        !hasImage && "bg-secondary/60",
      )}
    >
      {hasImage ? (
        <>
          <Image
            src={imageSrc!}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {/* Readable text over photo — warm dark wash matching brand */}
          <div
            className="absolute inset-0 bg-linear-to-b from-[#2c2318]/75 via-[#2c2318]/65 to-[#2c2318]/80"
            aria-hidden
          />
        </>
      ) : null}

      <Container className="relative z-10">
        <div className="min-w-0">
          <p
            className={cn(
              "mb-3 text-[10px] font-bold tracking-[0.35em] uppercase",
              hasImage ? "text-primary" : "text-accent",
            )}
          >
            {eyebrow}
          </p>
          <h1
            className={cn(
              "font-display text-4xl font-bold md:text-5xl",
              hasImage ? "text-white" : "text-foreground",
            )}
          >
            {title}
          </h1>
          {description ? (
            <p
              className={cn(
                "mt-3 text-sm leading-relaxed",
                hasImage ? "text-white/80" : "text-muted-foreground",
                descriptionClassName,
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
