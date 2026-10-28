# Customer website: Cloudflare Free deployment

## Current project and source

- Website Worker: **`balloon-creation`**, separate from `ballooncreation-assistant`.
- Repository: `0Lakshya0/ballooncreationelite`.
- Production branch: **`arena/f5dd0ec5-ballooncreationelite`**. The owner confirmed saving it in Cloudflare together with the settings below. This is not independently authenticated dashboard access.
- The initial default-branch build was accidentally started and cancelled. Do not retry that old commit as the launch build. A fresh push to the selected production branch should start a new build.
- The website project exists; the last supplied dashboard showed **No URLs enabled / No active routes**. Public deployment is not confirmed by a local build or by a Git push alone.

## Saved dashboard settings

| Setting | Value |
| --- | --- |
| Root/path | `/` |
| Build command | `bun run build` |
| Deploy command | `npx wrangler deploy --config .output/server/wrangler.json --name balloon-creation` |
| Production branch | `arena/f5dd0ec5-ballooncreationelite` |
| Preview builds | Off for initial launch |
| Cloudflare Access protection | Off for the public customer site |

The dashboard-managed build token stays in Cloudflare. Do not ask for it in chat, put it in Git, or enable a paid plan. Keep the domain purchase separate from hosting; no `.in` domain has been purchased or connected in this session.

## Build preparation

`bun run build` compiles the existing native TanStack/Nitro application, then runs `scripts/prepare-cloudflare-website.mjs`. The latter changes only the generated `.output/server/wrangler.json`:

- Sets `name: "balloon-creation"` so neither the repository's old “elite” name nor the assistant project is used as the customer Worker name.
- Sets `workers_dev: true` so the bootstrap project's disabled public address is enabled on the actual deployment.
- Preserves generated module rules, `nodejs_compat`, ASSETS binding and server entry.
- Checks the public output against 20,000 files / 25 MiB per file; refuses missing/unexpected output and an assistant config. It does not upload the 51 MiB standalone phone-preview HTML. Do not copy that review artifact into `public`.

Local validation on 2026-10-28:

- Bun **1.4.4** frozen-lockfile install PASS, no dependency/lock changes.
- Production build and generated website config PASS: **412 files**, largest **707,859 bytes** at preparation time.
- Wrangler **4.154.0** actual deploy-command **dry run PASS**; **3,032.64 KiB total / 645.87 KiB gzip**, ASSETS binding present. This is packaging validation, not a real deployment or proof of Cloudflare CPU usage under live traffic.
- **7 hosting checks**, **12 supplied-photo/production-asset regressions**, TypeScript, changed-script ESLint and diff checks PASS.
- Provenance guard: **373 production raster assets**, **371 embedded review raster assets**, zero unapproved images. Existing gallery, page designs, business text, Bloon identity and phone artifact remain unchanged.

Reproduce: `npm run test:hosting`, `bun run build`, then `npx wrangler deploy --config .output/server/wrangler.json --name balloon-creation --dry-run`. Public native output and generated configs remain ignored, not committed. The actual saved Cloudflare deploy command intentionally omits `--dry-run`.

## Launch verification and pending items

After the fresh push, inspect GitHub's Cloudflare build check and/or the new build in Cloudflare. Only report success when deployment is actually confirmed. The sandbox has no Cloudflare token/session and does not directly call a paid deployment API.

Then inspect the actual public URL, mobile/desktop pages and original photos. The existing assistant is a separate deployment with an exact `ALLOWED_ORIGINS` allowlist: the new website origin may need to be added there, preserving existing origins. Do not disable CORS, widen it to `*`, replace provider keys, or claim a real AI response was tested without testing it. There is no assistant code/deployment/health/inference change in this preparation.

Inquiry database secrets are not configured in this sandbox. The existing honest reviewed WhatsApp fallback remains; do not promise private-database saving works on the new host until its server configuration is verified. Custom domain, final-domain canonical/share metadata, and `.in` renewal/payment are later steps. Free service limits and policies apply; no lifetime/no-limit guarantee or paid-plan activation is made.
