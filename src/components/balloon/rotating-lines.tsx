import { useEffect, useRef, useState, type CSSProperties } from 'react';

const lines: [string, string][] = [
  ['Life’s finest moments,', 'beautifully imagined.'],
  ['Making your grandest', 'dreams come alive.'],
  ['Where luxury styling meets', 'flawless execution.'],
  ['Crafting spaces that tell', 'your unique story.'],
  ['Exquisite designs for', 'life’s biggest milestones.'],
  ['From intimate setups to', 'legendary celebrations.'],
  ['Designing perfection for', 'your timeless moments.'],
  ['Impeccable artistry in', 'every single detail.'],
  ['Bringing magic, color, and', 'shine to your venue.'],
  ['Your vision brought', 'to life with elegance.'],
  ['Creating the perfect', 'backdrop for your smiles.'],
  ['Bespoke event aesthetics', 'tailored just for you.'],
  ['Inspiring awe with every', 'balloon and flower.'],
  ['The ultimate standard in', 'premium event decor.'],
  ['Redefining celebrations with', 'world-class artistry.'],
];

const sparks = Array.from({ length: 14 }, (_, k) => ({
  left: `${(k * 37 + 7) % 96 + 2}%`, top: `${(k * 53) % 35}%`,
  animationDelay: `${0.5 + (k % 7) * 0.4}s`, '--s': `${1.5 + (k % 3) * 0.75}px`,
}) as CSSProperties);

export function RotatingLines() {
  const [i, setI] = useState(0);
  const [fading, setFading] = useState<number | null>(null);
  const index = useRef(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => {
      setFading(index.current);
      index.current = (index.current + 1) % lines.length;
      setI(index.current);
    }, 6000);
    return () => clearInterval(t);
  }, []);
  const [a, b] = lines[i] ?? ['', ''];
  const out = fading === null ? null : lines[fading] ?? null;
  return (
    <h2 className="aura-lines" aria-live="polite">
      {lines.map(([x, y], k) => <span key={k} className="aura-sizer" aria-hidden="true">{x}<br /><em>{y}</em></span>)}
      <span className="liquid-gold" aria-hidden="true">
        <svg viewBox="0 0 1200 200" preserveAspectRatio="none" focusable="false">
          <defs><linearGradient id="fluid-gold" x1="0" y1="0" x2="0" y2="1"><stop className="fluid-cream" /><stop offset=".32" className="fluid-warm" /><stop offset=".52" className="fluid-cream" /><stop offset=".7" className="fluid-deep" /><stop offset="1" className="fluid-warm" /></linearGradient></defs>
          <path fill="url(#fluid-gold)" d="M0 83 C180 25 310 145 530 87 S890 35 1200 88 L1200 113 C890 62 740 157 530 111 S180 59 0 109 Z" />
          <path className="fluid-thread" d="M0 119 C230 70 360 165 620 114 S970 75 1200 121" />
          <path className="fluid-thread fluid-thread-fine" d="M0 67 C180 115 390 23 640 73 S1010 126 1200 70" />
        </svg>
      </span>
      <span key={`s${i}`} className="star-dust" aria-hidden="true">{sparks.map((s, k) => <b key={k} style={s} />)}</span>
      {out && <span key={`o${fading}`} className="aura-line aura-out" aria-hidden="true">{out[0]}<br /><em>{out[1]}</em></span>}
      <span key={i} className="aura-line aura-in">{a}<br /><em>{b}</em></span>
    </h2>
  );
}
