import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { galleryProposalMedia } from "./gallery-proposal";
import { galleryMedia, galleryMessage } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
const folder = "photo-intake/gallery-proposal-batch-1/";
const manifest = JSON.parse(readFileSync(folder + "selection.json", "utf8"));
const hash = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");
it("retains20 originals, appends19 unique BC119–137 and omits the byte-identical BC05 repeat", () => {
  expect(manifest.photos).toHaveLength(19);
  expect(manifest.duplicates).toHaveLength(1);
  const prior = new Set(
    readdirSync("photo-intake", { recursive: true })
      .map(String)
      .filter(
        (p) =>
          /\.jpe?g$/i.test(p) &&
          !p.startsWith("gallery-proposal-batch-1/") &&
          !p.startsWith("gallery-first-night-batch-3/existing-proposal-"),
      )
      .map((p) => hash("photo-intake/" + p)),
  );
  for (const p of [...manifest.photos, ...manifest.duplicates])
    expect(hash(folder + p.source)).toBe(p.sha256);
  for (const p of manifest.photos) expect(prior.has(p.sha256)).toBe(false);
  expect(new Set(manifest.photos.map((p: { sha256: string }) => p.sha256)).size).toBe(19);
  const d = manifest.duplicates[0];
  expect(readFileSync(folder + d.source)).toEqual(readFileSync(d.existingSource));
  expect(hash(d.existingSource)).toBe(d.existingSHA256);
  expect(galleryMedia.filter((p) => p.id === d.existingId)).toHaveLength(1);
  expect(galleryMedia.find((p) => p.id === d.existingId)?.reference).toBe("BC-05");
  expect(galleryProposalMedia.map((p) => p.reference)).toEqual(
    Array.from({ length: 19 }, (_, i) => `BC-${119 + i}`),
  );
  expect(galleryMedia).toHaveLength(300);
  expect(new Set(galleryMedia.map((p) => p.id)).size).toBe(300);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 300 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
  expect(galleryMedia.find((p) => p.id === "proposal-rose-sparkle")?.reference).toBe("BC-31");
  expect(galleryMedia.find((p) => p.id === "naming-gold-silver-balloons")?.reference).toBe(
    "BC-118",
  );
});
it("keeps21 Proposal images independent, preserves all other styles and scopes three-digit enquiries", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  const proposal = sections.find((p) => p.id === "proposal")!;
  expect(proposal.items).toHaveLength(21);
  expect(proposal.layout).toBe("romantic");
  expect(proposal.radius).toBe("140px 140px 4px 4px");
  expect(proposal.initial).toBe(3);
  expect(sections.reduce((n, p) => n + Math.min(p.initial, p.items.length), 0)).toBe(54);
  for (const [id, n] of [
    ["anniversary", 20],
    ["first-night", 41],
    ["room-surprise", 1],
    ["naming-ceremony", 20],
    ["baby-shower", 18],
    ["welcome-baby", 17],
    ["kids-birthday", 14],
    ["birthday", 7],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(n);
  for (const p of galleryProposalMedia) {
    expect(p.occasion).toBe("Proposal");
    expect(p.group).toBe("Love & weddings");
    const viewer = collectionViewerItems(p.id, galleryMedia);
    expect(viewer).toHaveLength(21);
    expect(viewer.every((q) => q.occasion === "Proposal")).toBe(true);
  }
  const m = galleryMessage([galleryProposalMedia[0]!, galleryProposalMedia[18]!]);
  expect(m).toContain("BC-119 · Proposal");
  expect(m).toContain("BC-137 · Proposal");
});
it("keeps home/circle/covers unchanged and does not infer venue, photographer, fresh material, ownership or safety", () => {
  for (const name of ["hero-slides", "occasion-photos", "supplied-occasion-photos"]) {
    const code = readFileSync(`src/lib/${name}.ts`, "utf8");
    for (const p of galleryProposalMedia) expect(code).not.toContain(p.id);
  }
  for (const p of galleryProposalMedia) {
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
    expect(`${p.title} ${p.detail}`).not.toMatch(
      /Bali|Toronto|Nashville|Andrea|Salazar|Mimz|Henchill|verified|our work|fresh|safely/i,
    );
  }
  expect(galleryProposalMedia.filter((p) => p.width > p.height)).toHaveLength(1);
});
