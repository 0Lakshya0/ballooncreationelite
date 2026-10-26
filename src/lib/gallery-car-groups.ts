import type { GalleryMedia } from "./creation-gallery";
export type CarPartId = "birthday" | "wedding";
export const carParts = [
  {
    id: "birthday",
    name: "Birthday Car Decoration",
    eyebrow: "A LITTLE SURPRISE ON WHEELS",
    description: "Boot surprises, birthday balloons and little details for someone special.",
    details: [
      "Balloon-filled boot settings",
      "Bunting, photo strings and light details",
      "Bouquets, gifts and playful interiors",
    ],
  },
  {
    id: "wedding",
    name: "Wedding Car Decoration",
    eyebrow: "THE BEAUTIFUL JOURNEY",
    description: "Floral bonnets, ribbon details and considered welcomes for the wedding journey.",
    details: [
      "Floral bonnet and roof arrangements",
      "Ribbon accents and leafy details",
      "Simple touches or statement floral styling",
    ],
  },
] as const;
export function carPart(item: GalleryMedia) {
  return carParts.find((part) => part.id === item.carPart) ?? carParts[1];
}
export function carChapters(items: readonly GalleryMedia[]) {
  return carParts.map((part) => ({
    ...part,
    items: items.filter(
      (item) => item.occasion === "Car Decoration" && carPart(item).id === part.id,
    ),
  }));
}
