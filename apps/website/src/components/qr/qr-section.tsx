"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

import { Container, Link, Section, SectionDivider, SectionLabel } from "@/components/ui";
import { cn } from "@/lib/cn";
import { images } from "@/lib/images";
import type { QrTarget } from "@/lib/qr/schema";
import { resolveQrTargetUrl } from "@/lib/qr";

/** Display-only: strip scheme so the label stays friendly. */
function friendlyUrlLabel(url: string) {
  return url.replace(/^https?:\/\//i, "");
}

function isInternalPath(url: string) {
  return url.startsWith("/") && !url.startsWith("//");
}

type QrSectionProps = {
  targets: QrTarget[];
};

/**
 * Share section — multiple QR targets (max 5 active from CMS).
 * Centre logo is always the brand logo; only dark module color varies per target.
 */
export function QrSection({ targets }: QrSectionProps) {
  const list = targets.length > 0 ? targets : [];
  const [activeId, setActiveId] = useState(list[0]?.id ?? "");
  const active = useMemo(
    () => list.find((t) => t.id === activeId) ?? list[0],
    [list, activeId],
  );

  const [qr, setQr] = useState<{ url: string; dataUrl: string | null }>({
    url: "",
    dataUrl: null,
  });

  useEffect(() => {
    if (!list.some((t) => t.id === activeId) && list[0]) {
      setActiveId(list[0].id);
    }
  }, [list, activeId]);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const origin = typeof window !== "undefined" ? window.location.origin : undefined;
    const absolute = resolveQrTargetUrl(active.targetUrl, origin);
    const dark = active.darkColor || "#2C2318";

    setQr({ url: absolute, dataUrl: null });

    QRCode.toDataURL(absolute, {
      width: 280,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark, light: "#FFFFFF" },
    })
      .then((dataUrl) => {
        if (!cancelled) setQr({ url: absolute, dataUrl });
      })
      .catch(() => {
        if (!cancelled) setQr({ url: absolute, dataUrl: null });
      });

    return () => {
      cancelled = true;
    };
  }, [active]);

  if (!active) {
    return null;
  }

  const ctaHref = isInternalPath(active.targetUrl) ? active.targetUrl : qr.url;
  const ctaExternal = !isInternalPath(active.targetUrl);

  return (
    <Section id="qr" tone="muted">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Share with ur loved ones.</SectionLabel>
          <h2 className="font-display text-foreground text-4xl font-bold md:text-5xl">
            Share Maydi&apos;s
          </h2>
          <SectionDivider />

          {list.length > 1 ? (
            <div
              className="mt-8 flex flex-wrap items-center justify-center gap-2"
              role="tablist"
              aria-label="QR destinations"
            >
              {list.map((t) => {
                const selected = t.id === active.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveId(t.id)}
                    className={cn(
                      "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 bg-card text-foreground hover:border-primary/50 hover:text-primary",
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="bg-card border-border/50 mt-8 inline-flex flex-col items-center gap-4 rounded-3xl border p-6 shadow-sm sm:mt-10 sm:p-8">
            {qr.dataUrl ? (
              <div className="relative h-60 w-60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qr.dataUrl}
                  alt={`QR code for ${active.label}`}
                  className="h-full w-full rounded-xl"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white p-1.5 shadow-sm ring-1 ring-black/5">
                    {/* Brand logo fixed — not editable in admin */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={images.logo}
                      alt=""
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-secondary h-52 w-52 animate-pulse rounded-xl" />
            )}
            <p className="text-muted-foreground max-w-xs text-xs break-all">
              {friendlyUrlLabel(qr.url)}
            </p>
            {ctaExternal ? (
              <Link external href={ctaHref} variant="primary">
                Open {active.label}
              </Link>
            ) : (
              <Link href={ctaHref} variant="primary">
                Open {active.label}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
