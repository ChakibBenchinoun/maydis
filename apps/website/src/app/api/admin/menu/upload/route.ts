import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import { uploadMedia } from "@/lib/media/storage";
import { getServiceRoleClient } from "@/lib/supabase/server";

/** Multipart upload: field `file` → public URL on Storage bucket `media`. */
export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const contentType = file.type || "application/octet-stream";
  const result = await uploadMedia(supabase, {
    folder: "menu",
    data: file,
    contentType,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    path: result.path,
    publicUrl: result.publicUrl,
  });
}
