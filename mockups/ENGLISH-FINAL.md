# English final — editorial refresh

The editorial layout now uses the original cream, champagne-gold and rose-gold palette (not the wine-rose palette).

This visual treatment is **only** for the standalone English final page. It is not installed on the main website. The bilingual final page and the original English/Hinglish review drafts retain their existing design.

## View

Arena LIVE PREVIEW: **Decor Types — English final**, port **8090**.

From the repository root:

```sh
python3 mockups/_serve.py 8090 mockups/final-english-showcase
```

The self-contained page is `mockups/final-english-showcase/index.html`. Photos and licensed Latin variable fonts are embedded; no Google Fonts connection is required.

## Rebuild

```sh
cd mockups
python3 _build_final.py
```

The English-only hook in `_build_final.py` applies `_english_luxe.enhance()` after cleaning the original page. It preserves the existing 25 chip buttons, 150 option records, detail-sheet script and enquiry flow. `_build_final_both.py` uses the unchanged `clean()` function and does not import the editorial treatment.

Generated English outputs:

- `mockups/final/decor-types-final.html` (relative image references, as before)
- `mockups/final/decor-types-final-single.html` (self-contained)
- `mockups/final-english-showcase/index.html` (dedicated English preview)
- `mockups/index.html` (English root)
- `drafts/final-english.html` (self-contained publish artifact; not automatically deployed)

## Checks

```sh
node --test mockups/tests/english-final.test.cjs
```

Checks the new shell, retained tagline, removed bottom description, all 25 styles and 150 options, round option thumbnails, inspiration shortcuts, back/Escape navigation, enquiry selection/reset and WhatsApp destination, embedded images/fonts and anchor targets.

Browser checks were also run at desktop and mobile widths using Chromium, with no horizontal overflow or JavaScript errors. The design uses responsive grids, visible focus styles, a skip link, dialog focus handling, and a reduced-motion override.

## Scope

- The tagline remains **We decorate your happiness**.
- The removed business-description / WhatsApp-and-call footer is not restored.
- No prices, ratings or invented testimonials were added.
- Photography is existing illustrative imagery, not a claim of completed client work. Replace with approved real event photos before a production launch.
- This is a visual HTML iteration, **not** an update to the separate React site-ready package. Port the approved design to that package and run production/accessibility checks before applying it to the main website.

Font files in `mockups/fonts/` retain their respective SIL Open Font License text files.


## Ambient motion

`_english_motion.py` adds CSS-only warm light, eight understated drifting petals (four on phones), a floating secondary photo, restrained photo/button hover treatments, and one-time section/card reveals through a single IntersectionObserver. It adds no remote resources, libraries, canvas, or scroll/animation-frame loop.

The hero index contains a **Motion on/off** control with a saved preference. Device reduced-motion preferences disable animation and show all content. Background animation pauses in hidden tabs; reveal content stays visible without IntersectionObserver or JavaScript. The original palette and layout are retained.
