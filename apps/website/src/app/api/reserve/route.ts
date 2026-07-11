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
    // Local / pre-Supabase: accept the request so the form UX works
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

  const { error } = await supabase.from("reservations").insert({
    name,
    phone,
    email,
    date,
    time,
    guests,
    notes,
    status: "pending",
  });

  if (error) {
    console.error("[reserve] insert failed", error);
    return NextResponse.json(
      { error: "Could not save reservation. Please call us instead." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, stored: true });
}
