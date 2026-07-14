import { z } from "zod";

import { normalizeWhatsAppPhone } from "@/lib/phone";

/** Allowed reservation statuses (admin + DB). */
export const RESERVATION_STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
] as const;

export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const reservationStatusSchema = z.enum(RESERVATION_STATUSES);

const timeSlotSchema = z
  .string()
  .trim()
  .regex(/^\d{2}:\d{2}$/, "Time must be HH:MM");

const dateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD");

/**
 * Public event booking request (POST /api/reserve).
 * Shared shape for future public stepper + admin create.
 */
export const reserveRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .max(32)
    .refine((v) => normalizeWhatsAppPhone(v) !== null, {
      message: "Enter a valid phone (05… or +213…)",
    }),
  email: z.preprocess(
    (v) => {
      if (v === null || v === undefined) return undefined;
      if (typeof v !== "string") return v;
      const t = v.trim();
      return t.length === 0 ? undefined : t;
    },
    z.string().email("Invalid email").max(120).optional(),
  ),
  date: dateSchema,
  time: timeSlotSchema,
  guests: z.string().trim().min(1, "Guests is required").max(16),
  notes: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
});

export type ReserveRequest = z.infer<typeof reserveRequestSchema>;

/** Admin: update status and/or internal notes. */
export const reservationUpdateSchema = z
  .object({
    status: reservationStatusSchema.optional(),
    notes: z.string().trim().max(1000).nullable().optional(),
  })
  .refine((v) => v.status !== undefined || v.notes !== undefined, {
    message: "Provide status and/or notes",
  });

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
  status: string;
  created_at: string;
};

export const reservationListQuerySchema = z.object({
  status: reservationStatusSchema.optional().or(z.literal("all")).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
});
