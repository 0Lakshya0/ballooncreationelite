import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollProgress } from "@/components/balloon/scroll-progress";
import { contact } from "@/lib/celebrations";
import { serviceDetails } from "@/lib/service-details";
import logo from "@/assets/brand-logo.webp";

const sections = [
  { href: "/#portfolio", label: "Our creations" },
  { href: "/#standard", label: "The signature standard" },
  { href: "/#reviews", label: "Kind words" },
  { href: "/#concierge", label: "Let’s celebrate" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="page-width nav-layout">
        <Link
          to="/"
          className="brand"
          aria-label="Balloon Creation home"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-mark-wrap">
            <img
              src={logo}
              className="brand-mark"
              alt="Balloon Creation logo"
              width={256}
              height={256}
            />
          </span>
          <span className="brand-text">
            <span className="brand-name">Balloon Creation</span>
            <span className="brand-rise">
              <span className="brand-descriptor">We Decorate Your Happiness</span>
            </span>
          </span>
        </Link>

        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          <div className="nav-drop">
            <Link
              to="/"
              hash="portfolio"
              className="nav-drop-trigger"
              onClick={() => setMenuOpen(false)}
            >
              Our creations
            </Link>
            <div className="nav-drop-panel" role="group" aria-label="Our creations">
              {serviceDetails.map((service) => (
                <Link
                  key={service.slug}
                  to="/creations/$slug"
                  params={{ slug: service.slug }}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{service.name}</span>
                  <ArrowUpRight size={13} />
                </Link>
              ))}
            </div>
          </div>
          {sections.slice(1).map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="/#faq" className="nav-mobile-only" onClick={() => setMenuOpen(false)}>
            FAQ
          </a>
          <a
            href={`tel:${contact.phone}`}
            className="nav-mobile-only"
            onClick={() => setMenuOpen(false)}
          >
            <Phone size={14} /> {contact.label}
          </a>
          <div className="nav-mobile-only nav-mobile-creations">
            {serviceDetails.map((service) => (
              <Link
                key={service.slug}
                to="/creations/$slug"
                params={{ slug: service.slug }}
                onClick={() => setMenuOpen(false)}
              >
                {service.name}
              </Link>
            ))}
          </div>
        </nav>

        <Button variant="luxury" className="nav-consultation" asChild>
          <a href="/#concierge">
            Request Consultation <ArrowUpRight />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X /> : <Menu />}
        </Button>
      </div>
      <ScrollProgress />
    </header>
  );
}
