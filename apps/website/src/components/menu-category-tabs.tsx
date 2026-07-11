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
      className={`flex gap-2.5 overflow-x-auto pb-2 md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${className}`}
    >
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
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
  );
}
