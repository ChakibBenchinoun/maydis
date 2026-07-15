import type { MenuItem } from "@/data/menu";

type MenuCardProps = {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  /** Optional wrapper class on the `<li>` (e.g. fixed width for marquee). */
  className?: string;
};

/**
 * Shared dish card for horizontal rows / stacks (equal content slots).
 * Root is a `div` so it can live in flex marquees (not only `<ul>`).
 */
export function MenuCard({ item, onSelect, className = "" }: MenuCardProps) {
  return (
    <div className={`flex shrink-0 ${className}`.trim()}>
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="group bg-card border-border/50 focus-visible:ring-primary flex h-full w-full flex-col overflow-hidden rounded-2xl border text-left shadow-sm transition-shadow duration-300 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
      >
        <div className="bg-secondary relative h-[140px] w-full shrink-0 overflow-hidden lg:h-[150px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            draggable={false}
          />
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-1.5 flex h-5 items-center">
            {item.tags[0] ? (
              <span className="bg-accent/12 text-accent inline-block rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                {item.tags[0]}
              </span>
            ) : (
              <span className="invisible px-2 py-0.5 text-[9px]" aria-hidden>
                —
              </span>
            )}
          </div>

          <h3 className="font-display text-foreground mb-1 line-clamp-2 min-h-[2.4rem] text-[0.95rem] leading-snug font-bold">
            {item.name}
          </h3>

          <p className="text-muted-foreground line-clamp-2 min-h-[2.25rem] text-xs leading-relaxed">
            {item.description}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <span className="text-primary text-sm font-bold tabular-nums">{item.price}</span>
            <span className="text-muted-foreground/70 group-hover:text-primary text-[11px] transition-colors">
              View →
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
