import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Clock3, Gem, MapPin, Menu, MessageCircle, Phone, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Concierge } from '@/components/balloon/concierge';
import { celebrations, contact } from '@/lib/celebrations';
import hero from '@/assets/celebration-hero.jpg';
import logoAsset from '@/assets/profile-logo.jpg.asset.json';
const logo = logoAsset.url;

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

const standards = [
  { icon: Sparkles, number: '01', title: 'Bespoke Artistry', detail: '1000+ custom designs', copy: 'Never off the shelf. Every colour, curve and detail is thoughtfully composed around your story.' },
  { icon: Clock3, number: '02', title: 'Flawless Execution', detail: 'Expert setup in 2 hours', copy: 'Precision behind the scenes. Perfection in the spotlight. We handle the details, you live the moment.' },
  { icon: Gem, number: '03', title: 'Premium Materials', detail: 'Only the exceptional', copy: 'Exquisite blooms, premium balloons and carefully chosen finishes. A difference you can feel.' },
];

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

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [occasion, setOccasion] = useState('');
  const [line, setLine] = useState(0);
  const [fading, setFading] = useState<number | null>(null);
  const index = useRef(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      setFading(index.current);
      index.current = (index.current + 1) % taglines.length;
      setLine(index.current);
    }, 10500);
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
  return <>
    <header className="site-header"><div className="page-width nav-layout">
      <a href="#" className="brand" aria-label="Balloon Creation home"><img src={logo} className="brand-mark" alt="Balloon Creation logo" width={512} height={512} /><span>Balloon Creation<span className="brand-descriptor">We Decorate Your Happiness</span></span></a>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        <a href="#portfolio" onClick={() => setMenuOpen(false)}>Our creations</a><a href="#standard" onClick={() => setMenuOpen(false)}>The signature standard</a><a href="#concierge" onClick={() => setMenuOpen(false)}>Let’s celebrate</a>
      </nav>
      <Button variant="luxury" className="nav-consultation" asChild><a href="#concierge">Request Consultation <ArrowUpRight /></a></Button>
      <Button variant="ghost" size="icon" className="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
    </div></header>
    <main>
      <section className="hero">
        <img src={hero} className="hero-image" alt="An exquisite ivory and champagne balloon installation with cascading white flowers in a grand ballroom" width={1920} height={1024} fetchPriority="high" />
        <div className="hero-wash" />
        <div className="page-width hero-content">
          <img src={logo} className="hero-mark" alt="Balloon Creation emblem" width={512} height={512} />
          <span className="eyebrow hero-eyebrow"><span className="little-line" /> BEAUTIFULLY BEYOND ORDINARY</span>
          <h1 className="hero-title" aria-live="polite">
            {fading !== null && <span key={`out-${fading}`} aria-hidden="true" className="tagline tagline-out">{taglines[fading][0]} <em>{taglines[fading][1]}</em></span>}
            <span key={`in-${line}`} className="tagline tagline-in">{taglines[line][0]} <em>{taglines[line][1]}</em></span>
          </h1>
          <p>Indore’s premier boutique for bespoke flower &amp; balloon aesthetics. Expert setup in 2 hours.</p>
          <div className="hero-actions"><Button variant="luxury" asChild><a href={`${contact.whatsapp}?text=${encodeURIComponent('Hello Balloon Creation! I would love to plan a bespoke celebration.')}`} target="_blank" rel="noreferrer"><MessageCircle />Let’s talk on WhatsApp<ArrowUpRight /></a></Button><Button variant="glass" asChild><a href={`tel:${contact.phone}`}><Phone />Call our concierge</a></Button></div>
          <div className="hero-footnote"><span className="little-line" /> THOUGHTFULLY DESIGNED. BEAUTIFULLY REMEMBERED.</div>
        </div>
        <a className="explore-scroll" href="#portfolio" aria-label="Explore our creations"><span>EXPLORE</span><ArrowDown size={17} /></a>
        <div className="hero-caption"><span>THE ART OF CELEBRATION</span><span>BALLOON CREATION · INDORE</span></div>
      </section>
      <div className="brand-strip"><div className="page-width"><span><MapPin size={14} /> INDORE’S BOUTIQUE EVENT ATELIER</span><span className="strip-center">Extraordinary occasions. Effortlessly yours.</span><span>FLOWERS <span className="strip-dot">✦</span> BALLOONS <span className="strip-dot">✦</span> MEMORIES</span></div></div>
      <section className="portfolio section-space page-width" id="portfolio">
        <div className="section-heading reveal"><div><span className="eyebrow">A WORLD OF CELEBRATIONS</span><h2>Life’s finest moments,<br /><em>beautifully imagined.</em></h2></div><div className="section-intro"><p>From grand gestures to intimate joys,<br />we make every occasion unmistakably yours.</p><span>EXPLORE OUR SIGNATURE CREATIONS <ArrowDown size={14} /></span></div></div>
        <div className="portfolio-grid">{celebrations.map((item, index) => <article className={`creation reveal creation-${index + 1}`} key={item.name}>
          <a className="creation-image" href="#concierge" onClick={event => { event.preventDefault(); chooseOccasion(item.name); }} aria-label={`Plan ${item.name}`}><img src={item.image} alt={`${item.name}: bespoke luxury flower and balloon styling`} width={1024} height={1024} loading="lazy" /><span className="image-tag">{item.tag}</span><span className="image-action"><ArrowUpRight size={21} /></span></a>
          <div className="creation-caption"><span className="creation-index">0{index + 1}</span><div><h3>{item.name}</h3><p>{item.subtitle}</p></div></div>
        </article>)}</div>
        <div className="portfolio-note reveal"><span>YOUR STORY. YOUR STYLE. YOUR ONE-OF-A-KIND CELEBRATION.</span><a href="#concierge">Let’s imagine yours <ArrowUpRight size={16} /></a></div>
      </section>
      <section className="standard section-space" id="standard"><div className="page-width">
        <div className="standard-heading reveal"><span className="eyebrow">THE SIGNATURE STANDARD</span><h2>The difference is<br /><em>in every detail.</em></h2><p>Not just a beautiful setup. An exceptional experience, from first idea to final flourish.</p></div>
        <div className="standards-grid">{standards.map(({ icon: Icon, ...item }) => <div className="standard-item reveal" key={item.number}><div className="standard-top"><Icon size={26} strokeWidth={1.1} /><span>{item.number}</span></div><h3>{item.title}</h3><span className="standard-detail">{item.detail}</span><p>{item.copy}</p></div>)}</div>
      </div></section>
      <Concierge occasion={occasion} onOccasionChange={setOccasion} />
    </main>
    <footer className="site-footer page-width"><a className="brand footer-brand" href="#"><span className="brand-balloon">🎈</span>Balloon Creation</a><span>© {new Date().getFullYear()} Balloon Creation. Crafted for your moments.</span><a href="#" className="back-top">BACK TO TOP <ArrowUpRight size={14} /></a></footer>
  </>;
}
