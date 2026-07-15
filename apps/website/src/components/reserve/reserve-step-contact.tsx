import { clampPhoneDigits } from "@/lib/reservations/options";

import { errorClass, fieldClass, labelClass } from "./reserve-field-styles";
import type { ReserveFieldErrors, ReserveFormApi, UpdateReserveField } from "./reserve-form-types";

export function ReserveStepContact({
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
      <form.Field name="name">
        {(field: {
          name: string;
          state: { value: string };
          handleBlur: () => void;
          handleChange: (v: string) => void;
        }) => (
          <div>
            <label className={labelClass} htmlFor={field.name}>
              Name *
            </label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => updateField("name", e.target.value, field.handleChange)}
              placeholder="Your full name"
              className={fieldClass}
              autoComplete="name"
            />
            {fieldErrors.name ? <p className={errorClass}>{fieldErrors.name}</p> : null}
          </div>
        )}
      </form.Field>

      <form.Field name="phone">
        {(field: {
          name: string;
          state: { value: string };
          handleBlur: () => void;
          handleChange: (v: string) => void;
        }) => (
          <div>
            <label className={labelClass} htmlFor={field.name}>
              Phone *
            </label>
            <input
              id={field.name}
              name={field.name}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) =>
                updateField("phone", clampPhoneDigits(e.target.value), field.handleChange)
              }
              placeholder="05XXXXXXXX"
              className={fieldClass}
              autoComplete="tel-national"
            />
            <p className="text-muted-foreground mt-1.5 text-[11px]">
              10 digits · Algerian mobile (05 / 06 / 07)
            </p>
            {fieldErrors.phone ? <p className={errorClass}>{fieldErrors.phone}</p> : null}
          </div>
        )}
      </form.Field>

      <form.Field name="email">
        {(field: {
          name: string;
          state: { value: string };
          handleBlur: () => void;
          handleChange: (v: string) => void;
        }) => (
          <div>
            <label className={labelClass} htmlFor={field.name}>
              Email (optional)
            </label>
            <input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => updateField("email", e.target.value, field.handleChange)}
              placeholder="you@email.com"
              className={fieldClass}
              autoComplete="email"
            />
            {fieldErrors.email ? <p className={errorClass}>{fieldErrors.email}</p> : null}
          </div>
        )}
      </form.Field>
    </div>
  );
}
