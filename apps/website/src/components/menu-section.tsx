"use client";

import { useEffect, useMemo, useState } from "react";

import type { MenuItem } from "@/data/menu";
import { MenuCategoryTabs } from "@/components/menu-category-tabs";
import { MenuGrid } from "@/components/menu-grid";
import { MenuItemModal } from "@/components/menu-item-modal";
import { SectionDivider } from "@/components/section-divider";
import { SectionLabel } from "@/components/section-label";
import { categoriesFromItems } from "@/lib/menu";

type MenuSectionProps = {
  /** Full catalog for `/menu` (category tabs + grid). */
  items: MenuItem[];
};

/**
 * Full menu page body — every category, grid of dishes.
 * Home “latest” showcase lives in `LatestMenuSection`.
 */
export function MenuSection({ items }: MenuSectionProps) {
  const categories = useMemo(() => categoriesFromItems(items), [items]);
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "Brunch");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (categories.length && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const filteredItems = items.filter((i) => i.category === activeCategory);

  return (
    <>
      <section className="py-10 md:py-14 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>Scan · Sip · Enjoy</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Full Menu
            </h2>
            <SectionDivider />
            <p className="text-muted-foreground text-sm mt-5 max-w-xs mx-auto leading-relaxed">
              Every dish, drink, and seasonal favourite — updated for your visit.
            </p>
          </div>

          {categories.length > 0 ? (
            <>
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
            </>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">
              Menu coming soon.
            </p>
          )}
        </div>
      </section>

      <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}
