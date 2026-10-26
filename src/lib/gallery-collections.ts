import { carPart } from "./gallery-car-groups";
import { weddingPart } from "./gallery-wedding-groups";
import { galleryMedia, type GalleryMedia } from "./creation-gallery";
export type GalleryCollection = {
  id: string;
  name: string;
  eyebrow: string;
  heading: string;
  description: string;
  layout: string;
  radius: string;
  initial: number;
  items: GalleryMedia[];
};
// Each exact style owns its own section, copy, framing and paging. Never mix Kids Birthday into Birthday.
const styles: [string, string, string, string, string, string, string, number][] = [
  [
    "birthday",
    "Birthday",
    "THE MILESTONE EDIT",
    "Another year. Your own kind of beautiful.",
    "Elegant florals, metallic details and thoughtful settings for grown-up birthdays and milestones.",
    "editorial",
    "4px",
    4,
  ],
  [
    "kids-birthday",
    "Kids Birthday",
    "LITTLE WORLDS. BIG IMAGINATIONS.",
    "Their favourite world, brought to life.",
    "Butterflies, space adventures, jungle friends and storybook characters—each little celebration gets its own personality.",
    "playful",
    "44px 44px 14px 14px",
    6,
  ],
  [
    "wedding",
    "Wedding",
    "THE FOREVER COLLECTION",
    "A setting worthy of your forever.",
    "Mehndi, Haldi, stage decoration and entrances—already arranged for each part of your celebration.",
    "romantic",
    "180px 180px 8px 8px",
    3,
  ],
  [
    "anniversary",
    "Anniversary",
    "THE TOGETHER EDIT",
    "For the years. And all that’s still to come.",
    "Personal settings for another chapter together.",
    "romantic",
    "8px 100px 8px 8px",
    3,
  ],
  [
    "proposal",
    "Proposal",
    "THE QUESTION COLLECTION",
    "One question. A world of feeling.",
    "Floral hearts, softly lit paths and personal settings for the moment you ask.",
    "romantic",
    "140px 140px 4px 4px",
    3,
  ],
  [
    "room-surprise",
    "Room Surprise",
    "BEHIND THE DOOR",
    "A little surprise. A lasting memory.",
    "Indoor surprises with flowers, balloons and a personal message.",
    "intimate",
    "18px",
    3,
  ],
  [
    "first-night",
    "First Night",
    "THE QUIETLY ROMANTIC EDIT",
    "Just the two of you.",
    "Petal paths, softly lit canopies and thoughtful room details for a moment together.",
    "intimate",
    "90px 8px 90px 8px",
    3,
  ],
  [
    "baby-shower",
    "Baby Shower",
    "THE NEW BEGINNING COLLECTION",
    "The sweetest reason to celebrate.",
    "Gentle palettes and welcoming backdrops for the parent-to-be.",
    "soft",
    "100px 100px 20px 20px",
    3,
  ],
  [
    "welcome-baby",
    "Welcome Baby",
    "THE HOME-WELCOME EDIT",
    "A little arrival. A whole lot of love.",
    "Gentle balloon palettes, playful details and welcoming settings for a little arrival.",
    "soft",
    "8px 80px 8px 80px",
    3,
  ],
  [
    "naming-ceremony",
    "Naming Ceremony",
    "THE LITTLE NAME COLLECTION",
    "A name to hold close.",
    "Floral cradle settings and family celebrations with a gentle touch.",
    "floral",
    "50% 50% 8px 8px / 90px 90px 8px 8px",
    3,
  ],
  [
    "pet-decoration",
    "Pet Decoration",
    "THE LITTLE PAWS EDIT",
    "For your smallest favourite guest.",
    "Pet portraits, playful photo corners and animal-inspired settings, each with its own little character.",
    "playful",
    "30px 8px 30px 8px",
    3,
  ],
  [
    "house-warming",
    "House Warming",
    "THE NEW CHAPTER COLLECTION",
    "Make the first welcome beautiful.",
    "Floral doorways, welcoming entrances and festive details for a new chapter at home.",
    "architectural",
    "100px 100px 0 0",
    3,
  ],
  [
    "car-decoration",
    "Car Decoration",
    "THE BEAUTIFUL JOURNEY EDIT",
    "Let the celebration travel with you.",
    "Birthday surprises or wedding arrivals—two collections, each with its own kind of celebration.",
    "editorial",
    "2px 60px 2px 2px",
    3,
  ],
  [
    "bachelor-party",
    "Bachelor Party",
    "THE FRIENDS-FIRST COLLECTION",
    "One more night with your favourites.",
    "Celebration settings for a party with your closest people.",
    "intimate",
    "4px 4px 80px 4px",
    3,
  ],
  [
    "grand-opening",
    "Grand Opening",
    "THE FIRST IMPRESSION EDIT",
    "An entrance worth remembering.",
    "Balloon-framed entrances, floral welcomes and statement details for a memorable first impression.",
    "architectural",
    "0px",
    3,
  ],
  [
    "showroom-setup",
    "Showroom Setup",
    "THE DISPLAY COLLECTION",
    "Frame the space. Set the mood.",
    "Floral features, statement entrances and styled displays that give a space its own personality.",
    "architectural",
    "0 70px 0 0",
    3,
  ],
  [
    "corporate-events",
    "Corporate Events",
    "THE BUSINESS CELEBRATION EDIT",
    "Considered. Coordinated. Celebrated.",
    "Balloon-framed stages, welcome displays and considered table details for shared celebrations.",
    "architectural",
    "16px 0 16px 0",
    3,
  ],
  [
    "product-launch",
    "Product Launch",
    "IN THE SPOTLIGHT",
    "A setting for something new.",
    "Balloon framing and display backdrops for a product’s introduction.",
    "editorial",
    "0 0 70px 0",
    3,
  ],
  [
    "farewell-party",
    "Farewell Party",
    "THE NEXT CHAPTER EDIT",
    "A goodbye worth remembering.",
    "Graduation moments, farewell backdrops and memory-filled details for the chapter ahead.",
    "soft",
    "70px 4px 4px 4px",
    3,
  ],
  [
    "annual-day-function",
    "Annual Day Function",
    "THE SHARED STAGE COLLECTION",
    "Bring the whole celebration into focus.",
    "Colourful entrances, themed backdrops and stages for a celebration shared by everyone.",
    "architectural",
    "8px 8px 0 0",
    3,
  ],
];
export function galleryCollections(
  items: readonly GalleryMedia[] = galleryMedia,
): GalleryCollection[] {
  const known = styles
    .map(([id, name, eyebrow, heading, description, layout, radius, initial]) => ({
      id,
      name,
      eyebrow,
      heading,
      description,
      layout,
      radius,
      initial,
      items: items.filter((item) => item.occasion === name),
    }))
    .filter((section) => section.items.length > 0);
  // New styles remain separate even before their bespoke presentation is configured.
  for (const item of items)
    if (!known.some((section) => section.name === item.occasion))
      known.push({
        id: item.occasion
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
        name: item.occasion,
        eyebrow: "THE CELEBRATION COLLECTION",
        heading: item.occasion,
        description: "Explore the details, save a favourite and make it your own.",
        layout: "editorial",
        radius: "8px",
        initial: 3,
        items: items.filter((media) => media.occasion === item.occasion),
      });
  return known;
}
export function collectionViewerItems(
  activeId: string | null,
  items: readonly GalleryMedia[],
): GalleryMedia[] {
  const active = items.find((item) => item.id === activeId);
  return active
    ? items.filter(
        (item) =>
          item.occasion === active.occasion &&
          (active.occasion !== "Wedding" || weddingPart(item).id === weddingPart(active).id) &&
          (active.occasion !== "Car Decoration" || carPart(item).id === carPart(active).id),
      )
    : [];
}
