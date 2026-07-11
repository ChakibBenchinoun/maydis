import Link from "next/link";
import type { Metadata } from "next";

import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Reserve",
  description: `Reserve a table at ${site.name} — coming soon.`,
};

export default function ReservePage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 pt-16">
      <p className="text-[10px] tracking-[0.35em] uppercase text-accent font-bold mb-3">
        Coming soon
      </p>
      <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
        Reserve a Table
      </h1>
      <p className="text-muted-foreground text-sm text-center max-w-sm mb-8 leading-relaxed">
        Online reservations will live here. For now, call us or visit the contact section on the home
        page.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={site.phoneHref}
          className="bg-primary text-white px-9 py-3.5 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase hover:bg-amber-500 transition-colors shadow-md text-center"
        >
          Call {site.phone}
        </a>
        <Link
          href="/#visit"
          className="border border-border text-foreground px-9 py-3.5 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase hover:border-primary hover:text-primary transition-colors text-center"
        >
          Visit info
        </Link>
      </div>
    </main>
  );
}
