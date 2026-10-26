import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

let directory, child, origin;
before(async () => {
  directory = await mkdtemp(join(tmpdir(), "balloon-preview-"));
  await mkdir(join(directory, ".output/server"), { recursive: true });
  await mkdir(join(directory, ".output/public"), { recursive: true });
  await writeFile(join(directory, ".output/private.txt"), "NOT PUBLIC");
  await writeFile(join(directory, ".output/public/style.css"), "body{color:gold}");
  await writeFile(
    join(directory, ".output/server/index.mjs"),
    `export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      if (url.pathname === '/_echo') return Response.json({method:request.method, body:await request.text(), url:request.url});
      if (url.pathname === '/_cookies') {
        const headers=new Headers(); headers.append('Set-Cookie','one=1; Path=/'); headers.append('Set-Cookie','two=2; Path=/');
        return new Response('cookies',{headers});
      }
      return env.ASSETS.fetch(request);
    }
  };`,
  );
  child = spawn(
    process.execPath,
    [
      new URL("./preview-production.mjs", import.meta.url).pathname,
      "--host",
      "0.0.0.0",
      "--port",
      "0",
    ],
    { cwd: directory, stdio: ["ignore", "pipe", "pipe"] },
  );
  origin = await new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => reject(new Error("Preview did not start")), 10000);
    child.stdout.on("data", (data) => {
      output += data;
      const port = output.match(/ready on 0\.0\.0\.0:(\d+)/)?.[1];
      if (port) {
        clearTimeout(timer);
        resolve(`http://127.0.0.1:${port}`);
      }
    });
    child.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Preview exited ${code}`));
    });
  });
});
after(async () => {
  if (child && child.exitCode === null) {
    child.kill("SIGTERM");
    await once(child, "exit");
  }
  if (directory) await rm(directory, { recursive: true, force: true });
});

test("serves bundled public assets with correct content type and HEAD semantics", async () => {
  const get = await fetch(`${origin}/style.css`);
  assert.equal(get.status, 200);
  assert.match(get.headers.get("content-type"), /text\/css/);
  assert.equal(await get.text(), "body{color:gold}");
  const head = await fetch(`${origin}/style.css`, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
});
test("streams POST bodies and query strings to the actual worker handler", async () => {
  const response = await fetch(`${origin}/_echo?test=1`, { method: "POST", body: "test body" });
  const result = await response.json();
  assert.equal(result.method, "POST");
  assert.equal(result.body, "test body");
  assert.equal(result.url, `${origin}/_echo?test=1`);
});
test("preserves separate Set-Cookie headers", async () => {
  const response = await fetch(`${origin}/_cookies`);
  assert.deepEqual(response.headers.getSetCookie(), ["one=1; Path=/", "two=2; Path=/"]);
});
test("returns missing assets as 404 and prevents public-directory traversal", async () => {
  assert.equal((await fetch(`${origin}/missing.css`)).status, 404);
  const response = await fetch(`${origin}/%2e%2e%2fprivate.txt`);
  assert.equal(response.status, 404);
  assert.notEqual(await response.text(), "NOT PUBLIC");
});
test("does not treat asset POST requests as readable static files", async () => {
  assert.equal((await fetch(`${origin}/style.css`, { method: "POST" })).status, 405);
});
