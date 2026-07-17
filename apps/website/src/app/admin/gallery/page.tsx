import { redirect } from "next/navigation";

import { GalleryAdminPanel } from "@/components/admin/gallery-admin-panel";
import { requireAdmin } from "@/lib/admin/auth";
import { listGalleryItems } from "@/lib/gallery/service";
import { getServiceRoleClient } from "@/lib/supabase/server";

export default async function AdminGalleryPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-bold">Gallery</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Service role key is required to manage gallery items.
        </p>
      </div>
    );
  }

  const { rows, error } = await listGalleryItems(supabase, { includeUnpublished: true });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-foreground text-2xl font-bold md:text-3xl">Gallery</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Photos and videos on the home gallery. Use description (not episode labels).
        </p>
      </div>

      {error ? (
        <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">{error}</p>
      ) : (
        <GalleryAdminPanel initialRows={rows} />
      )}
    </div>
  );
}
