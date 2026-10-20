import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const dir = path.join(root, "mockups/main-phone");
const dataUri = (file: string, mime: string) =>
  `data:${mime};base64,${fs.readFileSync(file).toString("base64")}`;
const photos = Object.fromEntries(
  fs
    .readdirSync("public/decor-types")
    .filter((f) => /\.jpg$/.test(f))
    .map((f) => [f, dataUri(`public/decor-types/${f}`, "image/jpeg")]),
);
const fonts = Object.fromEntries(
  fs
    .readdirSync("public/decor-types/fonts")
    .filter((f) => /\.woff2$/.test(f))
    .map((f) => [f, dataUri(`public/decor-types/fonts/${f}`, "font/woff2")]),
);
const thumbs = Object.fromEntries(
  fs
    .readdirSync("src/assets/categories")
    .filter((f) => f.endsWith(".webp"))
    .map((f) => [
      "/src/assets/categories/" + f,
      dataUri("src/assets/categories/" + f, "image/webp"),
    ]),
);
function portablePhoneView(): Plugin {
  return {
    name: "portable-native-phone-view",
    enforce: "pre",
    resolveId(source, importer) {
      if (importer?.endsWith("/src/routeTree.gen.ts") && source === "./routes/__root")
        return path.join(dir, "root.tsx");
    },
    transform(source, id) {
      if (id.includes("/src/assets/profile-logo.jpg.asset.json")) return undefined;
      if (
        id.endsWith("/category-marquee.tsx") ||
        id.endsWith("/hero-slides.ts") ||
        id.endsWith("/celebrations.ts") ||
        id.endsWith("/service-details.ts")
      ) {
        const glob =
          "import.meta.glob<string>('/src/assets/categories/*.webp', { eager: true, import: 'default' })";
        if (!source.includes(glob))
          throw new Error("Category photo glob changed; update the phone adapter.");
        return source.replace(glob, JSON.stringify(thumbs));
      }
      if (id.endsWith("/DecorTypesSection.tsx")) {
        const expected =
          'const resolveImg = (src: string, base: string) =>\n  src.startsWith("img/") ? `${base}/${src.slice(4)}` : src;';
        if (!source.includes(expected))
          throw new Error("Approved image resolver changed; update the phone adapter.");
        return (
          `const phonePhotos: Record<string,string> = ${JSON.stringify(photos)};\n` +
          source.replace(
            expected,
            'const resolveImg = (src: string, _base: string) => phonePhotos[src.replace(/^img\\//, "")] ?? src;',
          )
        );
      }
      if (id.endsWith("/src/components/balloon/concierge.tsx")) {
        return source.replace('pattern="[+0-9 ()\\-]{10,20}"', 'pattern="[+0-9 \\(\\)\\-]{10,20}"');
      }
      if (id.endsWith("/decor-collections-button.tsx")) {
        return source
          .replaceAll("/decor-types/balloon-decor.jpg", photos["balloon-decor.jpg"]!)
          .replaceAll("/decor-types/floral-decor.jpg", photos["floral-decor.jpg"]!);
      }
      if (id.endsWith(".css"))
        return source.replace(
          /\/decor-types\/fonts\/([^"')\s]+)/g,
          (_all, name: string) => fonts[name] ?? _all,
        );
      if (
        id.endsWith("/src/routes/index.tsx") ||
        id.endsWith("/about/AboutUsPage.tsx") ||
        id.endsWith("/site-header.tsx")
      )
        return source.replace(
          "const logo = logoAsset.url;",
          `const logo = ${JSON.stringify(dataUri("public/favicon.png", "image/png"))};`,
        );
      if (id.endsWith("/src/routes/decor-collections.tsx"))
        return source.replace(
          'href="/"',
          'href="#" onClick={(event) => { event.preventDefault(); window.dispatchEvent(new Event("phone:home")); }}',
        );
    },
  };
}
export default defineConfig({
  root: dir,
  publicDir: path.join(root, "public"),
  base: "./",
  envPrefix: "PHONE_PUBLIC_",
  plugins: [portablePhoneView(), react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@/lib/concierge.functions", replacement: path.join(dir, "inquiry.ts") },
      { find: "@", replacement: path.join(root, "src") },
    ],
  },
  build: {
    outDir: path.join(root, ".cache/main-phone"),
    emptyOutDir: true,
    copyPublicDir: false,
    assetsInlineLimit: Infinity,
    cssCodeSplit: false,
    modulePreload: false,
    rolldownOptions: { output: { format: "iife", codeSplitting: false } },
  },
});
