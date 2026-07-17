import { z } from "zod";

import { normalizeWhatsAppPhone } from "@/lib/phone";
import {
  GUESTS_MAX,
  GUESTS_MIN,
  isValidLocalDzMobile,
  PHONE_DIGITS_MAX,
  TIME_SLOTS,
  todayIsoLocal,
} from "@/lib/reservations/options";

/** Allowed reservation statuses (admin + DB). */
export const RESERVATION_STATUSES = ["pending", "confirmed", "cancelled", "completed"] as const;

export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const reservationStatusSchema = z.enum(RESERVATION_STATUSES);

const timeSlotSchema = z
  .string()
  .trim()
  .refine((v): v is (typeof TIME_SLOTS)[number] => (TIME_SLOTS as readonly string[]).includes(v), {
    message: "Choose a valid time slot",
  });

const dateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
  .refine((v) => v >= todayIsoLocal(), {
    message: "Date cannot be in the past",
  });

const emailField = z.preprocess((v) => {
  if (v === null || v === undefined) return undefined;
  if (typeof v !== "string") return v;
  const t = v.trim();
  return t.length === 0 ? undefined : t;
}, z.string().email("Invalid email").max(120).optional());

const notesField = z
  .string()
  .trim()
  .max(1000)
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined));

/** “Event for” — short free text (who / occasion). */
export const EVENT_FOR_MAX = 80;

const eventNameField = z
  .string()
  .trim()
  .min(1, "Tell us who or what this event is for")
  .max(EVENT_FOR_MAX, `Keep this under ${EVENT_FOR_MAX} characters`);

const phoneField = z
  .string()
  .trim()
  .min(1, "Phone is required")
  .refine(
    (v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length <= PHONE_DIGITS_MAX;
    },
    { message: "Phone must be at most 10 digits" },
  )
  .refine((v) => isValidLocalDzMobile(v.replace(/\D/g, "")), {
    message: "Enter a 10-digit mobile (05… / 06… / 07…)",
  })
  .refine((v) => normalizeWhatsAppPhone(v) !== null, {
    message: "Enter a valid mobile number",
  });

const guestsField = z
  .string()
  .trim()
  .refine(
    (v) => {
      const n = Number(v);
      return Number.isInteger(n) && n >= GUESTS_MIN && n <= GUESTS_MAX;
    },
    { message: `Guests must be between ${GUESTS_MIN} and ${GUESTS_MAX}` },
  );

/** Form values before submit transforms (email/notes may be ""). */
export type ReserveFormValues = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  eventName: string;
  guests: string;
  notes: string;
};

/**
 * Step labels (public UI).
 * 0 Info → 1 Contact → 2 Schedule → 3 Details → 4 Review
 */
export const RESERVE_STEPS = [
  { id: "info", label: "Info" },
  { id: "contact", label: "Contact" },
  { id: "schedule", label: "Schedule" },
  { id: "details", label: "Details" },
  { id: "review", label: "Review" },
] as const;

export type ReserveStepId = (typeof RESERVE_STEPS)[number]["id"];

export const reserveContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  phone: phoneField,
  email: emailField,
});

export const reserveWhenSchema = z.object({
  date: dateSchema,
  time: timeSlotSchema,
});

export const reserveDetailsSchema = z.object({
  eventName: eventNameField,
  guests: guestsField,
  notes: notesField,
});

/**
 * Public event booking request (POST /api/reserve).
 */
export const reserveRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  phone: phoneField,
  email: emailField,
  date: dateSchema,
  time: timeSlotSchema,
  eventName: eventNameField,
  guests: guestsField,
  notes: notesField,
});

export type ReserveRequest = z.infer<typeof reserveRequestSchema>;

type StepFail = { ok: false; message: string; fieldErrors: Record<string, string> };
type StepOk = { ok: true };

function zodFail(error: z.ZodError): StepFail {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return {
    ok: false,
    message: error.issues[0]?.message ?? "Please check the form",
    fieldErrors,
  };
}

/** Step 0 (Info) has no fields. Steps 1–3 validate subsets; 4 = full. */
export function validateReserveStep(
  stepIndex: number,
  values: ReserveFormValues,
): StepOk | StepFail {
  if (stepIndex <= 0) return { ok: true };

  if (stepIndex === 1) {
    const result = reserveContactSchema.safeParse({
      name: values.name,
      phone: values.phone,
      email: values.email,
    });
    return result.success ? { ok: true } : zodFail(result.error);
  }

  if (stepIndex === 2) {
    const result = reserveWhenSchema.safeParse({
      date: values.date,
      time: values.time,
    });
    return result.success ? { ok: true } : zodFail(result.error);
  }

  if (stepIndex === 3) {
    const result = reserveDetailsSchema.safeParse({
      eventName: values.eventName,
      guests: values.guests,
      notes: values.notes,
    });
    return result.success ? { ok: true } : zodFail(result.error);
  }

  // Review / full
  const full = reserveRequestSchema.safeParse(values);
  return full.success ? { ok: true } : zodFail(full.error);
}

/**
 * Re-check a single field after typing. Returns null if valid (clear error).
 */
export function fieldErrorAfterChange(
  field: keyof ReserveFormValues,
  values: ReserveFormValues,
): string | null {
  const map: Partial<Record<keyof ReserveFormValues, z.ZodType>> = {
    name: z.string().trim().min(1, "Name is required").max(80),
    phone: phoneField,
    email: emailField,
    date: dateSchema,
    time: timeSlotSchema,
    eventName: eventNameField,
    guests: guestsField,
    notes: notesField,
  };
  const schema = map[field];
  if (!schema) return null;
  const result = schema.safeParse(values[field]);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? "Invalid";
}

/** Admin: patch reservation fields (at least one required). */
export const reservationUpdateSchema = z
  .object({
    status: reservationStatusSchema.optional(),
    notes: z.string().trim().max(1000).nullable().optional(),
    name: z.string().trim().min(1).max(80).optional(),
    phone: z.string().trim().min(1).max(20).optional(),
    email: z.string().trim().email().max(120).nullable().optional(),
    date: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    time: z.string().trim().min(1).max(10).optional(),
    guests: z.string().trim().min(1).max(4).optional(),
    event_name: z.string().trim().max(EVENT_FOR_MAX).nullable().optional(),
  })
  .refine(
    (v) =>
      v.status !== undefined ||
      v.notes !== undefined ||
      v.name !== undefined ||
      v.phone !== undefined ||
      v.email !== undefined ||
      v.date !== undefined ||
      v.time !== undefined ||
      v.guests !== undefined ||
      v.event_name !== undefined,
    { message: "Provide at least one field to update" },
  );

export type ReservationUpdate = z.infer<typeof reservationUpdateSchema>;

export type ReservationRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  date: string;
  time: string;
  guests: string;
  notes: string | null;
  event_name: string | null;
  status: string;
  created_at: string;
};

export const reservationListQuerySchema = z.object({
  status: reservationStatusSchema.optional().or(z.literal("all")).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
});
