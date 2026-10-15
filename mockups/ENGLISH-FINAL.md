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


## Independent section atmospheres

`_english_motion.py` contains five independently scoped treatments:

| Surface | Palette | Treatment |
| --- | --- | --- |
| Opening hero | Cream and champagne | 10-second cream/gold/rose-gold loop; gold peak at 3.5 seconds |
| The Elements | Pearl ivory | Soft pearlescent breathing light, 4.5-second alternating fade |
| The Settings | Blush and champagne | Independent warm crossfades, 5.5-second alternating fade |
| The Magic | Candlelit chocolate and bronze-gold | Slow candlelight colour breathing, 5-second alternating fade |
| Inspiration | Soft rose-gold | Gentle photographic framing wash, 6-second alternating fade |

The base page stays a static ivory. Every animated layer is an absolute child of its own isolated, clipped section; there is **no fixed full-page animated layer**. The Magic section uses a dark warm-brown base from the existing brown/gold family for contrast, not an unrelated new theme.

Collection frames have refined padding, borders and image corners; inspiration photography has its own softly framed surface. Text, photos, controls and enquiry content remain stable. Ribbons, particles and moving halos remain removed.

The Motion on/off control pauses all sections and saves the preference. A **single IntersectionObserver** handles both one-time reveals and visibility-based playback: offscreen sections pause, visible sections play. Hidden tabs pause; reduced-motion users receive static surfaces and visible content. All sections remain readable without JavaScript/IntersectionObserver.

Browser checks covered distinct animation names, section-bound geometry, real opacity changes, offscreen pausing, global pause/resume, reduced-motion, responsive widths 320/390/768/1024/1440 and the detail/enquiry interaction. The HTML regression suite still checks every one of the 25 styles and 150 options.


### Stronger, visibly distinct colour endpoints

Primary layers now cover the whole local surface with opaque gradients rather than small, translucent radial tints. Secondary accents are limited to 16% opacity so they do not wash out the primary fade. Endpoints stay within cream/champagne/rose-gold and warm bronze; small-copy contrast is strengthened for the richer phases.

Real Chromium base/peak screenshots at 1440px and 390px were pixel-sampled at exposed section margins. The largest RGB-channel differences were 39–87 levels across the five sections, and natural hero playback reached more than 85% of its gold layer within six seconds. These checks distinguish an actually visible rendered colour change from merely having an animation declaration.
