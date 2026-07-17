import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  ReservationRow,
  ReservationStatus,
  ReservationUpdate,
  ReserveRequest,
} from "@/lib/reservations/schema";

const ROW_SELECT =
  "id, name, phone, email, date, time, guests, notes, event_name, status, created_at";

export async function createReservation(
  supabase: SupabaseClient,
  input: ReserveRequest,
): Promise<{ id: string | null; stored: boolean; error?: string }> {
  const payload = {
    name: input.name,
    phone: input.phone,
    email: input.email ?? null,
    date: input.date,
    time: input.time,
    guests: input.guests,
    notes: input.notes ?? null,
    event_name: input.eventName,
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
        "Could not save reservation. Run supabase/migrations/001_init.sql and 005_content_cms.sql in the Supabase SQL Editor.",
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
    .select(ROW_SELECT)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;
  if (error) {
    // Older DBs without event_name: retry without the column
    if (error.message?.includes("event_name")) {
      return listReservationsLegacy(supabase, options);
    }
    console.error("[reservations] list failed", error);
    return { rows: [], error: "Could not load reservations." };
  }

  return { rows: (data ?? []).map(normalizeRow) };
}

/** Fallback when 005 not applied yet. */
async function listReservationsLegacy(
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
    console.error("[reservations] list legacy failed", error);
    return { rows: [], error: "Could not load reservations." };
  }

  return {
    rows: (data ?? []).map((r) =>
      normalizeRow({
        ...r,
        event_name: extractEventNameFromNotes((r as { notes?: string | null }).notes ?? null),
      }),
    ),
  };
}

function extractEventNameFromNotes(notes: string | null): string | null {
  if (!notes) return null;
  const m = notes.match(/^Event:\s*(.+?)(?:\n|$)/i);
  return m?.[1]?.trim() || null;
}

function normalizeRow(row: Record<string, unknown>): ReservationRow {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    phone: String(row.phone ?? ""),
    email: (row.email as string | null) ?? null,
    date: String(row.date ?? ""),
    time: String(row.time ?? ""),
    guests: String(row.guests ?? ""),
    notes: (row.notes as string | null) ?? null,
    event_name: (row.event_name as string | null) ?? null,
    status: String(row.status ?? "pending"),
    created_at: String(row.created_at ?? ""),
  };
}

export async function updateReservation(
  supabase: SupabaseClient,
  id: string,
  patch: ReservationUpdate,
): Promise<{ row: ReservationRow | null; error?: string }> {
  const updates: Record<string, unknown> = {};
  if (patch.status !== undefined) updates.status = patch.status;
  if (patch.notes !== undefined) updates.notes = patch.notes;
  if (patch.name !== undefined) updates.name = patch.name;
  if (patch.phone !== undefined) updates.phone = patch.phone;
  if (patch.email !== undefined) updates.email = patch.email;
  if (patch.date !== undefined) updates.date = patch.date;
  if (patch.time !== undefined) updates.time = patch.time;
  if (patch.guests !== undefined) updates.guests = patch.guests;
  if (patch.event_name !== undefined) updates.event_name = patch.event_name;

  const { data, error } = await supabase
    .from("reservations")
    .update(updates)
    .eq("id", id)
    .select(ROW_SELECT)
    .single();

  if (error) {
    console.error("[reservations] update failed", error);
    return { row: null, error: "Could not update reservation." };
  }

  return { row: normalizeRow(data as Record<string, unknown>) };
}

export async function deleteReservation(
  supabase: SupabaseClient,
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from("reservations").delete().eq("id", id);
  if (error) {
    console.error("[reservations] delete failed", error);
    return { ok: false, error: "Could not delete reservation." };
  }
  return { ok: true };
}
