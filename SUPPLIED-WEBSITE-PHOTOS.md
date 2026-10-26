# Supplied photography across the customer website — 26 October 2026

This corrects a scope omission in the previous gallery/audit release: the gallery used supplied photos, but About, Signature, legacy services and the decor catalogue still displayed generated mockup photography.

## Changes

- `src/lib/supplied-site-photos.ts` is the central explicit mapping to existing supplied gallery IDs. It does not change gallery IDs, memberships, ordering, references or saved looks.
- About: wedding, anniversary, hall/statement/contact images and linked celebration thumbnails now use supplied photographs.
- Signature Standard: supplied white-circle floral wedding stage, with a factual image description and the existing styling-reference disclaimer.
- Home/About legacy celebration cards and all five legacy creation/service pages: supplied, occasion-appropriate hero/accent/gallery photos. Captions come from the actual supplied photo descriptions, not old generated-scene captions. Hero alt text no longer claims every supplied reference is verified Balloon Creation client work.
- Decor Collections button: supplied balloon/floral photographs.
- All decor render surfaces resolve their old approved image keys through the supplied-photo registry: 25 chips, header islands, chapters/moods, hero, option profiles/details, palettes, best-for images, examples, paired styles and enquiry selections. Old filenames are keys only, never image URLs. Approved 25-style/150-option text/data and independent gold/WebGL scenes remain unchanged.
- Unsupported photographic subjects use a neutral cream/gold non-photo mark. No unrelated photograph, generated replacement or broken image is presented as the missing equipment. Unsupported large hero images are omitted. Supplied option reference photos are identified as references, not a promise that the exact photographed setup is the selected variant.
- Removed all 34 retired generated JPGs from `public/decor-types`. The sync script no longer republishes mockup images; fonts/design/data syncing remains intact.
- Removed the phone adapter's generated-photo inlining/category-glob rewrites. Standard Vite imports now embed supplied photo assets directly.
- `public/og-cover.jpg` is a 1200×630 share crop of the supplied `wedding-stage-white-circle.webp`, not the old generated cover. Source: `src/assets/gallery-wedding-batch-1/wedding-stage-white-circle.webp`. Output SHA-256: `084584ac549667f2e3ddf95e96786cc11debff09136c5abf345c89e02d922fc7`.
- Existing Home/occasion/planner/gallery supplied photography is retained. Brand logo, Bloon illustration, fluid gold and other approved non-photographic design assets are not event photographs and are unchanged.

## Still needed from the owner — do not claim all styles are photographed

19 of 25 decor parent styles currently have suitable supplied photographs. Six equipment/experience parents deliberately have neutral non-photo marks: Cake Table & Dessert Bar, Fog/Bubbles/Smoke, Confetti/Balloon Drop, 360° Booth, Kids Activity/Play Zone, Sweet Cart/Candy Bar.

Specific requested subjects:

1. Cake/dessert table — full setup and close-up.
2. Sweet cart/candy bar.
3. Fog, bubbles and smoke effects **in use**.
4. Confetti shower and balloon drop **in use**.
5. A 360° booth showing its platform/camera equipment.
6. Kids activity/play equipment or character entertainment, not simply a children's birthday backdrop.
7. Ceiling LED/hanging rings (the supplied floral rings are not an LED-ring equipment photo).
8. Mataji/Ganeshji devotional setups. Current devotional imagery is explicitly a traditional floral styling reference, not a fabricated photograph of a deity setup.

The owner has been asked to start with 10 Cake Table & Dessert Bar photos; further batches can follow style by style. Product Launch remains deferred. Cold Pyro and Live Entertainment already have suitable supplied spark-fountain and dance-performance references, respectively. Low seating uses the actual yellow Haldi canopy with sofa/floor cushions, not the geometrical floral urn photo.

## Preservation and checks

- Gallery remains 351 unique supplied photos / 371 placements, with its existing wedding/Car subsections, Room cross-listing, saved looks and deliberate classifications.
- Approved 25 styles / 150 options retained; every style and option remains functional, including those awaiting a real photo.
- Protected EN/HI/bilingual review files and pre-existing worker documentation changes are not included in this change.
- No backend/provider deployment, health request, inference or account setup belongs to this photo correction.
- Regression checks cover supplied provenance, exact decor-key coverage, explicit missing subjects, truthful service captions, no retired imports/globs/public generated files, and portable-phone adapter safety.

## Verified release

- **Current customer link: https://clck.ru/3WhWqS** (opens Home).
- Functional source: `43d44f4ad0fa7799768f9ce9c4619df4001b5b79`.
- Immutable phone artifact: `2fbb17d12bce793c4edd98c627970df5b32b764b`.
- Target: `https://htmlpreview.github.io/?https://raw.githubusercontent.com/0Lakshya0/ballooncreationelite/2fbb17d12bce793c4edd98c627970df5b32b764b/drafts/main-website-phone.html` (add `#about`, `#decor-collections`, `#signature-standard` or `#our-creations`).
- Phone size **53,755,477 bytes**; local/GitHub Git blob **`4884c865ee5ae7529bf6fc958cdf5f55a7f7b910`**, equal. Embedded source metadata and inline JavaScript syntax PASS. Normal source/artifact pushes; GitHub's >50 MiB recommendation was a warning, not a failure.
- **408 application tests / 50 files PASS**, TypeScript and changed-source lint PASS. After final low-seating curation and caption adjustments: 17 focused provenance/decor tests plus 6 About tests PASS. Both committed-source builds PASS.
- Byte-level provenance: **all 373 production raster files** are supplied-photo variants, the approved brand logo, or the explicitly recorded supplied share-cover crop. **All 371 unique embedded phone raster assets** match the supplied/brand allowlist. No unknown or retired synthetic image bytes. Counts are asset files/variants, not the 351 gallery memberships. Reproduce with `node scripts/check-supplied-photo-build.mjs` after building native and phone versions.
- **Native production and exact final phone: 31 route/width cases each**, at 320/390/1440. All changed core pages plus all 5 legacy services at 390/1440; main pages at 320; gallery checked last at every width. **104 actual image sources checked in each format**, all supplied/brand; no broken images, page errors, duplicate H1s or document horizontal overflow. Every decor parent and its first detailed option opened in the actual browser; all 150 options are covered by the React regression. 19 real-photo chips/6 honest neutral marks and omitted missing-photo heroes verified in both builds. Gallery final checks retain 20 styles/351 unique and separate Car choices. The unchanged occasion pages are also covered by application tests and the entire production/phone raster provenance checks; the previous comprehensive interaction audit is not represented as a new run here.
- Exact phone About/Signature/Collections visual screenshots reviewed; selected decor mappings reviewed as a labelled contact sheet, including real sparks, dance performance, canopy seating, corporate tables and actual signage.
- Independent published follow rendered Home with positive 1,000/2/88/19 counters, About with the actual supplied white-circle stage/anniversary/hanging-ring descriptions, the full 25-style/150-option Collections with 6 neutral missing-photo marks, and Signature content. The final independent gallery follow rendered all 3 chunks with 351 unique photos/20 styles, Room 21 and separate Car 15 Birthday/5 Wedding choices. This verifies publication; local exact-blob browser checks provide interaction/provenance evidence.
- Protected 10 owner files byte-compared against the initial backup, unchanged and unstaged. No worker/provider changes, deployment, inference or paid operation. Existing database/provider verification limits and whole-repository lint debt remain as documented in the earlier audit.

This supersedes `3WhH8W` for the customer website. Earlier audit/creator/gallery release notes remain historical; this correction does not claim the eight requested missing photo subjects have been received.
