import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import { reservationListQuerySchema } from "@/lib/reservations/schema";
import { listReservations } from "@/lib/reservations/service";
import { getServiceRoleClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceRoleClient() ?? null;
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const url = new URL(request.url);
  const raw = {
    status: url.searchParams.get("status") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  };
  const query = reservationListQuerySchema.safeParse(raw);
  if (!query.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const status =
    query.data.status === "all" || query.data.status === undefined ? "all" : query.data.status;

  const { rows, error } = await listReservations(supabase, {
    status,
    limit: query.data.limit,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, rows, admin: admin.email });
}
