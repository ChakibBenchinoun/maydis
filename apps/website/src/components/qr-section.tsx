"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";

import { SectionLabel } from "@/components/section-label";
import { SectionDivider } from "@/components/section-divider";

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
    <section id="qr" className="py-24 px-6 md:px-10 bg-secondary/45">
      <div className="max-w-3xl mx-auto text-center">
        <SectionLabel>Table QR</SectionLabel>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
          Menu at a glance
        </h2>
        <SectionDivider />
        <p className="text-muted-foreground text-sm mt-5 max-w-sm mx-auto leading-relaxed">
          Print this code for tables — guests open the full digital menu instantly.
        </p>

        <div className="mt-10 inline-flex flex-col items-center gap-4 bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt="QR code to Maydi's menu" className="w-52 h-52 rounded-xl" />
          ) : (
            <div className="w-52 h-52 rounded-xl bg-secondary animate-pulse" />
          )}
          <p className="text-xs text-muted-foreground break-all max-w-xs">{url}</p>
          <Link
            href="/menu"
            className="bg-primary text-white px-8 py-3 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase hover:bg-amber-500 transition-colors"
          >
            Open menu
          </Link>
        </div>
      </div>
    </section>
  );
}
