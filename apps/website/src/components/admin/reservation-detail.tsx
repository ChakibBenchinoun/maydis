"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { formatPhoneDisplay, normalizeWhatsAppPhone } from "@/lib/phone";
import {
  fetchAdminReservation,
  patchAdminReservation,
  reservationQueryKey,
  syncReservationCaches,
} from "@/lib/reservations/client";
import { formatDisplayDate } from "@/lib/reservations/options";
import {
  RESERVATION_STATUSES,
  type ReservationRow,
  type ReservationStatus,
} from "@/lib/reservations/schema";
import { reservationStatusBadgeClass, reservationStatusLabel } from "@/lib/reservations/status";

const selectClass =
  "border-border bg-secondary text-foreground focus:border-primary rounded-lg border px-3 py-2 text-sm focus:outline-hidden disabled:opacity-60";

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-foreground text-sm/6 font-medium">{label}</dt>
      <dd className="text-muted-foreground mt-1 text-sm/6 sm:col-span-2 sm:mt-0">{children}</dd>
    </div>
  );
}

export function ReservationDetail({ id, initialRow }: { id: string; initialRow: ReservationRow }) {
  const queryClient = useQueryClient();
  const [seededAt] = useState(() => Date.now());

  const { data: row = initialRow, isFetching } = useQuery({
    queryKey: reservationQueryKey(id),
    queryFn: () => fetchAdminReservation(id),
    initialData: initialRow,
    initialDataUpdatedAt: seededAt,
  });

  const updateStatus = useMutation({
    mutationFn: (status: ReservationStatus) => patchAdminReservation(id, { status }),
    onSuccess: (next) => {
      syncReservationCaches(queryClient, next);
      toast.success(`Marked ${reservationStatusLabel[next.status] ?? next.status}`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Update failed");
    },
  });

  const e164 = normalizeWhatsAppPhone(row.phone);
  const waHref = e164 ? `https://wa.me/${e164}` : undefined;
  const current = RESERVATION_STATUSES.includes(row.status as ReservationStatus)
    ? (row.status as ReservationStatus)
    : "pending";
  const eventLabel = row.event_name?.trim() || null;
  const notes = row.notes?.trim() || null;
  const email = row.email?.trim() || null;

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/reservations"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All reservations
        </Link>
      </div>

      <div className="px-4 sm:px-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-foreground text-base/7 font-semibold">
              {row.name}
              {isFetching ? (
                <Loader2
                  className="text-muted-foreground ml-2 inline size-3.5 animate-spin"
                  aria-label="Refreshing"
                />
              ) : null}
            </h3>
            <p className="text-muted-foreground mt-1 max-w-2xl text-sm/6">
              Booking for {formatDisplayDate(row.date)} at {row.time} · {row.guests} guests
            </p>
          </div>
          <Badge className={reservationStatusBadgeClass(row.status)}>
            {reservationStatusLabel[row.status] ?? row.status}
          </Badge>
        </div>
      </div>

      <div className="border-border mt-6 border-t">
        <dl className="divide-border divide-y">
          <DetailField label="Guest name">{row.name}</DetailField>

          <DetailField label="Phone">{e164 ? formatPhoneDisplay(e164) : row.phone}</DetailField>

          <DetailField label="Email">{email || "—"}</DetailField>

          <DetailField label="Date">{formatDisplayDate(row.date)}</DetailField>

          <DetailField label="Time">
            <span className="tabular-nums">{row.time}</span>
          </DetailField>

          <DetailField label="Party size">
            <span className="tabular-nums">{row.guests}</span>
          </DetailField>

          <DetailField label="Event">{eventLabel || "—"}</DetailField>

          <DetailField label="Notes">
            {notes ? <span className="text-foreground whitespace-pre-wrap">{notes}</span> : "—"}
          </DetailField>

          <DetailField label="Status">
            <div className="flex flex-wrap items-center gap-3">
              <select
                disabled={updateStatus.isPending}
                value={current}
                onChange={(e) => updateStatus.mutate(e.target.value as ReservationStatus)}
                className={selectClass}
                aria-label="Update reservation status"
              >
                {RESERVATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {reservationStatusLabel[s]}
                  </option>
                ))}
              </select>
              {updateStatus.isPending ? (
                <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                  <Loader2 className="size-3 animate-spin" />
                  Saving…
                </span>
              ) : null}
            </div>
          </DetailField>

          <DetailField label="Contact">
            {waHref ? (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 font-medium"
              >
                WhatsApp guest
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            ) : (
              "No valid mobile for WhatsApp"
            )}
          </DetailField>

          <DetailField label="Reference">
            <span className="text-foreground font-mono text-xs">{row.id}</span>
          </DetailField>

          <DetailField label="Received">{new Date(row.created_at).toLocaleString()}</DetailField>
        </dl>
      </div>
    </div>
  );
}
