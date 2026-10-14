// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

/**
 * Dev-only shim so the site looks complete outside Lovable's hosted preview.
 *
 * `src/assets/*.asset.json` files point at `/__l5e/assets-v1/...`, a path that
 * only Lovable's proxy (or a build served by Lovable) can resolve. When the app
 * runs on a plain dev server — this sandbox, or `npm run dev` on a laptop — that
 * request 404s, so the navbar/hero logo renders as a broken image.
 *
 * This middleware serves the bundled public copy of the same emblem for those
 * asset paths in dev only. Production builds are untouched: Lovable keeps
 * serving the real uploaded file.
 */
function lovableAssetDevFallback(): Plugin {
  const fallbackFile = "favicon.png";

  return {
    name: "lovable-asset-dev-fallback",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/__l5e/assets-v1/")) return next();

        const publicDir = server.config.publicDir ?? path.resolve(server.config.root, "public");
        const fileName = path.basename(req.url.split("?")[0] ?? "");
        const candidates = [
          path.resolve(publicDir, fileName),
          path.resolve(publicDir, fallbackFile),
        ];

        for (const file of candidates) {
          try {
            const info = await stat(file);
            if (!info.isFile()) continue;
            res.setHeader("Content-Type", "image/png");
            res.setHeader("Cache-Control", "no-store");
            return createReadStream(file).pipe(res);
          } catch {
            // try the next candidate
          }
        }

        next();
      });
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  plugins: [lovableAssetDevFallback()],
  vite: {
    server: {
      // Dev-only: allows the sandbox / hosted preview proxy host (e.g. *.e2b.app)
      // to load the dev server. Does not affect production builds.
      allowedHosts: [".e2b.app", ".arena.ai", ".lovable.app", ".lovableproject.com"],
    },
  },
});
