import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import { deactivateStaffMember } from "@/lib/admin/staff";
import { getServiceRoleClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (admin.role !== "owner") {
    return NextResponse.json({ error: "Only the owner can remove staff." }, { status: 403 });
  }

  const { id } = await params;
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { error } = await deactivateStaffMember(supabase, id);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
