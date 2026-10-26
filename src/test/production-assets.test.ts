import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
it("bundles the approved logo on all main headers instead of requiring a platform-private asset URL", () => {
  expect(readFileSync("src/assets/brand-logo.png")).toEqual(readFileSync("public/favicon.png"));
  for (const name of [
    "src/routes/index.tsx",
    "src/components/balloon/site-header.tsx",
    "src/components/balloon/about/AboutUsPage.tsx",
  ]) {
    const source = readFileSync(name, "utf8");
    expect(source).toContain("@/assets/brand-logo.png");
    expect(source).not.toContain("profile-logo.jpg.asset.json");
  }
});
it("previews the actual Nitro/Cloudflare output and ignores disposable bundles during lint", () => {
  expect(JSON.parse(readFileSync("package.json", "utf8")).scripts.preview).toBe(
    "node scripts/preview-production.mjs",
  );
  expect(readFileSync("scripts/preview-production.mjs", "utf8")).toContain(
    ".output/server/index.mjs",
  );
  expect(readFileSync("eslint.config.js", "utf8")).toContain('".cache/**"');
});

it("sends the decor collection planning action to the real consultation page", () => {
  const source = readFileSync("src/components/balloon/decor/DecorTypesSection.tsx", "utf8");
  expect(source).not.toContain('href="#concierge"');
  expect(source).toContain('to="/lets-celebrate" hash="callback"');
});

it("keeps wrapped About-page facts separated instead of touching the previous row", () => {
  const css = readFileSync("src/components/balloon/about/about.css", "utf8");
  expect(css.match(/\.ab-root \.ab-facts \{([^}]+)\}/)?.[1]).toContain("row-gap: 18px");
});
