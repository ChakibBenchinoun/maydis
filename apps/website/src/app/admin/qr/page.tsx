import { redirect } from "next/navigation";

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
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-bold">QR codes</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Service role key is required to manage QR targets.
        </p>
      </div>
    );
  }

  const { rows, error } = await listQrTargets(supabase, { includeInactive: true });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-foreground text-2xl font-bold md:text-3xl">QR codes</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Share section destinations. Logo is fixed; only the QR dark color is editable.
        </p>
      </div>

      {error ? (
        <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">{error}</p>
      ) : (
        <QrAdminPanel initialRows={rows} />
      )}
    </div>
  );
}
