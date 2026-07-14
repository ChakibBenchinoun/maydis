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
    notes: booking.notes ?? null,
    reservationId,
  });

  return NextResponse.json({
    ok: true,
    stored,
    id: reservationId,
    whatsapp: {
      owner: whatsapp.owner.ok,
      guest: whatsapp.guest.ok,
      ownerError: whatsapp.owner.error ?? null,
      guestError: whatsapp.guest.error ?? null,
      setupHint: whatsapp.setupHint ?? null,
    },
  });
}
