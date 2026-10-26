import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryWeddingMedia } from "./gallery-wedding";
import { galleryMedia, galleryMessage, readGalleryShortlist } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
import { weddingChapters, weddingPart, weddingPreview } from "./gallery-wedding-groups";
const folder = "photo-intake/gallery-wedding-batch-1/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
const hash = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");
it("retains20 unique supplied Wedding originals and appends BC138–157 without moving old137 references", () => {
  expect(manifest.photos).toHaveLength(20);
  expect(manifest.duplicates).toEqual([]);
  const prior = new Set(
    readdirSync("photo-intake", { recursive: true })
      .map(String)
      .filter(
        (p) =>
          /\.jpe?g$/i.test(p) &&
          !p.startsWith("gallery-wedding-batch-1/") &&
          p !== "gallery-showroom-batch-1/existing-wedding-tropical-repeat-original.jpeg",
      )
      .map((p) => hash("photo-intake/" + p)),
  );
  for (const p of manifest.photos) {
    expect(hash(folder + p.source)).toBe(p.sha256);
    expect(prior.has(p.sha256)).toBe(false);
    expect(p.crop).toBeUndefined();
  }
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(20);
  expect(galleryWeddingMedia.map((p) => p.reference)).toEqual(
    Array.from({ length: 20 }, (_, i) => `BC-${138 + i}`),
  );
  expect(galleryMedia).toHaveLength(351);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(351);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 351 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
  expect(galleryMedia.find((p) => p.id === "wedding")?.reference).toBe("BC-01");
  expect(galleryMedia.find((p) => p.id === "proposal-red-lantern-ring")?.reference).toBe("BC-137");
  expect(
    readGalleryShortlist('["wedding","proposal-red-lantern-ring","naming-gold-silver-balloons"]'),
  ).toEqual(["wedding", "proposal-red-lantern-ring", "naming-gold-silver-balloons"]);
});
it("keeps exactly one Wedding parent with ordered Mehndi7,Haldi6,Stage6,Entrance2 chapters, and three representative previews", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  const wedding = sections.find((p) => p.id === "wedding")!;
  expect(wedding.items).toHaveLength(21);
  const chapters = weddingChapters(galleryMedia);
  expect(chapters.map((p) => [p.id, p.items.length])).toEqual([
    ["mehndi", 7],
    ["haldi", 6],
    ["stage", 6],
    ["entrance", 2],
  ]);
  expect(new Set(chapters.flatMap((p) => p.items.map((q) => q.id))).size).toBe(21);
  expect(weddingPreview(wedding.items).map((p) => weddingPart(p).id)).toEqual([
    "mehndi",
    "haldi",
    "stage",
  ]);
  expect(sections.reduce((n, p) => n + Math.min(p.initial, p.items.length), 0)).toBe(62);
  for (const [id, n] of [
    ["proposal", 21],
    ["naming-ceremony", 20],
    ["anniversary", 20],
    ["first-night", 41],
    ["room-surprise", 21],
    ["baby-shower", 18],
    ["welcome-baby", 17],
    ["kids-birthday", 14],
    ["birthday", 7],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(n);
  expect(weddingPart(galleryWeddingMedia[13]!).id).toBe("haldi");
});
it("automatically scopes Wedding viewers to their own chapter and names the chapter in meaningful enquiries", () => {
  for (const p of galleryWeddingMedia) {
    expect(p.occasion).toBe("Wedding");
    expect(p.group).toBe("Love & weddings");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(
      p.weddingPart === "mehndi" ? 7 : p.weddingPart === "entrance" ? 2 : 6,
    );
    expect(
      viewer.every((q) => q.occasion === "Wedding" && weddingPart(q).id === p.weddingPart),
    ).toBe(true);
    expect(galleryMessage([p])).toContain(`${p.reference} · Wedding / ${weddingPart(p).name}`);
  }
  const selected = galleryWeddingMedia.filter((p) => ["BC-139", "BC-142"].includes(p.reference));
  const chapters = weddingChapters(selected);
  expect(chapters.map((p) => p.id)).toEqual(["mehndi", "haldi"]);
  expect(collectionViewerItems(selected[0]!.id, selected)).toHaveLength(1);
  expect(weddingChapters([])).toEqual([]);
});
it("preserves every full scene and mark, corrects only the sideways stage, and leaves home/circles/covers alone", () => {
  expect(manifest.photos.filter((p: { rotate: number }) => p.rotate)).toHaveLength(1);
  const p = manifest.photos.find((p: { rotate: number }) => p.rotate);
  expect(p.reference).toBe("BC-141");
  expect(p.rotate).toBe(90);
  expect(galleryWeddingMedia.find((p) => p.reference === "BC-141")).toMatchObject({
    width: 1308,
    height: 736,
  });
  expect(galleryWeddingMedia.filter((p) => p.width > p.height)).toHaveLength(2);
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryWeddingMedia) expect(code).not.toContain(p.id);
  }
  for (const p of galleryWeddingMedia)
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /verified|our work|our client|fresh|safely|WedMeGood/i,
    );
});
