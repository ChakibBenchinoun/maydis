import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import { qrTargetSchema } from "@/lib/qr/schema";
import { deleteQrTarget, updateQrTarget } from "@/lib/qr/service";
import { getServiceRoleClient } from "@/lib/supabase/server";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = qrTargetSchema.partial().safeParse(body);
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

  const { row, error } = await updateQrTarget(supabase, id, parsed.data);
  if (error || !row) {
    return NextResponse.json({ error: error ?? "Could not update QR" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, row });
}

export async function DELETE(_request: Request, context: Ctx) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { ok, error } = await deleteQrTarget(supabase, id);
  if (!ok) {
    return NextResponse.json({ error: error ?? "Could not delete" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
