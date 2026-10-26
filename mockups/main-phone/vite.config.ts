import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const dir = path.join(root, "mockups/main-phone");
const dataUri = (file: string, mime: string) =>
  `data:${mime};base64,${fs.readFileSync(file).toString("base64")}`;
const fonts = Object.fromEntries(
  fs
    .readdirSync("public/decor-types/fonts")
    .filter((f) => /\.woff2$/.test(f))
    .map((f) => [f, dataUri(`public/decor-types/fonts/${f}`, "font/woff2")]),
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
      if (id.endsWith("/src/components/balloon/concierge.tsx")) {
        return source.replace('pattern="[+0-9 ()\\-]{10,20}"', 'pattern="[+0-9 \\(\\)\\-]{10,20}"');
      }
      if (id.endsWith(".css"))
        return source.replace(
          /\/decor-types\/fonts\/([^"')\s]+)/g,
          (_all, name: string) => fonts[name] ?? _all,
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
