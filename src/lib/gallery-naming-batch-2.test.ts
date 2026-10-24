import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryNamingBatch2Media } from "./gallery-naming-batch-2";
import { galleryMedia, galleryMessage } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
const folder = "photo-intake/gallery-naming-batch-2/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
const hash = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");
it("retains5 unique originals and appends BC114–118 without replacing previous references", () => {
  expect(manifest.photos).toHaveLength(5);
  expect(manifest.duplicates).toEqual([]);
  const prior = new Set(
    readdirSync("photo-intake", { recursive: true })
      .map(String)
      .filter((p) => /\.jpe?g$/i.test(p) && !p.startsWith("gallery-naming-batch-2/"))
      .map((p) => hash("photo-intake/" + p)),
  );
  for (const p of manifest.photos) {
    expect(hash(folder + p.source)).toBe(p.sha256);
    expect(prior.has(p.sha256)).toBe(false);
  }
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(5);
  expect(galleryNamingBatch2Media.map((p) => p.reference)).toEqual(
    Array.from({ length: 5 }, (_, i) => `BC-${114 + i}`),
  );
  expect(galleryMedia).toHaveLength(118);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(118);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 118 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
  expect(galleryMedia.find((p) => p.id === "floral-swing")?.reference).toBe("BC-09");
  expect(galleryMedia.filter((p) => p.id === "floral-swing")).toHaveLength(1);
  expect(galleryMedia.find((p) => p.id === "naming-fairy-floral-ring")?.reference).toBe("BC-113");
});
it("reaches20 Naming Ceremony looks with style-local navigation and preserves all other collections", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  expect(sections.find((p) => p.id === "naming-ceremony")?.items).toHaveLength(20);
  expect(sections.reduce((n, p) => n + Math.min(p.initial, p.items.length), 0)).toBe(37);
  for (const [id, n] of [
    ["baby-shower", 18],
    ["welcome-baby", 1],
    ["first-night", 24],
    ["anniversary", 20],
    ["kids-birthday", 14],
    ["birthday", 7],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(n);
  for (const p of galleryNamingBatch2Media) {
    expect(p.occasion).toBe("Naming Ceremony");
    expect(p.group).toBe("Baby & family");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(20);
    expect(viewer.every((q) => q.occasion === "Naming Ceremony")).toBe(true);
  }
  const m = galleryMessage([galleryNamingBatch2Media[0]!, galleryNamingBatch2Media[4]!]);
  expect(m).toContain("BC-114 · Naming Ceremony");
  expect(m).toContain("BC-118 · Naming Ceremony");
});
it("preserves approved home/circle/covers and keeps printed personal/placeholder/supplier details out of captions", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryNamingBatch2Media) expect(code).not.toContain(p.id);
  }
  for (const p of galleryNamingBatch2Media) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /Ravi|Thanusha|20XX|October|BalloonPot|verified|our work|safe.sleep|fresh/i,
    );
  }
  expect(galleryNamingBatch2Media.filter((p) => p.width > p.height)).toHaveLength(1);
});
