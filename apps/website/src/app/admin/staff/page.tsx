import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StaffPanel } from "@/components/admin/staff-panel";
import { requireAdmin } from "@/lib/admin/auth";
import { listStaff } from "@/lib/admin/staff";
import { getServiceRoleClient } from "@/lib/supabase/server";

export default async function AdminStaffPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return (
      <div className="space-y-4">
        <AdminPageHeader title="Staff" />
        <p className="text-muted-foreground text-sm">
          Service role key is required to manage staff.
        </p>
      </div>
    );
  }

  const { rows, error } = await listStaff(supabase);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Staff"
        description="The owner invites colleagues here. They sign in with email and the password you set."
      />

      {error ? (
        <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">{error}</p>
      ) : (
        <StaffPanel initialRows={rows} me={{ email: admin.email, role: admin.role }} />
      )}
    </div>
  );
}
