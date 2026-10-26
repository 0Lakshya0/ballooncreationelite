import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryCorporateMedia } from "./gallery-corporate-batch-1";
import { galleryMedia, galleryMessage, readGalleryShortlist } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
import { weddingChapters } from "./gallery-wedding-groups";
const folder = "photo-intake/gallery-corporate-batch-1/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
const hash = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
it("retains20 original files (18 new +2 exact repeats) and adds stable BC283–300 without replacing the existing282 references", () => {
  expect(manifest.photos).toHaveLength(18);
  expect(manifest.duplicates).toHaveLength(2);
  for (const duplicate of manifest.duplicates) {
    expect(hash(folder + duplicate.source)).toBe(duplicate.sha256);
    expect(hash(duplicate.existingSource)).toBe(duplicate.sha256);
    expect(galleryMedia.filter((p) => p.id === duplicate.existingId)).toHaveLength(1);
    expect(galleryMedia.find((p) => p.id === duplicate.existingId)).toMatchObject({
      reference: duplicate.existingReference,
      occasion: duplicate.existingOccasion,
    });
  }
  expect(
    manifest.duplicates.map((p: { existingReference: string }) => p.existingReference),
  ).toEqual(["BC-14", "BC-169"]);
  const prior = new Set(
    readdirSync("photo-intake", { recursive: true })
      .map(String)
      .filter((p) => /\.jpe?g$/i.test(p) && !p.startsWith("gallery-corporate-batch-1/"))
      .map((p) => hash("photo-intake/" + p)),
  );
  for (const p of manifest.photos) {
    expect(hash(folder + p.source)).toBe(p.sha256);
    expect(prior.has(p.sha256)).toBe(false);
    expect(p.crop).toBeUndefined();
    expect(p.rotate).toBe(0);
  }
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(18);
  expect(galleryCorporateMedia.map((p) => p.reference)).toEqual(
    Array.from({ length: 18 }, (_, i) => `BC-${283 + i}`),
  );
  expect(galleryMedia).toHaveLength(351);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(351);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 351 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
  expect(galleryMedia.find((p) => p.id === "corporate-events")?.reference).toBe("BC-14");
  expect(
    readGalleryShortlist(
      '["corporate-events","welcome-baby","first-night-heart-lettered-path","corporate-aqua-service-week"]',
    ),
  ).toEqual([
    "corporate-events",
    "welcome-baby",
    "first-night-heart-lettered-path",
    "corporate-aqua-service-week",
  ]);
});
it("keeps Corporate Events19 independent, preserves all other styles/Wedding chapters and scopes its viewer and enquiries", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  expect(sections.find((p) => p.id === "corporate-events")).toMatchObject({
    layout: "architectural",
    radius: "16px 0 16px 0",
    initial: 3,
  });
  expect(sections.find((p) => p.id === "corporate-events")?.items).toHaveLength(19);
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
    ["car-decoration", 20],
    ["room-surprise", 21],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(n);
  for (const p of galleryCorporateMedia) {
    expect(p.occasion).toBe("Corporate Events");
    expect(p.group).toBe("Work & events");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(19);
    expect(viewer.every((q) => q.occasion === "Corporate Events")).toBe(true);
  }
  expect(
    sections.find((p) => p.id === "corporate-events")?.items.some((p) => p.reference === "BC-169"),
  ).toBe(false);
  const msg = galleryMessage([galleryCorporateMedia[0]!, galleryCorporateMedia[17]!]);
  expect(msg).toContain("BC-283 · Corporate Events");
  expect(msg).toContain("BC-300 · Corporate Events");
});
it("keeps user-classified mixed milestone/welcome/dining/stage scenes without editing marks, making claims or changing home assignments", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryCorporateMedia) expect(code).not.toContain(p.id);
  }
  for (const p of galleryCorporateMedia) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /Stanbic|Icon Realty|Krotho|Titan100|Marriott|Netflix|Black Diamond|Newgreens|claimed age|valid promotion|our client|verified|fresh flowers|pet.safe|owned work/i,
    );
  }
  expect(galleryCorporateMedia.filter((p) => p.width > p.height)).toHaveLength(3);
  expect(readFileSync("src/components/balloon/gallery/creation-gallery.css", "utf8")).toMatch(
    /\[data-gallery-style="corporate-events"\] \.gc-open img\s*\{[^}]*object-fit: contain/,
  );
});
