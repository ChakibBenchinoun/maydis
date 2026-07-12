import { NextResponse } from "next/server";

import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { notifyEventBookingWhatsApp } from "@/lib/whatsapp/send";

type Body = {
  name?: string;
  phone?: string;
  email?: string;
  date?: string;
  time?: string;
  guests?: string;
  notes?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const date = body.date?.trim() ?? "";
  const time = body.time?.trim() ?? "";
  const guests = body.guests?.trim() ?? "";
  const email = body.email?.trim() || null;
  const notes = body.notes?.trim() || null;

  if (!name || !phone || !date || !time || !guests) {
    return NextResponse.json(
      { error: "Name, phone, date, time, and guests are required." },
      { status: 400 },
    );
  }

  const booking = { name, phone, email, date, time, guests, notes };

  let reservationId: string | null = null;
  let stored = false;

  if (!isSupabaseConfigured()) {
    console.info("[reserve] Supabase not configured — accepted locally", booking);
  } else {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const { data: rpcId, error: rpcError } = await supabase.rpc("create_reservation", {
      payload: {
        name,
        phone,
        email,
        date,
        time,
        guests,
        notes,
      },
    });

    if (!rpcError && rpcId) {
      stored = true;
      reservationId = String(rpcId);
    } else {
      if (rpcError) {
        console.warn("[reserve] RPC failed, trying direct insert:", rpcError.message);
      }

      const { data: row, error } = await supabase
        .from("reservations")
        .insert({
          name,
          phone,
          email,
          date,
          time,
          guests,
          notes,
          status: "pending",
        })
        .select("id")
        .single();

      if (error) {
        console.error("[reserve] insert failed", { rpc: rpcError, insert: error });
        return NextResponse.json(
          {
            error:
              "Could not save reservation. Run supabase/migrations/001_init.sql in the Supabase SQL Editor (see docs/SUPABASE.md).",
          },
          { status: 500 },
        );
      }

      stored = true;
      reservationId = row?.id ? String(row.id) : null;
    }
  }

  const whatsapp = await notifyEventBookingWhatsApp({
    ...booking,
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
