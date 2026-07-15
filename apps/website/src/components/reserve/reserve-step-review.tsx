import { formatDisplayDate } from "@/lib/reservations/options";
import type { ReserveFormValues } from "@/lib/reservations/schema";

import type { ReserveFormApi } from "./reserve-form-types";

function ReviewDlRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-0 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-foreground text-sm font-medium">{label}</dt>
      <dd className="text-muted-foreground mt-1 text-sm wrap-break-word sm:col-span-2 sm:mt-0">
        {value}
      </dd>
    </div>
  );
}

export function ReserveStepReview({ form }: { form: ReserveFormApi }) {
  return (
    <form.Subscribe selector={(s: { values: ReserveFormValues }) => s.values}>
      {(values: ReserveFormValues) => (
        <div>
          <h4 className="font-display text-foreground text-base font-bold">Confirm your request</h4>
          <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
            Check everything looks right before sending.
          </p>
          <div className="border-border/60 mt-5 border-t">
            <dl className="divide-border/60 divide-y">
              <ReviewDlRow label="Full name" value={values.name} />
              <ReviewDlRow label="Phone" value={values.phone} />
              {values.email ? <ReviewDlRow label="Email" value={values.email} /> : null}
              <ReviewDlRow label="Event for" value={values.eventName} />
              <ReviewDlRow label="Date" value={formatDisplayDate(values.date)} />
              <ReviewDlRow label="Time" value={values.time} />
              <ReviewDlRow
                label="Event size"
                value={`${values.guests} ${values.guests === "1" ? "guest" : "guests"}`}
              />
              {values.notes ? <ReviewDlRow label="Notes" value={values.notes} /> : null}
            </dl>
          </div>
        </div>
      )}
    </form.Subscribe>
  );
}
