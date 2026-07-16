"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

import { Container, Link, Section, SectionDivider, SectionLabel } from "@/components/ui";
import { menuLink } from "@/lib/constants";
import { images } from "@/lib/images";

function menuUrl() {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${menuLink.href}`;
  }
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
  return base ? `${base}${menuLink.href}` : menuLink.href;
}

export function QrSection() {
  const [qr, setQr] = useState<{ url: string; dataUrl: string | null }>({
    url: menuLink.href,
    dataUrl: null,
  });

  useEffect(() => {
    const target = menuUrl();
    let cancelled = false;

    // High EC so the centre logo can cover modules and still scan.
    QRCode.toDataURL(target, {
      width: 280,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: "#2C2318", light: "#FFFFFF" },
    })
      .then((dataUrl) => {
        if (!cancelled) setQr({ url: target, dataUrl });
      })
      .catch(() => {
        if (!cancelled) setQr({ url: target, dataUrl: null });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section id="qr" tone="muted">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Share with ur loved ones.</SectionLabel>
          <h2 className="font-display text-foreground text-4xl font-bold md:text-5xl">
            Menu at a glance
          </h2>
          <SectionDivider />
          <div className="bg-card border-border/50 mt-10 inline-flex flex-col items-center gap-4 rounded-3xl border p-6 shadow-sm sm:mt-12 sm:p-8">
            {qr.dataUrl ? (
              <div className="relative h-60 w-60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qr.dataUrl}
                  alt="QR code to Maydi's menu"
                  className="h-full w-full rounded-xl"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white p-1.5 shadow-sm ring-1 ring-black/5">
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
            <p className="text-muted-foreground max-w-xs text-xs break-all">{qr.url}</p>
            <Link href={menuLink.href} variant="primary">
              Open menu
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
