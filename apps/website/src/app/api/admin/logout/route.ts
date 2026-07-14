import { NextResponse } from "next/server";

import { createAuthServerClient } from "@/lib/supabase/auth-server";

export async function POST() {
  const supabase = await createAuthServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  return NextResponse.json({ ok: true });
}
