import type { Metadata } from "next";

import { ScrollLineRegion } from "@/components/effects/page-scroll-line";
import { MenuSection } from "@/components/menu/menu-section";
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
    <ScrollLineRegion as="main" className="bg-background min-h-screen">
      <MenuSection items={items} />
    </ScrollLineRegion>
  );
}
