import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowUpRight,
  Check,
  Clock3,
  Gem,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteFooter, SiteHeader } from '@/components/balloon/site-chrome';
import { celebrations, contact } from '@/lib/celebrations';
import wedding from '@/assets/wedding.jpg';
import anniversary from '@/assets/anniversary.jpg';
import celebrationHero from '@/assets/celebration-hero.jpg';

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About Balloon Creation — Luxury Celebrations in Indore' },
      { name: 'description', content: 'Discover Balloon Creation: a decade of bespoke balloon and floral artistry, citywide Indore coverage, and carefully composed celebrations.' },
      { property: 'og:title', content: 'About Balloon Creation — Indore' },
      { property: 'og:description', content: 'Ten years of transforming Indore venues into immersive, beautifully considered celebrations.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: AboutPage,
});

const pillars = [
  {
    icon: MapPin,
    index: '01',
    title: 'Indore, citywide',
    detail: '100% Indore coverage',
    copy: 'From the polished avenues of Vijay Nagar and Saket to premium townships across the city, our concierge-led planning and polished on-site finish travel with you.',
    link: null,
  },
  {
    icon: Gem,
    index: '02',
    title: 'What you approve is what we build',
    detail: '100% exact-match promise*',
    copy: 'Choose a design from our portfolio. Your approved palette, composition, structure and key details become the installation benchmark—no unapproved substitutions.',
    link: { href: '/#portfolio', label: 'Explore the portfolio' },
  },
  {
    icon: Sparkles,
    index: '03',
    title: 'Every celebration. Every scale.',
    detail: 'One creative team',
    copy: 'Weddings, birthdays, baby showers, anniversaries, corporate events and devotional celebrations—elevated with premium structures, venue-approved cold-spark moments and smoke entries.',
    link: { href: '/#concierge', label: 'Plan your occasion' },
  },
];

const steps = [
  { title: 'The first conversation', copy: 'Share your date, venue and the feeling you are after. We listen before we sketch.' },
  { title: 'The design', copy: 'A considered concept shaped around your people, your palette and the room itself.' },
  { title: 'The approval', copy: 'You approve the design and scope before we build. What you approve becomes our benchmark.' },
  { title: 'The reveal', copy: 'Our crew arrives early, styles on site, checks every angle and leaves the venue immaculate.' },
];

const assurances = [
  { icon: Users, label: 'A dedicated setup crew' },
  { icon: Gem, label: 'On-site styling checks' },
  { icon: ShieldCheck, label: 'Approved scope, respected' },
  { icon: Clock3, label: 'Early arrival, immaculate handover' },
];

const vowPoints = ['Approved before we build', 'Checked before we leave', 'Informed before we change'];

const faqs = [
  {
    q: 'What does the exact-match promise actually cover?',
    a: 'The design you approve—palette, composition, structure and key details—becomes our installation benchmark. The promise applies to that approved design and agreed scope. If your venue introduces a constraint, we tell you before anything changes.',
  },
  {
    q: 'Are cold sparks and smoke entries safe at my venue?',
    a: 'We use venue-approved cold-spark and smoke effects, staged by our crew within the permissions your venue allows. Share the venue with us early and we will confirm what is possible before the design is finalised.',
  },
  {
    q: 'Do you travel across Indore?',
    a: 'Yes—100% Indore coverage, from Vijay Nagar and Saket to premium townships and venues across the city. Tell us the venue and we will plan the setup window around it.',
  },
  {
    q: 'How early should we book our date?',
    a: 'Every bespoke installation needs a dedicated crew and a planned setup window, so peak dates are limited by capacity rather than demand. The earlier you share your date and venue, the more room we have to design without compromise.',
  },
];

const gallery = celebrations.filter(item => item.name !== 'Grand Weddings & Rings').slice(0, 4);

function AboutPage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const root = document.documentElement;
    root.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0, rootMargin: '0px 0px 80px 0px' });
    document.querySelectorAll('.about-page .reveal').forEach(node => observer.observe(node));
    return () => { observer.disconnect(); root.classList.remove('motion-ready'); };
  }, []);

  return <>
    <SiteHeader />
    <main className="about-page">
      <section className="about-hero">
        <div className="page-width about-hero-grid">
          <div className="about-hero-copy reveal">
            <span className="eyebrow"><span className="little-line" /> ABOUT BALLOON CREATION · INDORE</span>
            <h1 className="about-page-title">The doors open.<br /><em>Your moment begins.</em></h1>
            <p className="about-lede">Ten years of transforming Indore venues into immersive celebrations—where sculptural balloon artistry, considered florals and immaculate staging feel as personal as they are grand.</p>
            <div className="about-hero-actions">
              <Button variant="luxury" asChild><a href="/#concierge">Check date availability <ArrowUpRight /></a></Button>
              <a className="about-text-link" href="/#portfolio">Explore the portfolio <ArrowUpRight size={15} /></a>
            </div>
            <ul className="about-facts" aria-label="Balloon Creation at a glance">
              <li><strong>10</strong><span>Years of celebrations</span></li>
              <li><strong>100<em>%</em></strong><span>Indore coverage</span></li>
              <li><strong>100<em>%*</em></strong><span>Approved-design match</span></li>
            </ul>
          </div>

          <div className="about-hero-visual reveal">
            <span className="about-seal" aria-hidden="true"><strong>10</strong><span>YEARS</span><em>INDORE</em></span>
            <figure className="about-portrait">
              <img src={wedding} alt="A floral and balloon wedding arch staged inside an Indore palace courtyard" width={1024} height={1024} fetchPriority="high" decoding="async" />
              <figcaption className="about-portrait-tag">THE WEDDING EDIT · INDORE</figcaption>
            </figure>
            <img className="about-inset" src={anniversary} alt="An intimate anniversary table styled with roses, candles and champagne balloons" width={1024} height={1024} loading="lazy" />
            <div className="about-float-card">
              <span>THE FEELING WE STAGE</span>
              <p>“The breath before the entrance.”</p>
            </div>
            <span className="about-vertical" aria-hidden="true">BEAUTIFULLY BEYOND ORDINARY</span>
          </div>
        </div>
      </section>

      <div className="about-ticker" aria-hidden="true">
        <div className="about-ticker-track">
          {[0, 1].map(group => <div className="about-ticker-group" key={group}>
            <span>Sculptural balloons</span><em>✦</em>
            <span>Considered florals</span><em>✦</em>
            <span>Venue-approved effects</span><em>✦</em>
            <span>Immaculate staging</span><em>✦</em>
            <span>Every detail, considered</span><em>✦</em>
          </div>)}
        </div>
      </div>

      <section className="about-epoch section-space">
        <div className="page-width about-epoch-grid">
          <div className="about-epoch-media reveal">
            <img src={celebrationHero} alt="A candlelit banquet hall dressed with sculptural balloons and white florals" width={1920} height={1024} loading="lazy" decoding="async" />
            <div className="about-epoch-plaque"><strong>10</strong><span>Years of craft · Indore</span></div>
          </div>
          <div className="about-epoch-copy reveal">
            <div className="about-section-head">
              <span className="eyebrow">01 — THE 10-YEAR EPOCH</span>
              <h2>An empty venue is only <em>the opening scene.</em></h2>
            </div>
            <p className="about-epoch-lead">We shape the breath before an entrance—the first flash of colour when the doors open, the instant a roomful of people sees a celebration made for one family, one milestone, one unforgettable night.</p>
            <p>From the gracious warmth of Vijay Nagar and Saket to premium townships across Indore, we pair the city’s hospitality with visual choreography on a grand scale: sculptural balloon installations, considered florals, premium themed structures and a finish so composed it feels effortless.</p>
            <p>Ten years in, the instinct has not changed. Understand the people first. Then build the room around them. We don’t decorate to fill a space—we stage the feeling you want people to remember.</p>
            <span className="about-signature">The Balloon Creation studio · Indore</span>
          </div>
        </div>
      </section>

      <section className="about-triad section-space">
        <div className="page-width">
          <div className="about-section-head center reveal">
            <span className="eyebrow">02 — THE TRIAD OF DOMINANCE</span>
            <h2>Three promises. <em>No fine print on the feeling.</em></h2>
            <p>The details that decide whether a celebration feels beautiful—or unforgettable. These are the standards we hold every single time.</p>
          </div>
          <div className="about-triad-grid">
            {pillars.map(({ icon: Icon, ...pillar }) => <article className="about-pillar reveal" key={pillar.index}>
              <div className="about-pillar-top">
                <span className="about-pillar-icon"><Icon size={24} strokeWidth={1.1} /></span>
                <span className="about-pillar-index">{pillar.index}</span>
              </div>
              <h3>{pillar.title}</h3>
              <span className="about-pillar-detail">{pillar.detail}</span>
              <p>{pillar.copy}</p>
              {pillar.link && <a className="about-pillar-link" href={pillar.link.href}>{pillar.link.label} <ArrowUpRight size={14} /></a>}
            </article>)}
          </div>
          <p className="about-terms">*The exact-match promise applies to the approved design and agreed scope. Venue dimensions and permissions may affect special effects; we agree any required adjustment with you before installation.</p>
        </div>
      </section>

      <section className="about-vow-band">
        <img className="about-vow-bg" src={celebrationHero} alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <div className="page-width about-vow-inner reveal">
          <span className="eyebrow">03 — THE UNSPOKEN VOW</span>
          <h2>Hours before the first guest, <em>the room is already right.</em></h2>
          <p>While your guests are still on their way, our crew is on site—checking symmetry, sightlines, finishes and every detail against the approved plan. The venue is left immaculate and guest-ready. If a constraint appears, you hear from us before an agreed detail changes. The only surprise should be the reveal.</p>
          <ul className="about-vow-points">
            {vowPoints.map(point => <li key={point}><Check size={14} /> {point}</li>)}
          </ul>
        </div>
      </section>

      <section className="about-process section-space">
        <div className="page-width">
          <div className="about-process-head reveal">
            <div className="about-section-head">
              <span className="eyebrow">04 — THE APPROACH</span>
              <h2>Simple for you. <em>Meticulous behind the scenes.</em></h2>
            </div>
            <p>Four calm steps from the first hello to the final reveal. You never have to wonder what happens next.</p>
          </div>
          <div className="about-process-grid">
            {steps.map((step, index) => <div className="about-step reveal" key={step.title}>
              <span className="about-step-index">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </div>)}
          </div>
          <div className="about-assurances">
            {assurances.map(({ icon: Icon, label }) => <div className="about-assurance reveal" key={label}><Icon size={18} strokeWidth={1.2} /> {label}</div>)}
          </div>
        </div>
      </section>

      <section className="about-gallery section-space">
        <div className="page-width">
          <div className="about-gallery-head reveal">
            <div className="about-section-head">
              <span className="eyebrow">05 — THE PORTFOLIO</span>
              <h2>A city of moments, <em>beautifully staged.</em></h2>
            </div>
            <a className="about-text-link" href="/#portfolio">See all creations <ArrowUpRight size={15} /></a>
          </div>
          <div className="about-gallery-grid">
            {gallery.map(item => <a className="about-shot reveal" href="/#portfolio" key={item.name}>
              <img src={item.image} alt={`${item.name} by Balloon Creation`} width={1024} height={1024} loading="lazy" decoding="async" />
              <span className="about-shot-label"><strong>{item.name}</strong><span>{item.subtitle}</span></span>
              <span className="about-shot-arrow"><ArrowUpRight size={15} /></span>
            </a>)}
          </div>
        </div>
      </section>

      <section className="about-faq section-space">
        <div className="page-width about-faq-grid">
          <div className="about-section-head reveal">
            <span className="eyebrow">06 — BEFORE YOU ASK</span>
            <h2>Thoughtful answers, <em>before you commit.</em></h2>
            <p>Every celebration begins with a question. These are the ones we are asked most often—answered honestly.</p>
            <div className="about-faq-cta">
              <a className="about-text-link" href={contact.whatsapp} target="_blank" rel="noreferrer">Ask us on WhatsApp <ArrowUpRight size={15} /></a>
              <a className="about-call-link about-call-dark" href={`tel:${contact.phone}`}><Phone size={14} /> {contact.label}</a>
            </div>
          </div>
          <div className="about-faq-list reveal">
            {faqs.map((item, index) => <details className="about-faq-item" key={item.q} open={index === 0}>
              <summary><span>{item.q}</span><span className="about-faq-mark" aria-hidden="true" /></summary>
              <p>{item.a}</p>
            </details>)}
          </div>
        </div>
      </section>

      <section className="about-close">
        <div className="page-width">
          <div className="about-close-panel reveal">
            <img src={celebrationHero} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            <div className="about-close-copy">
              <span className="eyebrow">YOUR DATE. YOUR STORY.</span>
              <h2>Give your moment the <em>grand entrance</em> it deserves.</h2>
              <p>Every bespoke installation needs a dedicated crew and a carefully planned setup window. Peak dates are limited by capacity—share your date and venue, and we will check availability.</p>
              <div className="about-close-actions">
                <Button variant="luxury" asChild><a href="/#concierge">Check date availability <ArrowUpRight /></a></Button>
                <a className="about-ghost-button" href={`${contact.whatsapp}?text=${encodeURIComponent('Hello Balloon Creation! I would like to check availability for my celebration in Indore.')}`} target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp the studio</a>
                <a className="about-call-link" href={`tel:${contact.phone}`}><Phone size={14} /> {contact.label}</a>
              </div>
            </div>
          </div>
          <p className="about-close-terms">*The exact-match promise applies to the approved design and agreed scope. Venue permissions and dimensions may affect special effects; any adjustment is agreed with you in advance.</p>
        </div>
      </section>
    </main>

    <div className="about-mobile-bar">
      <a className="about-mobile-primary" href="/#concierge">Check date availability <ArrowUpRight size={15} /></a>
      <a className="about-mobile-whatsapp" href={`${contact.whatsapp}?text=${encodeURIComponent('Hello Balloon Creation! I would like to check availability for my celebration in Indore.')}`} target="_blank" rel="noreferrer" aria-label="WhatsApp the Balloon Creation studio"><MessageCircle size={18} /></a>
    </div>
    <SiteFooter />
  </>;
}
