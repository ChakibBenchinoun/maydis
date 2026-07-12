"use client";

import { useState } from "react";
import Link from "next/link";

import { MenuItemModal } from "@/components/menu/menu-item-modal";
import { MenuScrollRow } from "@/components/menu/menu-scroll-row";
import { MenuSwipeCarousel } from "@/components/menu/menu-swipe-carousel";
import { Container } from "@/components/ui/container";
import { SectionDivider } from "@/components/ui/section-divider";
import { SectionLabel } from "@/components/ui/section-label";
import type { MenuItem } from "@/data/menu";
import { latestMenuCopy } from "@/lib/constants";

type LatestMenuSectionProps = {
  /** Pre-selected “latest” dishes (from `pickLatestMenuItems`) */
  items: MenuItem[];
};

/**
 * Home section: showcase of the latest dishes only (not the full categorized menu).
 * Mobile: swipe stack · Desktop: centered horizontal scroll row.
 */
export function LatestMenuSection({ items }: LatestMenuSectionProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const hasItems = items.length > 0;

  return (
    <>
      <section id="menu" className="py-24">
        <Container>
          <div className="mb-14 text-center">
            <SectionLabel>{latestMenuCopy.label}</SectionLabel>
            <h2 className="font-display text-foreground text-4xl font-bold md:text-5xl">
              {latestMenuCopy.title}
            </h2>
            <SectionDivider />
            <p className="text-muted-foreground mx-auto mt-5 max-w-sm text-sm leading-relaxed">
              {latestMenuCopy.description}
            </p>
          </div>

          {hasItems ? (
            <>
              <div className="lg:hidden">
                <MenuSwipeCarousel items={items} onSelect={setSelectedItem} className="mb-4" />
              </div>
              <div className="hidden lg:block">
                <MenuScrollRow items={items} categoryKey="latest" onSelect={setSelectedItem} />
              </div>
            </>
          ) : (
            <p className="text-muted-foreground py-8 text-center text-sm">{latestMenuCopy.empty}</p>
          )}

          <div className="mt-10 text-center">
            <Link
              href={latestMenuCopy.ctaHref}
              className="bg-primary inline-flex items-center gap-2 rounded-full px-9 py-3.5 text-[11px] font-semibold tracking-[0.12em] text-white uppercase shadow-md transition-colors duration-200 hover:bg-amber-500"
            >
              {latestMenuCopy.cta}
            </Link>
          </div>
        </Container>
      </section>

      <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}
