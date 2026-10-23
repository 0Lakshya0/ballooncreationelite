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
