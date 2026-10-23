> Current MAIN: **https://clck.ru/3Wf3YS** — later frontend Bloon-identity update. Previous page/motion implementation and verification below remain unchanged; server prompt deployment remains pending. See `BLOON-IDENTITY.md`.

# No bottom-to-top option/page opening — 2026-10-23

Owner instruction: opening any option must not rise into view or sweep up from the previous page’s scroll position.

## Targeted changes

- Both real and portable TanStack routers keep scroll restoration enabled, but use `scrollRestorationBehavior: "instant"` and `defaultHashScrollIntoView: { behavior: "instant" }`. New routes and their hash targets therefore open at the intended position immediately, rather than inheriting the document’s smooth-scroll sweep from the previous page. Browser back/restored positions are retained, without animated travel.
- Main/legacy `.reveal`, About `.ab-reveal` and collection `.motion-reveal` hidden entry states have no translated offset. Existing opacity fades and observer behaviour remain. Hover transforms/transitions are intentionally retained; they are not page-opening animations.
- Home hero/child reveals, rotating aura/service-caption entry frames, search-result panel, creation overlay and navigation dropdown no longer translate vertically when they open. Their normal colour, opacity/blur, layout and interaction remain.
- Shared AI **panel** opening is opacity-only; the actual owner SVG Bloon, all mascot animations, drag/docking, shared chat and search/typewriter are untouched. No centering transforms are removed. UI dialog zoom/centering and accordion layout remain functional; collection details already had no sliding-entry transform.
- Raw in-page option anchors (including the portable remote-base handler), the collection container and the search "Explore" jump are instant too. Search appearance, placeholder/typewriter and result behaviour are unchanged. Default document scrolling is `auto`; normal manual scrolling and independently animated artwork remain unaffected.
- No broad `animation: none` switch: the original continuous carousel (including bounded three-second press), actual WebGL fluid, independent collection scenes, brand animation and approved hover behaviour remain. No AI/backend/provider/secret/database/configuration work or real requests/submissions.

## Verification and publication

TypeScript, native build, targeted lint and **182 frontend tests / 15 files** pass. Sixteen new policy regressions cover both router configurations, entry-keyframe translation, hidden reveal/dropdown/overlay offsets and retention of independent animation systems. Full actual-browser results and immutable phone publication are recorded in the latest `PHONE-VIEW.md` entry after verification.


Published MAIN **https://clck.ru/3Wexuz**; source `eee461b2b9b94bf259065bb569a7e05816c93321`, artifact `c0d932498d4bc22585969119d7add900213a44e2`, blob `f73e035d8fd573ccb9082fe96b2e2104bb044efa` / 12,802,248 bytes. Native and exact-phone 320/390/768/1440 entry tests pass under **normal** motion preference, including starting at the bottom and recording instant top/hash resets. All template families checked at 390; exact phone uses genuine fragment reloads and a simulated remote base, with zero external requests/page errors. Public Home and FAQ render separately verified. Current provenance and precise QA limits are in `PHONE-VIEW.md`.
