import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryShowroomMedia } from "./gallery-showroom";
import { galleryMedia, galleryMessage } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
import { weddingChapters } from "./gallery-wedding-groups";
const folder = "photo-intake/gallery-showroom-batch-1/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
const hash = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");
it("retains18 originals, adds17 new BC158–174, and leaves the exact BC145 repeat in Wedding only", () => {
  expect(manifest.photos).toHaveLength(17);
  expect(manifest.duplicates).toHaveLength(1);
  const prior = new Set(
    readdirSync("photo-intake", { recursive: true })
      .map(String)
      .filter((p) => /\.jpe?g$/i.test(p) && !p.startsWith("gallery-showroom-batch-1/"))
      .map((p) => hash("photo-intake/" + p)),
  );
  for (const p of [...manifest.photos, ...manifest.duplicates])
    expect(hash(folder + p.source)).toBe(p.sha256);
  for (const p of manifest.photos) {
    expect(prior.has(p.sha256)).toBe(false);
    expect(p.crop).toBeUndefined();
    expect(p.rotate).toBe(0);
  }
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(17);
  const d = manifest.duplicates[0];
  expect(readFileSync(folder + d.source)).toEqual(readFileSync(d.existingSource));
  expect(galleryMedia.filter((p) => p.id === d.existingId)).toHaveLength(1);
  expect(galleryMedia.find((p) => p.id === d.existingId)).toMatchObject({
    reference: "BC-145",
    occasion: "Wedding",
    weddingPart: "mehndi",
  });
  expect(galleryShowroomMedia.map((p) => p.reference)).toEqual(
    Array.from({ length: 17 }, (_, i) => `BC-${158 + i}`),
  );
  expect(galleryMedia).toHaveLength(247);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(247);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 247 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
  expect(galleryMedia.find((p) => p.id === "showroom-floral-display")?.reference).toBe("BC-07");
});
it("keeps Showroom18 separate with existing architectural mood and all other styles including Wedding chapters unchanged", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  const section = sections.find((p) => p.id === "showroom-setup")!;
  expect(section.items).toHaveLength(18);
  expect(section.layout).toBe("architectural");
  expect(section.radius).toBe("0 70px 0 0");
  expect(section.initial).toBe(3);
  expect(sections.reduce((n, p) => n + Math.min(p.initial, p.items.length), 0)).toBe(48);
  expect(weddingChapters(galleryMedia).map((p) => p.items.length)).toEqual([7, 6, 6, 2]);
  for (const [id, n] of [
    ["wedding", 21],
    ["proposal", 21],
    ["naming-ceremony", 20],
    ["anniversary", 20],
    ["first-night", 41],
    ["baby-shower", 18],
    ["welcome-baby", 17],
    ["kids-birthday", 14],
    ["birthday", 7],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(n);
  for (const p of galleryShowroomMedia) {
    expect(p.occasion).toBe("Showroom Setup");
    expect(p.group).toBe("Work & events");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(18);
    expect(viewer.every((q) => q.occasion === "Showroom Setup")).toBe(true);
  }
  const m = galleryMessage([galleryShowroomMedia[0]!, galleryShowroomMedia[16]!]);
  expect(m).toContain("BC-158 · Showroom Setup");
  expect(m).toContain("BC-174 · Showroom Setup");
});
it("leaves approved hero/circles/covers alone and avoids brand, personal name, client or affiliation claims", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryShowroomMedia) expect(code).not.toContain(p.id);
  }
  for (const p of galleryShowroomMedia) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /Homes\.com|Dior|benefit|Corona|Aimee|Tanisorn|house of cb|Moet|Black Friday|our client|verified|fresh flowers|safely/i,
    );
  }
  expect(galleryShowroomMedia.filter((p) => p.width > p.height)).toHaveLength(1);
});
