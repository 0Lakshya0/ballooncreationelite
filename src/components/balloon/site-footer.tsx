import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { contact } from "@/lib/celebrations";
import { serviceDetails } from "@/lib/service-details";
import { AreasTrigger } from "@/components/balloon/areas-dialog";
import logo from "@/assets/brand-logo.webp";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-width footer-grid">
        <div className="footer-brand-col">
          <Link to="/" className="footer-brand" aria-label="Balloon Creation home">
            <img src={logo} alt="" width={64} height={64} />
            <span>Balloon Creation</span>
          </Link>
          <p>
            Bespoke flower &amp; balloon artistry for Indore’s most meaningful moments. Thoughtfully
            designed, flawlessly installed, beautifully remembered.
          </p>
          <div className="footer-social">
            <a href={contact.whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle size={15} /> WhatsApp
            </a>
            <a href={contact.instagram} target="_blank" rel="noreferrer">
              <Instagram size={15} /> Instagram
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h3>Our creations</h3>
          {serviceDetails.map((service) => (
            <Link key={service.slug} to="/creations/$slug" params={{ slug: service.slug }}>
              {service.shortName}
            </Link>
          ))}
        </div>
        <nav className="footer-col" aria-label="Footer navigation">
          <h3>Explore</h3>
          <a href="/#portfolio">Our creations</a>
          <a href="/#standard">The signature standard</a>
          <a href="/#process">How it works</a>
          <a href="/#reviews">Kind words</a>
          <a href="/#faq">Questions</a>
        </nav>
        <div className="footer-col">
          <h3>Visit or call</h3>
          <a href={`tel:${contact.phone}`}>
            <Phone size={14} /> {contact.label}
          </a>
          <a href={contact.whatsapp} target="_blank" rel="noreferrer">
            <MessageCircle size={14} /> WhatsApp concierge
          </a>
          <AreasTrigger>
            <MapPin size={14} /> Areas we serve
          </AreasTrigger>
          <span className="footer-place">Indore, Madhya Pradesh</span>
          <span className="footer-hours">Open daily · 9 am – 9 pm</span>
        </div>
      </div>
      <div className="page-width footer-bottom">
        <span>© {new Date().getFullYear()} Balloon Creation. Crafted for your moments.</span>
        <div className="footer-legal">
          <span>
            <Check size={12} /> 1000+ designs delivered
          </span>
          <a href="#" className="back-top">
            BACK TO TOP <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
