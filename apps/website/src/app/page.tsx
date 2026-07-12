import { AboutSection } from "@/components/about-section";
import { GallerySection } from "@/components/gallery-section";
import { Hero } from "@/components/hero";
import { LatestMenuSection } from "@/components/latest-menu-section";
import { MomentsSection } from "@/components/moments-section";
import { QrSection } from "@/components/qr-section";
import { ReviewsSection } from "@/components/reviews-section";
import { VisitSection } from "@/components/visit-section";
import { getMenuItems, pickLatestMenuItems } from "@/lib/menu";

/** Refresh menu from Supabase without a full redeploy */
export const revalidate = 60;

export default async function HomePage() {
  const { items } = await getMenuItems();
  const latest = pickLatestMenuItems(items);

  return (
    <main>
      <Hero />
      <LatestMenuSection items={latest} />
      <GallerySection />
      <MomentsSection />
      <AboutSection />
      <ReviewsSection />
      <VisitSection />
      <QrSection />
    </main>
  );
}
