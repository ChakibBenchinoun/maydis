import { NextResponse } from "next/server";
import { z } from "zod";

import { ensureBootstrapOwner, isStaffEmail } from "@/lib/admin/staff";
import { createAuthServerClient } from "@/lib/supabase/auth-server";
import { getServiceRoleClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const normalized = email.trim().toLowerCase();

  const supabase = await createAuthServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Auth is not configured" }, { status: 503 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalized,
    password,
  });

  if (error || !data.user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const service = getServiceRoleClient();
  if (service) {
    await ensureBootstrapOwner(service, normalized, data.user.id);
  }

  const allowed = await isStaffEmail(service, normalized);
  if (!allowed) {
    await supabase.auth.signOut();
    return NextResponse.json(
      {
        error:
          "This account is not staff. The owner can add you under Admin → Staff.",
      },
      { status: 403 },
    );
  }

  return NextResponse.json({ ok: true });
}
