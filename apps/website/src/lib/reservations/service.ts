import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  ReservationRow,
  ReservationStatus,
  ReservationUpdate,
  ReserveRequest,
} from "@/lib/reservations/schema";

export async function createReservation(
  supabase: SupabaseClient,
  input: ReserveRequest,
): Promise<{ id: string | null; stored: boolean; error?: string }> {
  // No event_name column yet — store with notes for admin visibility
  const notesParts = [
    input.eventName ? `Event: ${input.eventName}` : null,
    input.notes ?? null,
  ].filter(Boolean) as string[];

  const payload = {
    name: input.name,
    phone: input.phone,
    email: input.email ?? null,
    date: input.date,
    time: input.time,
    guests: input.guests,
    notes: notesParts.length ? notesParts.join("\n") : null,
  };

  const { data: rpcId, error: rpcError } = await supabase.rpc("create_reservation", {
    payload,
  });

  if (!rpcError && rpcId) {
    return { id: String(rpcId), stored: true };
  }

  if (rpcError) {
    console.warn("[reservations] RPC failed, trying direct insert:", rpcError.message);
  }

  const { data: row, error } = await supabase
    .from("reservations")
    .insert({
      ...payload,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[reservations] insert failed", { rpc: rpcError, insert: error });
    return {
      id: null,
      stored: false,
      error:
        "Could not save reservation. Run supabase/migrations/001_init.sql in the Supabase SQL Editor.",
    };
  }

  return { id: row?.id ? String(row.id) : null, stored: true };
}

export async function listReservations(
  supabase: SupabaseClient,
  options: { status?: ReservationStatus | "all"; limit?: number } = {},
): Promise<{ rows: ReservationRow[]; error?: string }> {
  const limit = options.limit ?? 50;
  let query = supabase
    .from("reservations")
    .select("id, name, phone, email, date, time, guests, notes, status, created_at")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[reservations] list failed", error);
    return { rows: [], error: "Could not load reservations." };
  }

  return { rows: (data ?? []) as ReservationRow[] };
}

export async function updateReservation(
  supabase: SupabaseClient,
  id: string,
  patch: ReservationUpdate,
): Promise<{ row: ReservationRow | null; error?: string }> {
  const updates: Record<string, unknown> = {};
  if (patch.status !== undefined) updates.status = patch.status;
  if (patch.notes !== undefined) updates.notes = patch.notes;

  const { data, error } = await supabase
    .from("reservations")
    .update(updates)
    .eq("id", id)
    .select("id, name, phone, email, date, time, guests, notes, status, created_at")
    .single();

  if (error) {
    console.error("[reservations] update failed", error);
    return { row: null, error: "Could not update reservation." };
  }

  return { row: data as ReservationRow };
}

export async function getReservationById(
  supabase: SupabaseClient,
  id: string,
): Promise<{ row: ReservationRow | null; error?: string }> {
  const { data, error } = await supabase
    .from("reservations")
    .select("id, name, phone, email, date, time, guests, notes, status, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[reservations] get failed", error);
    return { row: null, error: "Could not load reservation." };
  }

  return { row: (data as ReservationRow) ?? null };
}
