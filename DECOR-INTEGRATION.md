# Approved decor collections — native homepage integration

## Scope

The approved English design is now a native React section on `/`, after the existing portfolio and before the signature standard. The header links to `#decor-types`. The original hero, gallery, search and concierge remain in place; no iframe or standalone HTML runtime is injected.

The integration preserves 25 styles, 150 detailed options, local photography, cream/champagne/rose transitions, button treatments and the approved raised-photo liquid shader. Radix handles modal focus/scroll locking. Options use small round profile photos, and selection messages use the existing shared WhatsApp contact.

Standalone English and bilingual pages are not regenerated or changed by this integration. Production-domain deployment is separate; building or pushing the Arena branch is not proof of deployment.

## Source and regeneration

- Approved source: `mockups/final/decor-types-final.html` and `mockups/_english_liquid_gold.py`.
- Native component: `src/components/balloon/decor/DecorTypesSection.tsx`.
- Generated catalogue, scoped CSS and exact shader: `decor-data.ts`, `approved-decor.css`, `liquid-shader.ts` in that folder.
- Bundled photos/fonts: `public/decor-types/` (font licenses included).
- Run `node scripts/sync-decor-design.mjs` from the repository root to regenerate those assets. It never writes the standalone drafts.
- `integration.css` contains native-modal/placement adjustments; `home-integration.css` contains narrow header/portfolio-heading responsive fixes. Do not edit generated CSS by hand.

The old `mockups/site-ready/decorTypesData.ts` supplies compatible type definitions and group identities only, not the approved content/design.

## Motion and lifecycle

The main homepage and decor share one visibility observer. Each liquid surface is viewport-gated, capped at 30fps and 800×900 drawing-buffer pixels. Rendering stops when paused, reduced motion is requested, the scene is offscreen or the document is hidden. Context restoration rebuilds the renderer; unmount disposes listeners, buffers and frames. Unsupported WebGL keeps a CSS fallback. Pause affects this section only; selection tray visibility is limited to the section.

## Verification completed

Automated repository checks:

```sh
npx tsc --noEmit
npm test
npm run build
```

All pass (9 unit tests, including all 150 option-detail openings and exact approved source/shader comparison). ESLint also passes for the new handwritten TypeScript files. The Bun lockfile includes the two build-time CSS parsing dependencies.

Additional real Chromium checks against main-site port 8080:

- No document horizontal overflow at 320, 390, 520, 768, 1024 and 1440px.
- One H1; original gallery, search/concierge presence; mobile collection link closes menu.
- All three photo-island uniforms match rendered photo geometry at 390/1440px; no WebGL errors; approved mobile photo opacity retained.
- Round option portraits, rich details, save/reset and WhatsApp URL contents.
- Modal focus trap, Escape from option to style then close, and focus return to trigger.
- Section-local pause, offscreen/reduced-motion suspension, context loss/restoration and no-WebGL fallback.
- Selection tray hidden outside the decor section; no JavaScript or hydration errors on a clean server load.

Desktop/mobile screenshots were also reviewed. The sandbox blocks the original external Google-font request; new decor fonts are local. Existing build warnings about Vite paths, concierge validator deprecation and chunk size are unchanged in scope. No real inquiry was submitted to the production database during UI testing.

## Separate previews

- Main React website: `npm run dev -- --host 0.0.0.0 --port 8080`.
- Approved English standalone: `python3 mockups/_serve.py 8090 mockups/final-english-showcase`.
- Separate bilingual page: `python3 mockups/_serve.py 8091 mockups/final-showcase`.

The approved standalone phone link remains https://clck.ru/3WX5uf; this is not a phone link to the integrated React homepage.
