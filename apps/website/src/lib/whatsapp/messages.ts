import { site } from "@/lib/constants";
import { formatPhoneDisplay } from "@/lib/phone";
import { formatDisplayDate } from "@/lib/reservations/options";

export type EventBooking = {
  name: string;
  phone: string;
  phoneE164: string;
  email?: string | null;
  date: string;
  time: string;
  eventName?: string | null;
  guests: string;
  notes?: string | null;
  reservationId?: string | null;
};

/** Public site origin for absolute admin links in WhatsApp. */
function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  const vercel = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercel) return vercel.startsWith("http") ? vercel : `https://${vercel}`;
  return "";
}

/** Admin list of all event requests (not a single booking id). */
export function adminReservationsUrl(): string {
  const path = "/admin/reservations";
  const origin = siteOrigin();
  return origin ? `${origin}${path}` : path;
}

function prettyDate(iso: string): string {
  return formatDisplayDate(iso);
}

function guestCountLabel(guests: string): string {
  const n = Number(guests);
  if (Number.isFinite(n) && n === 1) return "1 guest";
  return `${guests} guests`;
}

/** Message to the café owner when a new event is requested. */
export function ownerBookingMessage(b: EventBooking): string {
  const reservationsLink = adminReservationsUrl();
  const lines = [
    `🌿 New event request — ${site.name}`,
    ``,
    `Someone would love to celebrate with you! Here’s the request:`,
    ``,
    `👤 ${b.name}`,
    `📱 ${formatPhoneDisplay(b.phoneE164)}`,
    b.email ? `✉️ ${b.email}` : null,
    b.eventName ? `🎉 Event for: ${b.eventName}` : null,
    `📅 ${prettyDate(b.date)} at ${b.time}`,
    `👥 ${guestCountLabel(b.guests)}`,
    b.notes ? `📝 Notes: ${b.notes}` : null,
    ``,
    `👉 View all reservations:`,
    reservationsLink,
    ``,
    `Reply to the guest on WhatsApp when you’re ready to confirm. 💛`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

/** Warm confirmation message to the guest. */
export function guestBookingMessage(b: EventBooking): string {
  const lines = [
    `Hi ${b.name} 👋`,
    ``,
    `Thank you for choosing ${site.name} — we’re so happy you thought of us for your event!`,
    ``,
    `We’ve received your request and our team will review it shortly:`,
    b.eventName ? `• Event for: ${b.eventName}` : null,
    `• Date: ${prettyDate(b.date)}`,
    `• Time: ${b.time}`,
    `• Party size: ${guestCountLabel(b.guests)}`,
    b.notes ? `• Notes: ${b.notes}` : null,
    ``,
    `We’ll get back to you soon to confirm everything. If anything is urgent, call us anytime at ${site.phone}.`,
    ``,
    `We can’t wait to welcome you in Oran. 🌿`,
    `— The team at ${site.name}`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}
