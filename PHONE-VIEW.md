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
