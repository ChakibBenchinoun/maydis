"use client";

import { useState } from "react";
import Link from "next/link";

import type { MenuItem } from "@/data/menu";
import { MenuItemModal } from "@/components/menu-item-modal";
import { MenuScrollRow } from "@/components/menu-scroll-row";
import { MenuSwipeCarousel } from "@/components/menu-swipe-carousel";
import { SectionDivider } from "@/components/section-divider";
import { SectionLabel } from "@/components/section-label";
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
      <section id="menu" className="py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>{latestMenuCopy.label}</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              {latestMenuCopy.title}
            </h2>
            <SectionDivider />
            <p className="text-muted-foreground text-sm mt-5 max-w-sm mx-auto leading-relaxed">
              {latestMenuCopy.description}
            </p>
          </div>

          {hasItems ? (
            <>
              <div className="lg:hidden">
                <MenuSwipeCarousel
                  items={items}
                  onSelect={setSelectedItem}
                  className="mb-4"
                />
              </div>
              <div className="hidden lg:block">
                <MenuScrollRow
                  items={items}
                  categoryKey="latest"
                  onSelect={setSelectedItem}
                />
              </div>
            </>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">
              {latestMenuCopy.empty}
            </p>
          )}

          <div className="text-center mt-10">
            <Link
              href={latestMenuCopy.ctaHref}
              className="inline-flex items-center gap-2 bg-primary text-white px-9 py-3.5 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase hover:bg-amber-500 transition-colors duration-200 shadow-md"
            >
              {latestMenuCopy.cta}
            </Link>
          </div>
        </div>
      </section>

      <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}
