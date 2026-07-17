import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import { menuItemSchema } from "@/lib/menu/schema";
import { deleteMenuItem, updateMenuItem } from "@/lib/menu/service";
import { getServiceRoleClient } from "@/lib/supabase/server";

type Ctx = { params: Promise<{ id: string }> };

function parseId(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function PATCH(request: Request, context: Ctx) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: idRaw } = await context.params;
  const id = parseId(idRaw);
  if (id === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = menuItemSchema.partial().safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? "Invalid input" }, { status: 400 });
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { row, error } = await updateMenuItem(supabase, id, parsed.data);
  if (error || !row) {
    return NextResponse.json({ error: error ?? "Could not update item" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, row });
}

export async function DELETE(_request: Request, context: Ctx) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: idRaw } = await context.params;
  const id = parseId(idRaw);
  if (id === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { ok, error } = await deleteMenuItem(supabase, id);
  if (!ok) {
    return NextResponse.json({ error: error ?? "Could not delete" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
