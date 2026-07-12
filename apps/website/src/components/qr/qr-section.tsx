"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";

import { SectionDivider } from "@/components/ui/section-divider";
import { SectionLabel } from "@/components/ui/section-label";

function menuUrl() {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/menu`;
  }
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
  return base ? `${base}/menu` : "/menu";
}

export function QrSection() {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [url, setUrl] = useState("/menu");

  useEffect(() => {
    const target = menuUrl();
    setUrl(target);
    QRCode.toDataURL(target, {
      width: 280,
      margin: 2,
      color: { dark: "#2C2318", light: "#FFFFFF" },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, []);

  return (
    <section id="qr" className="bg-secondary/45 px-6 py-24 md:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <SectionLabel>Table QR</SectionLabel>
        <h2 className="font-display text-foreground text-4xl font-bold md:text-5xl">
          Menu at a glance
        </h2>
        <SectionDivider />
        <p className="text-muted-foreground mx-auto mt-5 max-w-sm text-sm leading-relaxed">
          Print this code for tables — guests open the full digital menu instantly.
        </p>

        <div className="bg-card border-border/50 mt-10 inline-flex flex-col items-center gap-4 rounded-3xl border p-8 shadow-sm">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt="QR code to Maydi's menu" className="h-52 w-52 rounded-xl" />
          ) : (
            <div className="bg-secondary h-52 w-52 animate-pulse rounded-xl" />
          )}
          <p className="text-muted-foreground max-w-xs text-xs break-all">{url}</p>
          <Link
            href="/menu"
            className="bg-primary rounded-full px-8 py-3 text-[11px] font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-amber-500"
          >
            Open menu
          </Link>
        </div>
      </div>
    </section>
  );
}
