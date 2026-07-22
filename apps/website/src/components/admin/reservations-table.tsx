"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { ChevronRight, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchAdminReservations,
  reservationsQueryKey,
  type ReservationStatusFilter,
} from "@/lib/reservations/client";
import { formatDisplayDate } from "@/lib/reservations/options";
import { RESERVATION_STATUSES, type ReservationRow } from "@/lib/reservations/schema";
import { reservationStatusBadgeClass, reservationStatusLabel } from "@/lib/reservations/status";
import { cn } from "@/lib/utils";

type ColumnMeta = {
  className?: string;
};

export function ReservationsTable({
  initialRows,
  initialStatus,
}: {
  initialRows: ReservationRow[];
  initialStatus: ReservationStatusFilter;
}) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<ReservationStatusFilter>(initialStatus);
  const [seededAt] = useState(() => Date.now());

  const {
    data: rows = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: reservationsQueryKey(statusFilter),
    queryFn: () => fetchAdminReservations(statusFilter),
    initialData: statusFilter === initialStatus ? initialRows : undefined,
    initialDataUpdatedAt: statusFilter === initialStatus ? seededAt : undefined,
  });

  const columns = useMemo<ColumnDef<ReservationRow>[]>(
    () => [
      {
        id: "when",
        header: "When",
        meta: { className: "w-[28%]" } satisfies ColumnMeta,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="space-y-0.5">
              <p className="text-foreground font-medium whitespace-nowrap">
                {formatDisplayDate(r.date)}
              </p>
              <p className="text-muted-foreground text-xs whitespace-nowrap tabular-nums">
                {r.time}
              </p>
            </div>
          );
        },
      },
      {
        id: "guest",
        header: "Guest",
        meta: { className: "w-[32%]" } satisfies ColumnMeta,
        cell: ({ row }) => (
          <p className="text-foreground truncate font-medium" title={row.original.name}>
            {row.original.name}
          </p>
        ),
      },
      {
        id: "guests",
        header: "Party",
        meta: { className: "w-[12%]" } satisfies ColumnMeta,
        cell: ({ row }) => (
          <span className="text-foreground tabular-nums">{row.original.guests}</span>
        ),
      },
      {
        id: "status",
        header: "Status",
        meta: { className: "w-[18%]" } satisfies ColumnMeta,
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge className={reservationStatusBadgeClass(status)}>
              {reservationStatusLabel[status] ?? status}
            </Badge>
          );
        },
      },
      {
        id: "open",
        header: "",
        meta: { className: "w-[10%]" } satisfies ColumnMeta,
        cell: () => (
          <span className="text-muted-foreground inline-flex items-center gap-0.5 text-xs font-medium">
            Open
            <ChevronRight className="size-3.5" aria-hidden />
          </span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  function changeFilter(next: string) {
    const value = (next || "all") as ReservationStatusFilter;
    setStatusFilter(value);
    router.replace(
      value !== "all"
        ? `/admin/reservations?status=${encodeURIComponent(value)}`
        : "/admin/reservations",
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Label
          htmlFor="reservation-status-filter"
          className="text-muted-foreground text-xs uppercase"
        >
          Status
        </Label>
        <select
          id="reservation-status-filter"
          value={statusFilter}
          onChange={(e) => changeFilter(e.target.value)}
          className="border-border bg-secondary text-foreground focus:border-primary rounded-lg border px-3 py-2 text-sm focus:outline-hidden"
        >
          <option value="all">All</option>
          {RESERVATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {reservationStatusLabel[s] ?? s}
            </option>
          ))}
        </select>
        <Badge variant="secondary" className="tabular-nums">
          {rows.length} shown
        </Badge>
        {isFetching && !isLoading ? (
          <Loader2
            className="text-muted-foreground size-3.5 animate-spin"
            aria-label="Refreshing"
          />
        ) : null}
      </div>

      {isError ? (
        <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">
          {error instanceof Error ? error.message : "Could not load reservations."}
        </p>
      ) : null}

      {isLoading && rows.length === 0 ? (
        <Card className="py-10">
          <CardContent className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Loading reservations…
          </CardContent>
        </Card>
      ) : rows.length === 0 ? (
        <Card className="py-10">
          <CardContent className="text-muted-foreground text-center text-sm">
            No reservations found for this filter.
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            "border-border/60 bg-card overflow-hidden rounded-xl border shadow-sm",
            isFetching && !isLoading && "opacity-80",
          )}
        >
          <Table className="table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/40 hover:bg-muted/40">
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta as ColumnMeta | undefined;
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          "text-muted-foreground h-11 px-3 text-xs font-semibold tracking-wide uppercase",
                          meta?.className,
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/40 cursor-pointer">
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as ColumnMeta | undefined;
                    return (
                      <TableCell key={cell.id} className={cn("relative p-0", meta?.className)}>
                        <Link
                          href={`/admin/reservations/${row.original.id}`}
                          className="text-foreground focus-visible:ring-ring block px-3 py-3 focus-visible:ring-2 focus-visible:outline-hidden focus-visible:ring-inset"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Link>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
