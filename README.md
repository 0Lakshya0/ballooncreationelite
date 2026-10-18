# Balloon Prestige

Build a high-end, ultra-luxury Single-Page Website for "Balloon Creation". The design must look like a world-class premium event agency, NOT a basic local vendor.

Theme: Elite Minimalist LIGHT theme (Pure white background, subtle cream accents, sophisticated dark charcoal typography).

Apply Apple-style premium smooth fade-in scroll animations. Use elegant glassmorphism (frosted glass blur effect) for cards and navigation to keep it modern.

Include these premium sections efficiently to save tokens:

1. Luxury Navbar: Blurred transparent background, sleek logo "🎈 Balloon Creation", and a minimalist, high-contrast "Request Consultation" button.

2. High-Fashion Hero: Massive editorial heading "We Don't Just Decorate, We Create Magical Memories." Subheading in a clean minimal font: "Indore's premier boutique for bespoke flower & balloon aesthetics. Expert setup in 2 hours." Two clean, elegant CTA buttons (WhatsApp / Call).

3. The Portfolio Grid (Categories): An editorial magazine-style layout showcasing 5 premium categories (Grand Weddings & Rings, Mega Birthdays, Anniversaries & Surprises, Baby Showers, and Devotional Celebrations like Mataji/Ganeshji). Strictly exclude general festivals (Diwali/Holi). Use large, sleek image placeholders.

4. The Signature Standard (Value Proposition): A highly sophisticated 3-column layout highlighting: "Bespoke Artistry" (1000+ custom designs), "Flawless Execution" (2-hour setup), and "Premium Materials".

5. Elite Concierge (Contact Form): A beautiful, minimal interactive inquiry form that feels like booking a luxury service.

Keep the entire codebase highly optimized, modular, and clean to preserve tokens for future modifications. Fully responsive for mobile.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ballooncreationelite.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c9c62f0c-5ed5-4b6a-aacf-35886dba1434).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Premium upgrade — owner notes

### What changed

- **Hero**: circular logo no longer depends on Lovable's asset proxy (the badge rendered blank/alt-text before), greeting trust row, tighter mobile typography, and delayed hero images so only the current/next/previous shot is downloaded.
- **Portfolio**: every creation card now opens a detail dialog (intro, highlights, image switcher, "Plan this look" and "Ask on WhatsApp"); choosing a look preselects it in the concierge form.
- **New sections**: animated trust band (1000+ designs, 2-hour setup, 88+ Indore areas, 20+ formats), a three-step "how it works" process, client-kind-words cards, and a 6-question FAQ.
- **Conversion**: floating WhatsApp bubble (desktop) and a thumb-friendly Call / WhatsApp / Book bar on mobile; sticky-header scroll progress; form error text is now human and offers a WhatsApp fallback.
- **SEO/social**: `LocalBusiness` + `FAQPage` JSON-LD, canonical URL, an OG/Twitter cover image (`public/og-cover.jpg`), geo meta, apple-touch icon.
- **Performance**: the six heavyweight JPGs were replaced by WebP (about 1.96 MB → 0.95 MB), the unused category sheet was removed, and the app now uses one logo asset instead of a remote-proxy JSON reference.

### Replace before launch (placeholders)

- The three reviews in `src/lib/site-content.ts` (`testimonials`) are written sample copy — swap in real client quotes and first names.
- `contact.instagram` currently points at `https://www.instagram.com/ballooncreation_indore/` — confirm it is the studio's account.
- `SITE_URL` in `src/routes/index.tsx` is the Lovable production domain; update it if a custom domain is connected.
- Real portfolio photography can replace `src/assets/*.webp` and `src/assets/categories/*.webp` without code changes.
- The concierge form needs `SUPABASE_SERVICE_ROLE_KEY` in the deployment environment (Lovable Cloud) — it is not present in this workspace, so submissions show the friendly error state here.

## Creation detail pages (added after the first upgrade)

Every creation — Grand Weddings & Rings, Mega Birthdays, Anniversaries & Surprises,
Baby Showers and Devotional Celebrations — now has its own page at
`/creations/<slug>` (e.g. `/creations/grand-weddings-rings`).

Each page contains, in order:

1. Breadcrumb + editorial hero with a floating "designed for" card.
2. Quick facts strip (setup window, design lead time, coverage, crew size).
3. **What this is and why it matters** — long-form copy plus a pull quote.
4. **The difference** — three positioning pillars.
5. **Everything that is included** — 8 concrete services per collection.
6. **How it happens** — a four-step process timeline and an occasion list.
7. **Our creations** — a six-photo editorial gallery with captions.
8. **Ways to celebrate** — three packages with the middle one highlighted.
9. Client proof, an FAQ block (with FAQPage schema), and a scarcity/closing CTA band.
10. Cross-links to the other four collections and the full concierge form.

Navigation: the navbar "Our creations" item opens a dropdown of all five
collections (and lists them inside the mobile menu), every portfolio card on the
home page links to its page, and the footer carries the full list. Each page is
server-rendered with its own title, description, canonical URL and
Service + BreadcrumbList + FAQPage JSON-LD.

All long-form copy lives in `src/lib/service-details.ts` — edit text, packages,
gallery captions, FAQs and the urgency lines there; the layout never needs
touching. The urgency wording deliberately mirrors how the studio really works
(limited installations per day, seasonal dates booked early) — please adjust it
if your capacity changes so it stays truthful.

- The per-collection reviews in `service-details.ts` (`proof`) are sample copy,
  just like the home-page testimonials. Replace them with real client quotes
  before launch.

### Verify

- `npx tsc --noEmit`, `npx vite build`, `npx vitest run` all pass.
- Checked at 1440 / 1280 / 1024 / 900 / 820 / 768 / 620 / 430 / 390 / 360 / 320 px with no horizontal scroll.
