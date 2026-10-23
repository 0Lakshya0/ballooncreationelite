import { readFileSync, existsSync } from "node:fs";
import { expect, it } from "vitest";
import { heroSlides } from "./hero-slides";
const selection = JSON.parse(readFileSync("photo-intake/homepage-real/selection.json", "utf8"));
it("uses only selected uploaded photos with unique stable IDs and no generated fallback slides", () => {
  expect(heroSlides).toHaveLength(17);
  expect(new Set(heroSlides.map((slide) => slide.id)).size).toBe(17);
  expect(heroSlides.map((slide) => slide.id)).toEqual(
    selection.photos.map((photo: { id: string }) => photo.id),
  );
  for (const slide of heroSlides) {
    expect(slide.image).toContain(`/homepage-real/${slide.id}.webp`);
    expect(slide.width).toBeGreaterThan(0);
    expect(slide.height).toBeGreaterThan(0);
    expect(slide.position).toMatch(/^\d+% \d+%$/);
    expect(slide.mobilePosition).toMatch(/^\d+% \d+%$/);
    const bytes = readFileSync(`src/assets/homepage-real/${slide.id}.webp`);
    expect(bytes.toString("ascii", 0, 4)).toBe("RIFF");
    expect(bytes.toString("ascii", 8, 12)).toBe("WEBP");
  }
  expect(readFileSync("src/lib/hero-slides.ts", "utf8")).not.toMatch(
    /assets\/(?:categories|birthday|wedding|anniversary|baby-shower|devotional|celebration-hero)/,
  );
});
it("keeps the sideways supplied wedding photo upright without painting/replacing its content", () => {
  const wedding = heroSlides.find((slide) => slide.id === "wedding")!;
  expect(wedding.width).toBe(1307);
  expect(wedding.height).toBe(736);
  expect(selection.photos.find((p: { id: string }) => p.id === "wedding").rotate).toBe(90);
});
it("does not reinstate the removed exhibition service through the uploaded batch", () => {
  expect(selection.excluded).toHaveLength(1);
  expect(selection.excluded[0].source).toBe("7f1242acc3533637e515de145c25f3c4.jpg");
  expect(JSON.stringify(heroSlides)).not.toMatch(/exhibition|7f1242acc3533637e515de145c25f3c4/);
  expect(existsSync("src/assets/homepage-real/exhibition.webp")).toBe(false);
});
it("preserves original rotation/fade/drift and responsive focal-point wiring", () => {
  const page = readFileSync("src/routes/index.tsx", "utf8");
  const css = readFileSync("src/styles.css", "utf8");
  expect(page).toContain("% heroSlides.length), 5000");
  expect(page).toContain('"--hero-position": s.position');
  expect(page).toContain('"--hero-mobile-position": s.mobilePosition');
  expect(page).toContain("key={s.id}");
  expect(css).toContain("transition: opacity 1.4s ease-in-out");
  expect(css).toContain("animation: royal-drift 22s ease-in-out infinite alternate");
});
