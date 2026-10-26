import { galleryMedia, type GalleryMedia } from "./creation-gallery";

/** Reuse supplied photographs without moving gallery memberships, IDs or saved looks. */
export function suppliedSitePhoto(id: string): GalleryMedia {
  const photo = galleryMedia.find((item) => item.id === id);
  if (!photo) throw new Error(`Missing supplied website photograph: ${id}`);
  return photo;
}
export const sitePhotos = {
  wedding: suppliedSitePhoto("wedding-stage-white-circle"),
  birthday: suppliedSitePhoto("birthday-50th"),
  anniversary: suppliedSitePhoto("anniversary-gold-red-drapes"),
  baby: suppliedSitePhoto("baby-shower-sage-elephant"),
  hall: suppliedSitePhoto("wedding-stage-hanging-rings"),
  traditional: suppliedSitePhoto("house-warming-ceremonial-floral-corner"),
};

/** Legacy catalogue IDs are retained, but their photography is now supplied, never synthetic. */
export const legacyCategoryPhotos: Record<number, GalleryMedia> = {
  1: sitePhotos.birthday,
  2: suppliedSitePhoto("kids-butterfly-garden"),
  3: sitePhotos.baby,
  4: suppliedSitePhoto("welcome-baby-blue-home-teddy"),
  5: suppliedSitePhoto("naming-sky-blue-cradle"),
  6: suppliedSitePhoto("anniversary-rose-heart"),
  7: suppliedSitePhoto("proposal-garden"),
  8: suppliedSitePhoto("first-night-pink-silver-room"),
  9: suppliedSitePhoto("first-night-sheer-rose-lights"),
  10: suppliedSitePhoto("wedding-stage-white-circle"),
  11: suppliedSitePhoto("wedding-haldi-yellow-canopy"),
  12: suppliedSitePhoto("house-warming-white-pink-leafy-frame"),
  13: suppliedSitePhoto("car-decoration"),
  14: suppliedSitePhoto("corporate-gold-sphere-banquet"),
  15: suppliedSitePhoto("corporate-black-gold-dining-room"),
  16: suppliedSitePhoto("pet-themed-celebration"),
  17: suppliedSitePhoto("showroom-floral-display"),
  18: suppliedSitePhoto("grand-opening"),
  20: suppliedSitePhoto("annual-red-led-stage"),
};

export const legacyServicePhotoIds: Record<string, readonly string[]> = {
  "grand-weddings-rings": [
    "wedding-stage-white-circle",
    "wedding-haldi-yellow-canopy",
    "wedding-entrance-floral-canopy",
    "car-decoration",
    "wedding-stage-pink-drapes",
    "wedding-entrance-night-drapes",
  ],
  "mega-birthdays": [
    "birthday-50th",
    "kids-butterfly-garden",
    "birthday-floral-73",
    "birthday-gold-23",
    "kids-space-moon",
    "birthday-rose-confetti",
  ],
  "anniversaries-surprises": [
    "anniversary-gold-red-drapes",
    "anniversary-photo-heart",
    "anniversary-rose-heart",
    "proposal-garden",
    "first-night-pink-silver-room",
  ],
  "baby-showers": [
    "baby-shower",
    "baby-shower-sage-elephant",
    "baby-shower-bloom",
    "welcome-baby-blue-home-teddy",
    "naming-sky-blue-cradle",
  ],
  // Real traditional floral references, not an invented photograph of Ganeshji/Mataji.
  "devotional-celebrations": [
    "house-warming-ceremonial-floral-corner",
    "house-warming-white-pink-leafy-frame",
    "naming-traditional-silver-cradle",
    "house-warming-colourful-floral-threshold",
  ],
};

/** Old approved decor filenames are lookup keys only; they must never become image URLs. */
export const decorPhotoIds: Record<string, string | null> = {
  "arch-entrance.jpg": "wedding-entrance-floral-canopy",
  "backdrop-photobooth.jpg": "birthday-gold-23",
  "balloon-arch.jpg": "grand-opening-blue-white-flower-balloons",
  "balloon-decor.jpg": "kids-butterfly-garden",
  "booth-360.jpg": null,
  "cake-dessert.jpg": null,
  "candle-aisle.jpg": "proposal-garden-light-path",
  "ceiling-hanging.jpg": "first-night-purple-draped-canopy",
  "ceiling-rings.jpg": null,
  "cold-pyro.jpg": "proposal-rose-sparkle",
  "confetti-balloon-drop.jpg": null,
  "custom-signage.jpg": "naming-illustrated-welcome-sign",
  "dessert-display.jpg": null,
  "drapes-lighting.jpg": "wedding-entrance-night-drapes",
  "fabric-gate.jpg": "wedding-entrance-floral-canopy",
  "floral-decor.jpg": "wedding-stage-pink-drapes",
  "fog-bubbles.jpg": null,
  "greenery-foliage.jpg": "corporate-botanical-display-room",
  "halo-corner.jpg": "proposal-night-rose-ring",
  "kids-zone.jpg": null,
  "live-entertainment.jpg": "annual-floral-dance-stage",
  "low-seating.jpg": "wedding-haldi-yellow-canopy",
  "mandap-pandal.jpg": "wedding-haldi-yellow-canopy",
  "marry-me-proposal.jpg": "proposal-red-heart-aisle",
  "premium-finishes.jpg": "birthday-gold-23",
  "props-cutouts.jpg": "kids-jungle-adventure",
  "red-carpet-entry.jpg": "grand-opening-floral-chandelier-canopy",
  "round-backdrop.jpg": "anniversary-silver-one",
  "sequin-wall.jpg": "farewell-graduation-cap-shimmer",
  "stage-truss.jpg": "annual-red-led-stage",
  "surprise-setups.jpg": "first-night-pink-silver-room",
  "sweet-cart.jpg": null,
  "tablescape-lounge.jpg": "corporate-gold-sphere-banquet",
  "walkway-aisle.jpg": "wedding-stage-regal-red",
};
export function suppliedDecorPhoto(key: string): GalleryMedia | undefined {
  const id = decorPhotoIds[key.replace(/^img\//, "")];
  return id ? suppliedSitePhoto(id) : undefined;
}
export const requestedSitePhotos = [
  "Cake table and dessert bar (close-up and complete setup)",
  "Sweet cart and candy bar",
  "Fog, bubbles and smoke effects in use",
  "Confetti shower and balloon drop in use",
  "360-degree booth with its platform/camera setup",
  "Kids activity/play zone or character entertainment (not just a birthday backdrop)",
  "Ceiling LED/hanging rings",
  "Mataji/Ganeshji devotional decoration",
] as const;
