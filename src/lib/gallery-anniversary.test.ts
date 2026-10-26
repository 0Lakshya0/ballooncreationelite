import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryAnniversaryMedia } from "./gallery-anniversary";
import { galleryMedia } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
const folder = "photo-intake/gallery-anniversary-batch-1/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
it("retains all10 originals, appends8 photos and verifies both byte-identical duplicates", () => {
  expect(manifest.photos).toHaveLength(8);
  expect(manifest.duplicates).toHaveLength(2);
  for (const p of [...manifest.photos, ...manifest.duplicates])
    expect(
      createHash("sha256")
        .update(readFileSync(folder + p.source))
        .digest("hex"),
    ).toBe(p.sha256);
  for (const p of manifest.duplicates) {
    expect(readFileSync(folder + p.source)).toEqual(readFileSync(p.existingSource));
    expect(galleryMedia.filter((q) => q.id === p.existingId)).toHaveLength(1);
    expect(galleryMedia.find((q) => q.id === p.existingId)?.reference).toBe(p.existingReference);
  }
  expect(galleryAnniversaryMedia.map((p) => p.reference)).toEqual(
    Array.from({ length: 8 }, (_, i) => `BC-${i + 58}`),
  );
  expect(galleryMedia).toHaveLength(267);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(267);
  expect(new Set(galleryMedia.map((p) => p.reference)).size).toBe(267);
});
it("keeps20 Anniversary looks in their own romantic collection with no birthday or proposal mixing", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  const anniversary = sections.find((p) => p.id === "anniversary")!;
  expect(anniversary.items).toHaveLength(20);
  expect(anniversary.layout).toBe("romantic");
  expect(sections.find((p) => p.id === "birthday")?.items).toHaveLength(7);
  expect(sections.find((p) => p.id === "kids-birthday")?.items).toHaveLength(14);
  expect(sections.find((p) => p.id === "baby-shower")?.items).toHaveLength(18);
  for (const p of galleryAnniversaryMedia) {
    expect(p.group).toBe("Love & weddings");
    expect(p.occasion).toBe("Anniversary");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(20);
    expect(viewer.every((q) => q.occasion === "Anniversary")).toBe(true);
  }
});
it("keeps BC08 and approved homepage/circle/cover assignments intact, with no invented client claims", () => {
  expect(galleryMedia.find((p) => p.id === "anniversary")?.reference).toBe("BC-08");
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryAnniversaryMedia) expect(code).not.toContain(p.id);
  }
  for (const p of galleryAnniversaryMedia) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(`${p.title} ${p.detail}`).not.toMatch(/client|verified|venue|2026/i);
  }
});
