import { occasionEntries } from "@/lib/occasion-entries";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollProgress } from "@/components/balloon/scroll-progress";
import { contact } from "@/lib/celebrations";
import { serviceDetails } from "@/lib/service-details";
import logoAsset from "@/assets/profile-logo.jpg.asset.json";
const logo = logoAsset.url;

const sections = [
  { to: "/signature-standard", label: "The signature standard" },
  { to: "/lets-celebrate", label: "Let’s celebrate" },
  { to: "/faqs", label: "FAQs" },
] as const;

export function SiteHeader() {
  const brandTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (brandTimer.current) clearTimeout(brandTimer.current);
    },
    [],
  );
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
          onClick={(event) => {
            setMenuOpen(false);
            const el = event.currentTarget;
            el.classList.remove("is-playing");
            void el.offsetWidth;
            el.classList.add("is-playing");
            if (brandTimer.current) clearTimeout(brandTimer.current);
            brandTimer.current = setTimeout(() => el.classList.remove("is-playing"), 9000);
          }}
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
              <span className="brand-descriptor">We decorate your happiness</span>
            </span>
          </span>
        </Link>

        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          <div className="nav-drop">
            <Link
              to="/our-creations"
              activeProps={{ "aria-current": "page" }}
              className="nav-drop-trigger"
              onClick={() => setMenuOpen(false)}
            >
              Our creations
            </Link>
            <div className="nav-drop-panel" role="group" aria-label="Our creations">
              <Link to="/our-creations" onClick={() => setMenuOpen(false)}>
                View the celebration gallery <ArrowUpRight size={13} />
              </Link>
              <Link to="/" hash="portfolio" onClick={() => setMenuOpen(false)}>
                Browse all {occasionEntries.length} occasions <ArrowUpRight size={13} />
              </Link>
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
          {sections.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ "aria-current": "page" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About us
          </Link>
          <a
            href={`tel:${contact.phone}`}
            className="nav-mobile-only"
            onClick={() => setMenuOpen(false)}
          >
            <Phone size={14} /> {contact.label}
          </a>
          <div className="nav-mobile-only nav-mobile-creations">
            <Link to="/our-creations" onClick={() => setMenuOpen(false)}>
              View the celebration gallery
            </Link>
            <Link to="/" hash="portfolio" onClick={() => setMenuOpen(false)}>
              Browse all {occasionEntries.length} occasions
            </Link>
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
          <Link to="/lets-celebrate" hash="callback" onClick={() => setMenuOpen(false)}>
            Request Consultation <ArrowUpRight />
          </Link>
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
