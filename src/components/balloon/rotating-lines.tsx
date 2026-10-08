import { useEffect, useState } from 'react';

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
  left: `${(k * 37 + 7) % 100}%`, top: `${(k * 53) % 60}%`,
  animationDelay: `${0.4 + (k % 7) * 0.35}s`, '--s': `${3 + (k % 3) * 2}px`,
}) as React.CSSProperties);

export function RotatingLines() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI(n => (n + 1) % lines.length), 6000);
    return () => clearInterval(t);
  }, []);
  const [a, b] = lines[i] ?? lines[0]!;
  return (
    <h2 className="aura-lines" aria-live="polite">
      {lines.map(([x, y], k) => <span key={k} className="aura-sizer" aria-hidden="true">{x}<br /><em>{y}</em></span>)}
      <span key={`f${i}`} className="liquid-gold" aria-hidden="true"><i /><i /><i /></span>
      <span key={`s${i}`} className="star-dust" aria-hidden="true">{sparks.map((s, k) => <b key={k} style={s} />)}</span>
      <span key={i} className="aura-line">{a}<br /><em>{b}</em></span>
    </h2>
  );
}
