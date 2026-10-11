import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { categories } from './category-marquee';
import { contact } from '@/lib/celebrations';

export function SmartSearch({ areas, onLocation }: { areas: string[]; onLocation: () => void }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const [ph, setPh] = useState('');
  useEffect(() => {
    const lines = [
      'You have any question? Write here...',
      'Want to search something? Search here...',
      'Want to know something? Write here...',
      'Looking for a Birthday Surprise?',
      "Search for 'Baby Shower' or 'Welcome Baby'...",
      "Try searching: 'First Night Decoration'...",
      "Ask us: 'Do you serve in Vijay Nagar?'",
      "Want to see 'Car Decoration' photos?",
      "Type 'Wedding' to explore our magic...",
    ];
    let i = 0, pos = 0, del = false, t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const line = lines[i]!;
      if (!del) {
        pos++;
        setPh(line.slice(0, pos));
        if (pos === line.length) { del = true; t = setTimeout(tick, 2500); return; }
        t = setTimeout(tick, 120);
      } else {
        pos--;
        setPh(line.slice(0, pos));
        if (pos === 0) { del = false; i = (i + 1) % lines.length; t = setTimeout(tick, 700); return; }
        t = setTimeout(tick, 55);
      }
    };
    t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, []);
  const term = q.trim().toLowerCase();
  const services = useMemo(() => term ? categories.filter(s => s.toLowerCase().includes(term)) : categories.slice(0, 5), [term]);
  const places = useMemo(() => term ? areas.filter(a => a.toLowerCase().includes(term)) : areas.slice(0, 5), [term, areas]);
  useEffect(() => {
    const close = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  const done = () => { setOpen(false); setQ(''); };
  const pickService = () => { done(); document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  const pickPlace = (p: string) => { done(); onLocation(); toast.success(`Yes! We cover ${p}.`); };
  return <div className="smart-search" ref={box} onKeyDown={e => e.key === 'Escape' && setOpen(false)}>
    <Search size={16} className="smart-icon" aria-hidden="true" />
    <input value={q} onChange={e => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} placeholder={ph || 'Search services or Indore areas…'} aria-label="Search services or locations" />
    {open && <div className="smart-results" role="listbox">
      {services.length + places.length === 0
        ? <a className="smart-empty" href={`${contact.whatsapp}?text=${encodeURIComponent(`Hello Balloon Creation! I am looking for: ${q}`)}`} target="_blank" rel="noreferrer">Not found? Ask directly on WhatsApp 💬</a>
        : <>
          {services.length > 0 && <><span className="smart-head">✨ SERVICES</span>{services.map(s => <button type="button" key={s} onClick={pickService}>🎈 {s}</button>)}</>}
          {places.length > 0 && <><span className="smart-head">🌍 LOCATIONS</span>{places.map(p => <button type="button" key={p} onClick={() => pickPlace(p)}>📍 {p}</button>)}</>}
        </>}
    </div>}
  </div>;
}
