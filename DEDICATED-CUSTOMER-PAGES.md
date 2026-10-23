# Dedicated FAQs, Signature Standard and Let’s Celebrate — 2026-10-23

## Owner-requested scope

Three real React/TanStack routes replace the header's Home-scroll destinations:

- `/faqs`: 12 practical, topic-grouped native FAQ accordions; local full-text search, result count, empty reset and direct personal-help link. No automatic requests, catalogue prices, booking guarantees or fake proof.
- `/signature-standard`: an editorial floral hero using the existing wedding asset, three design/venue/material principles, a three-step planning approach and four clear pre-confirmation checks. No fabricated testimonials/ratings/counters or arbitrary setup/response guarantees.
- `/lets-celebrate`: an optional, local planner for occasion/date/area/ideas, visible summary and encoded WhatsApp draft; an unsure path works with every field blank. Customer reviews/sends in WhatsApp, not automatically. Optional callback section reuses the existing native consultation form, behind an explicit disclosure. Query `?occasion=Birthday` preselects the shared supported occasion in planner and callback. `#callback` opens the form, including a direct SSR reload (initial disclosure state stays server/client consistent, then the effect opens it).

Header FAQs is now visible on desktop as well as mobile. Header **Request Consultation** opens `/lets-celebrate#callback`, rather than scrolling Home. Menus close after selecting a page, active links/tabs, Home breadcrumb and full-occasion return link remain available. Each page has its own title/description metadata. Short local tabs are intentionally labelled FAQs / Our standard / Plan with us, with full accessible names.

## Comfort and preservation

Scoped cream/champagne styling, readable 16–18px body/fields, large touch targets, native accordions and input labels, responsive single-column mobile layouts, visible focus states, reduced-motion support. The original brand/subtitle, actual full-site WebGL, single shared compact Bloon/chat/docking, removed footer, original six-card/Explore more browser, fixed mobile search icon, all 20 linked/moving circles and all five signature creation pages remain. Home sections/legacy hashes are retained for existing callbacks and bookmarked flows; only the requested header destinations change to dedicated pages. About/collection designs are not replaced.

The new planner is local React state only. It does not store/send personal details, call AI or save a booking. The WhatsApp URL contains the draft event brief; the customer chooses whether to open and send it. Existing contact information reused. No new dependencies, provider/Worker/key/backend/database/RPC/validation changes. The consultation component's new optional `compact` presentation omits its Home marketing column and uses neutral success wording; default Home presentation and submission handling are preserved. Native enquiry submission remains explicit; public static phone view still cannot save private enquiries and shows the existing honest WhatsApp/call fallback, never fake success. No real leads or AI requests were sent during verification.

## Portable routing

`mockups/main-phone/main.tsx` recognises all three new page fragments alongside the existing About/collection/creation fragments. For non-Home routes it preserves route search and inner section hash: `#lets-celebrate?occasion=Birthday#callback` reloads the correct planner and open callback section. It remains the actual React interface with embedded photography/fonts, not a standalone imitation.

## Verification

- TypeScript and **166 frontend tests / 14 files** pass; targeted changed-source ESLint has no errors. Native and portable production builds run before publication. Added 3 route matches and 8 guide-interface tests covering destination URLs (not Home hashes), FAQ search/topic/empty reset/no requests, signature content/checks/no fake proof, optional/unsure planner and escaped draft text, occasion prefill, no automatic submit, explicit callback/static error and unknown occasions.
- Native Chromium at **320/390/768/1440**: Home header→FAQ route, mobile menu closure, FAQ topics/search/reset/accordion, signature photo/checklist, optional planner fields and encoded draft, callback form/prefill, all three direct reloads/active tabs, occasion query plus callback hash reload, one shared Bloon/dialog open-close, no horizontal overflow/footer/page errors. Final screenshots reviewed; tightened mobile tabs/top spacing and fixed inline CTA layout during QA. A real SSR `details open` hydration issue on callback deep reload was found and fixed (not hidden). Home still has six visible cards and 20 circles. Native QA finished all assertions; its last browser teardown was explicitly closed after successful output.
- Exact final phone-artifact checks, public URL and blob integrity: see the latest entry in `PHONE-VIEW.md` after publication. Previous full circle-motion/WebGL/Bloon tests are historical, not repeated here as unrelated work.
