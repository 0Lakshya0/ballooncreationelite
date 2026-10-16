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
  const [reply, setReply] = useState<'price' | 'time' | 'contact' | null>(null);
  const [simulation, setSimulation] = useState<'idle' | 'waiting' | 'checking' | 'verifying' | 'success'>('idle');
  const [customQuery, setCustomQuery] = useState('');
  const searchTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cancelSimulation = () => {
    searchTimers.current.forEach(clearTimeout);
    searchTimers.current = [];
  };
  useEffect(() => () => searchTimers.current.forEach(clearTimeout), []);
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
  const handleSearch = (value: string) => {
    cancelSimulation();
    setQ(value);
    setOpen(true);
    setReply(null);
    setSimulation('idle');
    setCustomQuery('');
    const query = value.trim();
    if (!query) return;

    // Layer 1: whole words avoid treating "Corporate" as a request for a rate.
    if (/\b(prices?|costs?|rates?)\b/i.test(query)) { setReply('price'); return; }
    if (/\b(times?|duration)\b/i.test(query)) { setReply('time'); return; }
    if (/\b(contact|phone)\b/i.test(query)) { setReply('contact'); return; }

    // Layer 2: reuse the complete service/location lists, never sample the database.
    const term = query.toLowerCase();
    if (categories.some(service => service.toLowerCase().includes(term)) ||
        areas.some(place => place.toLowerCase().includes(term))) return;

    // Layer 3: a client-only sales animation, NOT a real stock/feasibility check.
    // Let typing settle before temporarily displaying the two 750ms input messages.
    setCustomQuery(query);
    setSimulation('waiting');
    searchTimers.current = [
      setTimeout(() => setSimulation('checking'), 500),
      setTimeout(() => setSimulation('verifying'), 1250),
      setTimeout(() => { setSimulation('success'); searchTimers.current = []; }, 2000),
    ];
  };
  const dismiss = () => {
    cancelSimulation();
    setSimulation('idle');
    setOpen(false);
  };
  const busy = simulation === 'checking' || simulation === 'verifying';
  const progress = simulation === 'checking' ? '🔄 Checking feasibility...' : '✨ Verifying stock...';
  useEffect(() => {
    const close = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) {
      searchTimers.current.forEach(clearTimeout);
      searchTimers.current = [];
      setSimulation('idle');
      setOpen(false);
    } };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  const done = () => { dismiss(); setQ(''); setReply(null); setCustomQuery(''); };
  const pickService = () => { done(); document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  const pickPlace = (p: string) => { done(); onLocation(); toast.success(`Yes! We cover ${p}.`); };
  return <div className="smart-search" ref={box} onKeyDown={e => e.key === 'Escape' && dismiss()}>
    <Search size={16} className="smart-icon" aria-hidden="true" />
    <input value={busy ? progress : q} readOnly={busy} aria-busy={busy} onChange={e => handleSearch(e.target.value)} onFocus={() => handleSearch(q)} placeholder={ph || 'Search services or Indore areas…'} aria-label="Search services or locations" />
    {open && simulation !== 'waiting' && <div className="smart-results" role="region" aria-label="Search results">
      {reply === 'price' ? <a className="smart-empty" href={`${contact.whatsapp}?text=${encodeURIComponent('Hi, I would like a custom quote.')}`} target="_blank" rel="noreferrer">💰 Estimates start ₹1,999. Click for Custom Quote.</a>
        : reply === 'time' ? <div className="smart-empty" role="status">⏱️ Setup takes 2-3 hours only.</div>
        : reply === 'contact' ? <>
          <a className="smart-empty" href={`${contact.whatsapp}?text=${encodeURIComponent('Hi, I would like to discuss a decoration.')}`} target="_blank" rel="noreferrer">📞 Click here to Call or WhatsApp us directly.</a>
          <a className="smart-empty" href={`tel:${contact.phone}`}>Call {contact.label}</a>
        </>
        : busy ? <div className="smart-empty" role="status">{progress}</div>
        : simulation === 'success' ? <>
          <div className="smart-empty" role="status"><strong>✅ Yes! We can create '{customQuery}'.</strong><br /><span>This is a unique request. Let's discuss details.</span></div>
          <a className="smart-empty" href={`${contact.whatsapp}?text=${encodeURIComponent(`Hi, can you do ${customQuery}?`)}`} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
        </>
        : <>
          {services.length > 0 && <><span className="smart-head">🎈 Services</span>{services.map(s => <button type="button" key={s} onClick={pickService}>🎈 {s}</button>)}</>}
          {places.length > 0 && <><span className="smart-head">📍 Locations</span>{places.map(p => <button type="button" key={p} onClick={() => pickPlace(p)}>📍 {p}</button>)}</>}
        </>}
    </div>}
  </div>;
}
