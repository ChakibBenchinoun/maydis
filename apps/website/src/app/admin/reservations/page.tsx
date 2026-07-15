import { redirect } from "next/navigation";

import { ReservationsTable } from "@/components/admin/reservations-table";
import { requireAdmin } from "@/lib/admin/auth";
import { reservationStatusSchema, type ReservationStatus } from "@/lib/reservations/schema";
import { listReservations } from "@/lib/reservations/service";
import { getServiceRoleClient } from "@/lib/supabase/server";

type Props = { searchParams: Promise<{ status?: string }> };

export default async function AdminReservationsPage({ searchParams }: Props) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const sp = await searchParams;
  const rawStatus = sp.status ?? "all";
  const statusParsed = reservationStatusSchema.safeParse(rawStatus);
  const statusFilter: ReservationStatus | "all" = statusParsed.success ? statusParsed.data : "all";

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-bold">Reservations</h1>
        <p className="text-muted-foreground mt-2 text-sm">
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
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-foreground text-2xl font-bold md:text-3xl">
          Reservations
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Review requests and update status. Guests are notified via WhatsApp when they book.
        </p>
      </div>

      {error ? (
        <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">{error}</p>
      ) : (
        <ReservationsTable initialRows={rows} initialStatus={statusFilter} />
      )}
    </div>
  );
}
