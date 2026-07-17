import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import { menuItemSchema } from "@/lib/menu/schema";
import { createMenuItem, listMenuItemsAdmin } from "@/lib/menu/service";
import { getServiceRoleClient } from "@/lib/supabase/server";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { rows, error } = await listMenuItemsAdmin(supabase, { includeUnavailable: true });
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, rows });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = menuItemSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? "Invalid input" }, { status: 400 });
  }

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { row, error } = await createMenuItem(supabase, parsed.data);
  if (error || !row) {
    return NextResponse.json({ error: error ?? "Could not create item" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, row });
}
