import { useEffect, useState } from 'react';
import { useLocation } from '@tanstack/react-router';
import { ArrowUpRight, Menu, MessageCircle, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contact } from '@/lib/celebrations';
function BrandMark() {
  return <span className="brand-mark-wrap"><img src="/brand-mark.svg" className="brand-mark" alt="" width={120} height={120} /></span>;
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return <header className="site-header" id="top"><div className="page-width nav-layout">
    <a href="/" className="brand" aria-label="Balloon Creation home">
      <BrandMark />
      <span className="brand-text"><span className="brand-name">Balloon Creation</span><span className="brand-rise"><span className="brand-descriptor">We Decorate Your Happiness</span></span></span>
    </a>
    <nav id="site-navigation" className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
      <a href="/#portfolio" onClick={() => setMenuOpen(false)}>Our creations</a>
      <a href="/about" aria-current={pathname === '/about' ? 'page' : undefined} onClick={() => setMenuOpen(false)}>About us</a>
      <a href="/#concierge" onClick={() => setMenuOpen(false)}>Let’s celebrate</a>
      <a className="nav-mobile-cta" href="/#concierge" onClick={() => setMenuOpen(false)}>Request consultation <ArrowUpRight size={14} /></a>
    </nav>
    <Button variant="luxury" className="nav-consultation" asChild><a href="/#concierge">Request Consultation <ArrowUpRight /></a></Button>
    <Button variant="ghost" size="icon" className="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
  </div></header>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="page-width site-footer-grid">
      <div>
        <a className="brand footer-brand" href="/" aria-label="Balloon Creation home">
          <BrandMark />
          <span className="brand-text"><span className="brand-name">Balloon Creation</span></span>
        </a>
        <p className="footer-about">Bespoke flowers, sculptural balloons and celebrations staged with care across Indore. We decorate your happiness.</p>
      </div>
      <nav className="footer-col" aria-label="Footer navigation">
        <span className="footer-head">Explore</span>
        <a href="/#portfolio">Our creations</a>
        <a href="/about">About us</a>
        <a href="/#concierge">Let’s celebrate</a>
      </nav>
      <div className="footer-col">
        <span className="footer-head">The studio</span>
        <a href={`tel:${contact.phone}`}><Phone size={13} /> {contact.label}</a>
        <a href={contact.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={13} /> WhatsApp the studio</a>
        <span>Indore, Madhya Pradesh</span>
      </div>
    </div>
    <div className="page-width footer-base">
      <span>© {new Date().getFullYear()} Balloon Creation</span>
      <span>Crafted for your moments · Indore</span>
      <a href="#top" className="back-top">BACK TO TOP <ArrowUpRight size={13} /></a>
    </div>
  </footer>;
}
