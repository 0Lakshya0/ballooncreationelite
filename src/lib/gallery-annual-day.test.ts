import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryAnnualDayMedia } from "./gallery-annual-day-batch-1";
import { galleryMedia, galleryMessage, readGalleryShortlist } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
import { weddingChapters } from "./gallery-wedding-groups";
const folder = "photo-intake/gallery-annual-day-batch-1/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
const hash = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
it("retains19 unique original files and adds stable BC320–338 without replacing the existing319 references", () => {
  expect(manifest.photos).toHaveLength(19);
  expect(manifest.duplicates).toEqual([]);
  const prior = new Set(
    readdirSync("photo-intake", { recursive: true })
      .map(String)
      .filter((p) => /\.jpe?g$/i.test(p) && !p.startsWith("gallery-annual-day-batch-1/"))
      .map((p) => hash("photo-intake/" + p)),
  );
  for (const p of manifest.photos) {
    expect(hash(folder + p.source)).toBe(p.sha256);
    expect(prior.has(p.sha256)).toBe(false);
    expect(p.crop).toBeUndefined();
    expect(p.rotate).toBe(0);
  }
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(19);
  expect(galleryAnnualDayMedia.map((p) => p.reference)).toEqual(
    Array.from({ length: 19 }, (_, i) => `BC-${320 + i}`),
  );
  expect(galleryMedia).toHaveLength(351);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(351);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 351 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
  expect(galleryMedia.find((p) => p.id === "annual-day")?.reference).toBe("BC-20");
  expect(
    readGalleryShortlist(
      '["annual-day","welcome-baby","first-night-heart-lettered-path","annual-colourful-draped-walkway"]',
    ),
  ).toEqual([
    "annual-day",
    "welcome-baby",
    "first-night-heart-lettered-path",
    "annual-colourful-draped-walkway",
  ]);
});
it("keeps Annual Day Function20 independent, preserves all other styles/Wedding chapters and scopes its viewer and enquiries", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  expect(sections.find((p) => p.id === "annual-day-function")).toMatchObject({
    layout: "architectural",
    radius: "8px 8px 0 0",
    initial: 3,
  });
  expect(sections.find((p) => p.id === "annual-day-function")?.items).toHaveLength(20);
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
    ["farewell-party", 16],
    ["corporate-events", 19],
    ["car-decoration", 20],
    ["room-surprise", 1],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(n);
  for (const p of galleryAnnualDayMedia) {
    expect(p.occasion).toBe("Annual Day Function");
    expect(p.group).toBe("Work & events");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(20);
    expect(viewer.every((q) => q.occasion === "Annual Day Function")).toBe(true);
  }
  const msg = galleryMessage([galleryAnnualDayMedia[0]!, galleryAnnualDayMedia[18]!]);
  expect(msg).toContain("BC-320 · Annual Day Function");
  expect(msg).toContain("BC-338 · Annual Day Function");
});
it("keeps user-classified mixed festive/opening/graduation/milestone/stage scenes without editing marks, making claims or changing home assignments", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryAnnualDayMedia) expect(code).not.toContain(p.id);
  }
  for (const p of galleryAnnualDayMedia) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /Abhinaya|Princeton|Shri Ram|Haleyman|HSBC|Genesis|Vardhman|admissions open|current year|our client|verified|fresh flowers|pet.safe|owned work/i,
    );
  }
  expect(galleryAnnualDayMedia.find((p) => p.id === "annual-red-led-stage")).toMatchObject({
    width: 404,
    height: 316,
  });
  expect(galleryAnnualDayMedia.filter((p) => p.width > p.height)).toHaveLength(6);
  expect(readFileSync("src/components/balloon/gallery/creation-gallery.css", "utf8")).toMatch(
    /\[data-gallery-style="annual-day-function"\] \.gc-open img\s*\{[^}]*object-fit: contain/,
  );
});
