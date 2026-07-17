import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MenuAdminPanel } from "@/components/admin/menu-admin-panel";
import { requireAdmin } from "@/lib/admin/auth";
import { listMenuItemsAdmin } from "@/lib/menu/service";
import { getServiceRoleClient } from "@/lib/supabase/server";

export default async function AdminMenuPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return (
      <div className="space-y-4">
        <AdminPageHeader title="Menu" />
        <p className="text-muted-foreground text-sm">
          Service role key is required to manage menu items.
        </p>
      </div>
    );
  }

  const { rows, error } = await listMenuItemsAdmin(supabase, { includeUnavailable: true });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Menu"
        description="Add, edit, or hide dishes. Changes appear on the public menu within about a minute."
      />

      {error ? (
        <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">{error}</p>
      ) : (
        <MenuAdminPanel initialRows={rows} />
      )}
    </div>
  );
}
