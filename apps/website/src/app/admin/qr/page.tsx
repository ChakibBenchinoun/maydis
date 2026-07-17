import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { QrAdminPanel } from "@/components/admin/qr-admin-panel";
import { requireAdmin } from "@/lib/admin/auth";
import { listQrTargets } from "@/lib/qr/service";
import { getServiceRoleClient } from "@/lib/supabase/server";

export default async function AdminQrPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return (
      <div className="space-y-4">
        <AdminPageHeader title="QR codes" />
        <p className="text-muted-foreground text-sm">
          Service role key is required to manage QR targets.
        </p>
      </div>
    );
  }

  const { rows, error } = await listQrTargets(supabase, { includeInactive: true });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="QR codes"
        description="Share section destinations. Logo is fixed; only the QR dark color is editable."
      />

      {error ? (
        <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">{error}</p>
      ) : (
        <QrAdminPanel initialRows={rows} />
      )}
    </div>
  );
}
