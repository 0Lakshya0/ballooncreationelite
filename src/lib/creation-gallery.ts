import { galleryFirstNightBatch2Media } from "./gallery-first-night-batch-2";
import { galleryFirstNightMedia } from "./gallery-first-night";
import { galleryAnniversaryBatch2Media } from "./gallery-anniversary-batch-2";
import { galleryAnniversaryMedia } from "./gallery-anniversary";
import { galleryFamilyBatch2Media } from "./gallery-family-batch-2";
import { galleryBabyShowerMedia } from "./gallery-baby-shower";
import { galleryBatch2Media } from "./gallery-batch-2";
import { galleryBatchMedia } from "./gallery-batches";
import { heroSlides } from "./hero-slides";
import { galleryUploaded } from "./gallery-uploaded";

export const galleryGroups = [
  "All moments",
  "Birthdays",
  "Love & weddings",
  "Baby & family",
  "Home & milestones",
  "Work & events",
] as const;
export type GalleryGroup = (typeof galleryGroups)[number];
type BaseMedia = {
  id: string;
  reference: string;
  title: string;
  occasion: string;
  group: Exclude<GalleryGroup, "All moments">;
  detail: string;
  image: string;
  width: number;
  height: number;
  position: string;
};
export type GalleryMedia = BaseMedia &
  (
    | { kind: "image" }
    | { kind: "video"; video: string; captions?: { src: string; language: string; label: string } }
  );
// Curated only from supplied photos. Never invent dates, venues, clients or results.
// Add future images/clips here with a stable ID/reference; video `image` is its poster.
const definitions: [string, string, string, Exclude<GalleryGroup, "All moments">, string][] = [
  [
    "wedding",
    "A setting for your forever",
    "Wedding",
    "Love & weddings",
    "Floral framing, a generous aisle and a beautifully layered stage.",
  ],
  [
    "birthday-50th",
    "A milestone, dressed in gold",
    "Birthday",
    "Birthdays",
    "White and metallic balloons meet a shimmer backdrop and an illuminated 50.",
  ],
  [
    "kids-birthday-princess",
    "A little storybook magic",
    "Kids Birthday",
    "Birthdays",
    "Pastel balloon clusters and a princess-inspired birthday setting.",
  ],
  [
    "grand-opening",
    "An entrance worth noticing",
    "Grand Opening",
    "Work & events",
    "A welcoming floral entrance with a classic black-and-white balloon palette.",
  ],
  [
    "proposal-garden",
    "One question. A beautiful moment.",
    "Proposal",
    "Love & weddings",
    "A romantic outdoor setting framed with flowers and personal details.",
  ],
  [
    "baby-shower",
    "The sweetest new beginning",
    "Baby Shower",
    "Baby & family",
    "A soft, welcoming palette for a celebration with your closest people.",
  ],
  [
    "showroom-floral-display",
    "Flowers that frame the space",
    "Showroom Setup",
    "Work & events",
    "Sculptural pink and white floral framing for a display space.",
  ],
  [
    "anniversary",
    "Another year, a little magic",
    "Anniversary",
    "Love & weddings",
    "A personal celebration of togetherness, with a thoughtfully styled backdrop.",
  ],
  [
    "floral-swing",
    "A little name. A lot of love.",
    "Naming Ceremony",
    "Baby & family",
    "A flower-covered baby cradle beneath a generous circular floral arch.",
  ],
  [
    "first-night",
    "A room made for two",
    "First Night",
    "Love & weddings",
    "Floral details for an intimate, newlywed room setting.",
  ],
  [
    "welcome-baby",
    "Welcome to your little world",
    "Welcome Baby",
    "Baby & family",
    "A cheerful home welcome for a very special new arrival.",
  ],
  [
    "house-warming",
    "New keys. New memories.",
    "House Warming",
    "Home & milestones",
    "Flowers and a welcoming entrance to mark a new chapter at home.",
  ],
  [
    "car-decoration",
    "The journey, beautifully dressed",
    "Car Decoration",
    "Home & milestones",
    "Considered floral details that make the celebration travel with you.",
  ],
  [
    "corporate-events",
    "A considered first impression",
    "Corporate Events",
    "Work & events",
    "Coordinated styling for a shared business celebration.",
  ],
  [
    "bachelor-party",
    "For your favourite people",
    "Bachelor Party",
    "Love & weddings",
    "A photo-ready party setting for a celebration with friends.",
  ],
  [
    "pet-themed-celebration",
    "Little paws. Big celebration.",
    "Pet Decoration",
    "Baby & family",
    "A playful celebration with a pet-themed backdrop and cheerful details.",
  ],
  [
    "product-launch",
    "A spotlight for something new",
    "Product Launch",
    "Work & events",
    "Blue, white and metallic balloon framing around a product-launch display.",
  ],
  [
    "proposal-room",
    "A beautiful surprise, indoors",
    "Room Surprise",
    "Love & weddings",
    "A romantic room setting, with flowers and a message at its heart.",
  ],
  [
    "farewell-party",
    "A goodbye worth remembering",
    "Farewell Party",
    "Work & events",
    "A thoughtful gathering backdrop for the next chapter.",
  ],
  [
    "annual-day",
    "A stage for shared moments",
    "Annual Day Function",
    "Work & events",
    "A decorated stage to bring a shared celebration into focus.",
  ],
];
const referenceById: Record<string, string> = {
  wedding: "BC-01",
  "birthday-50th": "BC-02",
  "kids-birthday-princess": "BC-03",
  "grand-opening": "BC-04",
  "proposal-garden": "BC-05",
  "baby-shower": "BC-06",
  "showroom-floral-display": "BC-07",
  anniversary: "BC-08",
  "floral-swing": "BC-09",
  "first-night": "BC-10",
  "welcome-baby": "BC-11",
  "house-warming": "BC-12",
  "car-decoration": "BC-13",
  "corporate-events": "BC-14",
  "bachelor-party": "BC-15",
  "pet-themed-celebration": "BC-16",
  "product-launch": "BC-17",
  "proposal-room": "BC-18",
  "farewell-party": "BC-19",
  "annual-day": "BC-20",
};
export const galleryMedia: GalleryMedia[] = definitions
  .map<GalleryMedia>(([id, title, occasion, group, detail]) => {
    const photo =
      heroSlides.find((item) => item.id === id) ??
      galleryUploaded[id as keyof typeof galleryUploaded];
    if (!photo) throw new Error(`Missing supplied gallery photo: ${id}`);
    return {
      id,
      reference: referenceById[id]!,
      kind: "image",
      title,
      occasion,
      group,
      detail,
      image: photo.image,
      width: photo.width,
      height: photo.height,
      position:
        "position" in photo && typeof photo.position === "string" ? photo.position : "50% 50%",
    };
  })
  .concat(
    galleryBatchMedia,
    galleryBatch2Media,
    galleryBabyShowerMedia,
    galleryFamilyBatch2Media,
    galleryAnniversaryMedia,
    galleryAnniversaryBatch2Media,
    galleryFirstNightMedia,
    galleryFirstNightBatch2Media,
  );
export const SHORTLIST_KEY = "bce-creation-shortlist-v1";
export function readGalleryShortlist(raw: string | null, items = galleryMedia): string[] {
  try {
    const value: unknown = JSON.parse(raw || "[]");
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter(
              (id): id is string => typeof id === "string" && items.some((item) => item.id === id),
            ),
          ),
        ]
      : [];
  } catch {
    return [];
  }
}
export function galleryMessage(items: readonly GalleryMedia[]): string {
  return [
    "Hi Balloon Creation!",
    items.length
      ? "I like these looks from Our Creations:"
      : "I would like help choosing a celebration setup.",
    ...items.map((item) => `${item.reference} · ${item.occasion} — ${item.title}`),
    "",
    "Event date:",
    "Venue / area:",
    "Please help adapt the idea to my space and confirm availability, inclusions and a quote.",
  ].join("\n");
}
