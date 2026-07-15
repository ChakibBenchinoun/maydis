import { cn } from "@/lib/cn";
import { EVENT_FOR_MAX } from "@/lib/reservations/schema";

import { errorClass, fieldClass, labelClass } from "./reserve-field-styles";
import type { ReserveFieldErrors, ReserveFormApi, UpdateReserveField } from "./reserve-form-types";
import { ReserveGuestStepper } from "./reserve-guest-stepper";

export function ReserveStepDetails({
  form,
  fieldErrors,
  updateField,
}: {
  form: ReserveFormApi;
  fieldErrors: ReserveFieldErrors;
  updateField: UpdateReserveField;
}) {
  return (
    <div className="space-y-5">
      <form.Field name="eventName">
        {(field: {
          name: string;
          state: { value: string };
          handleBlur: () => void;
          handleChange: (v: string) => void;
        }) => {
          const len = field.state.value.length;
          return (
            <div>
              <div className="mb-2.5 flex items-baseline justify-between gap-3">
                <label className={cn(labelClass, "mb-0")} htmlFor={field.name}>
                  Event for *
                </label>
                <span
                  className={cn(
                    "text-[11px] tabular-nums",
                    len >= EVENT_FOR_MAX ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {len}/{EVENT_FOR_MAX}
                </span>
              </div>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  updateField(
                    "eventName",
                    e.target.value.slice(0, EVENT_FOR_MAX),
                    field.handleChange,
                  )
                }
                maxLength={EVENT_FOR_MAX}
                placeholder="e.g. Sara’s birthday, team lunch…"
                className={fieldClass}
                autoComplete="off"
              />
              {fieldErrors.eventName ? <p className={errorClass}>{fieldErrors.eventName}</p> : null}
            </div>
          );
        }}
      </form.Field>

      <form.Field name="guests">
        {(field: { name: string; state: { value: string }; handleChange: (v: string) => void }) => (
          <div>
            <p className={labelClass} id={`${field.name}-label`}>
              Event size *
            </p>
            <ReserveGuestStepper
              id={field.name}
              value={field.state.value}
              onChange={(v) => updateField("guests", v, field.handleChange)}
            />
            {fieldErrors.guests ? <p className={errorClass}>{fieldErrors.guests}</p> : null}
          </div>
        )}
      </form.Field>

      <form.Field name="notes">
        {(field: {
          name: string;
          state: { value: string };
          handleBlur: () => void;
          handleChange: (v: string) => void;
        }) => (
          <div>
            <label className={labelClass} htmlFor={field.name}>
              Notes (optional)
            </label>
            <textarea
              id={field.name}
              name={field.name}
              rows={3}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => updateField("notes", e.target.value, field.handleChange)}
              placeholder="Setup, dietary needs, decorations…"
              className={`${fieldClass} resize-none`}
            />
            {fieldErrors.notes ? <p className={errorClass}>{fieldErrors.notes}</p> : null}
          </div>
        )}
      </form.Field>
    </div>
  );
}
