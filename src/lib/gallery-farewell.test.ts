import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryFarewellMedia } from "./gallery-farewell-batch-1";
import { galleryMedia, galleryMessage, readGalleryShortlist } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
import { weddingChapters } from "./gallery-wedding-groups";
const folder = "photo-intake/gallery-farewell-batch-1/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
const hash = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
it("retains16 original files (15 new +1 exact repeat) and adds stable BC268–282 without replacing the existing267 references", () => {
  expect(manifest.photos).toHaveLength(15);
  expect(manifest.duplicates).toHaveLength(1);
  const duplicate = manifest.duplicates[0];
  expect(hash(folder + duplicate.source)).toBe(duplicate.sha256);
  expect(hash(duplicate.existingSource)).toBe(duplicate.sha256);
  expect(duplicate).toMatchObject({
    existingId: "farewell-party",
    existingReference: "BC-19",
    existingOccasion: "Farewell Party",
  });
  const prior = new Set(
    readdirSync("photo-intake", { recursive: true })
      .map(String)
      .filter((p) => /\.jpe?g$/i.test(p) && !p.startsWith("gallery-farewell-batch-1/"))
      .map((p) => hash("photo-intake/" + p)),
  );
  for (const p of manifest.photos) {
    expect(hash(folder + p.source)).toBe(p.sha256);
    expect(prior.has(p.sha256)).toBe(false);
    expect(p.crop).toBeUndefined();
    expect(p.rotate).toBe(0);
  }
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(15);
  expect(galleryFarewellMedia.map((p) => p.reference)).toEqual(
    Array.from({ length: 15 }, (_, i) => `BC-${268 + i}`),
  );
  expect(galleryMedia).toHaveLength(351);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(351);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 351 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
  expect(galleryMedia.find((p) => p.id === "farewell-party")?.reference).toBe("BC-19");
  expect(
    readGalleryShortlist(
      '["farewell-party","welcome-baby","first-night-heart-lettered-path","farewell-graduation-cap-shimmer"]',
    ),
  ).toEqual([
    "farewell-party",
    "welcome-baby",
    "first-night-heart-lettered-path",
    "farewell-graduation-cap-shimmer",
  ]);
});
it("keeps Farewell Party16 independent, preserves all other styles/Wedding chapters and scopes its viewer and enquiries", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  expect(sections.find((p) => p.id === "farewell-party")).toMatchObject({
    layout: "soft",
    radius: "70px 4px 4px 4px",
    initial: 3,
  });
  expect(sections.find((p) => p.id === "farewell-party")?.items).toHaveLength(16);
  expect(sections.reduce((n, p) => n + Math.min(p.initial, p.items.length), 0)).toBe(60);
  expect(weddingChapters(galleryMedia).map((p) => p.items.length)).toEqual([7, 6, 6, 2]);
  for (const [id, n] of [
    ["birthday", 7],
    ["kids-birthday", 14],
    ["baby-shower", 18],
    ["anniversary", 20],
    ["first-night", 41],
    ["naming-ceremony", 20],
    ["proposal", 21],
    ["wedding", 21],
    ["showroom-setup", 18],
    ["welcome-baby", 17],
    ["pet-decoration", 21],
    ["house-warming", 21],
    ["grand-opening", 21],
    ["car-decoration", 20],
    ["room-surprise", 1],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(n);
  for (const p of galleryFarewellMedia) {
    expect(p.occasion).toBe("Farewell Party");
    expect(p.group).toBe("Work & events");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(16);
    expect(viewer.every((q) => q.occasion === "Farewell Party")).toBe(true);
  }
  const msg = galleryMessage([galleryFarewellMedia[0]!, galleryFarewellMedia[14]!]);
  expect(msg).toContain("BC-268 · Farewell Party");
  expect(msg).toContain("BC-282 · Farewell Party");
});
it("keeps user-classified graduation/retirement/prom and memory scenes without editing marks, making claims or changing home assignments", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryFarewellMedia) expect(code).not.toContain(p.id);
  }
  for (const p of galleryFarewellMedia) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /Patrick|Sawona|Kwacha|Delhi Public|Milind|claimed age|valid promotion|our client|verified|fresh flowers|pet.safe|owned work/i,
    );
  }
  expect(galleryFarewellMedia.find((p) => p.id === "farewell-gold-graduation-stage")).toMatchObject(
    { width: 736, height: 1345 },
  );
  expect(galleryFarewellMedia.filter((p) => p.width > p.height)).toHaveLength(1);
  expect(readFileSync("src/components/balloon/gallery/creation-gallery.css", "utf8")).toMatch(
    /\[data-gallery-style="farewell-party"\] \.gc-open img\s*\{[^}]*object-fit: contain/,
  );
});
