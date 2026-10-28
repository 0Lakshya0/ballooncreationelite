/** Prepare only the native customer website's generated Worker config; never the assistant. */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const WEBSITE_WORKER_NAME = "balloon-creation";
export const FREE_ASSET_LIMITS = { files: 20_000, bytes: 25 * 1024 * 1024 };

export function checkStaticAssets(directory, limits = FREE_ASSET_LIMITS) {
  let files = 0;
  let largestBytes = 0;
  function visit(folder) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile()) {
        const bytes = fs.statSync(file).size;
        files += 1;
        largestBytes = Math.max(largestBytes, bytes);
        if (bytes > limits.bytes)
          throw new Error(
            `Static asset exceeds the free hosting file limit: ${path.relative(directory, file)}`,
          );
      } else throw new Error("Unexpected non-file asset in the website output.");
    }
  }
  visit(directory);
  if (files > limits.files)
    throw new Error("Website output exceeds the free hosting asset-count limit.");
  return { files, largestBytes };
}

export function prepareCloudflareWebsite(root = process.cwd()) {
  const server = path.join(root, ".output/server");
  const file = path.join(server, "wrangler.json");
  if (!fs.existsSync(file))
    throw new Error("Native Worker configuration is missing. Run the Vite production build first.");
  const config = JSON.parse(fs.readFileSync(file, "utf8"));
  if (config.name === "ballooncreation-assistant")
    throw new Error("Refusing to alter the separate Bloon assistant Worker.");
  if (config.main !== "index.mjs" || !fs.existsSync(path.join(server, "index.mjs")))
    throw new Error("Unexpected native website entry point.");
  const publicDirectory = path.join(root, ".output/public");
  if (
    config.assets?.binding !== "ASSETS" ||
    path.resolve(server, config.assets.directory ?? "") !== path.resolve(publicDirectory)
  )
    throw new Error("Unexpected website asset binding or directory.");
  const assets = checkStaticAssets(publicDirectory);
  config.name = WEBSITE_WORKER_NAME;
  // The cancelled bootstrap project has no public URL yet. Deploying this config enables it.
  config.workers_dev = true;
  fs.writeFileSync(file, JSON.stringify(config, null, 2) + "\n");
  return { worker: config.name, workersDevEnabled: config.workers_dev, ...assets };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  console.log("Cloudflare website output ready:", prepareCloudflareWebsite());
}
