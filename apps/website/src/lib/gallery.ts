import { galleryItems as staticGalleryItems, type GalleryItem } from "@/data/gallery";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

type DbGalleryRow = {
  id: string;
  type: "photo" | "video" | string;
  image_url?: string | null;
  video_url?: string | null;
  alt?: string | null;
  title?: string | null;
  description?: string | null;
  sort_order?: number | null;
};

function mapRow(row: DbGalleryRow): GalleryItem {
  const type = row.type === "video" ? "video" : "photo";
  return {
    id: String(row.id),
    type,
    image: row.image_url || "/images/gallery-01.jpg",
    alt: row.alt || "Maydi's",
    videoSrc: row.video_url || undefined,
    title: row.title || undefined,
    description: row.description || undefined,
  };
}

function normalizeRpcPayload(data: unknown): DbGalleryRow[] {
  if (Array.isArray(data)) return data as DbGalleryRow[];
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as unknown;
      return Array.isArray(parsed) ? (parsed as DbGalleryRow[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Load gallery for server components.
 * Prefers Supabase RPC `get_gallery_items`; falls back to static `data/gallery.ts`.
 */
export async function getGalleryItems(): Promise<{
  items: GalleryItem[];
  source: "supabase" | "static";
}> {
  if (!isSupabaseConfigured()) {
    return { items: staticGalleryItems, source: "static" };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { items: staticGalleryItems, source: "static" };
  }

  const { data, error } = await supabase.rpc("get_gallery_items");
  if (error) {
    console.warn("[gallery] get_gallery_items failed, using static:", error.message);
    return { items: staticGalleryItems, source: "static" };
  }

  const rows = normalizeRpcPayload(data);
  if (rows.length === 0) {
    console.warn("[gallery] empty Supabase gallery, using static");
    return { items: staticGalleryItems, source: "static" };
  }

  return { items: rows.map(mapRow), source: "supabase" };
}
