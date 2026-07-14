import { redirect } from "next/navigation";

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
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-2xl font-bold">Staff</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Service role key is required to manage staff.
        </p>
      </div>
    );
  }

  const { rows, error } = await listStaff(supabase);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-foreground text-2xl font-bold md:text-3xl">Staff</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          The owner invites colleagues here. They sign in with email and the password you set.
        </p>
      </div>

      {error ? (
        <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">{error}</p>
      ) : (
        <StaffPanel initialRows={rows} me={{ email: admin.email, role: admin.role }} />
      )}
    </div>
  );
}
