# Owner-supplied About Us page — 2026-10-17

Added the supplied About Us experience at `/about`, accessible from the existing desktop/mobile home navigation. Home design, search/typewriter, decor collection, pricing rules and AI request behavior are unchanged. Cloudflare setup is not modified by this task.

Adaptations for the real application:

- TanStack links instead of hard-navigation demo URLs: Home, portfolio and consultation return to the actual home route/section, including inside the memory-routed portable phone site.
- Existing bundled wedding, anniversary, hall, birthday and baby-shower imagery instead of external Unsplash demos; reused contact constants. These are existing editorial assets, not newly verified owner portfolio photographs.
- Scoped `.ab-` CSS, bundled existing fonts, exact “We decorate your happiness” tagline. No new footer, preserving the standing removal instruction.
- All six supplied story/process/portfolio/FAQ sections, four FAQs, contact links, mobile CTA, title/description and LocalBusiness schema. Owner-supplied 10-year/coverage/design-match claims retained, including their scope qualification; not independently verified.
- Progressive enhancement: content stays visible without IntersectionObserver/reduced motion, shared reveal observer, accessible photo fallback with reserved geometry, Escape/menu focus return and scroll-lock cleanup. Reduced motion stops ticker/seal animations.
- Phone adapter supports share/reload at `#about` and keeps the current document URL while navigating routes, rather than navigating to raw GitHub paths.

Validation: 64 frontend tests, TypeScript, production build and targeted new/changed-file ESLint pass. All 63 backend/page-controller regressions pass with mocked inference. Chromium checks at 320/390/768/1440 verify no horizontal overflow, loaded local photos, menu/Escape, About navigation, enquiry link and FAQ toggling with no page errors. No real AI question was submitted. Public portable artifact/link publication follows the source commit; see PHONE-VIEW.md.

Eight unrelated existing Hindi/bilingual mockup changes are excluded from staging/publication source changes.

## Published main

**https://clck.ru/3WYZdL** — source `474da100e18a92326cc4fa2d6a7baf6dc16d488b`, artifact `4daf5d7de1d1554038d8f7f8f94ad34d1535f79d`, blob `27991983f059c777b14c418c33d3b23647b9b400`, 11,015,513 bytes. Redirect/home rendering and GitHub blob verified. Exact artifact additionally passed 4-width remote-base browser checks, mobile About navigation, fragment reload, enquiry routing and no automatic AI calls. A real remote-base history bug found during testing was fixed before publication. Native preview remains port 8080.
