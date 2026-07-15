"use client";

type MenuCategoryTabsProps = {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
  className?: string;
};

export function MenuCategoryTabs({
  categories,
  activeCategory,
  onChange,
  className = "",
}: MenuCategoryTabsProps) {
  return (
    <div
      className={`flex [scrollbar-width:none] gap-2.5 overflow-x-auto pb-2 [-ms-overflow-style:none] md:justify-center [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
            activeCategory === cat
              ? "bg-primary text-white shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
