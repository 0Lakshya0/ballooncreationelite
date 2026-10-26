import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryHouseWarmingMedia } from "./gallery-house-warming-batch-1";
import { galleryMedia, galleryMessage, readGalleryShortlist } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
import { weddingChapters } from "./gallery-wedding-groups";
const folder = "photo-intake/gallery-house-warming-batch-1/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
const hash = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
it("retains20 unique original files and adds stable BC228–247 without replacing the existing227 references", () => {
  expect(manifest.photos).toHaveLength(20);
  expect(manifest.duplicates).toEqual([]);
  const prior = new Set(
    readdirSync("photo-intake", { recursive: true })
      .map(String)
      .filter((p) => /\.jpe?g$/i.test(p) && !p.startsWith("gallery-house-warming-batch-1/"))
      .map((p) => hash("photo-intake/" + p)),
  );
  for (const p of manifest.photos) {
    expect(hash(folder + p.source)).toBe(p.sha256);
    expect(prior.has(p.sha256)).toBe(false);
    expect(p.crop).toBeUndefined();
    expect(p.rotate).toBe(0);
  }
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(20);
  expect(galleryHouseWarmingMedia.map((p) => p.reference)).toEqual(
    Array.from({ length: 20 }, (_, i) => `BC-${228 + i}`),
  );
  expect(galleryMedia).toHaveLength(351);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(351);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 351 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
  expect(galleryMedia.find((p) => p.id === "house-warming")?.reference).toBe("BC-12");
  expect(
    readGalleryShortlist(
      '["house-warming","welcome-baby","first-night-heart-lettered-path","house-warming-pink-balloon-petal-door"]',
    ),
  ).toEqual([
    "house-warming",
    "welcome-baby",
    "first-night-heart-lettered-path",
    "house-warming-pink-balloon-petal-door",
  ]);
});
it("keeps House Warming21 independent, preserves all other styles/Wedding chapters and scopes its viewer and enquiries", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  expect(sections.find((p) => p.id === "house-warming")).toMatchObject({
    layout: "architectural",
    radius: "100px 100px 0 0",
    initial: 3,
  });
  expect(sections.find((p) => p.id === "house-warming")?.items).toHaveLength(21);
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
    ["room-surprise", 1],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(n);
  for (const p of galleryHouseWarmingMedia) {
    expect(p.occasion).toBe("House Warming");
    expect(p.group).toBe("Home & milestones");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(21);
    expect(viewer.every((q) => q.occasion === "House Warming")).toBe(true);
  }
  const msg = galleryMessage([galleryHouseWarmingMedia[0]!, galleryHouseWarmingMedia[19]!]);
  expect(msg).toContain("BC-228 · House Warming");
  expect(msg).toContain("BC-247 · House Warming");
});
it("keeps user-classified balloon rooms, ceremonial backdrops and festive entrances without editing marks, making claims or changing home assignments", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryHouseWarmingMedia) expect(code).not.toContain(p.id);
  }
  for (const p of galleryHouseWarmingMedia) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /BEE Events|Shree.decorators|Sagar|Mayra|our client|verified|fresh flowers|pet.safe|owned work/i,
    );
  }
  expect([galleryHouseWarmingMedia[0]!.width, galleryHouseWarmingMedia[0]!.height]).toEqual([
    360, 640,
  ]);
  expect(galleryHouseWarmingMedia.filter((p) => p.width > p.height)).toHaveLength(0);
  expect(readFileSync("src/components/balloon/gallery/creation-gallery.css", "utf8")).toMatch(
    /\[data-gallery-style="house-warming"\] \.gc-open img\s*\{[^}]*object-fit: contain/,
  );
});
