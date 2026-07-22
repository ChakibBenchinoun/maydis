import type { QueryClient } from "@tanstack/react-query";

import type { ReservationRow, ReservationStatus } from "@/lib/reservations/schema";

export type ReservationStatusFilter = ReservationStatus | "all";

export function reservationsQueryKey(status: ReservationStatusFilter) {
  return ["admin", "reservations", status] as const;
}

export function reservationQueryKey(id: string) {
  return ["admin", "reservation", id] as const;
}

export async function fetchAdminReservations(
  status: ReservationStatusFilter,
  limit = 100,
): Promise<ReservationRow[]> {
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  params.set("limit", String(limit));
  const qs = params.toString();
  const res = await fetch(`/api/admin/reservations?${qs}`);
  const data = (await res.json()) as { rows?: ReservationRow[]; error?: string };
  if (!res.ok) {
    throw new Error(data.error || "Failed to load reservations");
  }
  return data.rows ?? [];
}

export async function fetchAdminReservation(id: string): Promise<ReservationRow> {
  const res = await fetch(`/api/admin/reservations/${id}`);
  const data = (await res.json()) as { row?: ReservationRow; error?: string };
  if (!res.ok || !data.row) {
    throw new Error(data.error || "Failed to load reservation");
  }
  return data.row;
}

export async function patchAdminReservation(
  id: string,
  body: { status: ReservationStatus },
): Promise<ReservationRow> {
  const res = await fetch(`/api/admin/reservations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { row?: ReservationRow; error?: string };
  if (!res.ok || !data.row) {
    throw new Error(data.error || "Update failed");
  }
  return data.row;
}

/** Keep list caches in sync after a single-row status change. */
export function syncReservationCaches(queryClient: QueryClient, row: ReservationRow) {
  queryClient.setQueryData(reservationQueryKey(row.id), row);

  const filters: ReservationStatusFilter[] = [
    "all",
    "pending",
    "confirmed",
    "cancelled",
    "completed",
  ];
  for (const filter of filters) {
    queryClient.setQueryData<ReservationRow[]>(reservationsQueryKey(filter), (prev) => {
      if (!prev) return prev;
      if (filter !== "all" && row.status !== filter) {
        return prev.filter((r) => r.id !== row.id);
      }
      const idx = prev.findIndex((r) => r.id === row.id);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = row;
      return next;
    });
  }
}
