import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin/auth";
import { addStaffMember, listStaff } from "@/lib/admin/staff";
import { getServiceRoleClient } from "@/lib/supabase/server";

const addSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["owner", "staff"]).optional().default("staff"),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { rows, error } = await listStaff(supabase);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    rows,
    me: { email: admin.email, role: admin.role },
  });
}

/** Owner only: create Auth user + staff_members row. */
export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (admin.role !== "owner") {
    return NextResponse.json({ error: "Only the owner can add staff." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? "Invalid input" }, { status: 400 });
  }

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const role = parsed.data.role;

  // Create auth user (or reuse if already exists)
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password: parsed.data.password,
    email_confirm: true,
  });

  let userId: string | undefined = created.user?.id;

  if (createError) {
    const msg = createError.message.toLowerCase();
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
      // Look up existing user by listing is heavy; try invite path skip — store email only
      userId = undefined;
    } else {
      console.error("[staff] createUser failed", createError);
      return NextResponse.json(
        { error: createError.message || "Could not create login for staff." },
        { status: 400 },
      );
    }
  }

  const { row, error } = await addStaffMember(supabase, {
    email,
    role,
    createdBy: admin.email,
    userId,
  });

  if (error || !row) {
    return NextResponse.json({ error: error ?? "Could not add staff" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    row,
    note:
      userId || !createError
        ? "Staff can sign in with the email and password you set."
        : "Email was already an Auth user — they can sign in with their existing password (or reset in Supabase).",
  });
}
