import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryBachelorMedia } from "./gallery-bachelor-batch-1";
import { galleryMedia, galleryMessage, readGalleryShortlist } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
import { weddingChapters } from "./gallery-wedding-groups";
const folder = "photo-intake/gallery-bachelor-batch-1/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
const hash = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
it("retains13 unique original files and adds stable BC339–351 without replacing the existing338 references", () => {
  expect(manifest.photos).toHaveLength(13);
  expect(manifest.duplicates).toEqual([]);
  const prior = new Set(
    readdirSync("photo-intake", { recursive: true })
      .map(String)
      .filter((p) => /\.jpe?g$/i.test(p) && !p.startsWith("gallery-bachelor-batch-1/"))
      .map((p) => hash("photo-intake/" + p)),
  );
  for (const p of manifest.photos) {
    expect(hash(folder + p.source)).toBe(p.sha256);
    expect(prior.has(p.sha256)).toBe(false);
    expect(p.crop).toBeUndefined();
    expect(p.rotate).toBe(0);
  }
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(13);
  expect(galleryBachelorMedia.map((p) => p.reference)).toEqual(
    Array.from({ length: 13 }, (_, i) => `BC-${339 + i}`),
  );
  expect(galleryMedia).toHaveLength(351);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(351);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 351 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
  expect(galleryMedia.find((p) => p.id === "bachelor-party")?.reference).toBe("BC-15");
  expect(
    readGalleryShortlist(
      '["bachelor-party","welcome-baby","first-night-heart-lettered-path","bachelor-ring-light-letters"]',
    ),
  ).toEqual([
    "bachelor-party",
    "welcome-baby",
    "first-night-heart-lettered-path",
    "bachelor-ring-light-letters",
  ]);
});
it("keeps Bachelor Party14 independent, preserves all other styles/Wedding chapters and scopes its viewer and enquiries", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  expect(sections.find((p) => p.id === "bachelor-party")).toMatchObject({
    layout: "intimate",
    radius: "4px 4px 80px 4px",
    initial: 3,
  });
  expect(sections.find((p) => p.id === "bachelor-party")?.items).toHaveLength(14);
  expect(sections.reduce((n, p) => n + Math.min(p.initial, p.items.length), 0)).toBe(62);
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
    ["annual-day-function", 20],
    ["car-decoration", 20],
    ["room-surprise", 21],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(n);
  for (const p of galleryBachelorMedia) {
    expect(p.occasion).toBe("Bachelor Party");
    expect(p.group).toBe("Love & weddings");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(14);
    expect(viewer.every((q) => q.occasion === "Bachelor Party")).toBe(true);
  }
  const msg = galleryMessage([galleryBachelorMedia[0]!, galleryBachelorMedia[12]!]);
  expect(msg).toContain("BC-339 · Bachelor Party");
  expect(msg).toContain("BC-351 · Bachelor Party");
});
it("keeps user-classified bride-to-be/floral/picnic/party scenes without editing marks, making claims or changing home assignments", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryBachelorMedia) expect(code).not.toContain(p.id);
  }
  for (const p of galleryBachelorMedia) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /Heineken|Bottega|personal name|our venue|our client celebration|brand partner|our client|verified|fresh flowers|pet.safe|owned work/i,
    );
  }
  expect(galleryBachelorMedia.filter((p) => p.width > p.height)).toHaveLength(1);
  expect(readFileSync("src/components/balloon/gallery/creation-gallery.css", "utf8")).toMatch(
    /\[data-gallery-style="bachelor-party"\] \.gc-open img\s*\{[^}]*object-fit: contain/,
  );
});
