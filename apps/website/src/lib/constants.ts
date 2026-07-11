export const site = {
  name: "Maydi's",
  nameDisplay: "MAYDI'S",
  tagline: "Where every plate is a little work of art.",
  description:
    "A bright, garden-like café in the heart of Oran — for slow mornings, nourishing lunches, and golden afternoon breaks.",
  phone: "+213 541 45 30 73",
  phoneHref: "tel:+213541453073",
  addressLine1: "Maydi's",
  addressLine2: "Oran, Algeria",
  mapsUrl:
    "https://www.google.com/maps/place/Maydi's/@35.7205944,-0.5985259,17z/data=!4m6!3m5!1s0xd7e63770f48b90f:0x5e16e7269ba85e4!8m2!3d35.7205944!4d-0.5985259!16s%2Fg%2F11gmt_vj5_",
  mapEmbedUrl:
    "https://www.google.com/maps?q=35.7205944,-0.5985259&z=17&output=embed",
  guideUrl: "https://guide-oran.com/maydis-oran/",
  lat: 35.7205944,
  lng: -0.5985259,
} as const;

/** Section anchors on the home page */
export const homeNavLinks = [
  { id: "menu", label: "Menu", href: "/#menu" },
  { id: "gallery", label: "Gallery", href: "/#gallery" },
  { id: "about", label: "Our Story", href: "/#about" },
  { id: "visit", label: "Visit", href: "/#visit" },
] as const;

/** Primary routes */
export const pageLinks = [
  { href: "/menu", label: "Full Menu" },
  { href: "/reserve", label: "Reserve" },
] as const;

export const socialLinks = [
  {
    href: "https://www.instagram.com/maydiscakeshop/",
    label: "Instagram",
    handle: "@maydiscakeshop",
  },
  {
    href: "https://www.tiktok.com/@maydiscakeshop",
    label: "TikTok",
  },
  {
    href: "https://www.facebook.com/profile.php?id=100064395051518",
    label: "Facebook",
  },
] as const;

export const openingHours = [
  { day: "Mon – Fri", hours: "08:00 – 21:00" },
  { day: "Saturday", hours: "09:00 – 22:00" },
  { day: "Sunday", hours: "10:00 – 20:00" },
] as const;

export const momentVideos = [
  {
    episode: "Episode 01",
    title: "A Morning at Maydi's",
    image: "/images/gallery-05.jpg",
    alt: "A morning at Maydi's",
  },
  {
    episode: "Episode 02",
    title: "The Space We Love",
    image: "/images/gallery-06.jpg",
    alt: "The space we love",
  },
] as const;
