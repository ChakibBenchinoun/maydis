import { redirect } from "next/navigation";

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
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-bold">Menu</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Service role key is required to manage menu items.
        </p>
      </div>
    );
  }

  const { rows, error } = await listMenuItemsAdmin(supabase, { includeUnavailable: true });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-foreground text-2xl font-bold md:text-3xl">Menu</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Add, edit, or hide dishes. Changes appear on the public menu within about a minute.
        </p>
      </div>

      {error ? (
        <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">{error}</p>
      ) : (
        <MenuAdminPanel initialRows={rows} />
      )}
    </div>
  );
}
