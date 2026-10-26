/** Run after native + phone builds; no network, browser, inference or external dependencies. */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import vm from "node:vm";

const raster = /\.(?:webp|avif|jpe?g|png|gif)$/;
const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const originalFiles = walk("src/assets").filter(
  (file) =>
    (/\/(?:gallery-[^/]+|homepage-real|occasion-real)\//.test(file) && raster.test(file)) ||
    file.endsWith("/brand-logo.png"),
);
const allowed = new Set(originalFiles.map((file) => hash(fs.readFileSync(file))));
// Documented crop of the supplied wedding-stage-white-circle.webp, not an arbitrary public image.
const suppliedCoverHash = "084584ac549667f2e3ddf95e96786cc11debff09136c5abf345c89e02d922fc7";
if (hash(fs.readFileSync("public/og-cover.jpg")) !== suppliedCoverHash)
  throw new Error(
    "Share-cover provenance changed: verify its supplied source and update the record.",
  );
allowed.add(suppliedCoverHash);

const assets = walk(".output/public").filter((file) => raster.test(file));
const unknown = assets.filter((file) => !allowed.has(hash(fs.readFileSync(file))));
if (unknown.length) throw new Error(`Unapproved production photography: ${unknown.join(", ")}`);

const phone = fs.readFileSync("drafts/main-website-phone.html", "utf8");
const images = [
  ...phone.matchAll(/data:image\/(webp|avif|jpeg|jpg|png|gif);base64,([A-Za-z0-9+/=]+)/g),
];
if (!images.length) throw new Error("Phone build has no embedded raster assets.");
const embeddedHashes = images.map((image) => hash(Buffer.from(image[2], "base64")));
if (embeddedHashes.some((value) => !allowed.has(value)))
  throw new Error(
    "The phone build embeds a raster asset outside the supplied-photo/brand allowlist.",
  );
for (const script of phone.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))
  new vm.Script(script[1]);
const source = phone.match(/name="bce-source-commit" content="([^"]+)"/)?.[1];
if (!source) throw new Error("Phone source-commit metadata is missing.");
console.log(
  JSON.stringify(
    {
      productionRasterAssets: assets.length,
      embeddedRasterAssets: images.length,
      uniqueEmbeddedHashes: new Set(embeddedHashes).size,
      unknown,
      phoneBytes: Buffer.byteLength(phone),
      source,
      inlineJavaScriptSyntax: "PASS",
      note: "Raster counts include supplied photo variants and the approved brand logo, not gallery memberships.",
    },
    null,
    2,
  ),
);
