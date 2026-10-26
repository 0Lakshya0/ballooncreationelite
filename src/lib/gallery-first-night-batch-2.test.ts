import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryFirstNightBatch2Media } from "./gallery-first-night-batch-2";
import { galleryMedia, galleryMessage } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
const folder = "photo-intake/gallery-first-night-batch-2/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
it("retains13 unique original hashes, appends BC87–99 and preserves all earlier references", () => {
  expect(manifest.photos).toHaveLength(13);
  expect(manifest.duplicates).toEqual([]);
  for (const p of manifest.photos)
    expect(
      createHash("sha256")
        .update(readFileSync(folder + p.source))
        .digest("hex"),
    ).toBe(p.sha256);
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(13);
  const previous = readdirSync("photo-intake", { recursive: true })
    .map(String)
    .filter((p) => /\.jpe?g$/i.test(p) && !p.startsWith("gallery-first-night-batch-2/"));
  const hashes = new Set(
    previous.map((p) =>
      createHash("sha256")
        .update(readFileSync("photo-intake/" + p))
        .digest("hex"),
    ),
  );
  for (const p of manifest.photos) expect(hashes.has(p.sha256)).toBe(false);
  expect(galleryFirstNightBatch2Media.map((p) => p.reference)).toEqual(
    Array.from({ length: 13 }, (_, i) => `BC-${87 + i}`),
  );
  expect(galleryMedia).toHaveLength(174);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(174);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 174 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
  expect(galleryMedia.find((p) => p.id === "first-night")?.reference).toBe("BC-10");
  expect(galleryMedia.find((p) => p.id === "anniversary-layered-love")?.reference).toBe("BC-76");
});
it("keeps all24 First Night photos in their intimate collection without mixing Room Surprise or Anniversary", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  const first = sections.find((p) => p.id === "first-night")!;
  expect(first.items).toHaveLength(24);
  expect(first.layout).toBe("intimate");
  expect(first.radius).toBe("90px 8px 90px 8px");
  expect(first.initial).toBe(3);
  expect(sections.reduce((n, p) => n + Math.min(p.initial, p.items.length), 0)).toBe(42);
  for (const [id, count] of [
    ["anniversary", 20],
    ["room-surprise", 1],
    ["birthday", 7],
    ["kids-birthday", 14],
    ["baby-shower", 18],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(count);
  for (const p of galleryFirstNightBatch2Media) {
    expect(p.occasion).toBe("First Night");
    expect(p.group).toBe("Love & weddings");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(24);
    expect(viewer.every((q) => q.occasion === "First Night")).toBe(true);
  }
  const message = galleryMessage([
    galleryFirstNightBatch2Media[0]!,
    galleryFirstNightBatch2Media[12]!,
  ]);
  expect(message).toContain("BC-87 · First Night");
  expect(message).toContain("BC-99 · First Night");
});
it("keeps approved home/circle/covers unchanged with neutral setup copy and no inferred event date or ownership", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryFirstNightBatch2Media) expect(code).not.toContain(p.id);
  }
  for (const p of galleryFirstNightBatch2Media) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /2024|20:12|CHINNI|Goa|Gurgaon|9319822716|Rio Boutique|verified|client|fresh|our work|safe candles/i,
    );
  }
});
