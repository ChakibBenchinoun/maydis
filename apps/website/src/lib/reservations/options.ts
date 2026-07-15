/** Shared option lists for public reserve form (UI + validation). */

export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];

/** Guest count stepper bounds (inclusive). */
export const GUESTS_MIN = 1;
export const GUESTS_MAX = 20;

/** Local Algerian mobile: 10 digits starting with 05 / 06 / 07. */
export const PHONE_DIGITS_MAX = 10;

/** Local calendar date as YYYY-MM-DD. */
export function todayIsoLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDisplayDate(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Keep digits only, max length (default 10 for local mobile). */
export function clampPhoneDigits(raw: string, max = PHONE_DIGITS_MAX): string {
  return raw.replace(/\D/g, "").slice(0, max);
}

export function isValidLocalDzMobile(digits: string): boolean {
  return /^0[567]\d{8}$/.test(digits);
}
