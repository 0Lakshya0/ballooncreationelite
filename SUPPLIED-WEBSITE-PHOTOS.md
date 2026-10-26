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

Owner asked to start with 10 Cake Table & Dessert Bar photos; further batches can follow style by style. Product Launch remains deferred. Cold Pyro and Live Entertainment already have suitable supplied spark-fountain and dance-performance references, respectively. Low seating uses the actual yellow Haldi canopy with sofa/floor cushions, not the geometrical floral urn photo.

## Preservation and checks

- Gallery remains 351 unique supplied photos / 371 placements, with its existing wedding/Car subsections, Room cross-listing, saved looks and deliberate classifications.
- Approved 25 styles / 150 options retained; every style and option remains functional, including those awaiting a real photo.
- Protected EN/HI/bilingual review files and pre-existing worker documentation changes are not included in this change.
- No backend/provider deployment, health request, inference or account setup belongs to this photo correction.
- Regression checks cover supplied provenance, exact decor-key coverage, explicit missing subjects, truthful service captions, no retired imports/globs/public generated files, and portable-phone adapter safety.

Validation and published link will be recorded after the exact final builds are checked.
