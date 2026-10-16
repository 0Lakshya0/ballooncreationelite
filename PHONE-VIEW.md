## Latest updated MAIN website — no sentence strips

**https://clck.ru/3WX8Z8**

This is the updated native homepage **with the new Explore decor styles button and full-home cream/champagne/rose liquid animation**, not the older Lovable deployment and not just the standalone English decor page.

- Pinned phone-view commit: `b1757b0bd7110e310a1a399acacdd633b2553309`.
- Exact source main-site revision: `14b88b769b0ff178366a0e49f0e2619349441749`.
- Target: `https://htmlpreview.github.io/?https://raw.githubusercontent.com/0Lakshya0/ballooncreationelite/b1757b0bd7110e310a1a399acacdd633b2553309/drafts/main-website-phone.html`.
- Remote blob `d8ad02c873c0de05f6c4149119665beb50560204` and size 10,950,826 bytes verified against GitHub.
- Native React screens bundled into one HTML with embedded photography/fonts, memory routing, detail modals and WhatsApp selection. No Arena login/sandbox uptime required; allow a moment on first load.
- **Public static phone view, not a production deployment.** WhatsApp/call work; private database enquiry submission is deliberately not connected and never shows a fake success. The production form/source remains unchanged.
- Build: `node scripts/build-main-phone.mjs`; adapters/readme: `mockups/main-phone/`.
- Local LIVE PREVIEW of the same artifact: **Updated website — phone view, 8092**. Main native preview remains **8080**; standalone English **8090** and bilingual **8091** remain separate.
- Chromium checks passed at 320/390/768/1440px, plus native collection entry/back/modals/WhatsApp and all embedded image decoding. The real HTMLPreview loader was also exercised with its remote-base behavior using locally supplied responses. Direct Chromium external navigation is blocked by the sandbox network; the fetch tool separately resolved the public short link and confirmed the pinned raw artifact/source metadata. Its latest HTMLPreview fetch returned the loader shell, so this is not a claim of external real-device rendering; native and HTMLPreview-loader browser tests use locally supplied responses.
- Every future main-site change needs a rebuild and a **new pinned phone link**; always end the user reply with that latest link. Never substitute the old Lovable domain or a temporary e2b link for the updated phone view.

- Owner preference: no white/cream strips, padded boxes or pill backplates behind sentences or supporting labels. Copy is directly on the approved liquid background. Keep this preference in future changes; actual cards/controls are unchanged.
- Readability update: 16–18px supporting sentences, 14–15px home labels, softer warm-taupe ink directly on the background, without sentence strips, and larger English card/detail copy. The English/native collection motion control is now in the top-right toolbar rather than the content.
- Updated separate English page: **https://clck.ru/3WX8ZA**, pinned to source revision `14b88b769b0ff178366a0e49f0e2619349441749`.
- Supersedes the darker-text snapshots (main https://clck.ru/3WX7T7, English https://clck.ru/3WX7TA); those immutable links cannot update.
- Older main-phone snapshot **https://clck.ru/3WX6tF** remains the smaller-type version; do not share it as the latest.
- Type-size/modal/toolbar checks pass for native home, collection and standalone English at 320/390/520/768/1024/1440px; meaningful visible labels are at least 13px. All 17 unit tests, TypeScript and production build pass. The regenerated phone HTML also passes native navigation, option/modal, WhatsApp, no-network embedded-asset and HTMLPreview-loader checks.

---

# Draft ko phone me dekhna (simple steps)

Draft preview ke chhote links — kisi bhi phone browser me khulte hain, koi login nahi chahiye.

| Kya | Short link |
| --- | --- |
| English draft | https://clck.ru/3WVcov |
| Hinglish draft | https://clck.ru/3WVcp2 |
| Menu (dono drafts) | https://clck.ru/3WVcox |

## Phone me kaise

1. Phone me **Chrome** kholo
2. Upar address bar me likho: **clck.ru/3WVcov** (English draft ke liye)
3. Draft khul jayega — chips par tap karo, option par tap karo, sab chalega
4. Ya laptop par `mockups/qr/phone-drafts.png` kholo aur phone camera se QR scan karo

Internet chahiye (draft GitHub se load hota hai). Login/internet ka koi jhanjhat nahi.

## Offline (bina internet)

`mockups/offline/decor-types-draft-offline.html` — ek hi file, photos andar. Download karke
phone me le jao (WhatsApp par khud ko bhej do) aur Chrome me kholo.


## Trial page (final look, English)

Ek hi link — koi login nahi, koi draft wording nahi. Ye page real page jaisa banta hai:

| Kya | Short link |
| --- | --- |
| Trial page (Decor Types, final look) | https://clck.ru/3WW92c |

Offline copy: `mockups/final/decor-types-final-single.html` (photos andar, internet ki zaroorat nahi)

## Ye short links kahan jaate hain (full URL)

`https://htmlpreview.github.io/?https://raw.githubusercontent.com/0Lakshya0/ballooncreationelite/arena/f5dd0ec5-ballooncreationelite/drafts/<file>`

(trial page = `drafts/final-english.html`)

Short links branch ke latest version par point karte hain, to har naye build ke saath
apne aap update ho jaate hain.

## Separate final page — English + Hinglish

Open https://clck.ru/3WWCNQ — this is a new page, not the old draft menu.
Use the English / Hinglish switch in the header.
Separate Arena LIVE PREVIEW: **Final — English + Hinglish**, port **8091**.
Offline copy: `mockups/final-showcase/index.html` (photos embedded).
Rebuild: `cd mockups && python3 _build_final_both.py`.
Run preview from repository root:
`python3 mockups/_serve.py 8091 mockups/final-showcase`.

## Liquid-gold rendered effect (earlier snapshot)

- Earlier version-specific link: **https://clck.ru/3WWb2Z**
- This pins English final commit `69ea1d5f8ba6153ac388b4758c12b9a406a07590` to avoid an older branch/raw-page cache.
- It is a snapshot, not an auto-updating link. Create a fresh snapshot link after later revisions if sharing this route.
- The existing dynamic English-final link **https://clck.ru/3WW92c** remains published from `drafts/final-english.html` on the Arena branch and also contains the liquid-gold renderer.
- Local LIVE PREVIEW remains **Decor Types — English final · 8090**.
- Browser WebGL support is needed for the reflected liquid-metal surface. Without it, the warm CSS colour/light animation remains as a graceful fallback.

## Restored shade cycle — earlier English snapshot

- Fresh phone link: **https://clck.ru/3WWbuf**
- Pins commit `1e2d635b9376a6be4981fb6777fb264b5344a8f2`: approved 3D liquid flow retained, material fades **cream → champagne-gold → rose-gold → cream** with lighter warm shadows.
- This is an immutable snapshot; the earlier `3WWb2Z` link retains the older bronze-heavy shading.
- Dynamic English link **https://clck.ru/3WW92c** also receives the update, subject to branch/raw-page cache.
- LIVE PREVIEW: **Decor Types — English final · 8090**. Main site and bilingual page are untouched by this revision.

## Visible fades + refined finish — earlier English snapshot

- Fresh phone link: **https://clck.ru/3WWdUz**
- Pins commit `a92bb260b891dd01adffc22214c3994bc3be75bc`.
- Native CSS colour fades now composite above the liquid canvas: visible cream → gold → rose → cream, independently timed per section. Hero has a ten-second cycle.
- Primary liquid folds retained with refined reflections and a small surface ripple. Buttons have travelling shine, hover/tap motion; gaps and planning/signoff surfaces have a warmer coordinated finish.
- Earlier snapshot links (`3WWb2Z`, `3WWbuf`) do not update. The dynamic English link `3WW92c` also receives this build, subject to caches.
- Keep **Motion on** to view playback; device reduced-motion settings are respected.
- LIVE PREVIEW: **Decor Types — English final · 8090**. Main site and bilingual page are unchanged.

## Clearer chapter photos — earlier English snapshot

- Fresh phone link: **https://clck.ru/3WWxXK**
- Pins commit `e1ed2120b69194c299c240ac98bd577beebb1785`.
- Only the three mobile 08/09/08 decor header photos change: opacity 44% → 78%. Approved design, 3D flow, colour/button animations and layout remain unchanged.
- Earlier snapshot links do not update. Dynamic English link: `https://clck.ru/3WW92c`.
- LIVE PREVIEW: **Decor Types — English final · 8090**.

## Photo-island shoreline — earlier English snapshot

- Fresh phone link: **https://clck.ru/3WWxxL**
- Pins commit `2209e4e2c7c275a858e501887aa3660ae5e2c715`.
- The three decor header photos act as islands: local liquid bends around their actual outlines, with contact crests and outward receding wakes. Photos/text stay stable; 78% mobile photo opacity, existing colour fades and buttons are retained.
- Art-directed shoreline effect, not a physical ocean simulation. Motion on is needed for playback; reduced-motion is respected.
- Earlier immutable snapshot links do not update. Dynamic English link: `https://clck.ru/3WW92c`.
- LIVE PREVIEW: **Decor Types — English final · 8090**. Main site and bilingual page untouched.

## Raised 3D fluid collision — current English snapshot

- Fresh phone link: **https://clck.ru/3WX5uf**
- Pins commit `80c48f08ec61d28d54348bc7ac539d5ff30cfe48`.
- Earlier SVG outline waves are removed. The liquid surface itself now rises against each header photo, splits into side channels and leaves rolling lower wakes, with height-derived lighting and broken crests.
- Photos remain stable and retain 78% mobile opacity. Approved colour fades and button effects remain. This is a procedural 3D visual effect, not a physical ocean simulation.
- Motion on is required for playback; device reduced-motion settings are respected. Without WebGL, the readable CSS treatment remains.
- Older snapshot links do not update. Dynamic English link: `https://clck.ru/3WW92c`.
- LIVE PREVIEW: **Decor Types — English final · 8090**. Main site and bilingual page are untouched.
