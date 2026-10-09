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

const sparks = Array.from({ length: 22 }, (_, k) => ({
  left: `${(k * 37 + 7) % 96 + 2}%`, top: `${(k * 53) % 20}%`,
  animationDelay: `${1 + (k % 8) * 0.18}s`, '--s': `${2 + (k % 3) * 1}px`,
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
      <span key={`s${i}`} className="star-dust" aria-hidden="true">{sparks.map((s, k) => <b key={k} style={s} className={k % 2 ? 'gold' : undefined} />)}</span>
      {out && <span key={`o${fading}`} className="aura-line aura-out" aria-hidden="true">{out[0]}<br /><em>{out[1]}</em></span>}
      <span key={i} className="aura-line aura-in">{a}<br /><em>{b}</em></span>
    </h2>
  );
}
