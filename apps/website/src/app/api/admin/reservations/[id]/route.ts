import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import { reservationUpdateSchema } from "@/lib/reservations/schema";
import { updateReservation } from "@/lib/reservations/service";
import { getServiceRoleClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = reservationUpdateSchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? "Invalid update" }, { status: 400 });
  }

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { row, error } = await updateReservation(supabase, id, parsed.data);
  if (error || !row) {
    return NextResponse.json({ error: error ?? "Not found" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, row });
}
