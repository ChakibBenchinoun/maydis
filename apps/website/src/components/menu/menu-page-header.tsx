import Link from "next/link";

import { Container } from "@/components/ui/container";
import { site } from "@/lib/constants";

export function MenuPageHeader() {
  return (
    <div className="bg-secondary/60 border-border border-b pt-24 pb-10">
      <Container>
        <Link
          href="/"
          className="text-muted-foreground hover:text-primary mb-6 inline-flex text-sm transition-colors"
        >
          ← Back to {site.name}
        </Link>
        <p className="text-accent mb-3 text-[10px] font-bold tracking-[0.35em] uppercase">
          QR · Table side
        </p>
        <h1 className="font-display text-foreground text-4xl font-bold md:text-5xl">Notre Carte</h1>
        <p className="text-muted-foreground mt-3 max-w-md text-sm leading-relaxed">
          Browse by category, tap a dish for the full story. Prices in DA.
        </p>
      </Container>
    </div>
  );
}
