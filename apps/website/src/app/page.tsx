import { AboutSection } from "@/components/about-section";
import { GallerySection } from "@/components/gallery-section";
import { Hero } from "@/components/hero";
import { MenuSection } from "@/components/menu-section";
import { MomentsSection } from "@/components/moments-section";
import { ReviewsSection } from "@/components/reviews-section";
import { VisitSection } from "@/components/visit-section";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <MenuSection />
      <GallerySection />
      <MomentsSection />
      <AboutSection />
      <ReviewsSection />
      <VisitSection />
    </main>
  );
}
