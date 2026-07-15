import type { Metadata } from "next";

import { ScrollLineRegion } from "@/components/effects/page-scroll-line";
import { ReservePageContent } from "@/components/reserve/reserve-page-content";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Reserve",
  description: `Book a private event or celebration at ${site.name} in Oran.`,
};

export default function ReservePage() {
  return (
    <ScrollLineRegion as="main" className="bg-background flex min-h-0 flex-1 flex-col">
      <ReservePageContent />
    </ScrollLineRegion>
  );
}
