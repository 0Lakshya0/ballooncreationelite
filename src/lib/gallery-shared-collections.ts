import type { GalleryMedia } from "./creation-gallery";

// Owner-approved Room Surprise reuse, not new photos or replacement primary occasions.
// Keep references, source files, primary collections and saved IDs unchanged.
export const roomSurpriseSharedIds: readonly string[] = [
  "first-night-heart-lettered-path",
  "first-night-pink-silver-room",
  "first-night-three-petal-hearts",
  "first-night-floor-canopy-lights",
  "proposal-white-heart-sunset",
  "first-night-purple-draped-canopy",
  "proposal-garden-light-path",
  "first-night-pink-black-balloons",
  "first-night-ivory-bronze-heart",
  "first-night-loft-heart-trail",
  "first-night-evening-candle-trail",
  "first-night-silver-red-question",
  "first-night-white-heart-teepee",
  "first-night-golden-bubble-lights",
  "proposal-soft-pink-frame",
  "first-night-petal-message-trail",
  "first-night-anniversary-light-canopy",
  "first-night-heartfelt-petal-lettering",
  "first-night-cushion-teepee",
  "first-night-red-petal-carpet",
];
export function mediaInCollection(item: GalleryMedia, name: string): boolean {
  return (
    item.occasion === name || (name === "Room Surprise" && roomSurpriseSharedIds.includes(item.id))
  );
}
export function collectionItems(name: string, items: readonly GalleryMedia[]): GalleryMedia[] {
  const selected = items.filter((item) => mediaInCollection(item, name));
  if (name !== "Room Surprise") return selected;
  return selected.sort(
    (a, b) => roomSurpriseSharedIds.indexOf(a.id) - roomSurpriseSharedIds.indexOf(b.id),
  );
}
// Presentation-only context: one underlying ID/file/save across both collections.
export function collectionPresentation(item: GalleryMedia, name: string): GalleryMedia {
  return name === "Room Surprise" && mediaInCollection(item, name)
    ? { ...item, occasion: name }
    : item;
}
