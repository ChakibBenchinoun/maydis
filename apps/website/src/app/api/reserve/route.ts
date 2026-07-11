import { NextResponse } from "next/server";

import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

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

  if (!isSupabaseConfigured()) {
    console.info("[reserve] Supabase not configured — accepted locally", {
      name,
      phone,
      date,
      time,
      guests,
      email,
      notes,
    });
    return NextResponse.json({
      ok: true,
      stored: false,
      message: "Reservation received (local mode — configure Supabase to persist).",
    });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  // JSON payload RPC (PostgREST exposes this reliably)
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

  if (!rpcError) {
    return NextResponse.json({ ok: true, stored: true, id: rpcId });
  }

  console.warn("[reserve] RPC failed, trying direct insert:", rpcError.message);

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

  return NextResponse.json({ ok: true, stored: true, id: row?.id });
}
