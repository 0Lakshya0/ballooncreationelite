import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryBatch2Media } from "./gallery-batch-2";
import { galleryMedia } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
const folder = "photo-intake/gallery-birthday-batch-2/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
it("retains all10 original files, appends nine stable references and omits the cropped repeat", () => {
  expect(manifest.photos).toHaveLength(9);
  expect(manifest.duplicates).toHaveLength(1);
  for (const photo of [...manifest.photos, ...manifest.duplicates]) {
    expect(
      createHash("sha256")
        .update(readFileSync(folder + photo.source))
        .digest("hex"),
    ).toBe(photo.sha256);
  }
  expect(galleryBatch2Media.map((p) => p.reference)).toEqual(
    Array.from({ length: 9 }, (_, i) => `BC-${i + 30}`),
  );
  expect(galleryMedia.filter((p) => p.id === manifest.duplicates[0].existingId)).toHaveLength(1);
  expect(manifest.duplicates[0].existingReference).toBe("BC-28");
  expect(galleryMedia.find((p) => p.id === "kids-first-birthday-peach")?.reference).toBe("BC-28");
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(157);
  expect(new Set(galleryMedia.map((p) => p.reference)).size).toBe(157);
});
it("separates normal and kids birthdays and classifies proposal lettering by the actual photo", () => {
  expect(galleryBatch2Media.filter((p) => p.occasion === "Birthday")).toHaveLength(4);
  expect(galleryBatch2Media.filter((p) => p.occasion === "Kids Birthday")).toHaveLength(4);
  const proposal = galleryBatch2Media.find((p) => p.id === "proposal-rose-sparkle")!;
  expect(proposal.occasion).toBe("Proposal");
  expect(proposal.group).toBe("Love & weddings");
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  expect(sections.find((p) => p.id === "birthday")?.items).toHaveLength(7);
  expect(sections.find((p) => p.id === "kids-birthday")?.items).toHaveLength(14);
  expect(sections.find((p) => p.id === "proposal")?.items).toHaveLength(21);
  for (const photo of galleryBatch2Media) {
    const viewer = collectionViewerItems(photo.id, galleryMedia);
    expect(viewer.some((p) => p.id === photo.id)).toBe(true);
    expect(viewer.every((p) => p.occasion === photo.occasion)).toBe(true);
  }
});
it("trims only the neutral screenshot padding, keeps supplier marks, and does not change approved home imagery", () => {
  expect(manifest.photos.find((p: { id: string }) => p.id === "birthday-black-roses").crop).toEqual(
    [0, 155, 736, 1205],
  );
  expect(galleryBatch2Media.find((p) => p.id === "birthday-black-roses")?.height).toBe(1050);
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const photo of galleryBatch2Media) expect(code).not.toContain(photo.id);
  }
});
