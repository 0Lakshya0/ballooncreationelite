// Run the built Cloudflare/Nitro fetch handler locally, without deploying or reading secrets into client code.
// Vite's default preview expects dist/server/server.js, but this project emits .output/server/index.mjs.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";

const { values } = parseArgs({
  options: {
    host: { type: "string", default: "0.0.0.0" },
    port: { type: "string", default: process.env.PORT || "4173" },
  },
});
const publicDir = path.resolve(".output/public");
const entry = path.resolve(".output/server/index.mjs");
try {
  await stat(entry);
} catch {
  throw new Error("Production build missing. Run npm run build before npm run preview.");
}
const { default: worker } = await import(pathToFileURL(entry).href);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};
async function asset(request) {
  if (!["GET", "HEAD"].includes(request.method))
    return new Response("Method not allowed", { status: 405 });
  let file;
  try {
    file = path.resolve(publicDir, "." + decodeURIComponent(new URL(request.url).pathname));
  } catch {
    return new Response("Bad asset path", { status: 400 });
  }
  if (!file.startsWith(publicDir + path.sep)) return new Response("Not found", { status: 404 });
  try {
    const info = await stat(file);
    if (!info.isFile()) return new Response("Not found", { status: 404 });
    const headers = {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      "Content-Length": String(info.size),
      "X-Content-Type-Options": "nosniff",
    };
    return new Response(request.method === "HEAD" ? null : await readFile(file), { headers });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", "http://" + (req.headers.host || "localhost"));
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      ...(req.method !== "GET" && req.method !== "HEAD"
        ? { body: Readable.toWeb(req), duplex: "half" }
        : {}),
    });
    const response = await worker.fetch(
      request,
      { ...process.env, ASSETS: { fetch: asset } },
      {
        waitUntil(promise) {
          Promise.resolve(promise).catch(() => console.error("Background preview task failed."));
        },
        passThroughOnException() {},
      },
    );
    const headers = Object.fromEntries(response.headers);
    if (response.headers.getSetCookie().length)
      headers["set-cookie"] = response.headers.getSetCookie();
    res.writeHead(response.status, headers);
    if (req.method === "HEAD" || !response.body) res.end();
    else
      Readable.fromWeb(response.body)
        .on("error", () => res.destroy())
        .pipe(res);
  } catch {
    console.error("Production preview request failed.");
    if (!res.headersSent) res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("The production preview could not serve this request.");
  }
});
server.listen(Number(values.port), values.host, () =>
  console.log(`Production website ready on ${values.host}:${server.address().port}`),
);
process.on("SIGTERM", () => server.close(() => process.exit(0)));
