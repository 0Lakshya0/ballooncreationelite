import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryBabyShowerMedia } from "./gallery-baby-shower";
import { galleryMedia } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
const intake = "photo-intake/gallery-baby-shower-batch-1/";
const manifest = JSON.parse(readFileSync(intake + "selection.json", "utf8"));
it("retains10 unique original files and appends BC39–48 without duplicating or replacing earlier looks", () => {
  expect(manifest.photos).toHaveLength(10);
  expect(manifest.duplicates).toEqual([]);
  for (const photo of manifest.photos) {
    expect(
      createHash("sha256")
        .update(readFileSync(intake + photo.source))
        .digest("hex"),
    ).toBe(photo.sha256);
  }
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(10);
  expect(galleryBabyShowerMedia.map((p) => p.reference)).toEqual(
    Array.from({ length: 10 }, (_, i) => `BC-${39 + i}`),
  );
  expect(galleryMedia).toHaveLength(57);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(57);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 57 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`),
  );
  expect(galleryMedia.find((p) => p.id === "baby-shower")?.reference).toBe("BC-06");
  expect(galleryMedia.find((p) => p.id === "kids-first-birthday-peach")?.reference).toBe("BC-28");
});
it("keeps all10 in Baby Shower, including gender reveal and traditional themes, without mixing birthdays", () => {
  const collections = galleryCollections();
  expect(collections).toHaveLength(20);
  expect(collections.find((p) => p.id === "baby-shower")?.items).toHaveLength(18);
  expect(collections.find((p) => p.id === "birthday")?.items).toHaveLength(7);
  expect(collections.find((p) => p.id === "kids-birthday")?.items).toHaveLength(14);
  for (const photo of galleryBabyShowerMedia) {
    expect(photo.group).toBe("Baby & family");
    expect(photo.occasion).toBe("Baby Shower");
    const viewer = collectionViewerItems(photo.id, galleryMedia);
    expect(viewer).toHaveLength(18);
    expect(viewer.every((p) => p.occasion === "Baby Shower")).toBe(true);
  }
});
it("rotates the final scene upright, preserves the tiny original resolution and leaves approved home photos alone", () => {
  const wide = galleryBabyShowerMedia.find((p) => p.id === "baby-shower-krishna-stage")!;
  expect([wide.width, wide.height]).toEqual([1280, 720]);
  expect(manifest.photos.find((p: { id: string }) => p.id === wide.id).rotate).toBe(90);
  const tiny = galleryBabyShowerMedia.find((p) => p.id === "baby-shower-bloom")!;
  expect([tiny.width, tiny.height]).toEqual([236, 182]);
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const photo of galleryBabyShowerMedia) expect(code).not.toContain(photo.id);
  }
});
