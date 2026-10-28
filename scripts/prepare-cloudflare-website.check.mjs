import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  prepareCloudflareWebsite,
  checkStaticAssets,
  FREE_ASSET_LIMITS,
} from "./prepare-cloudflare-website.mjs";
const roots = [];
afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "balloon-hosting-"));
  roots.push(root);
  fs.mkdirSync(path.join(root, ".output/server"), { recursive: true });
  fs.mkdirSync(path.join(root, ".output/public/assets"), { recursive: true });
  fs.writeFileSync(path.join(root, ".output/server/index.mjs"), "export default {};");
  fs.writeFileSync(path.join(root, ".output/public/assets/test.webp"), "supplied-test");
  const config = {
    name: "0lakshya0-ballooncreationelite",
    main: "index.mjs",
    assets: { binding: "ASSETS", directory: "../public" },
    compatibility_flags: ["nodejs_compat"],
    no_bundle: true,
    rules: [{ type: "ESModule", globs: ["**/*.mjs", "**/*.js"] }],
  };
  function write(value = config) {
    fs.writeFileSync(path.join(root, ".output/server/wrangler.json"), JSON.stringify(value));
  }
  write();
  return { root, config, write };
}
test("uses the website name, enables the public URL and preserves generated Nitro settings", () => {
  const { root, config } = fixture();
  const report = prepareCloudflareWebsite(root);
  assert.equal(report.worker, "balloon-creation");
  assert.equal(report.workersDevEnabled, true);
  assert.equal(report.files, 1);
  const actual = JSON.parse(
    fs.readFileSync(path.join(root, ".output/server/wrangler.json"), "utf8"),
  );
  assert.deepEqual(actual, { ...config, name: "balloon-creation", workers_dev: true });
  assert.deepEqual(prepareCloudflareWebsite(root), report);
});
test("requires a real native production build", () => {
  const { root } = fixture();
  fs.unlinkSync(path.join(root, ".output/server/wrangler.json"));
  assert.throws(() => prepareCloudflareWebsite(root), /missing/);
});
test("never modifies an assistant configuration", () => {
  const { root, config, write } = fixture();
  write({ ...config, name: "ballooncreation-assistant" });
  assert.throws(() => prepareCloudflareWebsite(root), /assistant/);
});
test("rejects an unexpected server entry", () => {
  const { root, config, write } = fixture();
  write({ ...config, main: "worker.js" });
  assert.throws(() => prepareCloudflareWebsite(root), /entry point/);
});
test("refuses to deploy an unrelated asset directory", () => {
  const { root, config, write } = fixture();
  write({ ...config, assets: { binding: "ASSETS", directory: "../../drafts" } });
  assert.throws(() => prepareCloudflareWebsite(root), /asset binding or directory/);
});
test("keeps per-file uploads within 25 MiB without publishing the portable phone HTML", () => {
  const { root } = fixture();
  const file = path.join(root, ".output/public/phone.html");
  fs.closeSync(fs.openSync(file, "w"));
  fs.truncateSync(file, FREE_ASSET_LIMITS.bytes + 1);
  assert.throws(() => prepareCloudflareWebsite(root), /file limit/);
});
test("enforces the free asset count", () => {
  const { root } = fixture();
  assert.throws(
    () => checkStaticAssets(path.join(root, ".output/public"), { files: 0, bytes: 100 }),
    /asset-count/,
  );
});
