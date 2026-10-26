import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryAnniversaryBatch2Media } from "./gallery-anniversary-batch-2";
import { galleryMedia, galleryMessage } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
const folder = "photo-intake/gallery-anniversary-batch-2/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
it("retains all11 unique originals and appends BC66–76 without replacing previous looks", () => {
  expect(manifest.photos).toHaveLength(11);
  expect(manifest.duplicates).toEqual([]);
  for (const p of manifest.photos)
    expect(
      createHash("sha256")
        .update(readFileSync(folder + p.source))
        .digest("hex"),
    ).toBe(p.sha256);
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(11);
  expect(galleryAnniversaryBatch2Media.map((p) => p.reference)).toEqual(
    Array.from({ length: 11 }, (_, i) => `BC-${66 + i}`),
  );
  expect(galleryMedia).toHaveLength(300);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(300);
  expect(new Set(galleryMedia.map((p) => p.reference)).size).toBe(300);
  expect(galleryMedia.find((p) => p.id === "anniversary")?.reference).toBe("BC-08");
  expect(galleryMedia.find((p) => p.id === "anniversary-three-gold")?.reference).toBe("BC-65");
});
it("keeps all11 additions in the20-photo Anniversary collection and preserves other exact styles", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  expect(sections.find((p) => p.id === "anniversary")?.items).toHaveLength(20);
  expect(sections.find((p) => p.id === "birthday")?.items).toHaveLength(7);
  expect(sections.find((p) => p.id === "kids-birthday")?.items).toHaveLength(14);
  expect(sections.find((p) => p.id === "baby-shower")?.items).toHaveLength(18);
  for (const p of galleryAnniversaryBatch2Media) {
    expect(p.occasion).toBe("Anniversary");
    expect(p.group).toBe("Love & weddings");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(20);
    expect(viewer.every((q) => q.occasion === "Anniversary")).toBe(true);
  }
  const message = galleryMessage([
    galleryAnniversaryBatch2Media[0]!,
    galleryAnniversaryBatch2Media[10]!,
  ]);
  expect(message).toContain("BC-66 · Anniversary");
  expect(message).toContain("BC-76 · Anniversary");
});
it("leaves approved hero/circle/covers unchanged and does not infer clients, dimensions or cities from filenames", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryAnniversaryBatch2Media) expect(code).not.toContain(p.id);
  }
  for (const p of galleryAnniversaryBatch2Media) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /Bhopal|Sikar|Funzoop|Mahesh|Sruthi|verified|client|8_8/i,
    );
  }
});
