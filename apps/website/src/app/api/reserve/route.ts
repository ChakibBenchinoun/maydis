import { NextResponse } from "next/server";

import { reserveRequestSchema } from "@/lib/reservations/schema";
import { createReservation } from "@/lib/reservations/service";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { notifyEventBookingWhatsApp } from "@/lib/whatsapp/send";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = reserveRequestSchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      {
        error: first?.message ?? "Invalid reservation data",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const booking = parsed.data;
  let reservationId: string | null = null;
  let stored = false;

  if (!isSupabaseConfigured()) {
    console.info("[reserve] Supabase not configured — accepted locally", booking);
  } else {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const result = await createReservation(supabase, booking);
    if (!result.stored && result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    stored = result.stored;
    reservationId = result.id;
  }

  const whatsapp = await notifyEventBookingWhatsApp({
    ...booking,
    email: booking.email ?? null,
    eventName: booking.eventName ?? null,
    notes: booking.notes ?? null,
    reservationId,
  });

  // Booleans only for the public UI. Technical errors stay server-side (logs).
  // Exposing Baileys URLs / setup docs confuses guests and looks broken.
  const waPayload: {
    owner: boolean;
    guest: boolean;
    ownerError?: string | null;
    guestError?: string | null;
    setupHint?: string | null;
  } = {
    owner: whatsapp.owner.ok,
    guest: whatsapp.guest.ok,
  };

  if (process.env.NODE_ENV !== "production") {
    waPayload.ownerError = whatsapp.owner.error ?? null;
    waPayload.guestError = whatsapp.guest.error ?? null;
    waPayload.setupHint = whatsapp.setupHint ?? null;
  }

  return NextResponse.json({
    ok: true,
    stored,
    id: reservationId,
    whatsapp: waPayload,
  });
}
