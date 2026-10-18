/** Package the real React screens into a login-free, single-file phone view. */
import { build } from "vite";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
await build({ configFile: path.resolve("mockups/main-phone/vite.config.ts") });
const folder = ".cache/main-phone";
const assets = path.join(folder, "assets");
const names = fs.readdirSync(assets);
if (
  names.filter((n) => n.endsWith(".js")).length !== 1 ||
  names.filter((n) => n.endsWith(".css")).length !== 1
)
  throw new Error("Phone view must have exactly one JS and CSS bundle.");
const js = fs
  .readFileSync(
    path.join(
      assets,
      names.find((n) => n.endsWith(".js")),
    ),
    "utf8",
  )
  .replace(/<\/script/gi, "<\\/script");
const css = fs
  .readFileSync(
    path.join(
      assets,
      names.find((n) => n.endsWith(".css")),
    ),
    "utf8",
  )
  .replace(/<\/style/gi, "<\\/style");
if (
  /SUPABASE_SERVICE_ROLE_KEY|supabaseAdmin|submit_concierge|GEMINI_API_KEY|GROQ_API_KEY|OPENROUTER_API_KEY|ZAI_API_KEY/.test(
    js,
  )
)
  throw new Error("Private server code must not enter a public phone view.");
const commit = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
let html = fs
  .readFileSync(`${folder}/index.html`, "utf8")
  .replace(/\s*<script[^>]+src=[^>]+><\/script>/g, "")
  .replace(/\s*<link[^>]+rel="stylesheet"[^>]*>/g, "");
html = html
  .replace(
    "</head>",
    () => `<meta name="bce-source-commit" content="${commit}" /><style>${css}</style></head>`,
  )
  .replace("</body>", () => `<script>${js}</script></body>`);
fs.writeFileSync("drafts/main-website-phone.html", html);
console.log(
  `Public phone view: drafts/main-website-phone.html (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(1)} MB). All photography/fonts are embedded. Source ${commit}.`,
);
