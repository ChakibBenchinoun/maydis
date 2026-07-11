/** Local assets under `public/images/` (from ~/Downloads/mydis). */

export const images = {
  logo: "/images/logo.png",
  hero: "/images/hero.jpg",
  sealing: "/images/sealing.webp",
  about: "/images/gallery-03.jpg",
  aboutAccent: "/images/sealing.webp",
  visit: "/images/gallery-01.jpg",
  moment1: "/images/gallery-05.jpg",
  moment2: "/images/gallery-06.jpg",
  /** Food / atmosphere pool for menu items */
  menuPool: [
    "/images/gallery-01.jpg",
    "/images/gallery-02.jpg",
    "/images/gallery-04.jpg",
    "/images/gallery-07.jpg",
    "/images/gallery-08.jpg",
    "/images/gallery-09.jpg",
    "/images/gallery-10.jpg",
    "/images/unnamed.webp",
    "/images/unnamed-1.webp",
    "/images/unnamed-2.webp",
    "/images/unnamed-3.webp",
    "/images/sealing.webp",
  ],
} as const;

export function menuImageAt(index: number): string {
  return images.menuPool[index % images.menuPool.length];
}
