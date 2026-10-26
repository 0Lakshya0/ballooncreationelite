# Website audit — 2026-10-26

Scope: application pages, phone/desktop layouts, navigation, search, forms, Bloon, production build/preview, backend contracts and integrations; gallery photo/style inspection is the final visual audit. This is a bounded test record, not a promise that no undiscovered bugs exist.

## Confirmed fixes

1. `npm run preview` previously returned HTTP 500: the framework preview expected `dist/server/server.js`, while Nitro emitted `.output/server/index.mjs`. The new local adapter runs the actual built fetch handler with a contained public-assets binding. It streams request/response bodies, preserves separate cookies and HEAD semantics, and does not deploy anything. Use `npm run build`, then `npm run preview -- --host 0.0.0.0 --port 8082`; do not substitute the old `npx vite preview` command.
2. Production Home, shared headers and About requested a platform-private logo URL that returned 404. Bundle the same approved PNG previously used by the working development/portable fallback. Remove the obsolete portable-source substitution; no visual rebranding.
3. Decor Collections' final planning action targeted nonexistent local `#concierge`. It now uses the real `/lets-celebrate#callback` route and opens that consultation section in the native app and memory-router phone view.
4. Server date parsing accepted rolled-over dates such as `2027-02-31`. The extracted schema now requires a real canonical calendar date, including leap-year handling, and compares against India's current date. Phone normalization, known occasions, field limits and the honeypot remain in force before the private RPC.
5. A failed consultation's WhatsApp fallback previously discarded the filled brief. It now preserves the submitted name, callback phone, occasion, date, venue and ideas in a user-reviewed WhatsApp draft. No automatic WhatsApp send, false booking confirmation, browser persistence or extra backend call.
6. Wrapped About-page facts had no row spacing on narrow screens. Add an 18px row gap without changing the approved typography, content or desktop layout.
7. ESLint traversed disposable bundled assets/cache and exhausted memory. Ignore `.cache/**` and `.wrangler/**`; do not wholesale-reformat unrelated source or protected owner files.

## Verification

- Application: **398 tests / 48 files pass**. Run isolated from simultaneous heavy browser audits; an earlier concurrent run hit timing limits in two large existing DOM tests, and the isolated full run passes without raising their timeouts or weakening assertions.
- TypeScript: `npx tsc --noEmit` passes.
- Changed-source ESLint and About stylesheet formatting pass.
- Production preview adapter: **5 Node tests pass**, covering GET/HEAD assets, POST-body/query forwarding, separate cookies, missing assets/path containment and rejected asset POSTs (`npm run test:preview`).
- Offline assistant Worker suite: **116 tests pass**. No Worker source/configuration/provider/quota/deployment change.
- Production build passes. Unknown-route response is HTTP 404.
- **69 non-gallery route/viewport cases**: main pages, all 19 occasion routes and 5 legacy routes at 390/1440; main pages plus representative occasions at 320. HTTP 200, zero broken images, missing local anchors, empty links, page errors or document horizontal overflow after fixes. Intentional clipped ticker/carousel children are not document overflow.
- Native interaction audit at **320/390/1440**: mobile menu, service search/keyboard navigation, local price answer, occasion progressive browsing/filtering, area dialog, Bloon dragging/docking, first-two/third creator disclosure and privacy, FAQ search/accordion, WhatsApp planner, required callback fields, decor options/selection/Escape and corrected planning link. Zero real AI calls or database writes.
- Normal-motion browser test: actual global and collection WebGL rendering; independent motion preferences; circles move, pause during press, resume at the three-second cap even while held, and continue after release.
- About's final narrow-screen fact-row spacing and desktop Home/About/Collections screenshots checked separately after the final CSS build.

## Integration limits / explicit non-claims

- One read-only assistant health request reported configured bindings, readable rate-limit storage and the existing production provider pool. This is configuration/storage health, **not a fresh inference/API-key test**. No provider expansion, paid operation, inference or deployment was performed.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are absent from this sandbox. Live native consultation persistence cannot be verified here; no migration or fabricated customer inquiry was inserted.
- The standalone phone HTML intentionally cannot write to the private database. Its honest error and user-reviewed WhatsApp fallback are retained; the new fallback preserves the visitor's filled brief.
- Whole-repository lint is **not green**: baseline after fixing cache traversal reports 9,776 errors (9,775 Prettier findings and one `prefer-const` in an automatically generated integration) plus seven React-refresh warnings. These pre-existing formatting/generated-file findings were not mass-edited or hidden; changed-source lint passes.
- Ten pre-existing bilingual/Worker owner edits are excluded from staging and must remain byte-identical to their session backups.

## Gallery and delivery

The final native gallery audit rendered all **371 placements / 351 unique photographs in 20 styles**, decoded every image and verified its exact bytes against the corresponding bundled ID. All eight labelled contact sheets were visually reviewed. No accidental file-to-ID/style mapping error was found. Owner-approved birthday/anniversary/proposal/bridal/animal motifs in other supplied categories were not silently reclassified. The 20 Room Surprise shared placements remain intentional, not duplicated files.

Exact-phone publication evidence is recorded with the immutable release in `PHONE-VIEW.md` and `OUR-CREATIONS-GALLERY.md`. Preserve all owner classifications, intentional Room Surprise shared membership, the two Car choices, automatic Wedding chapters and the deferred Product Launch reference. No new photos or gallery reclassification is required by the source fixes above.

Raw browser logs, screenshots and contact sheets are disposable `.cache/site-audit/` artifacts, not public website content or versioned generated datasets.
