"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { menuItems, categories, type MenuItem } from "@/data/menu";
import { SectionLabel } from "@/components/section-label";
import { SectionDivider } from "@/components/section-divider";
import { MenuItemModal } from "@/components/menu-item-modal";

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("Brunch");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedItem ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  const filteredItems = menuItems.filter((i) => i.category === activeCategory);

  return (
    <>
      <section id="menu" className="py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>Crafted with care</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Our Menu
            </h2>
            <SectionDivider />
            <p className="text-muted-foreground text-sm mt-5 max-w-xs mx-auto leading-relaxed">
              Seasonal ingredients, house-made sauces, and recipes we are genuinely proud of.
            </p>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 mb-12 md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.28 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="group cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                  <div className="overflow-hidden bg-secondary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full object-cover aspect-video sm:aspect-square object-center transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-foreground leading-snug mb-1.5">
                      {item.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">{item.price}</span>
                      <span className="text-xs text-muted-foreground/70 group-hover:text-primary transition-colors">
                        View →
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}
