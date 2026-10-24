## Current update — all 19 circle portraits supplied (2026-10-24)

The owner supplied the final three photos and explicitly assigned them to Birthday, Kids Birthday and Showroom Setup. Birthday now uses the gold/white50th-birthday setup; Kids Birthday uses the pastel princess-theme setup; Showroom Setup uses the floral wedding-fair display. All **19 circles** now have supplied images, with no generated-category fallback in the circle component. This does not claim that other galleries/style pages have been replaced or that supplied reference images depict the owner's work.

Three byte-identical JPEG originals are retained under `photo-intake/homepage-real/circle-batch-2/`. Source/crop mappings are in `circle-selection.json` (`additionalPhotos`). New metadata-free320-square WebPs total **76,296 bytes**; all19 portraits total **492,174 bytes**. Existing16 portraits, the complete17-photo hero, its opacity/animation, and all page/gallery photos remain unchanged. The floral fair image was explicitly approved **only for the Showroom Setup circle**; it does not restore the removed Exhibition Stall service or add this image to the hero.

`prepare-occasion-thumbnails.py --only-new` adds this batch without re-encoding the previous16. Full regeneration without the flag reads both original batches. `occasion-photos.ts` now requires all19 slug keys at compile time. The phone adapter no longer expects a category-photo glob in the circle component. Existing19 routes and press/drag motion remain unchanged. Publication/testing provenance follows in PHONE-VIEW.md; entries below describe the previous16-circle release.

Published current19-circle update **https://clck.ru/3Wfmcm**. Source `0d2359b1033369a9c1160e4ba817029cfbc7e547`, artifact `a382de4e95d82fc9bda71fd1e9bc8b4f66ae68c8`. Verified blob `a25c013dc9f72671a94ce40267ec0a1b5042fd88` /15,280,838bytes.274 tests/20 files, TypeScript/builds and native/exact-portable390/1440 all19 rendered profile hashes/dimensions/routes PASS; all three cropped previews reviewed. Exact scope and checks in PHONE-VIEW.md.

---

# Real circle photos and clearer homepage photography

2026-10-24. Follow-up owner request: replace the occasion circles' profile photos with matching uploads, make hero photography substantially easier to see, and report missing occasion photos.

- 16 of the 19 circles now use owner-uploaded images; 320×320 metadata-stripped WebPs are produced directly from unchanged originals, using the existing orientation/focal manifest. The wedding uses its same upright 90°CCW correction. Separate small assets avoid loading full hero pictures in every circle.
- Match aliases explicitly: Proposal → proposal-garden; Room Surprise → proposal-room; Pet Decoration → pet-themed-celebration; Annual Day Function → annual-day. Full-size inspection of the floral-swing upload shows a floral baby cradle, suitable for the Naming Ceremony profile; it is included there. Product Launch is not relabelled as Showroom Setup. Exhibition Stall stays removed.
- **Missing matching uploads among the 19 circles:** Birthday, Kids Birthday, Showroom Setup. Those three keep their existing editorial images until the owner supplies replacements. This inventory describes the circles, not a claim that all photos throughout the site's 25 decor styles, legacy service pages and galleries are owner-uploaded.
- Scope: circle profile photos only; cards and individual-page galleries remain unchanged. The 17-photo hero selection, framing, captions, 5s rotation/1.4s fade/22s drift and reduced motion stay intact.
- Hero active opacity rises from .68 to 1. The previous near-transparent mask (.13 at the mobile top / .33 at its middle, completely transparent at desktop left) is replaced with .93–1 mobile / .8–1 desktop. A localized cream wash keeps text readable while the photo remains clearly visible, especially across the middle/right/lower hero. No new text backplates, layout changes, unrelated recolouring, or global liquid renderer changes.
- Map and source provenance: `photo-intake/homepage-real/circle-selection.json` + `selection.json`. Rebuild: `PYTHONPATH=.cache/photo-tools python3 scripts/prepare-occasion-thumbnails.py`, then Prettier on `src/lib/occasion-photos.ts`. The manifest maps the full photos to circle slugs without changing validation/form data.
- Same 19 links, motion/drag/press-release lifecycle, at-most-3s hold pause, six initial cards, search/typewriter, Bloon and full-site WebGL remain unchanged. No backend/provider deployment or inference.

Verification and immutable phone publication are recorded in PHONE-VIEW.md.

Published MAIN **https://clck.ru/3WfK85**. Runtime source `2a14efa827b6e7dd269bb0aba8e6c536b099b5ff`, artifact `9acb39776423883f8ed13da890ae3361050c3799`, verified GitHub/local blob `d451159ed3f01138486bbe0a1bc5cbe678325c20` /15,549,264bytes. **273 tests /20 files**, TypeScript and native/portable builds PASS. Native and exact-phone320/390/768/1440 browser checks PASS for all19 circle byte hashes/routes,16 real portraits +3 retained placeholders, hero opacity1/nontransparent masks, real-time rotation/reduced motion and no overflow/JS errors/AI calls.390-mobile and1440-desktop first-slide screenshots reviewed; full boundaries in PHONE-VIEW.md.
