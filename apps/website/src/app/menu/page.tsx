import Link from "next/link";
import type { Metadata } from "next";

import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Menu",
  description: `Full ${site.name} menu — coming soon.`,
};

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 pt-16">
      <p className="text-[10px] tracking-[0.35em] uppercase text-accent font-bold mb-3">
        Coming soon
      </p>
      <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
        Full Menu
      </h1>
      <p className="text-muted-foreground text-sm text-center max-w-sm mb-8 leading-relaxed">
        The dedicated menu page (QR destination) will live here. For now, explore the menu on the home
        page.
      </p>
      <Link
        href="/#menu"
        className="bg-primary text-white px-9 py-3.5 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase hover:bg-amber-500 transition-colors shadow-md"
      >
        View home menu
      </Link>
    </main>
  );
}
