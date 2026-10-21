## Latest publication — compact Home and mobile search fix (2026-10-21)

MAIN: **https://clck.ru/3WbkAU**. Source `746da77115457ace99106b430f1f862761f09c3c`; pinned phone artifact `47e8cf5fc90949e68cd951263dec2cb86a73c09c`. Home initially shows six occasion cards, with **Explore more occasions** (+6), **Show fewer**, live showing/total count and immediate full-result search/filtering. All 20 occasion pages/circles and five legacy pages remain. Mobile smart-search icon sizing fixed without changing search/typewriter/AI behavior. About/collection, compact Bloon and WebGL unchanged. **142 tests / 12 files**, TypeScript, targeted lint/builds and native/exact-phone browser checks at four widths pass. No provider work or real AI/enquiry calls. Public redirect/render, integrity and exact verification boundaries: `PHONE-VIEW.md`. Earlier links/results below are historical.

---

## Previous publication — 20 simple occasion pages (2026-10-20)

MAIN: **https://clck.ru/3WbQrC**. Source `62c61e0e615c92dbebf4d0720a1c89ae9a54cfdd`; pinned phone artifact `3f829493a37d6236b9a6ad2edd9110e1ba170257`. Every circle now has a matching Home card and simple dedicated page, local filters/search, selectable ideas, unsure help and contextual contact. Existing five signature pages, About/collection, compact Bloon/chat/search and actual WebGL remain; footer stays absent. No provider/configuration changes or real AI/enquiry submissions. Only existing enquiry occasion validation was expanded (no database/RPC changes). Static phone view uses honest WhatsApp/call fallback, not private database saves. **140 tests / 12 files**, TypeScript, native build and four-width native/exact-phone browser checks pass; targeted lint has no errors/one existing refresh warning. Exact public redirect/render, GitHub blob integrity, detailed scope and test boundaries: `PHONE-VIEW.md`, `OCCASION-PAGES.md`. Older links/results below are historical.

---

# Bloon launcher — owner SVG integration

## Approved reference and size

- Original upload preserved verbatim at `mockups/ai-bloon/bloon-demo.html` (11,862 bytes; SHA-256 `9108c4db53ecba6cfdc590dbb67d85137df022a4d271f18aa105a757901f8f08`).
- Exact SVG geometry/gradient colours, rose-gold balloon head, suit, bow, ten cyclic local greetings and **Ask Bloon** caption. SVG IDs are unique for multiple instances.
- Owner rejected the demo's 160px floating size. Final SVG canvas is **84px at viewport widths ≤480px**, **96px above 480px**; launcher includes another 26px for the caption. CSS and docking calculations share these dimensions.
- This is the owner's SVG 3D-look mascot, not a new WebGL model. The approved full-site real WebGL liquid background is untouched.

## Behaviour preserved

- Idle float (3.8s), blink (5.8s), three greeting waves (0.52s each), raised greeting pose, happy eyes/blush, cursor-following pupils and cycling greeting bubble.
- Existing launcher button opens the same shared AI dialog. Existing mouse/touch dragging, nearest-side snap, remembered side/height, keyboard repositioning and focus remain.
- Tooltips mirror at the left edge, wrap on narrow screens and move down near the top. Left docking reserves space above the existing global motion button, including About's higher placement.
- Mascot respects global pause, reduced motion and hidden documents, and pauses during drag/open chat. Event listeners clean up. Escape dismisses the greeting.
- Greetings and animations are entirely local; no provider requests, generated greetings, additional assets or animation dependencies. Worker source/settings/secrets are unchanged; provider work remains paused.
- No search/typewriter, About content, header, footer, catalogue or overall background redesign.

## Verification

- 82 frontend tests across 9 files; TypeScript; targeted ESLint; native production build: PASS.
- Source tests compare SVG paths and gradient stops to the original upload, and cover greetings, pupils, pause/reduced motion, unique IDs and listener cleanup. Responsive geometry and motion-control clearance are tested.
- Native Chromium compact checks at 320/390/768/1440: 84/84/96/96px canvas widths, caption dimensions, bounded greeting, original animation durations, keyboard movement, pause/resume controls and chat opening without inference. Width checks completed in split runs; the first combined harness timed out at desktop startup.
- Fresh actual mobile context (390px, mobile + touch enabled from creation): native touch drag left, no accidental dialog, tap to open, remembered dock on reload, reduced-motion animation suppression and shared-search submission PASS. Changing an existing desktop context to raw touch mid-run was not a reliable harness; it is not counted as a pass.
- Search browser response was intercepted locally: exactly one mock POST, **zero real AI calls**. No provider setup or capacity test performed.
- Public immutable artifact/link provenance and exact portable smoke results are recorded separately in `PHONE-VIEW.md` after publication.

## Original Bloon publication (historical)

- MAIN: **https://clck.ru/3Wb9bY**. Source `da9a04ce6f4f6ef9ca934615ccccd0685edb8238`; artifact `a14db499e26a271e69e53e4342cb69d3e912eea7`.
- Exact portable browser smoke PASS at 320/390/768/1440 in independent contexts with a simulated remote HTMLPreview base: responsive dimensions, bounded greetings, chat; desktop About/shared pause-resume; zero external requests/page errors. Inline script syntax/source metadata and GitHub blob integrity verified separately; public short-link redirect/render shows Ask Bloon.

## Current MAIN after other-chat integration

**https://clck.ru/3WbFXT** — source `ced2c252bc1fd3c2fbe81b961f0395129c2de1d4`, artifact `ed22bdbd92221a5a1734ef273592cb7ffaa487dc`. Same compact owner mascot/animations; docking now also reserves existing About/collection bars and new Home/service contact actions, using resize observation. See `PHONE-VIEW.md` for exact-artifact tests/provenance.
