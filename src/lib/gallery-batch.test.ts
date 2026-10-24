import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import { galleryMedia } from "./creation-gallery";
import { galleryBatchMedia } from "./gallery-batches";
const intake = "photo-intake/gallery-birthday-batch-1/";
const manifest = JSON.parse(readFileSync(intake + "selection.json", "utf8"));
it("retains all10 originals, adds nine new stable photo references, and deduplicates the existing princess image", () => {
  expect(manifest.photos).toHaveLength(9);
  expect(manifest.duplicates).toHaveLength(1);
  expect(galleryBatchMedia).toHaveLength(9);
  for (const photo of [...manifest.photos, ...manifest.duplicates])
    expect(
      createHash("sha256")
        .update(readFileSync(intake + photo.source))
        .digest("hex"),
    ).toBe(photo.sha256);
  for (const photo of galleryBatchMedia) {
    expect(photo.reference).toMatch(/^BC-2[1-9]$/);
    expect(galleryMedia.filter((item) => item.id === photo.id)).toHaveLength(1);
  }
  expect(galleryMedia.filter((item) => item.id === "kids-birthday-princess")).toHaveLength(1);
  expect(readFileSync(intake + manifest.duplicates[0].source)).toEqual(
    readFileSync("photo-intake/homepage-real/circle-batch-2/889179520199331088.jpg"),
  );
});
it("corrects the sideways jungle to landscape and leaves the homepage and circle data unchanged", () => {
  const jungle = galleryBatchMedia.find((item) => item.id === "kids-jungle-adventure")!;
  expect(jungle.width).toBeGreaterThan(jungle.height);
  expect(manifest.photos.find((p: { id: string }) => p.id === jungle.id).rotate).toBe(90);
  for (const path of [
    "src/lib/hero-slides.ts",
    "src/lib/occasion-photos.ts",
    "src/lib/supplied-occasion-photos.ts",
  ]) {
    const code = readFileSync(path, "utf8");
    for (const item of galleryBatchMedia) expect(code).not.toContain(item.id);
  }
});
