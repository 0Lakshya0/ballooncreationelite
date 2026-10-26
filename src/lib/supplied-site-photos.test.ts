import { readdirSync, readFileSync, existsSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryMedia } from "./creation-gallery";
import { celebrations } from "./celebrations";
import { serviceDetails } from "./service-details";
import { DECOR_DATA } from "@/components/balloon/decor/decor-data";
import {
  decorPhotoIds,
  legacyCategoryPhotos,
  legacyServicePhotoIds,
  requestedSitePhotos,
  sitePhotos,
  suppliedDecorPhoto,
  suppliedSitePhoto,
} from "./supplied-site-photos";
const supplied = new Set(galleryMedia.map((photo) => photo.image));
it("uses supplied gallery photos for every core page image and legacy thumbnail", () => {
  for (const photo of [...Object.values(sitePhotos), ...Object.values(legacyCategoryPhotos)]) {
    expect(galleryMedia.find((item) => item.id === photo.id)).toBe(photo);
    expect(supplied.has(photo.image)).toBe(true);
  }
});
it("keeps each legacy service's photos and truthful captions in its explicit curated selection", () => {
  for (const service of serviceDetails) {
    const photos = legacyServicePhotoIds[service.slug]!.map(suppliedSitePhoto);
    expect(service.heroImage).toBe(photos[0]!.image);
    expect(service.accentImage).toBe(photos[1]!.image);
    expect(service.gallery).toEqual(
      photos.map((photo) => ({ src: photo.image, caption: photo.detail })),
    );
    expect(service.gallery.every((photo) => supplied.has(photo.src))).toBe(true);
  }
});
it("uses the same supplied selections for Home/About cross-links, not hidden generated fallbacks", () => {
  for (const item of celebrations) {
    const service = serviceDetails.find((service) => service.slug === item.slug)!;
    expect(item.image).toBe(service.heroImage);
    expect(item.gallery).toEqual(service.gallery.map((photo) => photo.src));
  }
});
it("classifies every approved decor image key explicitly as supplied or genuinely missing", () => {
  const keys = [...JSON.stringify(DECOR_DATA).matchAll(/img\/([^"\s]+)/g)].map(
    (match) => match[1]!,
  );
  expect(new Set(keys).size).toBe(34);
  for (const key of keys) {
    expect(Object.hasOwn(decorPhotoIds, key)).toBe(true);
    const id = decorPhotoIds[key];
    if (id) expect(suppliedDecorPhoto("img/" + key)).toBe(suppliedSitePhoto(id));
    else expect(suppliedDecorPhoto("img/" + key)).toBeUndefined();
  }
});
it("does not invent equipment photos or silently replace them with unrelated celebration pictures", () => {
  for (const key of [
    "booth-360.jpg",
    "fog-bubbles.jpg",
    "kids-zone.jpg",
    "cake-dessert.jpg",
    "sweet-cart.jpg",
    "confetti-balloon-drop.jpg",
    "ceiling-rings.jpg",
    "dessert-display.jpg",
  ])
    expect(suppliedDecorPhoto(key)).toBeUndefined();
  expect(requestedSitePhotos).toHaveLength(8);
  for (const key of [
    "https://example.com/photo.jpg",
    "/decor-types/unknown.jpg",
    "img/unknown.jpg",
  ])
    expect(suppliedDecorPhoto(key)).toBeUndefined();
});
it("does not ship retired generated decor photographs from the public directory", () => {
  expect(
    readdirSync("public/decor-types").filter((name) => /\.(jpg|png|webp)$/.test(name)),
  ).toEqual([]);
  expect(existsSync("public/decor-types/fonts/manrope-latin-wght-normal.woff2")).toBe(true);
});
it("prevents retired image imports and category globs from returning to customer source", () => {
  function visit(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory()
        ? visit(directory + "/" + entry.name)
        : /\.(ts|tsx|css)$/.test(entry.name) && !entry.name.includes(".test.")
          ? [directory + "/" + entry.name]
          : [],
    );
  }
  for (const file of visit("src")) {
    const source = readFileSync(file, "utf8");
    expect(source, file).not.toMatch(
      /from\s+["']@\/assets\/(?:wedding|birthday|baby-shower|anniversary|devotional|celebration-hero)\.(?:jpg|webp)["']/,
    );
    expect(source, file).not.toContain("/src/assets/categories/*.webp");
    expect(source, file).not.toMatch(
      /(?:src=["']|url\(["']?)\/decor-types\/[^/]+\.(?:jpg|png|webp)/,
    );
  }
});
it("does not inline archived synthetic photography in the public phone adapter", () => {
  const source = readFileSync("mockups/main-phone/vite.config.ts", "utf8");
  expect(source).not.toContain("src/assets/categories");
  expect(source).not.toContain("phonePhotos");
  expect(readFileSync("scripts/sync-decor-design.mjs", "utf8")).not.toContain(
    'fs.cpSync("mockups/img"',
  );
  expect(source).not.toContain("public/decor-types/${f}");
});
