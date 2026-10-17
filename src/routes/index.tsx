import { SmartSearch } from '@/components/balloon/smart-search';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, MapPin, MessageCircle, Phone, X } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/balloon/site-chrome';
import { Button } from '@/components/ui/button';
import { Concierge } from '@/components/balloon/concierge';
import { RotatingLines } from '@/components/balloon/rotating-lines';
import { CategoryMarquee } from '@/components/balloon/category-marquee';
import { celebrations, contact } from '@/lib/celebrations';
import { heroSlides } from '@/lib/hero-slides';
const logo = '/brand-mark.svg';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Balloon Creation — Bespoke Celebrations in Indore' },
    { name: 'description', content: 'Bespoke flower and balloon aesthetics for extraordinary weddings, birthdays and intimate celebrations. Discover Balloon Creation, Indore’s premier event boutique.' },
    { property: 'og:title', content: 'Balloon Creation — Beautifully Beyond Ordinary' },
    { property: 'og:description', content: 'Luxury flowers, sculptural balloons and magical memories. Bespoke celebrations in Indore, flawlessly set up in 2 hours.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

const taglines: [string, string][] = [
  ['We Don’t Just Decorate, We Create', 'Magical Memories.'],
  ['We Decorate', 'Your Happiness.'],
  ['Bespoke Flower & Balloon Artistry in', 'Indore.'],
  ['Transforming Ordinary Spaces Into', 'Extraordinary Celebrations.'],
  ['Turning Your Dream Celebrations Into', 'Breathtaking Reality.'],
  ['Where Your Deepest Emotions Meet Our', 'Finest Artistry.'],
  ['Crafting Beautiful Backdrops for Your', 'Lifelong Memories.'],
  ['The Secret Behind Every', 'Smiling and Beautiful Gathering.'],
  ['Elegant Balloon & Floral Aesthetics for', 'Elite Events.'],
  ['Celebrating Your Love and Milestones with', 'Luxury Decor.'],
  ['Where Modern Luxury Meets', 'Unforgettable Celebrations.'],
  ['Filling Every Corner of Your Venue with', 'Joy and Shine.'],
  ['Breathtaking Setups for the Days', 'You’ll Never Forget.'],
  ['Adding a Touch of Perfection to Your', 'Most Special Days.'],
  ['Making Every Milestone Look', 'Absolutely Legendary.'],
];

const indoreAreas = [
  'Vijay Nagar', 'Palasia', 'New Palasia', 'Old Palasia', 'Scheme 54', 'Scheme 78', 'Scheme 94', 'Scheme 103', 'Scheme 114', 'Scheme 136', 'Scheme 140',
  'AB Road', 'MG Road', 'Rajwada', 'Sarafa Bazaar', 'Khajrana', 'Bengali Square', 'Geeta Bhawan', 'Bhawarkua', 'Tower Square', 'Regal Square',
  'Sudama Nagar', 'Annapurna Nagar', 'Dwarkapuri', 'Navlakha', 'Sapna Sangeeta', 'Snehlataganj', 'LIG Colony', 'Tilak Nagar', 'Khatiwala Tank',
  'South Tukoganj', 'Tukoganj', 'Race Course Road', 'Yeshwant Niwas Road', 'Residency Area', 'Chhawani', 'Mhow Naka', 'Sanyogitaganj',
  'Rau', 'Pithampur Road', 'Bypass Road', 'Super Corridor', 'Nipania', 'Lasudia', 'Kanadia Road', 'Bicholi Mardana', 'Bicholi Hapsi',
  'Umiya Nagar', 'Mahalaxmi Nagar', 'Nanda Nagar', 'Pardeshipura', 'Sukhlia', 'MR 10', 'MR 11', 'Ring Road', 'Airport Road', 'Khandwa Road',
  'Sanwer Road', 'Depalpur Road', 'Simrol', 'Hatod', 'Manpur', 'Rajendra Nagar', 'Kesarbagh', 'Musakhedi', 'Azad Nagar', 'Vaishali Nagar',
  'Gulmohar Colony', 'Saket Nagar', 'Shalimar Township', 'Silver Springs', 'Apollo DB City', 'Greater Brajeshwari', 'Treasure Island Area',
  'Malhar Mega Mall Area', 'C21 Mall Area', 'Orbit Mall Area', 'Phoenix Citadel Area', 'Sarwate Bus Stand Area', 'Vijay Stambh Area',
  'Patnipura', 'Chandan Nagar', 'Gauri Nagar', 'Hira Nagar', 'Juni Indore', 'Ranipura', 'Bada Ganpati Area', 'Krishnapura',
].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

function Index() {
  const [areasOpen, setAreasOpen] = useState(false);
  const [occasion, setOccasion] = useState('');
  const [line, setLine] = useState(0);
  const [fading, setFading] = useState<number | null>(null);
  const index = useRef(0);
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      setFading(index.current);
      index.current = (index.current + 1) % taglines.length;
      setLine(index.current);
    }, 9000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0, rootMargin: '0px 0px 80px 0px' });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    return () => { observer.disconnect(); document.documentElement.classList.remove('motion-ready'); };
  }, []);
  function chooseOccasion(name: string) {
    setOccasion(name);
    document.getElementById('concierge')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  const current = taglines[line] ?? ['', ''];
  const out = fading === null ? null : taglines[fading] ?? null;
  return <>
    <SiteHeader />
    <main>
      <section className="hero">
        {heroSlides.map((s, i) => <img key={s.name} src={s.image} className={i === slide ? 'hero-image hero-slide is-active' : 'hero-image hero-slide'} alt={i === slide ? `${s.name} decoration by Balloon Creation` : ''} aria-hidden={i !== slide} width={1920} height={1024} fetchPriority={i === 0 ? 'high' : 'low'} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />)}
        <div className="hero-wash" />
        <div className="page-width hero-content">
          <img src={logo} className="hero-mark" alt="Balloon Creation emblem" width={512} height={512} />
          <span className="eyebrow hero-eyebrow"><span className="little-line" /> BEAUTIFULLY BEYOND ORDINARY</span>
          <h1 className="hero-title" aria-live="polite">
            {taglines.map(([start, end], i) => <span className="tagline-sizer" aria-hidden="true" key={`size-${i}`}>{start} <em>{end}</em></span>)}
            {out && <span key={`out-${fading}`} aria-hidden="true" className="tagline tagline-out">{out[0]} <em>{out[1]}</em></span>}
            <span key={`in-${line}`} className="tagline tagline-in">{current[0]} <em>{current[1]}</em></span>
          </h1>
          <p>Indore’s premier boutique for bespoke flower &amp; balloon aesthetics. Expert setup in 2 hours.</p>
          <div className="hero-actions"><Button variant="luxury" asChild><a href={`${contact.whatsapp}?text=${encodeURIComponent('Hello Balloon Creation! I would love to plan a bespoke celebration.')}`} target="_blank" rel="noreferrer"><MessageCircle />Let’s talk on WhatsApp<ArrowUpRight /></a></Button><Button variant="glass" asChild><a href={`tel:${contact.phone}`}><Phone />Call our concierge</a></Button></div>
          <div className="hero-footnote"><span className="little-line" /> THOUGHTFULLY DESIGNED. BEAUTIFULLY REMEMBERED.</div>
        </div>
        <a className="explore-scroll" href="#portfolio" aria-label="Explore our creations"><span>EXPLORE</span><ArrowDown size={17} /></a>
        <div className="service-badge" aria-live="polite"><span className="service-dot" /><span key={slide} className="service-name">{heroSlides[slide]?.name}</span></div>
        <div className="hero-caption"><span>THE ART OF CELEBRATION</span><span>BALLOON CREATION · INDORE</span></div>
      </section>
      <div className="brand-strip"><div className="page-width"><button type="button" className="areas-pill" onClick={() => setAreasOpen(true)} aria-haspopup="dialog"><MapPin size={14} /> Serving All Indore Areas <span className="areas-view">(View List)</span></button><SmartSearch areas={indoreAreas} onLocation={() => setAreasOpen(true)} /><span>FLOWERS <span className="strip-dot">✦</span> BALLOONS <span className="strip-dot">✦</span> MEMORIES</span></div></div>
      <CategoryMarquee />
      <section className="portfolio section-space page-width" id="portfolio">
        <div className="section-heading reveal"><div><span className="eyebrow">A WORLD OF CELEBRATIONS</span><RotatingLines /></div><div className="section-intro"><p>From grand gestures to intimate joys,<br />we make every occasion unmistakably yours.</p><span>EXPLORE OUR SIGNATURE CREATIONS <ArrowDown size={14} /></span></div></div>
        <div className="portfolio-grid">{celebrations.map((item, index) => <article className={`creation reveal creation-${index + 1}`} key={item.name}>
          <a className="creation-image" href="#concierge" onClick={event => { event.preventDefault(); chooseOccasion(item.name); }} aria-label={`Plan ${item.name}`}><img src={item.image} alt={`${item.name}: bespoke luxury flower and balloon styling`} width={1024} height={1024} loading="lazy" /><span className="image-tag">{item.tag}</span><span className="image-action"><ArrowUpRight size={21} /></span></a>
          <div className="creation-caption"><span className="creation-index">0{index + 1}</span><div><h3>{item.name}</h3><p>{item.subtitle}</p></div></div>
        </article>)}</div>
        <div className="portfolio-note reveal"><span>YOUR STORY. YOUR STYLE. YOUR ONE-OF-A-KIND CELEBRATION.</span><a href="#concierge">Let’s imagine yours <ArrowUpRight size={16} /></a></div>
      </section>
      <Concierge occasion={occasion} onOccasionChange={setOccasion} />
    </main>
    {areasOpen && <div className="areas-overlay" role="dialog" aria-modal="true" aria-label="Areas we serve in Indore" onClick={() => setAreasOpen(false)}>
      <div className="areas-modal" onClick={e => e.stopPropagation()}>
        <div className="areas-head"><span className="eyebrow">WHERE WE CELEBRATE</span><h2>Areas we serve in Indore</h2><button type="button" className="areas-close" aria-label="Close areas list" onClick={() => setAreasOpen(false)}><X size={18} /></button></div>
        <ul className="areas-list">{indoreAreas.map(area => <li key={area}><MapPin size={13} />{area}</li>)}</ul>
        <p className="areas-note">Don’t see your area? <a href={`${contact.whatsapp}?text=${encodeURIComponent('Hello Balloon Creation! Do you serve my area in Indore?')}`} target="_blank" rel="noreferrer">Ask us on WhatsApp</a> — we likely do.</p>
      </div>
    </div>}
    <SiteFooter />
  </>;
}
