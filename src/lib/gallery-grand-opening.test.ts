import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryGrandOpeningMedia } from "./gallery-grand-opening-batch-1";
import { galleryMedia, galleryMessage, readGalleryShortlist } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
import { weddingChapters } from "./gallery-wedding-groups";
const folder = "photo-intake/gallery-grand-opening-batch-1/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
const hash = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
it("retains20 unique original files and adds stable BC248–267 without replacing the existing247 references", () => {
  expect(manifest.photos).toHaveLength(20);
  expect(manifest.duplicates).toEqual([]);
  const prior = new Set(
    readdirSync("photo-intake", { recursive: true })
      .map(String)
      .filter((p) => /\.jpe?g$/i.test(p) && !p.startsWith("gallery-grand-opening-batch-1/"))
      .map((p) => hash("photo-intake/" + p)),
  );
  for (const p of manifest.photos) {
    expect(hash(folder + p.source)).toBe(p.sha256);
    expect(prior.has(p.sha256)).toBe(false);
    expect(p.crop).toBeUndefined();
    expect(p.rotate).toBe(0);
  }
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(20);
  expect(galleryGrandOpeningMedia.map((p) => p.reference)).toEqual(
    Array.from({ length: 20 }, (_, i) => `BC-${248 + i}`),
  );
  expect(galleryMedia).toHaveLength(300);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(300);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 300 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
  expect(galleryMedia.find((p) => p.id === "grand-opening")?.reference).toBe("BC-04");
  expect(
    readGalleryShortlist(
      '["grand-opening","welcome-baby","first-night-heart-lettered-path","grand-opening-orange-white-aqua-entrance"]',
    ),
  ).toEqual([
    "grand-opening",
    "welcome-baby",
    "first-night-heart-lettered-path",
    "grand-opening-orange-white-aqua-entrance",
  ]);
});
it("keeps Grand Opening21 independent, preserves all other styles/Wedding chapters and scopes its viewer and enquiries", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  expect(sections.find((p) => p.id === "grand-opening")).toMatchObject({
    layout: "architectural",
    radius: "0px",
    initial: 3,
  });
  expect(sections.find((p) => p.id === "grand-opening")?.items).toHaveLength(21);
  expect(sections.reduce((n, p) => n + Math.min(p.initial, p.items.length), 0)).toBe(54);
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
    ["car-decoration", 1],
    ["room-surprise", 1],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(n);
  for (const p of galleryGrandOpeningMedia) {
    expect(p.occasion).toBe("Grand Opening");
    expect(p.group).toBe("Work & events");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(21);
    expect(viewer.every((q) => q.occasion === "Grand Opening")).toBe(true);
  }
  const msg = galleryMessage([galleryGrandOpeningMedia[0]!, galleryGrandOpeningMedia[19]!]);
  expect(msg).toContain("BC-248 · Grand Opening");
  expect(msg).toContain("BC-267 · Grand Opening");
});
it("keeps user-classified mixed-celebration storefronts, ribbons and welcome panels without editing marks, making claims or changing home assignments", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryGrandOpeningMedia) expect(code).not.toContain(p.id);
  }
  for (const p of galleryGrandOpeningMedia) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /Skechers|Pozitron|Eminent|Martino|Avantis|Cuong|79909|Mysa|valid promotion|our client|verified|fresh flowers|pet.safe|owned work/i,
    );
  }
  expect(galleryGrandOpeningMedia.filter((p) => p.width > p.height)).toHaveLength(0);
  expect(readFileSync("src/components/balloon/gallery/creation-gallery.css", "utf8")).toMatch(
    /\[data-gallery-style="grand-opening"\] \.gc-open img\s*\{[^}]*object-fit: contain/,
  );
});
