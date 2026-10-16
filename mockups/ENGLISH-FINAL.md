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

`_english_motion.py` contains seven independently scoped surfaces. The CSS treatments below remain the fallback; supported browsers now use the liquid-gold renderer described below:

| Surface | Palette | Treatment |
| --- | --- | --- |
| Opening hero | Cream and champagne | 10-second cream/gold/rose-gold loop; gold peak at 3.5 seconds |
| Discovery heading/navigation | Warm champagne | Independent 5-second local fade |
| The Elements | Pearl ivory | Soft pearlescent breathing light, 4.5-second alternating fade |
| The Settings | Blush and champagne | Independent warm crossfades, 5.5-second alternating fade |
| The Magic | Candlelit chocolate and bronze-gold | Slow candlelight colour breathing, 5-second alternating fade |
| Inspiration | Soft rose-gold | Gentle photographic framing wash, 6-second alternating fade |
| Planning steps | Warm amber/champagne | Independent 6.5-second fade |

The connective page canvas is a static warm cream/champagne, with no unstyled white introduction or planning-step slot. Every animated layer is an absolute child of its own isolated, clipped section; there is **no fixed full-page animated layer**. The Magic section uses a dark warm-brown base from the existing brown/gold family for contrast, not an unrelated new theme.

Collection frames have refined padding, borders and image corners; inspiration photography has its own softly framed surface. Text, photos, controls and enquiry content remain stable. Ribbons, particles and moving halos remain removed.

The Motion on/off control pauses all sections and saves the preference. A **single IntersectionObserver** handles both one-time reveals and visibility-based playback: offscreen sections pause, visible sections play. Hidden tabs pause; reduced-motion users receive static surfaces and visible content. All sections remain readable without JavaScript/IntersectionObserver.

Browser checks covered distinct animation names, section-bound geometry, real opacity changes, offscreen pausing, global pause/resume, reduced-motion, responsive widths 320/390/768/1024/1440 and the detail/enquiry interaction. The HTML regression suite still checks every one of the 25 styles and 150 options.


### Stronger, visibly distinct colour endpoints

Primary layers now cover the whole local surface with opaque gradients rather than small, translucent radial tints. Secondary accents are limited to 16% opacity so they do not wash out the primary fade. Endpoints stay within cream/champagne/rose-gold and warm bronze; small-copy contrast is strengthened for the richer phases.

Real Chromium base/peak screenshots at 1440px and 390px were pixel-sampled at exposed section margins. The largest RGB-channel differences were 39–87 levels across the five sections, and natural hero playback reached more than 85% of its gold layer within six seconds. These checks distinguish an actually visible rendered colour change from merely having an animation declaration.


## Fluid light and gentle depth

`_english_fluid.py` supplies local rounded-gradient light volumes. Three decorative layers per scene use transform-only perspective/translation/rotation to suggest flowing light and slight 3D depth, while the stronger colour fades remain unchanged. This CSS fallback itself has no WebGL or frame loop. The supported-browser primary renderer is described below.

The discovery heading/menu and planning steps now each have their own independently observed scene. White card surfaces are warm translucent champagne with an inset light edge and restrained drop shadow; header, enquiry bar, connective margins and signoff are theme-matched too. Foreground text/cards do not tilt. Selected chips retain a distinct warm-gold state.

All fluid effects pause with Motion off, hidden tabs and offscreen scenes; reduced-motion gets static highlights. Browser checks confirm seven scenes, changing 3D transform matrices, visibility-based pausing, responsive widths and working detail/enquiry controls.


## Reflective liquid-gold renderer

`_english_liquid_gold.py` now provides the primary supported-browser effect. Each local surface has a WebGL canvas that reconstructs a continuous flowing height field, its analytical surface normals and view-dependent studio reflections. Curvature shadows and specular highlights give the raised folds/valleys visible metallic depth. The rendered material itself now follows the earlier **cream → champagne-gold → rose-gold → cream** fade over ten seconds, with independent section phase offsets. Gold peaks at 3.5 seconds and rose at 7 seconds in the hero. Light warm fold shadows replace the former dark-bronze base; the existing primary flowing folds are retained. The later finishing pass described below adds only fine surface ripples and refines reflection widths. The copy veil is warm-neutral rather than imposing a constant yellow cast. This is a procedural 3D-surface effect, **not** a physical-fluid solver or a claim to reproduce a specific advertisement.

- No external texture, video, shader library or dependency is downloaded.
- Only visible scenes initialize a context; one shared requestAnimationFrame loop draws active scenes at a maximum of about 30 FPS.
- Backing dimensions are capped at 800 × 900 and do not scale with devicePixelRatio.
- Saved Motion off, offscreen sections and hidden tabs stop rendering; resume continues the prior state rather than restarting it.
- Reduced-motion startup retains static CSS surfaces without initializing the animated renderer.
- Unsupported WebGL, compile/link failure and context loss gracefully restore the existing CSS colour/light treatment.
- High-precision fragment shading is used when available, with a mediump fallback.
- A warm foreground veil and stronger paragraph colours keep copy separate from the reflections; photos, option thumbnails and buttons are not distorted.

Chromium checks verified shader compilation, non-zero advancing draw counts, no GL/JavaScript errors, pause/resume, independent offscreen freezing, capped resolution, mobile widths, reduced-motion, context-loss recovery to CSS fallback, unavailable-WebGL fallback and the existing enquiry flow. The Node HTML regression suite has 16 passing checks, including all 25 styles and 150 options.

### Rendered shade regression

In Chromium, the compiled shader was drawn at material-cycle times 0, 3.5, 7 and 10 seconds. Full-canvas mean RGB samples were respectively **194/186/171**, **185/161/119**, **182/154/133**, and **190/181/166**. The relative blue/red ratios distinguish cream, gold, rose and the return to cream despite moving-fold brightness changes. These are actual framebuffer samples, not CSS declarations; desktop phase captures and a 390px mobile view were also inspected. The existing WebGL lifecycle/fallback and interaction checks still pass.

## Visible fades, controls and connective finish

The previous shader-only colour changes were not sufficiently visible in use. `_english_refinement.py` now places a native-CSS cream/gold/rose veil **after the opaque canvas**, preserving visible fold relief while restoring the earlier fade rhythm. Cream is an actual light endpoint too, not just a return to yellow metal. Independent section durations/offsets keep this local; there is no whole-page wash. Native CSS playback does not depend on the GPU's shader frame count. The existing CSS section tones remain the unsupported-WebGL fallback.

- Hero cycle: cream → gold at 3.5s → rose at 7s → cream at 10s. Other sections have their own 9–13s cycles and phase offsets.
- Primary flowing geometry retained, with an analytically differentiated low-amplitude ripple, narrower studio reflection and controlled highlights. This is still a procedural height field, not a fluid solver.
- Primary CTA/header/enquiry buttons have a staggered travelling shine, hover lift and tap press. Style cards have an animated edge and option cards have hover feedback. Text does not bounce or move during idle animation.
- All continuous new animations obey Motion off, hidden-tab pausing and reduced-motion; scene veils also pause offscreen.
- Connective margins use warm cream/champagne/rose paper gradients; large gaps are reduced. Discovery, collection frames, planning and signoff have coordinated asymmetric corners, warm borders and light inset edges. No new footer copy is added.

**Actual composed-screen verification:** Chromium observed natural, unseeked CSS playback (not manually changed shader uniforms) at 1440px and 390px. Exposed background strips in cream/gold/rose yielded mean RGB **234/222/201 → 219/191/145 → 216/182/156** on desktop and **245/230/213 → 212/178/123 → 214/170/144** on mobile. The cream-to-gold difference reaches 90 blue-channel levels on mobile, and rose restores a distinctly pinker tint. Full screenshots were inspected for foreground readability and retained surface relief. Button animation names, hover transforms, pause/reduced-motion, finished discovery/planning regions and no horizontal overflow were checked. The existing real WebGL lifecycle, fallback and enquiry regression checks also pass.

### Final photo visibility adjustment

At widths up to 520px, all three 08/09/08 decor-style header photos now use 78% opacity (previously 44%). Desktop opacity, photo placement, flowing surfaces, colour fades, button motion and spacing are unchanged. Chromium confirmed the computed opacity at 320/390/520px (0.78) and 768/1440px (1), with no horizontal overflow.

## Header photos as raised obstacles — rendered 3D collision

The earlier SVG contact outlines and travelling line wakes were insufficient for the requested mountain-in-water effect. They have been **removed**, not supplemented with more border animation.

`_english_liquid_gold.py` now reconstructs a raised bow-wave surface in the existing WebGL height field. Incoming waves build up against the measured photo boundary, turn into side channels, reflect outward and leave two unequal rolling wakes below the obstacle. The collision contributes CSS-pixel wave height and **finite-difference height derivatives** to the rendered surface normals, plus broken crest highlights and contact occlusion. This changes the 3D lighting/volume itself, not just the colour or a stroke. The pulse varies impact/run-up and receding phases. Beyond the photo neighbourhood the original flow is unchanged.

`_english_shoreline.py` now only supplies the raised photo's static foot/shadow and a ResizeObserver-driven layout helper. A soft local mask on the colour veil reveals the rendered collision rather than bleaching its relief away. There are **no SVG shoreline paths, extra canvases, extra GPU contexts or additional animation loops**. All seven existing canvases use the same gated RAF and visibility/reduced-motion lifecycle.

- Approved 78% mobile photo opacity, desktop opacity and photo position/size stay unchanged. Text, buttons and detail/selection interactions remain stable.
- Approved section colour fades remain; only the immediate obstacle neighbourhood is softly unmasked to show depth. Shader cream/gold/rose material endpoints are unchanged.
- Saved Motion off, hidden tabs, offscreen scenes and reduced-motion pause the renderer as before. Unsupported/lost WebGL retains the readable CSS treatment and static raised photo, without pretending to render a fluid collision.
- This is an art-directed procedural 3D surface, **not** a numerical ocean simulation or a physically accurate splashing-fluid solver.

Verification: **16/16 Node checks pass**, including the absence of the former SVG paths and presence of real height/normal collision sampling. Chromium confirmed the three actual obstacle uniforms match photo bounds within 2 CSS pixels at 390/1440px, shader compilation/no GL errors, retained opacity and exactly seven canvases. At frozen impact/recede times, disabling only the obstacle changed **16,454 / 16,397 nearby framebuffer pixels** (maximum RGB-channel delta **156 / 142**); outside the bounded neighbourhood the difference was **zero**. Pause/resume, offscreen/reduced-motion freezing, context-loss fallback and restored collision uniforms, unsupported-WebGL readable fallback, responsive widths 320/390/520/768/1440 and the real detail/selection flow passed without JavaScript errors. Actual mobile and desktop captures were visually inspected for raised wave faces, stable photos and readable foregrounds.
