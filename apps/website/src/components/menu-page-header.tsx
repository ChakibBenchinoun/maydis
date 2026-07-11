import Link from "next/link";

import { site } from "@/lib/constants";

export function MenuPageHeader() {
  return (
    <div className="bg-secondary/60 border-b border-border pt-24 pb-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          ← Back to {site.name}
        </Link>
        <p className="text-[10px] tracking-[0.35em] uppercase text-accent font-bold mb-3">
          QR · Table side
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
          Notre Carte
        </h1>
        <p className="text-muted-foreground text-sm mt-3 max-w-md leading-relaxed">
          Browse by category, tap a dish for the full story. Prices in DA.
        </p>
      </div>
    </div>
  );
}
