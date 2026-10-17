import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync('src/about-us-page.tsx', 'utf8');
const cssMatch = src.match(/const aboutStyles = `([\s\S]*?)`;\s*$/);
const css = cssMatch[1];

let out = src;

// 1. remove the three asset imports (they break in any other project)
out = out.replace(/import weddingPhoto from "\.\/assets\/wedding\.jpg";\n/, '');
out = out.replace(/import anniversaryPhoto from "\.\/assets\/anniversary\.jpg";\n/, '');
out = out.replace(/import hallPhoto from "\.\/assets\/celebration-hero\.jpg";\n/, '');

// 2. photo config block inserted right after BRAND
const brandBlockEnd = out.indexOf('const waLink =');
const photosBlock = `/* ---------------------------------------------------------------------------
 * EDIT 1 — Apni photos ke URL daalein (https://... ya /images/...)
 * Khali chhodne par ek soft gold gradient placeholder dikhega — page kabhi
 * tootega nahi. Isi liye ye file kisi bhi project mein paste ho jati hai.
 * ------------------------------------------------------------------------- */
const PHOTOS = {
  wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  anniversary: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
  hall: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1600&q=80',
  birthday: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80',
};

`;
out = out.slice(0, brandBlockEnd) + photosBlock + out.slice(brandBlockEnd);

// 3. JSX + data references
out = out.replaceAll('src={weddingPhoto}', 'src={PHOTOS.wedding}');
out = out.replaceAll('src={anniversaryPhoto}', 'src={PHOTOS.anniversary}');
out = out.replaceAll('src={hallPhoto}', 'src={PHOTOS.hall}');
out = out.replace('image: weddingPhoto', 'image: PHOTOS.birthday');
out = out.replace('image: anniversaryPhoto', 'image: PHOTOS.anniversary');
out = out.replace('image: hallPhoto', 'image: PHOTOS.hall');

// 4. graceful image failure
out = out.replace(
  `    root.querySelectorAll('.ab-reveal').forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);`,
  `    root.querySelectorAll('.ab-reveal').forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  /* agar koi photo URL load na ho to layout toota hua na dikhe */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onError = (event: Event) => {
      const el = event.target as HTMLImageElement | null;
      if (el && el.tagName === 'IMG') el.style.visibility = 'hidden';
    };
    root.addEventListener('error', onError, true);
    return () => root.removeEventListener('error', onError, true);
  }, []);`
);

// 5. gradient placeholders in CSS
out = out.replace(
  '.ab-root img { display: block; max-width: 100%; }',
  `.ab-root img { display: block; max-width: 100%; }
.ab-portrait, .ab-shot, .ab-media > img, .ab-close-panel > img, .ab-vow-bg {
  background: linear-gradient(140deg, #f0e2c6, #e3cda4 45%, #f5ead4);
}`
);

// 6. header comment rewritten for portability
const headStart = out.indexOf('/**');
const headEnd = out.indexOf('*/') + 2;
const header = `/**
 * ============================================================================
 *  BALLOON CREATION — ABOUT US PAGE  ·  PORTABLE SINGLE FILE
 * ============================================================================
 *  Ek hi file mein: header, mobile menu, poora page, footer, aur poori CSS.
 *  Sirf React chahiye — koi icon package, koi UI library, koi CSS file nahi.
 *
 *  ISE KAHIN BHI CHALAYEIN
 *  1) File ko apne project mein rakhein, e.g. src/pages/AboutUs.tsx
 *  2) Router mein <AboutUsPage /> render karein
 *     • Next.js App Router → app/about/page.tsx
 *     • Vite / CRA / TanStack → jo bhi route file ho
 *  3) Next.js App Router ho to file ki pehli line par 'use client'; laga dein
 *
 *  SIRF 3 EDITS
 *  • EDIT 1 → PHOTOS object mein apne image URL daalein
 *  • EDIT 2 → BRAND object mein phone / WhatsApp / years
 *  • EDIT 3 → NAV ke links apne routes se badlein
 *
 *  Images default mein demo URLs use karti hain, isliye pehli baar mein bhi
 *  page turant dikhega. Apni asli tasveerein daalte hi aur behtar lagega.
 * ============================================================================
 */`;
out = out.slice(0, headStart) + header + out.slice(headEnd);

writeFileSync('src/about-us-page.portable.tsx', out);
console.log('portable file written:', out.length, 'chars');
console.log('remaining asset imports:', (out.match(/assets\//g) || []).length);
console.log('PHOTOS refs:', (out.match(/PHOTOS\./g) || []).length);
