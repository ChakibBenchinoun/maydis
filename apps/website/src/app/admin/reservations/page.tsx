import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ReservationsTable } from "@/components/admin/reservations-table";
import { requireAdmin } from "@/lib/admin/auth";
import type { ReservationStatusFilter } from "@/lib/reservations/client";
import { reservationStatusSchema } from "@/lib/reservations/schema";
import { listReservations } from "@/lib/reservations/service";
import { getServiceRoleClient } from "@/lib/supabase/server";

type Props = { searchParams: Promise<{ status?: string }> };

export default async function AdminReservationsPage({ searchParams }: Props) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const sp = await searchParams;
  const rawStatus = sp.status ?? "all";
  const statusParsed = reservationStatusSchema.safeParse(rawStatus);
  const statusFilter: ReservationStatusFilter = statusParsed.success ? statusParsed.data : "all";

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return (
      <div className="space-y-4">
        <AdminPageHeader title="Reservations" />
        <p className="text-muted-foreground text-sm">
          Set <code className="text-foreground">SUPABASE_SERVICE_ROLE_KEY</code> to manage bookings.
        </p>
      </div>
    );
  }

  const { rows, error } = await listReservations(supabase, {
    status: statusFilter,
    limit: 100,
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reservations"
        description="Browse bookings. Open a row for contact details, notes, and status updates."
      />

      {error ? (
        <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">{error}</p>
      ) : (
        <ReservationsTable initialRows={rows} initialStatus={statusFilter} />
      )}
    </div>
  );
}
