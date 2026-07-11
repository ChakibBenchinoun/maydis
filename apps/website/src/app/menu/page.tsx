import type { Metadata } from "next";

import { MenuPageHeader } from "@/components/menu-page-header";
import { MenuSection } from "@/components/menu-section";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Menu",
  description: `Full menu at ${site.name} — brunch, bowls, desserts, and drinks in Oran.`,
};

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-background">
      <MenuPageHeader />
      <MenuSection variant="full" />
    </main>
  );
}
