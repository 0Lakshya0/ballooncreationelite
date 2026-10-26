import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryPetMedia } from "./gallery-pet-batch-1";
import { galleryMedia, galleryMessage, readGalleryShortlist } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
import { weddingChapters } from "./gallery-wedding-groups";
const folder = "photo-intake/gallery-pet-batch-1/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
const hash = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
it("retains20 unique original files and adds stable BC208–227 without replacing the existing207 references", () => {
  expect(manifest.photos).toHaveLength(20);
  expect(manifest.duplicates).toEqual([]);
  const prior = new Set(
    readdirSync("photo-intake", { recursive: true })
      .map(String)
      .filter((p) => /\.jpe?g$/i.test(p) && !p.startsWith("gallery-pet-batch-1/"))
      .map((p) => hash("photo-intake/" + p)),
  );
  for (const p of manifest.photos) {
    expect(hash(folder + p.source)).toBe(p.sha256);
    expect(prior.has(p.sha256)).toBe(false);
    expect(p.crop).toBeUndefined();
    expect(p.rotate).toBe(0);
  }
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(20);
  expect(galleryPetMedia.map((p) => p.reference)).toEqual(
    Array.from({ length: 20 }, (_, i) => `BC-${208 + i}`),
  );
  expect(galleryMedia).toHaveLength(227);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(227);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 227 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
  expect(galleryMedia.find((p) => p.id === "pet-themed-celebration")?.reference).toBe("BC-16");
  expect(
    readGalleryShortlist(
      '["pet-themed-celebration","welcome-baby","first-night-heart-lettered-path","pet-memory-wall"]',
    ),
  ).toEqual([
    "pet-themed-celebration",
    "welcome-baby",
    "first-night-heart-lettered-path",
    "pet-memory-wall",
  ]);
});
it("keeps Pet Decoration21 independent, preserves all other styles/Wedding chapters and scopes its viewer and enquiries", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  expect(sections.find((p) => p.id === "pet-decoration")).toMatchObject({
    layout: "playful",
    radius: "30px 8px 30px 8px",
    initial: 3,
  });
  expect(sections.find((p) => p.id === "pet-decoration")?.items).toHaveLength(21);
  expect(sections.reduce((n, p) => n + Math.min(p.initial, p.items.length), 0)).toBe(46);
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
    ["room-surprise", 1],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(n);
  for (const p of galleryPetMedia) {
    expect(p.occasion).toBe("Pet Decoration");
    expect(p.group).toBe("Baby & family");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(21);
    expect(viewer.every((q) => q.occasion === "Pet Decoration")).toBe(true);
  }
  const msg = galleryMessage([galleryPetMedia[0]!, galleryPetMedia[19]!]);
  expect(msg).toContain("BC-208 · Pet Decoration");
  expect(msg).toContain("BC-227 · Pet Decoration");
});
it("keeps user-classified safari, shop, portrait and pet corners without editing marks, making claims or changing home assignments", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryPetMedia) expect(code).not.toContain(p.id);
  }
  for (const p of galleryPetMedia) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /Trendingzoo|Deccography|Lake Forest|Deniz|1505|our client|verified|fresh flowers|pet.safe|owned work/i,
    );
  }
  expect(galleryPetMedia.filter((p) => p.width > p.height)).toHaveLength(0);
  expect(readFileSync("src/components/balloon/gallery/creation-gallery.css", "utf8")).toMatch(
    /\[data-gallery-style="pet-decoration"\] \.gc-open img\s*\{[^}]*object-fit: contain/,
  );
});
