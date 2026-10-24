// Full-size supplied images, shared by occasion cards and their detail pages.
import { heroSlides } from "./hero-slides";
import { galleryUploaded } from "./gallery-uploaded";
import type { occasionEntries } from "./occasion-entries";
type OccasionSlug = (typeof occasionEntries)[number]["slug"];
export type SuppliedPhoto = { image: string; width: number; height: number };
const assignments: Record<OccasionSlug, string> = {
  "baby-shower": "baby-shower",
  "welcome-baby": "welcome-baby",
  anniversary: "anniversary",
  proposal: "proposal-garden",
  "room-surprise": "proposal-room",
  "first-night": "first-night",
  "bachelor-party": "bachelor-party",
  wedding: "wedding",
  "house-warming": "house-warming",
  "car-decoration": "car-decoration",
  "pet-decoration": "pet-themed-celebration",
  "farewell-party": "farewell-party",
  "corporate-events": "corporate-events",
  "grand-opening": "grand-opening",
  "annual-day-function": "annual-day",
  "naming-ceremony": "floral-swing",
  birthday: "birthday-50th",
  "kids-birthday": "kids-birthday-princess",
  "showroom-setup": "showroom-floral-display",
};
export const suppliedOccasionPhotos = Object.fromEntries(
  Object.entries(assignments).map(([slug, id]) => {
    const photo =
      heroSlides.find((item) => item.id === id) ??
      galleryUploaded[id as keyof typeof galleryUploaded];
    if (!photo) throw new Error(`Missing supplied occasion photo: ${slug}`);
    return [slug, photo];
  }),
) as Record<OccasionSlug, SuppliedPhoto>;
