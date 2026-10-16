# Approved decor design — homepage entry and full-site liquid background

## Current placement (corrected to the owner's instruction)

The collection is **not embedded between homepage sections**. The original `FLOWERS ✦ BALLOONS ✦ MEMORIES` text in the service strip is replaced by a clearly actionable **Explore decor styles** link-button. Paired photos, a champagne/rose finish, travelling highlight, raised hover and arrow communicate that it is clickable. It opens `/decor-collections` through native TanStack routing.

The collection route preserves the approved editorial English design: 25 styles, 150 fully detailed options, photographed chips, round option portraits, selection/WhatsApp actions and raised-photo liquid effects. Its header offers a back-to-home link and the exact subtitle “We decorate your happiness”. There is no iframe, injected standalone runtime or catalogue on `/`.

The existing homepage hero/slideshow, category carousel, gallery, search, service areas, signature standard and concierge remain in place. The extra collection navbar anchor from the earlier integration has been removed.

## Full-home animation

`SiteLiquidBackground` provides **one fixed viewport-sized WebGL surface** behind the entire homepage, from header/hero through gallery, standards, enquiry and footer. It reuses the exact approved English fragment shader and the existing bounded/disposable renderer, not an approximate CSS replacement. The same cream → champagne → rose fade uses the approved gradients, easing, keyframe positions and opacity strengths. A light pearl finish softens highlights for readability. The hero photography is gently masked so the fluid remains visible, and previously opaque section backgrounds now let it show through.

A pause/resume control is always available. Its saved setting (`bce-site-motion`) is separate from the collection's local setting. The renderer stops when the document is hidden, respects reduced motion, handles context restoration, and is disposed on navigation away from home. A warm CSS fallback remains usable without WebGL or if the optional renderer chunk fails to load. The existing renderer caps drawing buffers at 800×900 and updates at most 30fps. Only one home background canvas is needed, regardless of page length.

The site's intended Manrope/Cormorant fonts are served locally from the existing licensed bundle. Photography and text remain above the decorative, pointer-transparent background. Controls/forms keep readable warm glass surfaces.

## Source and regeneration

- Entry button: `src/components/balloon/decor-collections-button.tsx` and its stylesheet.
- Home material: `src/components/balloon/site-liquid-background.tsx` and its stylesheet.
- Homepage: `src/routes/index.tsx`.
- Separate collection route: `src/routes/decor-collections.tsx`.
- Approved collection source: `mockups/final/decor-types-final.html` and `mockups/_english_liquid_gold.py`.
- Native collection: `src/components/balloon/decor/DecorTypesSection.tsx`.
- Generated data/CSS/shader: `decor-data.ts`, `approved-decor.css`, `liquid-shader.ts` in that folder.
- Bundled photos/fonts: `public/decor-types/` (licenses included).

Run `node scripts/sync-decor-design.mjs` from the repository root to regenerate the approved catalogue, scoped CSS, shader and assets. It never writes standalone drafts. Do not edit generated CSS by hand. The old `mockups/site-ready/decorTypesData.ts` supplies compatible types/group identities only, not the approved design/content.

The homepage and collection share the existing singleton visibility observer. The homepage's fixed surface is always in view; collection scenes are independently viewport-gated. Radix handles collection modal focus/scroll locking; the collection selection tray remains local to that page.

## Verification

```sh
npx tsc --noEmit
npm test
npm run build
```

15 unit tests cover both routes, the corrected entry placement, exact approved data/shader, all 150 option-detail openings, palette consistency and global background pause/reduced-motion/visibility/disposal. ESLint is also run on the new handwritten TypeScript files.

Real Chromium checks cover:

- No inline collection or stale `#decor-types` homepage navbar link; entry button occupies the original strip position.
- Homepage and collection widths 320, 390, 520, 768, 1024 and 1440px without document horizontal overflow.
- Original homepage gallery, search, service-area button and concierge retained.
- A single fixed background across the homepage; transparent section surfaces; cream/champagne/rose keyframes sampled in-browser.
- Pause/resume, separate saved setting, visibility suspension, WebGL context loss/restoration, reduced motion and no-WebGL fallback.
- SPA entry/back navigation, clean background remount and native collection options/modals.
- Collection photo-island geometry at 390/1440px, rich details, focus trap, Escape/back/focus return, WhatsApp selection, offscreen pause and context restoration were rechecked against the new collection route, alongside the unit tests.

Desktop/mobile screenshots are reviewed. No real enquiry is submitted to the production database during UI testing. Existing build warnings about Vite paths, concierge validator deprecation and chunk size are outside this change.

## Separate previews and publishing

- Main React website: `npm run dev -- --host 0.0.0.0 --port 8080`.
- Approved English standalone: `python3 mockups/_serve.py 8090 mockups/final-english-showcase`.
- Separate bilingual page: `python3 mockups/_serve.py 8091 mockups/final-showcase`.

The original integration left standalone pages unchanged. Subsequent approved readability refinements update only English; bilingual remains separate and unchanged. The former standalone phone snapshot https://clck.ru/3WX5uf is not the latest English revision or a phone link to the integrated React website. Production-domain publishing is separate: a successful build or Arena-branch push does not itself verify deployment.

## Latest main-site phone view

Updated public phone view: **https://clck.ru/3WXBhx**, pinned to `432483d96c429a8fe62da11f29e32bd151f9f33e`. It uses the native homepage/collection components from source revision `72e39ab`, including the three-layer salesman search, unchanged typewriter/design and no sentence backplates. See `PHONE-VIEW.md` for exact source/blob verification, build instructions and the static enquiry limitation. The public view is not a production-domain deployment.

## Readability refinement

The moving material and its palette are unchanged. Small homepage sentences now use 16–18px type; supporting labels/captions use 14–15px with softer warm-taupe ink; the later owner correction below removes all sentence backplates. Form inputs use 16px type; the mobile hero and form can grow/reflow rather than clipping their larger text. The category labels no longer fade through pale transparent lettering.

English/native collection copy uses 16px paragraphs, 14–16px card/detail text and a 13px minimum for meaningful labels. Small paragraph surfaces and photo overlays improve contrast without replacing the liquid background. The selection tray/options reflow on phones for the larger type. Both native collection and standalone English motion controls now sit in a right-aligned toolbar immediately below the header, outside the introductory sentences/hero.

`mockups/_english_readability.py` is shared through the approved stylesheet generator. Rebuild **English only** with `PYTHONPATH=/home/user/python-deps python3 mockups/_build_english_final.py` (or normal Python with Pillow installed), then `node scripts/sync-decor-design.mjs`. This deliberately leaves Hindi/bilingual edits alone. Browser checks cover 320/390/520/768/1024/1440px on homepage, native collection and standalone English, meaningful visible type sizes, modal overflow and relocated pause/resume behavior. All 17 unit tests, TypeScript and production build pass.

## Softer theme-matched reading treatment

The owner preferred less dark/heavy supporting text. Large type sizes and the top-right English motion toolbar stay unchanged. Supporting copy now uses warm taupe `#73614f`, muted champagne-taupe labels `#80694f`, regular 400 body weight and medium 500 labels instead of the previous near-black/heavier treatment. Controls use `#62503c`. Selective pearl-cream backing supports copy on moving folds; cards and photographic captions use complementary lighter/warm surfaces rather than black styling. The approved liquid shader/colour cycle is unchanged.

A new unit test checks shared native/English ink tokens, preserved larger type and at least 4.5:1 contrast for the chosen primary ink/surface pairs (not a claim of a full WCAG audit). All 17 unit tests, TypeScript, production build, and the six-width homepage/collection/standalone-English typography, overflow, modal and motion-toolbar browser checks pass. The public phone package is rebuilt from the same components after this change.

Latest unboxed-type snapshots: main **https://clck.ru/3WX8Z8** (artifact `b1757b0bd7110e310a1a399acacdd633b2553309`), separate English **https://clck.ru/3WX8ZA** (source `14b88b769b0ff178366a0e49f0e2619349441749`). Both public short links were followed successfully. Native phone and real HTMLPreview-loader browser tests pass, including navigation, modals, embedded images/fonts, WhatsApp and honest private-enquiry fallback. GitHub confirms the phone blob and size recorded in `PHONE-VIEW.md`.

## Owner correction: no sentence strips or backplates

The pearl/white backing treatment above was explicitly rejected. Do not reintroduce it. Supporting sentences, kickers, category labels, location text and the footer now sit directly on the approved background, with transparent backgrounds, no added padding/borders/rounded backplates or box shadows. The shared English/native collection does the same for introductory copy, chapter descriptions, captions, process labels and mood-card text. Actual cards, form panels and interactive controls keep their existing surfaces; this is not a redesign of those elements. Large type and softer warm-taupe ink remain, and the liquid animation/photo collisions are unchanged. Process-label selectors exclude decorative atmosphere children.

Browser computed-style assertions confirm that the affected copy has no background colour/image or box shadow at 320/390/520/768/1024/1440px on the homepage, native collection and standalone English. Mobile screenshots were reviewed. Typography/overflow, modal and motion-toggle regression checks pass; all 17 unit tests, TypeScript and production build pass. Original Hindi/bilingual drafts remain untouched.

Current no-strip public views: main **https://clck.ru/3WX8Z8**, separate English **https://clck.ru/3WX8ZA**. Native and HTMLPreview-loader phone browser checks both pass. The phone artifact is pinned to `b1757b0bd7110e310a1a399acacdd633b2553309`, built from source `14b88b769b0ff178366a0e49f0e2619349441749`; GitHub confirms blob `d8ad02c873c0de05f6c4149119665beb50560204`, 10,950,826 bytes. Prior links containing white backplates remain immutable and must not be presented as current.

## Main search: three-layer local salesman logic

`src/components/balloon/smart-search.tsx` now routes queries through `handleSearch`: whole-word, case-insensitive Price/Cost/Rate, Time/Duration and Contact/Phone interceptors first; then the existing complete service/location catalogues; then the requested client-only simulation and custom-query WhatsApp link. The rate interceptor deliberately does not match the substring in Corporate. Pricing text is explicitly requested by the owner for this search-only reply; it does not add prices to decor collections.

The current source contains 20 services and 88 configured locations (all retained rather than truncating to the approximately 80 mentioned in the request). Empty-query suggestions and service scroll/location-modal actions remain. A 500ms typing debounce precedes two 750ms simulated input messages (1.5 seconds total); the original query is retained, restored afterwards and safely encoded into the WhatsApp link. The input is temporarily read-only during those messages; Escape/outside-click cancels them. New queries, clearing and unmount also clear pending timers. This is a sales animation, not a real feasibility/inventory check, external AI or an API call.

No CSS, visual-search classes or typewriter-effect code changed. Chromium computed styles for the input match the previous phone artifact (height, padding, radius, font, ink, gradients and shadows). The existing typewriter effect is byte-for-byte unchanged. Added 18 tests cover keyword priority, all configured records, grouping, exact simulation timings/query, Unicode/HTML-safe text, WhatsApp encoding, cancellation/cleanup, original actions and placeholder typing/hold/deletion. All 35 suite tests, TypeScript, targeted semantic ESLint (existing formatting preserved) and production build pass. Main Chromium checks pass at 320/390/768/1440px with no overflow/runtime errors and working simulation, original location dialog and WhatsApp query. The English/bilingual standalone pages are untouched by this search-only update.

Salesman search phone release: **https://clck.ru/3WXBhx**. Native phone and the real HTMLPreview loader (locally intercepted hosting responses) pass the same four-width search checks, including both progress phases, preserved query/WhatsApp message, original location-modal action and typewriter. The public short link was also followed separately and returned the correct homepage content. Artifact `432483d96c429a8fe62da11f29e32bd151f9f33e`, source `72e39ab006e52011736a396c3a3d6c44d27acc47`, remote blob `82f8927d94eb601b0a99b0113ce797bec8c3a784`, 10,952,791 bytes verified through GitHub. Standalone English remains on its previous, unchanged revision.

## External real-AI backend preparation — not yet connected

The owner created `ballooncreation-assistant` in Cloudflare, deployed the default Hello World Worker, and saved `GEMINI_API_KEY` as a masked production Secret. The owner showed Google projects labelled Free tier; no key value was shared. Main website/search/phone and English/bilingual pages remain unchanged.

`workers/assistant/worker.js` is the complete, keyless dashboard-paste backend. It supports optional Gemini/Groq/OpenRouter fallback, persisted cooldowns and daily visitor/IP/site quotas, but intentionally fails closed until D1 binding `AI_DB`, exact `ALLOWED_ORIGINS`, verified free model IDs and explicit `ENABLED_PROVIDERS` exist. No default model, paid plugin or Google Search grounding is enabled. D1 quotas use an atomic conditional SQL INSERT rather than insecure browser-only or isolate-local counters. See the adjacent README for limits, anonymous identity limitations, Free-tier configuration requirements and pending deployment/activation steps.

20 Node tests using real SQLite SQL and mocked provider HTTP pass. Local workerd/Miniflare + D1 smoke checks also pass for startup, automatic schema, quota/gap, fallback, cooldown and CORS; upstream responses are mocked, not actual AI provider verification. The owner must now paste only worker.js and deploy; `setup_required` at the Worker status URL is expected. Real answer verification, other providers/keys, D1 binding, model activation and native search integration are still pending. Existing main-phone link https://clck.ru/3WXBhx is unchanged and not connected to this backend yet.

## Real-AI test failure: diagnostics correction, not a claimed AI fix

The separate AI check page returned `providers_cooling_down` for the owner's valid custom decoration question. Initial code hid whether the earlier provider failure was quota, permission/key, model, location or timeout related. Safe diagnostics revision `safe-diagnostics-1` now preserves allowlisted categories/HTTP status in D1 and exposes read-only cooldown/last-result status without secrets, raw messages, questions or identity hashes. Legacy failures are explicitly unknown rather than guessed. It does not reset cooldowns, rotate same-provider keys, change billing, bypass quota or call AI from health. Worker limits and fail-closed gates remain; all 37 worker/page-controller tests and the existing mocked-upstream workerd/D1 smoke pass. The owner still must deploy updated worker.js; live cause/answer are not verified. Native website/design/typewriter/local search and the public main-phone snapshot remain unchanged.

## First-answer report and second-question timeout

The owner reports receiving a first real answer. The subsequent screenshot and fresh Worker health confirm `provider_timeout` on Gemini. Backend revision `safe-diagnostics-2` replaces the overly short single-provider 8s deadline with up to 20s, shares a bounded 24s budget across fallback providers, and gives the standalone check page 40s including storage/network overhead. No quota, secret, billing, output token or website-design changes. All 42 worker/page-controller tests pass; actual recovery awaits the owner's deployment and a new real test. This does not promise that provider outages/latency can never recur.

## Owner-requested practical low-traffic limits — pending Cloudflare deployment

Prepared `relaxed-limits-1`: 50 visitor attempts/day, 200 shared-IP attempts/day, 500 site attempts/day, 2s visitor/IP interval, 1,500-character questions, 12 KiB request bound. Includes the previous 20s single-provider timeout fix and bounded 24s fallback budget; no separate intermediate deployment needed. Test page HTML/controller updated to match. Existing usage/cooldowns are not reset; no secrets, billing or main-site design changed. 46 worker/SQLite/controller tests pass. The site ceiling is **not** a verified Gemini free-quota estimate: the owner's project-specific RPD/RPM/TPM still needs a safe AI Studio rate-limits view. Currently only Gemini is enabled; other provider fallback is not yet configured.
