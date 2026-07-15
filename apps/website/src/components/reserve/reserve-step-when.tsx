import { ReserveCalendar } from "./reserve-calendar";
import { errorClass, labelClass } from "./reserve-field-styles";
import type { ReserveFieldErrors, ReserveFormApi, UpdateReserveField } from "./reserve-form-types";
import { ReserveTimeSlots } from "./reserve-time-slots";

export function ReserveStepWhen({
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
      <form.Field name="date">
        {(field: { state: { value: string }; handleChange: (v: string) => void }) => (
          <div>
            <p className={labelClass}>Date *</p>
            <ReserveCalendar
              value={field.state.value}
              onChange={(iso) => updateField("date", iso, field.handleChange)}
            />
            {fieldErrors.date ? <p className={errorClass}>{fieldErrors.date}</p> : null}
          </div>
        )}
      </form.Field>

      <form.Field name="time">
        {(field: { state: { value: string }; handleChange: (v: string) => void }) => (
          <div>
            <ReserveTimeSlots
              value={field.state.value}
              onChange={(t) => updateField("time", t, field.handleChange)}
            />
            {fieldErrors.time ? <p className={errorClass}>{fieldErrors.time}</p> : null}
          </div>
        )}
      </form.Field>
    </div>
  );
}
