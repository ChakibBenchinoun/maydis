export const site = {
  name: "Maydi's",
  nameDisplay: "MAYDI'S",
  tagline: "Where every plate is a little work of art.",
  description:
    "A bright, garden-like café in the heart of Oran — for slow mornings, nourishing lunches, and golden afternoon breaks.",
  phone: "+213 550 00 00 00",
  phoneHref: "tel:+213550000000",
  addressLine1: "Rue Larbi Ben M'hidi",
  addressLine2: "Oran 31000, Algeria",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52372.63!2d-0.6641!3d35.6969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7d9da6be1e3ceb%3A0x71ff13ef9ff9c7a0!2sOran%2C%20Algeria!5e0!3m2!1sen!2sus!4v1720000000000!5m2!1sen!2sus",
} as const;

export const navLinks = [
  { id: "menu", label: "Menu" },
  { id: "gallery", label: "Gallery" },
  { id: "about", label: "Our Story" },
  { id: "visit", label: "Visit" },
] as const;

export const socialLinks = [
  {
    href: "https://instagram.com/maydiscakeshop",
    label: "Instagram",
    handle: "@maydiscakeshop",
  },
  {
    href: "https://tiktok.com/@maydiscafe",
    label: "TikTok",
  },
  {
    href: "https://facebook.com/maydiscafe",
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
    image:
      "https://images.unsplash.com/photo-1670403165691-86bf05ddc3e9?w=800&h=500&fit=crop&auto=format",
    alt: "A morning at Maydi's",
  },
  {
    episode: "Episode 02",
    title: "The Space We Love",
    image:
      "https://images.unsplash.com/photo-1652862730877-1c32adb07df3?w=800&h=500&fit=crop&auto=format",
    alt: "The space we love",
  },
] as const;
