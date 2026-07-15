import { formatPhoneDisplay } from "@/lib/phone";
import { site } from "@/lib/constants";

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

/** Message to the café owner when a new event is requested. */
export function ownerBookingMessage(b: EventBooking): string {
  const lines = [
    `🌿 New event request — ${site.name}`,
    ``,
    `Name: ${b.name}`,
    `Phone: ${formatPhoneDisplay(b.phoneE164)}`,
    b.email ? `Email: ${b.email}` : null,
    b.eventName ? `Event: ${b.eventName}` : null,
    `Date: ${b.date}`,
    `Time: ${b.time}`,
    `Guests: ${b.guests}`,
    b.notes ? `Notes: ${b.notes}` : null,
    b.reservationId ? `Ref: ${b.reservationId}` : null,
    ``,
    `Reply to the guest on WhatsApp to confirm.`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

/** Confirmation message to the guest. */
export function guestBookingMessage(b: EventBooking): string {
  const lines = [
    `Hi ${b.name} 👋`,
    ``,
    `We received your event request at ${site.name}:`,
    b.eventName ? `• Event: ${b.eventName}` : null,
    `• Date: ${b.date}`,
    `• Time: ${b.time}`,
    `• Guests: ${b.guests}`,
    b.notes ? `• Notes: ${b.notes}` : null,
    ``,
    `We'll confirm shortly. For urgent changes call ${site.phone}.`,
    ``,
    `— ${site.name}, Oran`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}
