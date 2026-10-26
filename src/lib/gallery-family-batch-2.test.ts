import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryFamilyBatch2Media } from "./gallery-family-batch-2";
import { galleryMedia } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
const intake = "photo-intake/gallery-family-batch-2/";
const manifest = JSON.parse(readFileSync(intake + "selection.json", "utf8"));
it("retains all nine received originals and appends BC49–57 without losing previous references", () => {
  expect(manifest.photos).toHaveLength(9);
  expect(manifest.duplicates).toEqual([]);
  for (const p of manifest.photos)
    expect(
      createHash("sha256")
        .update(readFileSync(intake + p.source))
        .digest("hex"),
    ).toBe(p.sha256);
  expect(galleryFamilyBatch2Media.map((p) => p.reference)).toEqual(
    Array.from({ length: 9 }, (_, i) => `BC-${49 + i}`),
  );
  expect(galleryMedia).toHaveLength(351);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(351);
  expect(new Set(galleryMedia.map((p) => p.reference)).size).toBe(351);
  expect(galleryMedia.find((p) => p.id === "baby-shower-bloom")?.reference).toBe("BC-39");
});
it("puts seven shower setups in Baby Shower and both explicit first birthdays in Kids Birthday", () => {
  expect(galleryFamilyBatch2Media.filter((p) => p.occasion === "Baby Shower")).toHaveLength(7);
  expect(
    galleryFamilyBatch2Media.filter((p) => p.occasion === "Kids Birthday").map((p) => p.id),
  ).toEqual(["kids-blue-car-one", "kids-boss-baby-one"]);
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  expect(sections.find((p) => p.id === "baby-shower")?.items).toHaveLength(18);
  expect(sections.find((p) => p.id === "kids-birthday")?.items).toHaveLength(14);
  expect(sections.find((p) => p.id === "birthday")?.items).toHaveLength(7);
  for (const p of galleryFamilyBatch2Media) {
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer.every((q) => q.occasion === p.occasion)).toBe(true);
    expect(viewer).toHaveLength(p.occasion === "Baby Shower" ? 18 : 14);
    expect(p.group).toBe(p.occasion === "Baby Shower" ? "Baby & family" : "Birthdays");
  }
});
it("leaves approved homepage/circle/cover assignments alone and uses no invented location claims", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryFamilyBatch2Media) expect(code).not.toContain(p.id);
  }
  for (const p of galleryFamilyBatch2Media) {
    expect(`${p.title} ${p.detail}`).not.toMatch(/Delhi|NCR|client|verified|2026/i);
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
  }
});
