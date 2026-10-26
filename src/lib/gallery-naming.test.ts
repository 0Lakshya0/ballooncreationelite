import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryNamingMedia } from "./gallery-naming";
import { galleryMedia, galleryMessage } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
const folder = "photo-intake/gallery-naming-batch-1/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
const hash = (file: string) => createHash("sha256").update(readFileSync(file)).digest("hex");
it("retains all15 originals, appends14 unique BC100–113 and omits the resized BC09 repeat", () => {
  expect(manifest.photos).toHaveLength(14);
  expect(manifest.duplicates).toHaveLength(1);
  for (const p of [...manifest.photos, ...manifest.duplicates])
    expect(hash(folder + p.source)).toBe(p.sha256);
  const prior = new Set(
    readdirSync("photo-intake", { recursive: true })
      .map(String)
      .filter((p) => /\.jpe?g$/i.test(p) && !p.startsWith("gallery-naming-batch-1/"))
      .map((p) => hash("photo-intake/" + p)),
  );
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(14);
  for (const p of manifest.photos) expect(prior.has(p.sha256)).toBe(false);
  const duplicate = manifest.duplicates[0];
  expect(hash(duplicate.existingSource)).toBe(duplicate.existingSHA256);
  expect(duplicate.sha256).not.toBe(duplicate.existingSHA256);
  expect(duplicate.existingId).toBe("floral-swing");
  expect(duplicate.detection.hammingDistance).toBe(0);
  expect(galleryMedia.filter((p) => p.id === duplicate.existingId)).toHaveLength(1);
  expect(galleryMedia.find((p) => p.id === duplicate.existingId)?.reference).toBe("BC-09");
  expect(galleryNamingMedia.map((p) => p.reference)).toEqual(
    Array.from({ length: 14 }, (_, i) => `BC-${100 + i}`),
  );
  expect(galleryMedia).toHaveLength(282);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(282);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 282 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
});
it("keeps20 Naming Ceremony photos independent from Baby Shower and Welcome Baby, with stable three-digit enquiries", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  const naming = sections.find((p) => p.id === "naming-ceremony")!;
  expect(naming.items).toHaveLength(20);
  expect(naming.layout).toBe("floral");
  expect(naming.radius).toBe("50% 50% 8px 8px / 90px 90px 8px 8px");
  expect(naming.initial).toBe(3);
  expect(sections.reduce((n, p) => n + Math.min(p.initial, p.items.length), 0)).toBe(52);
  for (const [id, n] of [
    ["baby-shower", 18],
    ["welcome-baby", 17],
    ["anniversary", 20],
    ["first-night", 41],
    ["birthday", 7],
    ["kids-birthday", 14],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(n);
  for (const p of galleryNamingMedia) {
    expect(p.occasion).toBe("Naming Ceremony");
    expect(p.group).toBe("Baby & family");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(20);
    expect(viewer.every((q) => q.occasion === "Naming Ceremony")).toBe(true);
  }
  const message = galleryMessage([galleryNamingMedia[0]!, galleryNamingMedia[13]!]);
  expect(message).toContain("BC-100 · Naming Ceremony");
  expect(message).toContain("BC-113 · Naming Ceremony");
});
it("preserves approved hero/circle/covers and avoids identity, venue, supplier or safe-sleep claims in captions", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryNamingMedia) expect(code).not.toContain(p.id);
  }
  for (const p of galleryNamingMedia) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /Macaulay|Lajwaab|Aravind|Brett|Mohaned|2020|Shriganesha|BalloonPot|Baptism|verified|our work|safe.sleep|fresh/i,
    );
  }
  expect(galleryNamingMedia.filter((p) => p.width > p.height)).toHaveLength(4);
});
