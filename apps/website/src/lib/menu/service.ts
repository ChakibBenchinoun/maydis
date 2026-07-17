import type { SupabaseClient } from "@supabase/supabase-js";

import type { MenuItemInput, MenuItemRow } from "@/lib/menu/schema";

const SELECT =
  "id, name, description, details, price, category, image_url, tags, sort_order, available, created_at";

export async function listMenuItemsAdmin(
  supabase: SupabaseClient,
  options: { includeUnavailable?: boolean } = {},
): Promise<{ rows: MenuItemRow[]; error?: string }> {
  let query = supabase.from("menu_items").select(SELECT).order("sort_order", { ascending: true });

  if (!options.includeUnavailable) {
    query = query.eq("available", true);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[menu] list failed", error);
    return { rows: [], error: "Could not load menu." };
  }
  return { rows: (data ?? []) as MenuItemRow[] };
}

export async function createMenuItem(
  supabase: SupabaseClient,
  input: MenuItemInput,
): Promise<{ row: MenuItemRow | null; error?: string }> {
  const { data, error } = await supabase
    .from("menu_items")
    .insert({
      name: input.name,
      description: input.description ?? "",
      details: input.details ?? "",
      price: input.price,
      category: input.category,
      image_url: input.image_url ?? "",
      tags: input.tags ?? [],
      sort_order: input.sort_order ?? 0,
      available: input.available ?? true,
    })
    .select(SELECT)
    .single();

  if (error) {
    console.error("[menu] create failed", error);
    return { row: null, error: "Could not create menu item." };
  }
  return { row: data as MenuItemRow };
}

export async function updateMenuItem(
  supabase: SupabaseClient,
  id: number,
  patch: Partial<MenuItemInput>,
): Promise<{ row: MenuItemRow | null; error?: string }> {
  const updates: Record<string, unknown> = {};
  if (patch.name !== undefined) updates.name = patch.name;
  if (patch.description !== undefined) updates.description = patch.description;
  if (patch.details !== undefined) updates.details = patch.details;
  if (patch.price !== undefined) updates.price = patch.price;
  if (patch.category !== undefined) updates.category = patch.category;
  if (patch.image_url !== undefined) updates.image_url = patch.image_url;
  if (patch.tags !== undefined) updates.tags = patch.tags;
  if (patch.sort_order !== undefined) updates.sort_order = patch.sort_order;
  if (patch.available !== undefined) updates.available = patch.available;

  const { data, error } = await supabase
    .from("menu_items")
    .update(updates)
    .eq("id", id)
    .select(SELECT)
    .single();

  if (error) {
    console.error("[menu] update failed", error);
    return { row: null, error: "Could not update menu item." };
  }
  return { row: data as MenuItemRow };
}

export async function deleteMenuItem(
  supabase: SupabaseClient,
  id: number,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) {
    console.error("[menu] delete failed", error);
    return { ok: false, error: "Could not delete menu item." };
  }
  return { ok: true };
}
