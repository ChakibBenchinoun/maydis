import type { Metadata } from "next";

import { MenuPageHeader } from "@/components/menu-page-header";
import { MenuSection } from "@/components/menu-section";
import { site } from "@/lib/constants";
import { getMenuItems } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu",
  description: `Full menu at ${site.name} — brunch, bowls, desserts, and drinks in Oran.`,
};

/** Refresh menu from Supabase without a full redeploy */
export const revalidate = 60;

export default async function MenuPage() {
  const { items } = await getMenuItems();

  return (
    <main className="min-h-screen bg-background">
      <MenuPageHeader />
      <MenuSection variant="full" items={items} />
    </main>
  );
}
