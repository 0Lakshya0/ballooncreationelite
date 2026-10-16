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

## AI search assistant (free setup)

The search bar in the header can answer any question with AI. It uses Google Gemini's **free tier**:

1. Create a free key (no credit card) at https://aistudio.google.com/app/apikey
2. Add it as a **server-side** secret named `GEMINI_API_KEY` (never prefix it with `VITE_`).
3. Optional: set `GEMINI_MODEL` (default `gemini-3.1-flash-lite`).

Answers try live Google Search grounding first, then fall back to free Wikipedia context. Harmful requests are refused by the system prompt in `src/lib/assistant.functions.ts`.
