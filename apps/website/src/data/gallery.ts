export type GalleryItemType = "photo" | "video";

export type GalleryItem = {
  id: string;
  type: GalleryItemType;
  /** Image URL (photo) or poster (video). */
  image: string;
  alt: string;
  /** Optional real video file when available. */
  videoSrc?: string;
  title?: string;
  episode?: string;
};

/**
 * Photos + videos interleaved so marquee rows don’t stack videos together.
 * Order: photo · video · photos · video · … (both marquee halves get mix).
 */
export const galleryItems: GalleryItem[] = [
  {
    id: "photo-01",
    type: "photo",
    image: "/images/gallery-01.jpg",
    alt: "Maydi's café moment",
  },
  {
    id: "video-01",
    type: "video",
    image: "/images/gallery-05.jpg",
    videoSrc: "/videos/maydis-01.mp4",
    alt: "A morning at Maydi's",
    episode: "Episode 01",
    title: "A Morning at Maydi's",
  },
  {
    id: "photo-02",
    type: "photo",
    image: "/images/gallery-02.jpg",
    alt: "Maydi's food and space",
  },
  {
    id: "photo-03",
    type: "photo",
    image: "/images/gallery-03.jpg",
    alt: "Maydi's interior",
  },
  {
    id: "video-02",
    type: "video",
    image: "/images/gallery-06.jpg",
    videoSrc: "/videos/maydis-02.mp4",
    alt: "The space we love",
    episode: "Episode 02",
    title: "The Space We Love",
  },
  {
    id: "photo-04",
    type: "photo",
    image: "/images/gallery-04.jpg",
    alt: "Maydi's specialty",
  },
  {
    id: "photo-07",
    type: "photo",
    image: "/images/gallery-07.jpg",
    alt: "Maydi's plating",
  },
  {
    id: "video-03",
    type: "video",
    image: "/images/video-poster-extra.jpg",
    videoSrc: "/videos/maydis-03.mp4",
    alt: "Moments at Maydi's",
    episode: "Episode 03",
    title: "Café Moments",
  },
  {
    id: "photo-08",
    type: "photo",
    image: "/images/gallery-08.jpg",
    alt: "Maydi's kitchen life",
  },
  {
    id: "photo-09",
    type: "photo",
    image: "/images/gallery-09.jpg",
    alt: "Maydi's warm corner",
  },
  {
    id: "video-04",
    type: "video",
    image: "/images/gallery-04.jpg",
    videoSrc: "/videos/maydis-04.mp4",
    alt: "Life at Maydi's",
    episode: "Episode 04",
    title: "Life at Maydi's",
  },
  {
    id: "photo-10",
    type: "photo",
    image: "/images/gallery-10.jpg",
    alt: "Maydi's guests favorite",
  },
  {
    id: "photo-11",
    type: "photo",
    image: "/images/unnamed.webp",
    alt: "Maydi's selection",
  },
  {
    id: "photo-12",
    type: "photo",
    image: "/images/unnamed-1.webp",
    alt: "Maydi's signature look",
  },
  {
    id: "photo-13",
    type: "photo",
    image: "/images/unnamed-2.webp",
    alt: "Maydi's craft",
  },
  {
    id: "photo-14",
    type: "photo",
    image: "/images/unnamed-3.webp",
    alt: "Maydi's vibe",
  },
  {
    id: "photo-15",
    type: "photo",
    image: "/images/sealing.webp",
    alt: "Maydi's seal",
  },
];
