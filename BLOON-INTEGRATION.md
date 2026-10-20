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
