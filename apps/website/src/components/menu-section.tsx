"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import type { MenuItem } from "@/data/menu";
import { SectionLabel } from "@/components/section-label";
import { SectionDivider } from "@/components/section-divider";
import { MenuItemModal } from "@/components/menu-item-modal";
import { MenuCategoryTabs } from "@/components/menu-category-tabs";
import { MenuGrid } from "@/components/menu-grid";

type MenuSectionProps = {
  /** Home preview vs full /menu experience */
  variant?: "preview" | "full";
  /** Server-loaded items (Supabase or static fallback) */
  items: MenuItem[];
};

export function MenuSection({ variant = "preview", items }: MenuSectionProps) {
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const item of items) {
      if (!seen.has(item.category)) {
        seen.add(item.category);
        out.push(item.category);
      }
    }
    return out;
  }, [items]);

  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "Brunch");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (categories.length && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    document.body.style.overflow = selectedItem ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  const filteredItems = items.filter((i) => i.category === activeCategory);
  const isFull = variant === "full";

  return (
    <>
      <section
        id={isFull ? undefined : "menu"}
        className={isFull ? "py-10 md:py-14 px-6 md:px-10" : "py-24 px-6 md:px-10"}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>{isFull ? "Scan · Sip · Enjoy" : "Crafted with care"}</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              {isFull ? "Full Menu" : "Our Menu"}
            </h2>
            <SectionDivider />
            <p className="text-muted-foreground text-sm mt-5 max-w-xs mx-auto leading-relaxed">
              {isFull
                ? "Every dish, drink, and seasonal favourite — updated for your visit."
                : "Seasonal ingredients, house-made sauces, and recipes we are genuinely proud of."}
            </p>
          </div>

          <MenuCategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
            className="mb-12"
          />

          <MenuGrid
            items={filteredItems}
            categoryKey={activeCategory}
            onSelect={setSelectedItem}
          />

          {!isFull && (
            <div className="text-center mt-12">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-primary text-white px-9 py-3.5 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase hover:bg-amber-500 transition-colors duration-200 shadow-md"
              >
                View full menu
              </Link>
            </div>
          )}
        </div>
      </section>

      <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}
