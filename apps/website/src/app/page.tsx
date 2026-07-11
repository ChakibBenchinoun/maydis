import { AboutSection } from "@/components/about-section";
import { GallerySection } from "@/components/gallery-section";
import { Hero } from "@/components/hero";
import { MenuSection } from "@/components/menu-section";
import { MomentsSection } from "@/components/moments-section";
import { QrSection } from "@/components/qr-section";
import { ReviewsSection } from "@/components/reviews-section";
import { VisitSection } from "@/components/visit-section";
import { getMenuItems } from "@/lib/menu";

/** Refresh menu from Supabase without a full redeploy */
export const revalidate = 60;

export default async function HomePage() {
  const { items } = await getMenuItems();

  return (
    <main>
      <Hero />
      <MenuSection items={items} />
      <GallerySection />
      <MomentsSection />
      <AboutSection />
      <ReviewsSection />
      <VisitSection />
      <QrSection />
    </main>
  );
}
