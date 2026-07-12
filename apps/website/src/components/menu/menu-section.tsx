"use client";

import { useEffect, useMemo, useState } from "react";

import { MenuCategoryTabs } from "@/components/menu/menu-category-tabs";
import { MenuGrid } from "@/components/menu/menu-grid";
import { MenuItemModal } from "@/components/menu/menu-item-modal";
import { Container } from "@/components/ui/container";
import { SectionDivider } from "@/components/ui/section-divider";
import { SectionLabel } from "@/components/ui/section-label";
import type { MenuItem } from "@/data/menu";
import { menuLink } from "@/lib/constants";
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
      <section className="py-10 md:py-14">
        <Container>
          <div className="mb-14 text-center">
            <SectionLabel>Scan · Sip · Enjoy</SectionLabel>
            <h2 className="font-display text-foreground text-4xl font-bold md:text-5xl">
              {menuLink.label}
            </h2>
            <SectionDivider />
            <p className="text-muted-foreground mx-auto mt-5 max-w-xs text-sm leading-relaxed">
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
            <p className="text-muted-foreground py-8 text-center text-sm">Menu coming soon.</p>
          )}
        </Container>
      </section>

      <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}
