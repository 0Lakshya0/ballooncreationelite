# Decor Types — site par lagane ke liye ready package

Ye section **live website par lagane ke liye bilkul tayyar** hai. Abhi lagaya nahi gaya hai —
jab tum bologe "laga do", to sirf 3 steps hain.

## Kya kya hai

| File | Kaam |
| --- | --- |
| `DecorTypesSection.tsx` | Poora section — React component (chips, detail sheet, enquiry bar) |
| `decorTypesData.ts` | 25 chips + 150 options ka saara content (typed) |
| `decor-types.css` | Section ki styling — `.bce-decor` ke andar scoped, isliye site ke baaki page par koi asar nahi |
| `DecorTypesSection.test.tsx` | Smoke test (6 tests pass) |

Standalone preview (jaisa dikhega): `mockups/final/decor-types-final.html`

## Site par lagane ke steps

1. **Photos** — `mockups/img/*.jpg` ko `public/decor-types/` me copy karo
   (34 photos, ~4 MB).

2. **Component** — teen files `src/components/balloon/` me daalo:
   `DecorTypesSection.tsx`, `decorTypesData.ts`, `decor-types.css`

3. **Render** — jahan section chahiye (jaise `src/routes/index.tsx`, occasions row ke baad):

   ```tsx
   import DecorTypesSection from "@/components/balloon/DecorTypesSection";
   ...
   <DecorTypesSection imgBase="/decor-types" />
   ```

Bas. `imgBase` batata hai ki photos kaunse folder me hain — default `"img"` hai (standalone page ke liye).

## Dhyan rakhne wali baatein

- **Fonts**: section `Cormorant Garamond` + `Manrope` use karta hai. Live site par ye already
  hain — agar na hon, to `<head>` me Google Fonts ka link daalna padega.
- **Price kahin nahi hai** — poora section enquiry/WhatsApp based hai.
- **WhatsApp number** `+91 74898 63753` (`WA_HREF` data file me, ek jagah).
- **Photos** abhi AI-made placeholders hain — asli event photos daalte hi ye section aur strong lagega.
- `.bce-decor` wrapper ki wajah se section ka CSS sirf iske andar chalta hai — site ke baaki
  page ko chhoota nahi.

## Dobara banane ka tarika (agar content badle)

```bash
cd mockups
python3 _build2.py            # draft copy se page banata hai
python3 _build_offline.py     # offline single-file copies
python3 _build_offline.py --publish /path/to/drafts
python3 _build_final.py       # final-looking page (draft wording hataata hai)
python3 _build_site_ready.py  # yahi React package dobara banata hai
npx vitest run --config mockups/vitest.smoke.config.ts   # test
```
