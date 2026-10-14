# 🎈 Live Preview Kaise Chalaye (Hinglish Guide)

Ye project `TanStack Start + React + TypeScript + Tailwind` par bana hai (Vite dev server ke saath).
Neeche 3 tarike diye hain — jaha bhi chalao, **live preview** turant mil jayega.

---

## Option 1 — Arena sandbox (sabse aasan, kuch install nahi karna)

Agar tum AI se code karwa rahe ho yahan (Arena), to bas itna kaafi hai:

```bash
npm install       # sirf pehli baar
npm run dev
```

- Dev server hamesha **port 8080** par bind karta hai (`0.0.0.0`), isliye Arena/Jupyter-style sandbox
  isko pakad kar tumhe **LIVE PREVIEW** de deta hai.
- Preview host (`*.e2b.app`) allow karne ke liye `vite.config.ts` me already `allowedHosts` set hai —
  warna browser "Blocked request. This host is not allowed." dikhata.
- Har file save karne ke baad HMR se preview khud update ho jata hai (full reload ki zarurat nahi).

> Sandbox me sirf Git/GitHub + npm/pypi ke bahar network khula hota hai. Isliye `/__l5e/...`
> wala Lovable asset (owner logo) 404 deta tha — `vite.config.ts` me dev-only fallback plugin
> add kiya hai jo wahi logo `public/favicon.png` se serve kar deta hai. Lovable par production
> build me koi change nahi hota.

---

## Option 2 — Apne laptop / PC par (Node.js 18+ chahiye)

Pura control apne haath me chahiye to:

```bash
git clone https://github.com/0Lakshya0/ballooncreationelite.git
cd ballooncreationelite
npm install
npm run dev          # http://localhost:8080
```

Useful commands:

| Command           | Kaam                                    |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Development server + live preview (HMR) |
| `npm run build`   | Production build                        |
| `npm run preview` | Build ka production preview             |
| `npm run lint`    | ESLint check                            |
| `npm run test`    | Vitest tests                            |

**Note:** laptop par bhi owner ka logo dikhega, kyunki dev fallback plugin add kiya hai.
Agar `bun` use karte ho: `bun install && bun run dev`.

**Mujhe mobile par dekhna hai?** `npm run dev -- --host` chalao aur same Wi-Fi par
laptop ke IP (`http://192.168.x.x:8080`) se kholo.

---

## Option 3 — Lovable editor (owner ke liye sabse smooth)

Lovable project: https://lovable.dev/projects/c9c62f0c-5ed5-4b6a-aacf-35886dba1434

- Wahan code editor ke saath apne aap live preview milta hai.
- Yahan ka code `main` branch par push karte ho → Lovable me sync dikhta hai.

Live site: https://ballooncreationelite.lovable.app

---

## Kaam karne ka flow (jo follow kar rahe hain)

1. Tum file + instruction dete ho (ya changelog likhte ho).
2. Main code update karta hoon (React + TS + Tailwind + shadcn/ui same stack me).
3. `npm run dev` chalta rehta hai → tum turant **live preview** me result dekhte ho.
4. Sab theek lage to `git commit` + `git push origin main` (Lovable sync ho jata hai).
