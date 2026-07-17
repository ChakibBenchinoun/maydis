import { AboutSection } from "@/components/about/about-section";
import { ScrollLineRegion } from "@/components/effects/page-scroll-line";
import { GallerySection } from "@/components/gallery/gallery-section";
import { Hero } from "@/components/hero/hero";
import { LatestMenuSection } from "@/components/menu/latest-menu-section";
import { QrSection } from "@/components/qr/qr-section";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { VisitSection } from "@/components/visit/visit-section";
import { getGalleryItems } from "@/lib/gallery";
import { getMenuItems, pickLatestMenuItems } from "@/lib/menu";
import { getQrTargets } from "@/lib/qr";

/** Refresh CMS content from Supabase without a full redeploy */
export const revalidate = 60;

export default async function HomePage() {
  const [{ items }, { items: gallery }, { targets }] = await Promise.all([
    getMenuItems(),
    getGalleryItems(),
    getQrTargets(),
  ]);
  const latest = pickLatestMenuItems(items);

  return (
    <main>
      <Hero />
      <ScrollLineRegion>
        <LatestMenuSection items={latest} />
        <GallerySection items={gallery} />
        <AboutSection />
        <ReviewsSection />
        <VisitSection />
        <QrSection targets={targets} />
      </ScrollLineRegion>
    </main>
  );
}
