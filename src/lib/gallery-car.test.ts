import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryCarMedia } from "./gallery-car-batch-1";
import { galleryMedia, galleryMessage, readGalleryShortlist } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
import { carChapters, carPart } from "./gallery-car-groups";
import { weddingChapters } from "./gallery-wedding-groups";
const folder = "photo-intake/gallery-car-batch-1/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
const hash = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
it("retains20 exact originals, adds19 BC301–319 and keeps floral-peacock BC13 once", () => {
  expect(manifest.photos).toHaveLength(19);
  expect(manifest.duplicates).toHaveLength(1);
  const duplicate = manifest.duplicates[0];
  expect(hash(folder + duplicate.source)).toBe(duplicate.sha256);
  expect(hash(duplicate.existingSource)).toBe(duplicate.sha256);
  expect(galleryMedia.filter((p) => p.id === duplicate.existingId)).toHaveLength(1);
  expect(galleryMedia.find((p) => p.id === duplicate.existingId)).toMatchObject({
    reference: "BC-13",
    occasion: "Car Decoration",
    carPart: "wedding",
  });
  const prior = new Set(
    readdirSync("photo-intake", { recursive: true })
      .map(String)
      .filter((p) => /\.jpe?g$/i.test(p) && !p.startsWith("gallery-car-batch-1/"))
      .map((p) => hash("photo-intake/" + p)),
  );
  for (const p of manifest.photos) {
    expect(hash(folder + p.source)).toBe(p.sha256);
    expect(prior.has(p.sha256)).toBe(false);
    expect(p.crop).toBeUndefined();
    expect(p.rotate).toBe(0);
    expect(["birthday", "wedding"]).toContain(p.carPart);
  }
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(19);
  expect(galleryCarMedia.map((p) => p.reference)).toEqual(
    Array.from({ length: 19 }, (_, i) => `BC-${301 + i}`),
  );
  expect(galleryMedia).toHaveLength(351);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(351);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 351 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
  expect(
    readGalleryShortlist(
      '["car-decoration","car-blue-seat-surprise","car-red-rose-pink-ribbon-car"]',
    ),
  ).toEqual(["car-decoration", "car-blue-seat-surprise", "car-red-rose-pink-ribbon-car"]);
});
it("keeps one Car parent with two ordered, disjoint Birthday15/Wedding5 collections and scoped viewers/enquiries", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  const cars = sections.find((p) => p.id === "car-decoration")!;
  expect(cars).toMatchObject({ layout: "editorial", radius: "2px 60px 2px 2px", initial: 3 });
  expect(cars.items).toHaveLength(20);
  expect(carChapters(cars.items).map((p) => [p.name, p.items.length])).toEqual([
    ["Birthday Car Decoration", 15],
    ["Wedding Car Decoration", 5],
  ]);
  expect(new Set(carChapters(cars.items).flatMap((p) => p.items.map((q) => q.id))).size).toBe(20);
  expect(weddingChapters(galleryMedia).map((p) => p.items.length)).toEqual([7, 6, 6, 2]);
  for (const p of cars.items) {
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(carPart(p).id === "birthday" ? 15 : 5);
    expect(
      viewer.every((q) => carPart(q).id === carPart(p).id && q.occasion === "Car Decoration"),
    ).toBe(true);
    expect(p.group).toBe("Home & milestones");
  }
  for (const [id, n] of [
    ["wedding", 21],
    ["birthday", 7],
    ["kids-birthday", 14],
    ["corporate-events", 19],
    ["farewell-party", 16],
    ["grand-opening", 21],
    ["showroom-setup", 18],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(n);
  expect(galleryMessage([galleryCarMedia[0]!, galleryCarMedia[18]!])).toContain(
    "BC-301 · Car Decoration / Birthday Car Decoration",
  );
  expect(galleryMessage([galleryCarMedia[18]!])).toContain(
    "BC-319 · Car Decoration / Wedding Car Decoration",
  );
});
it("preserves full supplied scenes/plates/people/portraits/overlays and avoids identity, ownership, brand or driving-safety claims", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryCarMedia) expect(code).not.toContain(p.id);
  }
  for (const p of galleryCarMedia) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(p.kind).toBe("image");
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /BMW|Honda|GJ01|SLP|Hershey|Riya|our client|verified|owned work|fresh flowers|safe to drive|paint.safe/i,
    );
  }
  expect(galleryCarMedia.filter((p) => p.width > p.height)).toHaveLength(0);
  expect(readFileSync("src/components/balloon/gallery/creation-gallery.css", "utf8")).toMatch(
    /\[data-gallery-style="car-decoration"\] \.gc-open img\s*\{[^}]*object-fit: contain/,
  );
});
