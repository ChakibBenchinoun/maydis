import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
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
      <div className="space-y-4">
        <AdminPageHeader title="Gallery" />
        <p className="text-muted-foreground text-sm">
          Service role key is required to manage gallery items.
        </p>
      </div>
    );
  }

  const { rows, error } = await listGalleryItems(supabase, { includeUnpublished: true });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gallery"
        description="Photos and videos on the home gallery. Use description (not episode labels)."
      />

      {error ? (
        <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">{error}</p>
      ) : (
        <GalleryAdminPanel initialRows={rows} />
      )}
    </div>
  );
}
