import wedding from "@/assets/wedding.webp";
import birthday from "@/assets/birthday.webp";
import anniversary from "@/assets/anniversary.webp";
import baby from "@/assets/baby-shower.webp";
import devotional from "@/assets/devotional.webp";

const categories = import.meta.glob<string>("/src/assets/categories/*.webp", {
  eager: true,
  import: "default",
});
const cat = (n: number): string | undefined =>
  categories[`/src/assets/categories/category-${String(n).padStart(2, "0")}.webp`];

export const contact = {
  phone: "+917489863753",
  label: "+91 74898 63753",
  whatsapp: "https://wa.me/917489863753",
  instagram: "https://www.instagram.com/ballooncreation_indore/",
  city: "Indore, Madhya Pradesh",
};

export const whatsappLink = (message: string) =>
  `${contact.whatsapp}?text=${encodeURIComponent(message)}`;

export type Celebration = {
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  tag: string;
  intro: string;
  highlights: string[];
  gallery: string[];
};

export const celebrations: Celebration[] = [
  {
    slug: "grand-weddings-rings",
    name: "Grand Weddings & Rings",
    subtitle: "The beginning of your forever.",
    image: wedding,
    tag: "LOVE, BEAUTIFULLY CELEBRATED",
    intro:
      "Sculpted floral arches, candlelit aisles and a ring ceremony staged like a film. An editorial setting for the most photographed day of your life.",
    highlights: [
      "Grand stage & mandap styling",
      "Fresh imported-look florals",
      "Ring ceremony & proposal setups",
    ],
    gallery: [wedding, cat(11), cat(6)].filter(Boolean) as string[],
  },
  {
    slug: "mega-birthdays",
    name: "Mega Birthdays",
    subtitle: "Another year. An extraordinary celebration.",
    image: birthday,
    tag: "MAKE A WISH",
    intro:
      "Balloon architecture, personalised backdrops and dessert tables styled to perfection — birthdays that look as joyful as they feel.",
    highlights: [
      "Theme & balloon installations",
      "Cake table and backdrop styling",
      "Kids, teens and milestone birthdays",
    ],
    gallery: [birthday, cat(1), cat(2)].filter(Boolean) as string[],
  },
  {
    slug: "anniversaries-surprises",
    name: "Anniversaries & Surprises",
    subtitle: "For the moments only love can create.",
    image: anniversary,
    tag: "JUST THE TWO OF YOU",
    intro:
      "A candlelit dinner for two, a room filled with your favourite flowers, a surprise planned to the last petal. Intimate, quiet, unforgettable.",
    highlights: [
      "Candlelight couple setups",
      "Room & rooftop surprises",
      "Proposal and first-night styling",
    ],
    gallery: [anniversary, cat(7), cat(8)].filter(Boolean) as string[],
  },
  {
    slug: "baby-showers",
    name: "Baby Showers",
    subtitle: "Little beginnings. Beautiful memories.",
    image: baby,
    tag: "A LITTLE WONDER",
    intro:
      "Soft palettes, cloud-like balloons and a setting as gentle as the news you are celebrating. Made for mothers-to-be and the family around her.",
    highlights: [
      "Pastel balloon clouds",
      "Mom-to-be seating and swing",
      "Welcome baby & naming ceremonies",
    ],
    gallery: [baby, cat(3), cat(4)].filter(Boolean) as string[],
  },
  {
    slug: "devotional-celebrations",
    name: "Devotional Celebrations",
    subtitle: "Graceful settings for Mataji & Ganeshji.",
    image: devotional,
    tag: "TRADITION, WITH GRACE",
    intro:
      "Marigold garlands, brass accents and a decorum that honours tradition. Devotional settings created with the care the occasion deserves.",
    highlights: [
      "Mataji & Ganeshji decor",
      "Traditional flower styling",
      "Festive home & mandir setups",
    ],
    gallery: [devotional, cat(20), cat(5)].filter(Boolean) as string[],
  },
];
