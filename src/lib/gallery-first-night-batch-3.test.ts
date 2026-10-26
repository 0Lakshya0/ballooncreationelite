import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryFirstNightBatch3Media } from "./gallery-first-night-batch-3";
import { galleryMedia, galleryMessage, readGalleryShortlist } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
import { weddingChapters } from "./gallery-wedding-groups";
const folder = "photo-intake/gallery-first-night-batch-3/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
const hash = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");
it("retains20 originals, adds17 new BC175–191 and leaves three exact Proposal repeats at BC123/124/127", () => {
  expect(manifest.photos).toHaveLength(17);
  expect(manifest.duplicates).toHaveLength(3);
  const prior = new Set(
    readdirSync("photo-intake", { recursive: true })
      .map(String)
      .filter((p) => /\.jpe?g$/i.test(p) && !p.startsWith("gallery-first-night-batch-3/"))
      .map((p) => hash("photo-intake/" + p)),
  );
  for (const p of [...manifest.photos, ...manifest.duplicates])
    expect(hash(folder + p.source)).toBe(p.sha256);
  for (const p of manifest.photos) {
    expect(prior.has(p.sha256)).toBe(false);
    expect(p.crop).toBeUndefined();
    expect(p.rotate).toBe(0);
  }
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(17);
  expect(
    manifest.duplicates.map((p: { existingReference: string }) => p.existingReference),
  ).toEqual(["BC-123", "BC-124", "BC-127"]);
  for (const d of manifest.duplicates) {
    expect(readFileSync(folder + d.source)).toEqual(readFileSync(d.existingSource));
    expect(galleryMedia.filter((p) => p.id === d.existingId)).toHaveLength(1);
    expect(galleryMedia.find((p) => p.id === d.existingId)).toMatchObject({
      reference: d.existingReference,
      occasion: "Proposal",
    });
  }
  expect(galleryFirstNightBatch3Media.map((p) => p.reference)).toEqual(
    Array.from({ length: 17 }, (_, i) => `BC-${175 + i}`),
  );
  expect(galleryMedia).toHaveLength(282);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(282);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 282 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
  expect(galleryMedia.find((p) => p.id === "first-night")?.reference).toBe("BC-10");
  expect(
    readGalleryShortlist(
      '["first-night","showroom-floral-panel-wall","first-night-heart-lettered-path"]',
    ),
  ).toEqual(["first-night", "showroom-floral-panel-wall", "first-night-heart-lettered-path"]);
});
it("keeps all41 First Night references in one intimate collection without changing any other style or Wedding chapters", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  const section = sections.find((p) => p.id === "first-night")!;
  expect(section.items).toHaveLength(41);
  expect(section.layout).toBe("intimate");
  expect(section.radius).toBe("90px 8px 90px 8px");
  expect(section.initial).toBe(3);
  expect(sections.reduce((n, p) => n + Math.min(p.initial, p.items.length), 0)).toBe(52);
  expect(weddingChapters(galleryMedia).map((p) => p.items.length)).toEqual([7, 6, 6, 2]);
  for (const [id, n] of [
    ["wedding", 21],
    ["proposal", 21],
    ["naming-ceremony", 20],
    ["anniversary", 20],
    ["showroom-setup", 18],
    ["room-surprise", 1],
    ["baby-shower", 18],
    ["welcome-baby", 17],
    ["kids-birthday", 14],
    ["birthday", 7],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(n);
  for (const p of galleryFirstNightBatch3Media) {
    expect(p.occasion).toBe("First Night");
    expect(p.group).toBe("Love & weddings");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(41);
    expect(viewer.every((q) => q.occasion === "First Night")).toBe(true);
  }
  const m = galleryMessage([galleryFirstNightBatch3Media[0]!, galleryFirstNightBatch3Media[16]!]);
  expect(m).toContain("BC-175 · First Night");
  expect(m).toContain("BC-191 · First Night");
});
it("keeps user-classified birthday/anniversary/proposal-lettered room references without inventing client, age or material claims or changing home", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryFirstNightBatch3Media) expect(code).not.toContain(p.id);
  }
  for (const p of galleryFirstNightBatch3Media) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /JOL|Pandora|Million Roses|26th|our client|verified|fresh flowers|safe candles|newlywed/i,
    );
  }
  expect(galleryFirstNightBatch3Media.filter((p) => p.width > p.height)).toHaveLength(0);
});
