import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryWelcomeBabyMedia } from "./gallery-welcome-baby-batch-1";
import { galleryMedia, galleryMessage, readGalleryShortlist } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
import { weddingChapters } from "./gallery-wedding-groups";
const folder = "photo-intake/gallery-welcome-baby-batch-1/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
const hash = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
it("retains18 originals, adds16 BC192–207 and keeps exact BC47 and re-encoded BC11 repeats once in their old styles", () => {
  expect(manifest.photos).toHaveLength(16);
  expect(manifest.duplicates).toHaveLength(2);
  const prior = new Set(
    readdirSync("photo-intake", { recursive: true })
      .map(String)
      .filter((p) => /\.jpe?g$/i.test(p) && !p.startsWith("gallery-welcome-baby-batch-1/"))
      .map((p) => hash("photo-intake/" + p)),
  );
  for (const p of [...manifest.photos, ...manifest.duplicates])
    expect(hash(folder + p.source)).toBe(p.sha256);
  for (const p of manifest.photos) {
    expect(prior.has(p.sha256)).toBe(false);
    expect(p.crop).toBeUndefined();
    expect(p.rotate).toBe(0);
  }
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(16);
  expect(
    manifest.duplicates.map((p: { existingReference: string }) => p.existingReference),
  ).toEqual(["BC-47", "BC-11"]);
  for (const p of manifest.duplicates) {
    expect(hash(p.existingSource)).toBe(p.existingSHA256);
    expect(galleryMedia.filter((q) => q.id === p.existingId)).toHaveLength(1);
    expect(galleryMedia.find((q) => q.id === p.existingId)).toMatchObject({
      reference: p.existingReference,
      occasion: p.existingOccasion,
    });
  }
  expect(readFileSync(folder + manifest.duplicates[0].source)).toEqual(
    readFileSync(manifest.duplicates[0].existingSource),
  );
  expect(manifest.duplicates[1].detection).toContain("dHash0/256");
  expect(galleryWelcomeBabyMedia.map((p) => p.reference)).toEqual(
    Array.from({ length: 16 }, (_, i) => `BC-${192 + i}`),
  );
  expect(galleryMedia).toHaveLength(319);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(319);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 319 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
  expect(
    readGalleryShortlist(
      '["welcome-baby","baby-shower-krishna-pastel","first-night-heart-lettered-path","welcome-baby-blue-home-teddy"]',
    ),
  ).toEqual([
    "welcome-baby",
    "baby-shower-krishna-pastel",
    "first-night-heart-lettered-path",
    "welcome-baby-blue-home-teddy",
  ]);
});
it("keeps Welcome Baby17 separate, retains all other style counts and Wedding chapters, and scopes enquiries/viewers", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  expect(sections.find((p) => p.id === "welcome-baby")).toMatchObject({
    layout: "soft",
    radius: "8px 80px 8px 80px",
    initial: 3,
  });
  expect(sections.find((p) => p.id === "welcome-baby")?.items).toHaveLength(17);
  expect(sections.reduce((n, p) => n + Math.min(p.initial, p.items.length), 0)).toBe(56);
  expect(weddingChapters(galleryMedia).map((p) => p.items.length)).toEqual([7, 6, 6, 2]);
  for (const [id, n] of [
    ["first-night", 41],
    ["baby-shower", 18],
    ["birthday", 7],
    ["kids-birthday", 14],
    ["wedding", 21],
    ["proposal", 21],
    ["naming-ceremony", 20],
    ["anniversary", 20],
    ["showroom-setup", 18],
    ["room-surprise", 1],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(n);
  for (const p of galleryWelcomeBabyMedia) {
    expect(p.occasion).toBe("Welcome Baby");
    expect(p.group).toBe("Baby & family");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(17);
    expect(viewer.every((q) => q.occasion === "Welcome Baby")).toBe(true);
  }
  const message = galleryMessage([galleryWelcomeBabyMedia[0]!, galleryWelcomeBabyMedia[15]!]);
  expect(message).toContain("BC-192 · Welcome Baby");
  expect(message).toContain("BC-207 · Welcome Baby");
});
it("preserves supplied motifs neutrally without ownership/affiliation claims or changing home, while containing whole scenes and insetting hearts", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryWelcomeBabyMedia) expect(code).not.toContain(p.id);
  }
  for (const p of galleryWelcomeBabyMedia) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /Sikar|9309488292|Avyay|Gaurish|Trishiv|Beatrice|Emmanuel|Robert|our client|verified|fresh flowers|safe candles/i,
    );
  }
  expect(galleryWelcomeBabyMedia.filter((p) => p.width > p.height)).toHaveLength(1);
  const css = readFileSync("src/components/balloon/gallery/creation-gallery.css", "utf8");
  expect(css).toMatch(
    /\[data-gallery-style="welcome-baby"\] \.gc-open img\s*\{[^}]*object-fit: contain/,
  );
  expect(css).toMatch(
    /\[data-gallery-style="welcome-baby"\] \.gc-heart\s*\{\s*top: 30px;\s*right: 30px;/,
  );
});
