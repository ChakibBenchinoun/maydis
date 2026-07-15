import type { ReserveFormValues } from "@/lib/reservations/schema";

export type ReserveFieldErrors = Record<string, string>;

/**
 * Shared field update used by multi-step bodies.
 * `setValue` is TanStack Field’s handleChange.
 */
export type UpdateReserveField = (
  name: keyof ReserveFormValues,
  value: string,
  setValue: (v: string) => void,
) => void;

/** Minimal form API surface step components need (avoids coupling to full useForm type). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReserveFormApi = any;
