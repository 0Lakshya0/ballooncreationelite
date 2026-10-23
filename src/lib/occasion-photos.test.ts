import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { occasionEntries } from "./occasion-entries";
import { realOccasionPhotos } from "./occasion-photos";
const selection = JSON.parse(
  readFileSync("photo-intake/homepage-real/circle-selection.json", "utf8"),
);

it("replaces only the 16 matching circle portraits and reports the three missing photos", () => {
  expect(Object.keys(realOccasionPhotos)).toEqual(Object.keys(selection.matches));
  expect(Object.keys(realOccasionPhotos)).toHaveLength(16);
  const missing = occasionEntries.filter((entry) => !realOccasionPhotos[entry.slug]);
  expect(missing.map((entry) => entry.slug)).toEqual(selection.missing);
  expect(missing.map((entry) => entry.name)).toEqual([
    "Birthday",
    "Kids Birthday",
    "Showroom Setup",
  ]);
  for (const [slug, image] of Object.entries(realOccasionPhotos)) {
    expect(occasionEntries.some((entry) => entry.slug === slug)).toBe(true);
    expect(image).toContain(`/occasion-real/${slug}.webp`);
    const bytes = readFileSync(`src/assets/occasion-real/${slug}.webp`);
    expect(bytes.toString("ascii", 0, 4)).toBe("RIFF");
    expect(bytes.toString("ascii", 8, 12)).toBe("WEBP");
  }
});
it("maps aliases and the baby cradle deliberately without misusing the product-launch photo", () => {
  expect(selection.matches.proposal).toBe("proposal-garden");
  expect(selection.matches["room-surprise"]).toBe("proposal-room");
  expect(selection.matches["pet-decoration"]).toBe("pet-themed-celebration");
  expect(selection.matches["annual-day-function"]).toBe("annual-day");
  expect(selection.matches["naming-ceremony"]).toBe("floral-swing");
  expect(Object.values(selection.matches)).not.toContain("product-launch");
  expect(JSON.stringify(selection.matches)).not.toMatch(/exhibition|category-19/);
});
it("uses the real portraits only in circles, retains fallback photos, routes and bounded press motion", () => {
  const component = readFileSync("src/components/balloon/category-marquee.tsx", "utf8");
  expect(component).toContain("realOccasionPhotos[slug] ??");
  expect(component).toContain("/src/assets/categories/category-");
  expect(component).toContain('to="/creations/$slug"');
  expect(component).toContain("bindCategoryMotion(carousel)");
  expect(component).toContain("stopOnMouseEnter: false");
  expect(component).toContain("data-occasion-photo={slug}");
});
it("removes the compounded low-opacity hero mask without changing the global gold shader", () => {
  const css = readFileSync("src/components/balloon/site-liquid-background.css", "utf8");
  expect(css).toMatch(/\.site-liquid-shell \.hero-slide\.is-active\s*\{\s*opacity: 1;/);
  expect(css).toContain("mask-image: linear-gradient(90deg, #000c, #000 58%)");
  expect(css).toContain("mask-image: linear-gradient(180deg, #000e, #000 50%)");
  expect(css).not.toContain("opacity: 0.68");
  expect(css).toContain("opacity: 0.94");
  expect(css).toContain("opacity: 0.52");
  expect(css).toContain("opacity: 0.58");
});
