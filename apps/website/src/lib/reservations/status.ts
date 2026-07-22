/** Shared status labels / badge styles for admin reservations UI. */

export const reservationStatusLabel: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

export function reservationStatusBadgeClass(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-accent/15 text-accent border-transparent";
    case "cancelled":
      return "bg-destructive/10 text-destructive border-transparent";
    case "completed":
      return "bg-secondary text-muted-foreground border-transparent";
    default:
      return "bg-primary/15 text-primary border-transparent";
  }
}
