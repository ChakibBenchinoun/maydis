import { menuLink, reserveLink, site } from "@/lib/constants";
import type { QrTarget } from "@/lib/qr/schema";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

const DEFAULT_DARK = "#2C2318";

/** Static fallback when Supabase is offline / empty (max 3 — under 5 active cap). */
export const staticQrTargets: QrTarget[] = [
  {
    id: "static-menu",
    label: "Menu",
    targetUrl: menuLink.href,
    darkColor: DEFAULT_DARK,
  },
  {
    id: "static-reserve",
    label: "Reserve",
    targetUrl: reserveLink.href,
    darkColor: DEFAULT_DARK,
  },
  {
    id: "static-instagram",
    label: "Instagram",
    targetUrl: "https://www.instagram.com/maydiscakeshop/",
    darkColor: DEFAULT_DARK,
  },
];

type DbQrRow = {
  id: string;
  label: string;
  target_url: string;
  dark_color?: string | null;
  sort_order?: number | null;
};

function mapRow(row: DbQrRow): QrTarget {
  return {
    id: String(row.id),
    label: row.label,
    targetUrl: row.target_url,
    darkColor: row.dark_color?.trim() || DEFAULT_DARK,
  };
}

function normalizeRpcPayload(data: unknown): DbQrRow[] {
  if (Array.isArray(data)) return data as DbQrRow[];
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as unknown;
      return Array.isArray(parsed) ? (parsed as DbQrRow[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Turn a path or absolute URL into a scannable absolute URL.
 * Uses production origin for server-side absolute links when possible.
 */
export function resolveQrTargetUrl(targetUrl: string, origin?: string): string {
  const raw = targetUrl.trim();
  if (/^https?:\/\//i.test(raw)) return raw;
  const base =
    origin?.replace(/\/$/, "") ||
    site.productionOrigin.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "";
  if (!base) return raw.startsWith("/") ? raw : `/${raw}`;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${base}${path}`;
}

/**
 * Load active QR targets for the public share section.
 * Prefers Supabase RPC `get_qr_targets`; falls back to static defaults.
 */
export async function getQrTargets(): Promise<{
  targets: QrTarget[];
  source: "supabase" | "static";
}> {
  if (!isSupabaseConfigured()) {
    return { targets: staticQrTargets, source: "static" };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { targets: staticQrTargets, source: "static" };
  }

  const { data, error } = await supabase.rpc("get_qr_targets");
  if (error) {
    console.warn("[qr] get_qr_targets failed, using static:", error.message);
    return { targets: staticQrTargets, source: "static" };
  }

  const rows = normalizeRpcPayload(data);
  if (rows.length === 0) {
    return { targets: staticQrTargets, source: "static" };
  }

  return { targets: rows.map(mapRow), source: "supabase" };
}
