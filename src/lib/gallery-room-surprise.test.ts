import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { it, expect } from "vitest";
import { galleryMedia, galleryMessage, readGalleryShortlist } from "./creation-gallery";
import { galleryCollections, collectionViewerItems } from "./gallery-collections";
import {
  collectionItems,
  collectionPresentation,
  mediaInCollection,
  roomSurpriseSharedIds,
} from "./gallery-shared-collections";
const manifest = JSON.parse(
  readFileSync("photo-intake/gallery-room-surprise-batch-1/selection.json", "utf8"),
);
it("reuses all20 exact incoming originals without any new image assets, IDs, references or primary occasion changes", () => {
  expect(manifest.photos).toEqual([]);
  expect(manifest.sharedPhotos).toHaveLength(20);
  expect(new Set(roomSurpriseSharedIds).size).toBe(20);
  expect(readdirSync("photo-intake/gallery-room-surprise-batch-1")).toEqual(["selection.json"]);
  for (const p of manifest.sharedPhotos) {
    expect(createHash("sha256").update(readFileSync(p.existingSource)).digest("hex")).toBe(
      p.sha256,
    );
    const media = galleryMedia.filter((m) => m.id === p.existingId);
    expect(media).toHaveLength(1);
    expect(media[0]).toMatchObject({
      reference: p.existingReference,
      occasion: p.existingOccasion,
    });
    expect(mediaInCollection(media[0]!, "Room Surprise")).toBe(true);
    expect(mediaInCollection(media[0]!, "Birthday")).toBe(false);
  }
  expect(galleryMedia).toHaveLength(351);
  expect(new Set(galleryMedia.map((p) => p.reference)).size).toBe(351);
  expect(galleryMedia.map((p) => p.reference).sort()).toEqual(
    Array.from({ length: 351 }, (_, i) => `BC-${String(i + 1).padStart(2, "0")}`).sort(),
  );
  expect(
    manifest.sharedPhotos.filter(
      (p: { existingOccasion: string }) => p.existingOccasion === "First Night",
    ),
  ).toHaveLength(17);
  expect(
    manifest.sharedPhotos.filter(
      (p: { existingOccasion: string }) => p.existingOccasion === "Proposal",
    ),
  ).toHaveLength(3);
});
it("gives Room Surprise21 in supplied order while keeping First Night41/Proposal21 and other collections unchanged", () => {
  const sections = galleryCollections();
  expect(sections).toHaveLength(20);
  expect(sections.find((p) => p.id === "room-surprise")).toMatchObject({
    layout: "intimate",
    radius: "18px",
    initial: 3,
  });
  const room = collectionItems("Room Surprise", galleryMedia);
  expect(room.map((p) => p.id)).toEqual(["proposal-room", ...roomSurpriseSharedIds]);
  expect(room).toHaveLength(21);
  expect(sections.reduce((n, p) => n + p.items.length, 0)).toBe(371);
  expect(new Set(sections.flatMap((p) => p.items.map((q) => q.id))).size).toBe(351);
  for (const [id, n] of [
    ["first-night", 41],
    ["proposal", 21],
    ["bachelor-party", 14],
    ["annual-day-function", 20],
    ["wedding", 21],
    ["car-decoration", 20],
    ["product-launch", 1],
  ] as const)
    expect(sections.find((p) => p.id === id)?.items).toHaveLength(n);
  expect(collectionItems("Room Surprise", [...galleryMedia].reverse()).map((p) => p.id)).toEqual(
    room.map((p) => p.id),
  );
});
it("uses the opened collection for isolated viewer/enquiries and preserves one shared favourite with contextual labels", () => {
  for (const id of ["proposal-room", ...roomSurpriseSharedIds]) {
    const viewer = collectionViewerItems(id, galleryMedia, "Room Surprise");
    expect(viewer).toHaveLength(21);
    expect(viewer.every((p) => p.occasion === "Room Surprise")).toBe(true);
    expect(viewer.map((p) => p.id)).toEqual(["proposal-room", ...roomSurpriseSharedIds]);
  }
  for (const id of roomSurpriseSharedIds) {
    const original = galleryMedia.find((p) => p.id === id)!;
    const primary = collectionViewerItems(id, galleryMedia, original.occasion);
    expect(primary).toHaveLength(original.occasion === "First Night" ? 41 : 21);
    expect(primary.every((p) => p.occasion === original.occasion)).toBe(true);
    expect(collectionPresentation(original, "Room Surprise")).toMatchObject({
      id,
      image: original.image,
      reference: original.reference,
      occasion: "Room Surprise",
    });
    expect(original.occasion).not.toBe("Room Surprise");
  }
  const id = roomSurpriseSharedIds[0]!;
  expect(readGalleryShortlist(JSON.stringify([id, id, "wedding"]))).toEqual([id, "wedding"]);
  const saved = galleryMedia
    .filter((p) => [id, "wedding"].includes(p.id))
    .map((p) => collectionPresentation(p, "Room Surprise"));
  const msg = galleryMessage(saved);
  expect(msg).toContain("BC-175 · Room Surprise");
  expect(msg).toContain("BC-01 · Wedding");
  const restricted = galleryMedia.filter((p) => roomSurpriseSharedIds.slice(0, 2).includes(p.id));
  expect(collectionViewerItems(id, restricted, "Room Surprise")).toHaveLength(2);
  expect(collectionViewerItems("missing", galleryMedia, "Room Surprise")).toEqual([]);
  expect(
    collectionViewerItems("wedding", galleryMedia, "Room Surprise").every(
      (p) => p.occasion === "Wedding",
    ),
  ).toBe(true);
});
