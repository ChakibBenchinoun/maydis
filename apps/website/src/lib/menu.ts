import { menuItems as staticMenuItems, type MenuItem } from "@/data/menu";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

type DbMenuRow = {
  id: number | string;
  name: string;
  description?: string | null;
  details?: string | null;
  price: string;
  category: string;
  image_url?: string | null;
  tags?: string[] | null;
  sort_order?: number | null;
};

function mapRow(row: DbMenuRow): MenuItem {
  return {
    id: Number(row.id),
    name: row.name,
    description: row.description ?? "",
    details: row.details ?? "",
    price: row.price,
    category: row.category,
    image: row.image_url || "/images/gallery-01.jpg",
    tags: Array.isArray(row.tags) ? row.tags : [],
  };
}

function normalizeRpcPayload(data: unknown): DbMenuRow[] {
  if (Array.isArray(data)) return data as DbMenuRow[];
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as unknown;
      return Array.isArray(parsed) ? (parsed as DbMenuRow[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** Unique categories in display order of first appearance. */
export function categoriesFromItems(items: MenuItem[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    if (!seen.has(item.category)) {
      seen.add(item.category);
      out.push(item.category);
    }
  }
  return out;
}

/** Default how many dishes to feature on the home “latest” section. */
export const LATEST_MENU_LIMIT = 8;

/**
 * Pick the newest dishes for the home showcase.
 * Prefers higher `id` (treat as recency); falls back to input order if ids tie.
 */
export function pickLatestMenuItems(
  items: MenuItem[],
  limit: number = LATEST_MENU_LIMIT,
): MenuItem[] {
  if (items.length <= limit) return items;
  return [...items].sort((a, b) => b.id - a.id || a.name.localeCompare(b.name)).slice(0, limit);
}

/**
 * Load menu for server components.
 * Prefers Supabase RPC `get_menu_items`; falls back to static `data/menu.ts`.
 */
export async function getMenuItems(): Promise<{
  items: MenuItem[];
  source: "supabase" | "static";
}> {
  if (!isSupabaseConfigured()) {
    return { items: staticMenuItems, source: "static" };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { items: staticMenuItems, source: "static" };
  }

  const { data, error } = await supabase.rpc("get_menu_items");
  if (error) {
    console.warn("[menu] get_menu_items RPC failed, using static menu:", error.message);
    return { items: staticMenuItems, source: "static" };
  }

  const rows = normalizeRpcPayload(data);
  if (rows.length === 0) {
    console.warn("[menu] empty Supabase menu, using static menu");
    return { items: staticMenuItems, source: "static" };
  }

  return { items: rows.map(mapRow), source: "supabase" };
}
