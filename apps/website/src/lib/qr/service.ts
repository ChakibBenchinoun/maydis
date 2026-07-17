import type { SupabaseClient } from "@supabase/supabase-js";

import {
  MAX_ACTIVE_QR_TARGETS,
  QR_ACTIVE_LIMIT_MESSAGE,
  type QrTargetInput,
  type QrTargetRow,
} from "@/lib/qr/schema";

const SELECT = "id, label, target_url, dark_color, sort_order, active, created_at";

export async function countActiveQrTargets(
  supabase: SupabaseClient,
  exceptId?: string,
): Promise<number> {
  let query = supabase
    .from("qr_targets")
    .select("id", { count: "exact", head: true })
    .eq("active", true);
  if (exceptId) {
    query = query.neq("id", exceptId);
  }
  const { count, error } = await query;
  if (error) {
    console.error("[qr] count active failed", error);
    return MAX_ACTIVE_QR_TARGETS; // fail closed for activate attempts
  }
  return count ?? 0;
}

export async function listQrTargets(
  supabase: SupabaseClient,
  options: { includeInactive?: boolean } = {},
): Promise<{ rows: QrTargetRow[]; error?: string }> {
  let query = supabase.from("qr_targets").select(SELECT).order("sort_order", { ascending: true });
  if (!options.includeInactive) {
    query = query.eq("active", true);
  }
  const { data, error } = await query;
  if (error) {
    console.error("[qr] list failed", error);
    return { rows: [], error: "Could not load QR targets." };
  }
  return { rows: (data ?? []) as QrTargetRow[] };
}

export async function createQrTarget(
  supabase: SupabaseClient,
  input: QrTargetInput,
): Promise<{ row: QrTargetRow | null; error?: string }> {
  const wantActive = input.active ?? true;
  if (wantActive) {
    const n = await countActiveQrTargets(supabase);
    if (n >= MAX_ACTIVE_QR_TARGETS) {
      return { row: null, error: QR_ACTIVE_LIMIT_MESSAGE };
    }
  }

  const { data, error } = await supabase
    .from("qr_targets")
    .insert({
      label: input.label,
      target_url: input.target_url,
      dark_color: input.dark_color ?? "#2C2318",
      sort_order: input.sort_order ?? 0,
      active: wantActive,
    })
    .select(SELECT)
    .single();

  if (error) {
    console.error("[qr] create failed", error);
    return { row: null, error: "Could not create QR target." };
  }
  return { row: data as QrTargetRow };
}

export async function updateQrTarget(
  supabase: SupabaseClient,
  id: string,
  patch: Partial<QrTargetInput>,
): Promise<{ row: QrTargetRow | null; error?: string }> {
  // Never accept logo fields — brand logo is fixed in the public QR UI.
  const updates: Record<string, unknown> = {};
  if (patch.label !== undefined) updates.label = patch.label;
  if (patch.target_url !== undefined) updates.target_url = patch.target_url;
  if (patch.dark_color !== undefined) updates.dark_color = patch.dark_color;
  if (patch.sort_order !== undefined) updates.sort_order = patch.sort_order;

  if (patch.active === true) {
    const n = await countActiveQrTargets(supabase, id);
    if (n >= MAX_ACTIVE_QR_TARGETS) {
      return { row: null, error: QR_ACTIVE_LIMIT_MESSAGE };
    }
    updates.active = true;
  } else if (patch.active === false) {
    updates.active = false;
  }

  const { data, error } = await supabase
    .from("qr_targets")
    .update(updates)
    .eq("id", id)
    .select(SELECT)
    .single();

  if (error) {
    console.error("[qr] update failed", error);
    return { row: null, error: "Could not update QR target." };
  }
  return { row: data as QrTargetRow };
}

export async function deleteQrTarget(
  supabase: SupabaseClient,
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from("qr_targets").delete().eq("id", id);
  if (error) {
    console.error("[qr] delete failed", error);
    return { ok: false, error: "Could not delete QR target." };
  }
  return { ok: true };
}
