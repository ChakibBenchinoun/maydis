export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  details: string;
  tags: string[];
};

/**
 * Static fallback when Supabase is empty / offline.
 * Keep in sync with `supabase/migrations/*seed*` (DB is source of truth in prod).
 */
export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Maydi's Signature Brunch",
    description: "Poached eggs, smoked salmon, silky avocado on toasted sourdough",
    price: "950 DA",
    category: "Brunch",
    image: "/images/gallery-01.jpg",
    details:
      "Two perfectly poached eggs draped over house-smoked salmon and silky avocado mash on toasted sourdough. Finished with a drizzle of lemon herb oil, capers, and microgreens. Served with a side dressed salad.",
    tags: ["Chef's Pick", "Bestseller"],
  },
  {
    id: 2,
    name: "Garden Eggs Platter",
    description: "Roasted seasonal vegetables, herb pesto, two poached eggs",
    price: "850 DA",
    category: "Brunch",
    image: "/images/gallery-02.jpg",
    details:
      "A colourful medley of oven-roasted courgette, peppers, and cherry tomatoes, crowned with two poached eggs and a vibrant basil-pistachio pesto. Light, nourishing, and deeply satisfying.",
    tags: ["Vegetarian"],
  },
  {
    id: 3,
    name: "Brioche French Toast",
    description: "Thick-cut brioche, vanilla custard, maple syrup, fresh berries",
    price: "750 DA",
    category: "Brunch",
    image: "/images/gallery-04.jpg",
    details:
      "Thick-cut brioche soaked overnight in a vanilla bean egg custard, pan-fried to a golden blush, served with warm maple syrup, a dusting of icing sugar, and a generous spoonful of seasonal berry compote.",
    tags: ["Sweet"],
  },
  {
    id: 4,
    name: "Avocado Toast Deluxe",
    description: "Sourdough, smashed avocado, cherry tomatoes, za'atar, chilli",
    price: "650 DA",
    category: "Toasts & Croissants",
    image: "/images/gallery-07.jpg",
    details:
      "Thick sourdough slices toasted to perfection, spread with seasoned avocado mash, halved cherry tomatoes, toasted pine nuts, and a flourish of za'atar. A squeeze of lemon ties it all together.",
    tags: ["Vegan", "Bestseller"],
  },
  {
    id: 5,
    name: "Salmon Cream Cheese Toast",
    description: "Whipped cream cheese, cold-smoked salmon, capers, dill",
    price: "700 DA",
    category: "Toasts & Croissants",
    image: "/images/gallery-08.jpg",
    details:
      "House-baked rye toast spread with whipped cream cheese blended with fresh dill, topped with silky cold-smoked salmon, briny capers, pickled red onion, and a crack of black pepper.",
    tags: [],
  },
  {
    id: 6,
    name: "Butter Croissant",
    description: "Freshly baked daily, served warm with house-made jam",
    price: "350 DA",
    category: "Toasts & Croissants",
    image: "/images/gallery-09.jpg",
    details:
      "Laminated in house with 84% French butter over three days. Baked fresh each morning until deeply golden. Served warm alongside house-made apricot jam and a curl of salted butter.",
    tags: ["Fresh Daily"],
  },
  {
    id: 7,
    name: "Almond Frangipane Croissant",
    description: "Double-baked, almond cream filling, toasted flaked almonds",
    price: "450 DA",
    category: "Toasts & Croissants",
    image: "/images/gallery-10.jpg",
    details:
      "Our croissant taken one step further — filled with rich almond frangipane, double-baked for crisp caramelised layers, finished with toasted flaked almonds and a cloud of icing sugar.",
    tags: ["Chef's Pick"],
  },
  {
    id: 8,
    name: "Green Goddess Bowl",
    description: "Tri-colour quinoa, avocado, cucumber, herbs, green tahini",
    price: "850 DA",
    category: "Salads & Bowls",
    image: "/images/unnamed.webp",
    details:
      "A nourishing base of tri-colour quinoa topped with sliced avocado, cucumber ribbons, roasted chickpeas, fresh herbs, and a house-made green tahini dressing, scattered with seeds and edible flowers.",
    tags: ["Vegan", "Gluten-Free"],
  },
  {
    id: 9,
    name: "Mediterranean Feta Salad",
    description: "Rocket, sheep's feta, Kalamata olives, cherry tomatoes, herbs",
    price: "750 DA",
    category: "Salads & Bowls",
    image: "/images/unnamed-1.webp",
    details:
      "A generous tangle of rocket and mixed leaves, Kalamata olives, halved cherry tomatoes, and thin-sliced cucumber, topped with crumbled sheep's milk feta and dressed with lemon, extra virgin olive oil, and wild oregano.",
    tags: ["Vegetarian"],
  },
  {
    id: 10,
    name: "Warm Roasted Grain Bowl",
    description: "Farro, roasted vegetables, hummus, hazelnut dukkah",
    price: "800 DA",
    category: "Salads & Bowls",
    image: "/images/unnamed-2.webp",
    details:
      "Warm farro and bulgur wheat topped with a rainbow of oven-roasted seasonal vegetables, a generous swoosh of house-made hummus, hazelnut dukkah, pomegranate molasses, and a handful of fresh herbs.",
    tags: ["Vegan"],
  },
  {
    id: 11,
    name: "Chocolate Fondant",
    description: "Warm dark chocolate, molten centre, vanilla bean ice cream",
    price: "650 DA",
    category: "Desserts & Cakes",
    image: "/images/unnamed-3.webp",
    details:
      "Individually baked 72% dark chocolate fondant — crackled on the outside, richly flowing within. Served immediately alongside a quenelle of house-made vanilla bean ice cream and a dusting of cacao.",
    tags: ["Warm", "Bestseller"],
  },
  {
    id: 12,
    name: "Lotus Biscoff Cheesecake",
    description: "Velvety baked cheesecake, Biscoff crust, caramel glaze",
    price: "700 DA",
    category: "Desserts & Cakes",
    image: "/images/sealing.webp",
    details:
      "Velvety baked cheesecake on a buttery Lotus Biscoff crust, topped with a mirror-smooth caramel glaze and a whole Biscoff biscuit. Chilled overnight for a perfectly set, melt-in-the-mouth texture.",
    tags: ["Chef's Pick"],
  },
  {
    id: 13,
    name: "Pistachio & Raspberry Tart",
    description: "Crisp pastry shell, pistachio frangipane, fresh raspberries",
    price: "600 DA",
    category: "Desserts & Cakes",
    image: "/images/gallery-01.jpg",
    details:
      "A crisp pâte sucrée shell filled with silky pistachio frangipane cream, adorned with fresh raspberries and a thin coat of apricot glaze. Finished with chopped pistachios and a sprig of fresh mint.",
    tags: ["Seasonal"],
  },
  {
    id: 14,
    name: "Ceremonial Matcha Latte",
    description: "Ceremonial grade matcha, steamed oat milk, touch of raw honey",
    price: "450 DA",
    category: "Beverages",
    image: "/images/gallery-02.jpg",
    details:
      "Premium ceremonial grade Japanese matcha, whisked to a smooth froth and topped with steamed oat milk poured in a delicate pattern. Subtly sweetened with raw honey. Available hot or iced.",
    tags: ["Vegan Option"],
  },
  {
    id: 15,
    name: "Iced Hibiscus Rose",
    description: "Hibiscus, rose water, fresh mint, lemon, sparkling water",
    price: "350 DA",
    category: "Beverages",
    image: "/images/gallery-04.jpg",
    details:
      "A jewel-bright, naturally caffeine-free sipper. Cold-steeped hibiscus blended with rose water, fresh lemon, and a handful of mint, poured over ice and topped with a splash of sparkling water.",
    tags: ["Caffeine-Free", "Bestseller"],
  },
  {
    id: 16,
    name: "House Specialty Coffee",
    description: "Single origin, prepared your way — espresso, flat white, cold brew",
    price: "300 DA",
    category: "Beverages",
    image: "/images/gallery-07.jpg",
    details:
      "Sourced from single-origin Ethiopian beans, roasted to a medium-light profile. Available as espresso, flat white, cappuccino, Americano, or cold brew. All dairy and plant milks available.",
    tags: [],
  },
];

export const categories = [
  "Brunch",
  "Toasts & Croissants",
  "Salads & Bowls",
  "Desserts & Cakes",
  "Beverages",
] as const;
