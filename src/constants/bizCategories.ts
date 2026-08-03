export const BIZ_CATEGORIES = [
  { slug: "all",               label: "All" },
  { slug: "makeup-hair",       label: "Makeup & Hair",       image: "/images/Biz/Biz_makeup.webp" },
  { slug: "cakes",             label: "Cakes",               image: "/images/Biz/Biz_cake.webp" },
  { slug: "photo-video",       label: "Photo & Video",       image: "/images/Biz/Biz_photography.webp" },
  { slug: "invitation-cards",  label: "Invitation Cards",    image: "/images/Biz/Biz_cards.webp" },
  { slug: "florists-garlands", label: "Florists & Garlands", image: "/images/Biz/Biz_florits.webp" },
  { slug: "wedding-halls",     label: "Wedding Halls",       image: "/images/Biz/Biz_Halls.webp" },
  { slug: "wedding-decor",     label: "Wedding Decor",       image: "/images/Biz/Biz_Decor.webp" },
  { slug: "food-sweets",       label: "Food & Sweets",       image: "/images/Biz/Biz_food.webp" },
  { slug: "bridal-groom-wear", label: "Bridal & Groom Wear", image: "/images/Biz/Biz_wear.webp" },
  { slug: "wedding-cars",      label: "Wedding Cars",        image: "/images/Biz/Biz_cars.webp" },
  { slug: "event-planners",    label: "Event Planners",      image: "/images/Biz/Biz_planners.webp" },
  { slug: "jewellery",         label: "Jewellery",           image: "/images/Biz/Biz_jewellery.webp" },
  { slug: "honeymoon-travel",  label: "Honeymoon & Travel",  image: "/images/Biz/Biz_travel.webp" },
  { slug: "more",              label: "More",                image: "/images/Biz/Biz_more.webp" },
] as const;

export type BizCategorySlug = typeof BIZ_CATEGORIES[number]["slug"];
