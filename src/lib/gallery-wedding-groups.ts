import type { GalleryMedia } from "./creation-gallery";
export type WeddingPartId = "mehndi" | "haldi" | "stage" | "entrance";
// A Wedding stays one parent style. These are its ordered chapters, not extra occasion filters.
export const weddingParts = [
  {
    id: "mehndi",
    name: "Mehndi",
    eyebrow: "THE COLOURFUL BEGINNING",
    description: "Playful details, colourful backdrops and a little Mehndi magic.",
    radius: "36px 36px 12px 12px",
  },
  {
    id: "haldi",
    name: "Haldi",
    eyebrow: "A LITTLE SUNSHINE",
    description: "Yellow florals, joyful drapes and bright settings for your Haldi celebration.",
    radius: "80px 80px 8px 8px",
  },
  {
    id: "stage",
    name: "Stage Decoration",
    eyebrow: "THE FOREVER SETTING",
    description: "Floral frames, thoughtful seating and a stage for your celebration.",
    radius: "8px",
  },
  {
    id: "entrance",
    name: "Entrance & Aisle",
    eyebrow: "THE FIRST LITTLE IMPRESSION",
    description: "Welcoming floral entrances and softly lit paths to the celebration.",
    radius: "120px 120px 8px 8px",
  },
] as const;
export function weddingPart(item: GalleryMedia) {
  return weddingParts.find((p) => p.id === item.weddingPart) ?? weddingParts[2];
}
export function weddingChapters(items: readonly GalleryMedia[]) {
  return weddingParts
    .map((part) => ({
      ...part,
      items: items.filter(
        (item) => item.occasion === "Wedding" && weddingPart(item).id === part.id,
      ),
    }))
    .filter((part) => part.items.length > 0);
}
export function weddingPreview(items: readonly GalleryMedia[]) {
  return weddingChapters(items)
    .slice(0, 3)
    .map((part) => part.items[0]!);
}
