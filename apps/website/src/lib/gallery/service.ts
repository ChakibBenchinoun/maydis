import type { SupabaseClient } from "@supabase/supabase-js";

import type { GalleryItemInput, GalleryItemRow } from "@/lib/gallery/schema";

const SELECT =
  "id, type, image_url, video_url, alt, title, description, sort_order, published, created_at";

export async function listGalleryItems(
  supabase: SupabaseClient,
  options: { includeUnpublished?: boolean } = {},
): Promise<{ rows: GalleryItemRow[]; error?: string }> {
  let query = supabase.from("gallery_items").select(SELECT).order("sort_order", { ascending: true });

  if (!options.includeUnpublished) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[gallery] list failed", error);
    return { rows: [], error: "Could not load gallery." };
  }
  return { rows: (data ?? []) as GalleryItemRow[] };
}

export async function createGalleryItem(
  supabase: SupabaseClient,
  input: GalleryItemInput,
): Promise<{ row: GalleryItemRow | null; error?: string }> {
  const { data, error } = await supabase
    .from("gallery_items")
    .insert({
      type: input.type,
      image_url: input.image_url,
      video_url: input.type === "video" ? input.video_url ?? null : null,
      alt: input.alt,
      title: input.title ?? null,
      description: input.description ?? null,
      sort_order: input.sort_order ?? 0,
      published: input.published ?? true,
    })
    .select(SELECT)
    .single();

  if (error) {
    console.error("[gallery] create failed", error);
    return { row: null, error: "Could not create gallery item." };
  }
  return { row: data as GalleryItemRow };
}

export async function updateGalleryItem(
  supabase: SupabaseClient,
  id: string,
  patch: Partial<GalleryItemInput>,
): Promise<{ row: GalleryItemRow | null; error?: string }> {
  const updates: Record<string, unknown> = {};
  if (patch.type !== undefined) updates.type = patch.type;
  if (patch.image_url !== undefined) updates.image_url = patch.image_url;
  if (patch.video_url !== undefined) updates.video_url = patch.video_url;
  if (patch.alt !== undefined) updates.alt = patch.alt;
  if (patch.title !== undefined) updates.title = patch.title;
  if (patch.description !== undefined) updates.description = patch.description;
  if (patch.sort_order !== undefined) updates.sort_order = patch.sort_order;
  if (patch.published !== undefined) updates.published = patch.published;

  const { data, error } = await supabase
    .from("gallery_items")
    .update(updates)
    .eq("id", id)
    .select(SELECT)
    .single();

  if (error) {
    console.error("[gallery] update failed", error);
    return { row: null, error: "Could not update gallery item." };
  }
  return { row: data as GalleryItemRow };
}

export async function deleteGalleryItem(
  supabase: SupabaseClient,
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) {
    console.error("[gallery] delete failed", error);
    return { ok: false, error: "Could not delete gallery item." };
  }
  return { ok: true };
}
