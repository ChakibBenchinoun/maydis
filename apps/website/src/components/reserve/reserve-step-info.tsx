import { openingHours } from "@/lib/constants";

/** Step 0 — welcome / hours (centered). */
export function ReserveStepInfo() {
  return (
    <div className="space-y-8 text-center">
      <div>
        <p className="text-muted-foreground mx-auto mb-6 max-w-md text-sm leading-relaxed">
          A glimpse of what we share with you — space, tables, food, and the feeling of a slow good
          day in Oran.
        </p>
        <ul className="mx-auto max-w-md space-y-5 text-sm leading-relaxed">
          <li>
            <p className="text-foreground mb-1 font-semibold">Indoor & outdoor space</p>
            <p className="text-muted-foreground">
              Bright interior seating and a garden-like terrace for sunny days and golden evenings.
            </p>
          </li>
          <li>
            <p className="text-foreground mb-1 font-semibold">Tables for every gathering</p>
            <p className="text-muted-foreground">
              Intimate corners for two, family tables, and room for larger celebrations when booked
              in advance.
            </p>
          </li>
          <li>
            <p className="text-foreground mb-1 font-semibold">Food with variety</p>
            <p className="text-muted-foreground">
              Brunch plates, bowls, cakes, and drinks — something for slow mornings and long
              lunches.
            </p>
          </li>
          <li>
            <p className="text-foreground mb-1 font-semibold">The vibe</p>
            <p className="text-muted-foreground">
              Calm, warm, and welcoming. Come for the food, stay for the atmosphere.
            </p>
          </li>
        </ul>
      </div>

      <div className="border-border/50 border-t pt-6">
        <h4 className="font-display text-foreground mb-3 text-base font-bold">Opening hours</h4>
        <div className="mx-auto inline-grid max-w-full grid-cols-[auto_auto] gap-x-8 gap-y-2.5 text-left text-sm">
          {openingHours.map(({ day, hours }) => (
            <div key={day} className="contents">
              <span className="text-muted-foreground">{day}</span>
              <span className="text-foreground text-right font-semibold tabular-nums">{hours}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
