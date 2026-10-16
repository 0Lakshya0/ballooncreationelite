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

Standalone English/bilingual pages are not regenerated or changed by this work. The approved standalone phone link remains https://clck.ru/3WX5uf; it is not a phone link to the integrated React website. Production-domain publishing is separate: a successful build or Arena-branch push does not itself verify deployment.
