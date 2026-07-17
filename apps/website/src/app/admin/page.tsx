import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  CalendarDays,
  Clock,
  ExternalLink,
  Images,
  QrCode,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/admin/auth";
import { listGalleryItems } from "@/lib/gallery/service";
import { listMenuItemsAdmin } from "@/lib/menu/service";
import { MAX_ACTIVE_QR_TARGETS } from "@/lib/qr/schema";
import { listQrTargets } from "@/lib/qr/service";
import { listReservations } from "@/lib/reservations/service";
import { getServiceRoleClient } from "@/lib/supabase/server";

const quickLinks = [
  {
    href: "/admin/reservations",
    title: "Reservations",
    description: "Update status and view guest details",
    icon: CalendarDays,
  },
  {
    href: "/admin/reservations?status=pending",
    title: "Needs response",
    description: "Pending bookings waiting for staff",
    icon: Clock,
  },
  {
    href: "/admin/menu",
    title: "Menu",
    description: "Dishes, prices, images, visibility",
    icon: UtensilsCrossed,
  },
  {
    href: "/admin/gallery",
    title: "Gallery",
    description: "Photos & videos, descriptions, publish",
    icon: Images,
  },
  {
    href: "/admin/qr",
    title: "QR codes",
    description: "Up to 5 active targets · color only",
    icon: QrCode,
  },
  {
    href: "/admin/staff",
    title: "Staff",
    description: "Owner invites colleagues",
    icon: Users,
  },
] as const;

function maxIsoDate(dates: Array<string | undefined | null>): string | null {
  let best: number | null = null;
  for (const d of dates) {
    if (!d) continue;
    const t = Date.parse(d);
    if (Number.isNaN(t)) continue;
    if (best === null || t > best) best = t;
  }
  return best === null ? null : new Date(best).toISOString();
}

function formatRelativeOrDate(iso: string | null): string {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "—";
  const diffMs = Date.now() - t;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(t).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getServiceRoleClient();

  let total = 0;
  let pending = 0;
  let confirmed = 0;
  let stalePending = 0;
  let menuAvailable = 0;
  let menuTotal = 0;
  let galleryPublished = 0;
  let galleryTotal = 0;
  let galleryPhotos = 0;
  let galleryVideos = 0;
  let qrActive = 0;
  let qrTotal = 0;
  let lastContentAt: string | null = null;

  if (supabase) {
    const [reservations, menu, gallery, qr] = await Promise.all([
      listReservations(supabase, { status: "all", limit: 200 }),
      listMenuItemsAdmin(supabase, { includeUnavailable: true }),
      listGalleryItems(supabase, { includeUnpublished: true }),
      listQrTargets(supabase, { includeInactive: true }),
    ]);

    const rows = reservations.rows;
    total = rows.length;
    pending = rows.filter((r) => r.status === "pending").length;
    confirmed = rows.filter((r) => r.status === "confirmed").length;

    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    stalePending = rows.filter((r) => {
      if (r.status !== "pending") return false;
      const created = Date.parse(r.created_at);
      return !Number.isNaN(created) && created < cutoff;
    }).length;

    menuTotal = menu.rows.length;
    menuAvailable = menu.rows.filter((r) => r.available !== false).length;

    galleryTotal = gallery.rows.length;
    galleryPublished = gallery.rows.filter((r) => r.published !== false).length;
    galleryPhotos = gallery.rows.filter((r) => r.type === "photo").length;
    galleryVideos = gallery.rows.filter((r) => r.type === "video").length;

    qrTotal = qr.rows.length;
    qrActive = qr.rows.filter((r) => r.active).length;

    lastContentAt = maxIsoDate([
      ...menu.rows.map((r) => r.created_at),
      ...gallery.rows.map((r) => r.created_at),
      ...qr.rows.map((r) => r.created_at),
      ...rows.map((r) => r.created_at),
    ]);
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        actions={
          <Badge variant="secondary" className="capitalize">
            {admin.role}
          </Badge>
        }
      />

      {/* Top booking metrics */}
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Bookings" value={total} />
        <StatCard label="Pending" value={pending} tone="pending" />
        <StatCard label="Confirmed" value={confirmed} tone="confirmed" />
      </div>

      {/* Content snapshot + attention items */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="gap-3 py-4">
          <CardHeader className="px-4 pb-0">
            <CardTitle className="font-display text-base">Content</CardTitle>
            <CardDescription>Public site inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-4">
            <ContentRow
              href="/admin/menu"
              label="Menu"
              value={`${menuAvailable} live · ${menuTotal} total`}
            />
            <ContentRow
              href="/admin/gallery"
              label="Gallery"
              value={`${galleryPublished} live · ${galleryPhotos} photos · ${galleryVideos} videos`}
            />
            <ContentRow
              href="/admin/qr"
              label="QR codes"
              value={`${qrActive} active · ${qrTotal} total · max ${MAX_ACTIVE_QR_TARGETS}`}
            />
            <div className="border-border/50 text-muted-foreground flex items-center justify-between border-t pt-3 text-xs">
              <span>Last activity</span>
              <span className="text-foreground font-medium">
                {formatRelativeOrDate(lastContentAt)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className={stalePending > 0 ? "border-primary/30 gap-3 py-4" : "gap-3 py-4"}>
          <CardHeader className="px-4 pb-0">
            <div className="flex items-center gap-2">
              {stalePending > 0 ? <AlertTriangle className="text-primary size-4 shrink-0" /> : null}
              <CardTitle className="font-display text-base">Needs attention</CardTitle>
            </div>
            <CardDescription>Pending over 24 hours with no status change</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-4">
            <p className="font-display text-foreground text-3xl font-bold tabular-nums">
              {stalePending}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {stalePending === 0
                ? "All pending requests are newer than a day, or none are waiting."
                : stalePending === 1
                  ? "1 reservation is still pending after 24 hours."
                  : `${stalePending} reservations are still pending after 24 hours.`}
            </p>
            <Link
              href="/admin/reservations?status=pending"
              className="text-primary inline-flex items-center gap-1 text-sm font-semibold hover:underline"
            >
              See all pending
              <ExternalLink className="size-3.5" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="font-display text-foreground text-lg font-bold">Quick links</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map(({ href, title, description, icon: Icon }) => (
            <Link key={href} href={href} className="group block">
              <Card className="group-hover:border-primary/40 group-hover:bg-secondary/40 h-full gap-3 py-4 transition-colors">
                <CardHeader className="px-4 pb-0">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                      <Icon className="size-4" />
                    </span>
                    <CardTitle className="font-display group-hover:text-primary text-base">
                      {title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs leading-relaxed">
                    {description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "pending" | "confirmed";
}) {
  return (
    <Card className="gap-2 py-4">
      <CardHeader className="px-4 pb-0">
        <CardDescription className="text-xs font-semibold tracking-wider uppercase">
          {label}
        </CardDescription>
        <CardTitle className="font-display text-3xl font-bold tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pt-0">
        {tone === "pending" ? (
          <Badge className="bg-primary/15 text-primary border-transparent">Needs review</Badge>
        ) : null}
        {tone === "confirmed" ? (
          <Badge className="bg-accent/15 text-accent border-transparent">On the books</Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ContentRow({ href, label, value }: { href: string; label: string; value: string }) {
  return (
    <Link
      href={href}
      className="hover:bg-secondary/50 -mx-1 flex items-start justify-between gap-3 rounded-lg px-1 py-1 transition-colors"
    >
      <span className="text-foreground text-sm font-medium">{label}</span>
      <span className="text-muted-foreground text-right text-xs leading-relaxed">{value}</span>
    </Link>
  );
}
