import { readFileSync } from "node:fs";
import postcss from "postcss";
import { expect, it } from "vitest";
const main = readFileSync("src/styles.css", "utf8");
const ai = readFileSync("src/components/balloon/ai-concierge.css", "utf8");
it.each(["src/router.tsx", "mockups/main-phone/main.tsx"])(
  "%s opens destinations and hash targets instantly, without disabling restoration",
  (path) => {
    const code = readFileSync(path, "utf8");
    expect(code).toContain('scrollRestorationBehavior: "instant"');
    expect(code).toContain('defaultHashScrollIntoView: { behavior: "instant" }');
    expect(code).toContain("scrollRestoration: true");
  },
);
it.each([
  "hero-in",
  "scroll-in",
  "aura-in",
  "aura-out",
  "service-in",
  "smart-in",
  "bce-ai-panel-in",
])("%s has no translated opening frames (opacity/blur is allowed)", (name) => {
  let found = false;
  postcss.parse(main + ai).walkAtRules("keyframes", (rule) => {
    if (rule.params !== name) return;
    found = true;
    rule.walkDecls((decl) => {
      if (["transform", "translate", "top", "bottom"].includes(decl.prop))
        expect(decl.value).toBe("none");
    });
  });
  expect(found).toBe(true);
});
it.each([
  ["src/styles.css", ".motion-ready .reveal:not(.is-visible)"],
  ["src/components/balloon/about/about.css", ".ab-motion-ready .ab-reveal"],
  [
    "src/components/balloon/decor/approved-decor.css",
    '.bce-decor[data-motion="on"] .motion-reveal',
  ],
  ["src/components/balloon/site-upgrades.css", ".nav-drop-panel"],
  ["src/components/balloon/site-upgrades.css", ".creation-hover"],
])("%s keeps %s stationary before opening", (path, selector) => {
  let found = false;
  postcss.parse(readFileSync(path!, "utf8")).walkRules((rule) => {
    if (rule.selector !== selector) return;
    found = true;
    rule.walkDecls("transform", (decl) => expect(decl.value).toBe("none"));
  });
  expect(found).toBe(true);
});
it("preserves the carousel, background and mascot rather than applying a global animation kill switch", () => {
  expect(main).toContain("@keyframes royal-drift");
  expect(main).toContain("@keyframes orb-shine-loop");
  const carousel = readFileSync("src/components/balloon/category-marquee.tsx", "utf8");
  expect(carousel).toContain("speed: 0.35");
  expect(carousel).toContain("bindCategoryMotion");
  expect(ai).toContain("animation: bce-ai-panel-in");
  expect(readFileSync("src/components/balloon/ai-bloon.css", "utf8")).toContain("@keyframes");
});

it("also makes raw in-page links and search option jumps instant, not just router links", () => {
  for (const path of ["src/styles.css", "src/components/balloon/decor/approved-decor.css"]) {
    postcss.parse(readFileSync(path, "utf8")).walkDecls("scroll-behavior", (decl) => {
      expect(decl.value).toBe("auto");
    });
  }
  expect(readFileSync("mockups/main-phone/main.tsx", "utf8")).not.toContain('"smooth"');
  expect(readFileSync("src/components/balloon/smart-search.tsx", "utf8")).toContain(
    'router.navigate({ to: "/creations/$slug", params: { slug: item.slug } })',
  );
});
