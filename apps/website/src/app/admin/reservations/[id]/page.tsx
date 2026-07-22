import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ReservationDetail } from "@/components/admin/reservation-detail";
import { requireAdmin } from "@/lib/admin/auth";
import { getReservation } from "@/lib/reservations/service";
import { getServiceRoleClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function AdminReservationDetailPage({ params }: Props) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  if (!id) notFound();

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Set <code className="text-foreground">SUPABASE_SERVICE_ROLE_KEY</code> to manage bookings.
        </p>
        <Link
          href="/admin/reservations"
          className="text-primary text-sm font-medium hover:underline"
        >
          Back to reservations
        </Link>
      </div>
    );
  }

  const { row, error } = await getReservation(supabase, id);
  if (error === "Reservation not found." || !row) {
    notFound();
  }
  if (error) {
    return (
      <div className="space-y-4">
        <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">{error}</p>
        <Link
          href="/admin/reservations"
          className="text-primary text-sm font-medium hover:underline"
        >
          Back to reservations
        </Link>
      </div>
    );
  }

  return <ReservationDetail id={id} initialRow={row} />;
}
