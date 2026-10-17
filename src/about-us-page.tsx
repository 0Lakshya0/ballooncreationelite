/**
 * ============================================================================
 *  BALLOON CREATION — ABOUT US PAGE  (single copy-paste file)
 * ============================================================================
 *  Ye ek hi file mein poora page hai:
 *    • Header + mobile menu
 *    • Hero, ticker, 10-year story, Triad, Vow, Process, Gallery, FAQ, CTA
 *    • Footer
 *    • Poori CSS (neeche `aboutStyles` mein) — koi alag stylesheet nahi chahiye
 *    • SEO structured data (LocalBusiness JSON-LD)
 *
 *  DEPENDENCIES: sirf React. Koi UI library, koi icon package, koi CSS file nahi.
 *
 *  USE KAISE KAREIN
 *  1) File copy karke apne project mein rakhein, e.g. `src/pages/AboutUs.tsx`.
 *  2) Neeche "EDIT 1" mein apne 3 photos ke path daalein.
 *  3) "EDIT 2" mein apna phone / WhatsApp / Instagram daalein.
 *  4) Router mein `<AboutUs />` render kar dein (Next.js: `app/about/page.tsx`).
 *
 *  NOTE: nav links `/#portfolio` type ke hain — agar aapka router alag hai to
 *        "EDIT 3" wale 5 links apne routes se badal lein.
 * ============================================================================
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

/* ---------------------------------------------------------------------------
 * EDIT 1 — Apni photos (import ya public URL, dono chalega)
 * ------------------------------------------------------------------------- */
import weddingPhoto from "./assets/wedding.jpg";
import anniversaryPhoto from "./assets/anniversary.jpg";
import hallPhoto from "./assets/celebration-hero.jpg";

/* ---------------------------------------------------------------------------
 * EDIT 2 — Brand + contact details
 * ------------------------------------------------------------------------- */
const BRAND = {
  name: "Balloon Creation",
  tagline: "We Decorate Your Happiness",
  descriptor:
    "Bespoke flowers, sculptural balloons and celebrations staged with care across Indore. We decorate your happiness.",
  phone: "+917489863753",
  phoneLabel: "+91 74898 63753",
  whatsapp: "https://wa.me/917489863753",
  city: "Indore, Madhya Pradesh",
  years: 10,
};

const waLink = (message: string) => `${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
const WA_DEFAULT =
  "Hello Balloon Creation! I would like to check availability for my celebration in Indore.";

/* ---------------------------------------------------------------------------
 * EDIT 3 — Navigation (apne routes ke hisaab se badlein)
 * ------------------------------------------------------------------------- */
const NAV = [
  { label: "Our creations", href: "/#portfolio" },
  { label: "About us", href: "/about", current: true },
  { label: "Let’s celebrate", href: "/#concierge" },
];

const GALLERY = [
  {
    name: "Mega Birthdays",
    subtitle: "Another year. An extraordinary celebration.",
    image: weddingPhoto,
    alt: "Birthday styling by Balloon Creation",
  },
  {
    name: "Anniversaries & Surprises",
    subtitle: "For the moments only love can create.",
    image: anniversaryPhoto,
    alt: "Anniversary styling by Balloon Creation",
  },
  {
    name: "Baby Showers",
    subtitle: "Little beginnings. Beautiful memories.",
    image: hallPhoto,
    alt: "Baby shower styling by Balloon Creation",
  },
];

const PILLARS = [
  {
    icon: "pin",
    index: "01",
    title: "Indore, citywide",
    detail: "100% Indore coverage",
    copy: "From the polished avenues of Vijay Nagar and Saket to premium townships across the city, our concierge-led planning and polished on-site finish travel with you.",
    link: null,
  },
  {
    icon: "gem",
    index: "02",
    title: "What you approve is what we build",
    detail: "100% exact-match promise*",
    copy: "Choose a design from our portfolio. Your approved palette, composition, structure and key details become the installation benchmark—no unapproved substitutions.",
    link: { href: "/#portfolio", label: "Explore the portfolio" },
  },
  {
    icon: "sparkle",
    index: "03",
    title: "Every celebration. Every scale.",
    detail: "One creative team",
    copy: "Weddings, birthdays, baby showers, anniversaries, corporate events and devotional celebrations—elevated with premium structures, venue-approved cold-spark moments and smoke entries.",
    link: { href: "/#concierge", label: "Plan your occasion" },
  },
];

const STEPS = [
  {
    title: "The first conversation",
    copy: "Share your date, venue and the feeling you are after. We listen before we sketch.",
  },
  {
    title: "The design",
    copy: "A considered concept shaped around your people, your palette and the room itself.",
  },
  {
    title: "The approval",
    copy: "You approve the design and scope before we build. What you approve becomes our benchmark.",
  },
  {
    title: "The reveal",
    copy: "Our crew arrives early, styles on site, checks every angle and leaves the venue immaculate.",
  },
];

const ASSURANCES = [
  { icon: "users", label: "A dedicated setup crew" },
  { icon: "gem", label: "On-site styling checks" },
  { icon: "shield", label: "Approved scope, respected" },
  { icon: "clock", label: "Early arrival, immaculate handover" },
];

const VOW_POINTS = [
  "Approved before we build",
  "Checked before we leave",
  "Informed before we change",
];

const FAQS = [
  {
    q: "What does the exact-match promise actually cover?",
    a: "The design you approve—palette, composition, structure and key details—becomes our installation benchmark. The promise applies to that approved design and agreed scope. If your venue introduces a constraint, we tell you before anything changes.",
  },
  {
    q: "Are cold sparks and smoke entries safe at my venue?",
    a: "We use venue-approved cold-spark and smoke effects, staged by our crew within the permissions your venue allows. Share the venue with us early and we will confirm what is possible before the design is finalised.",
  },
  {
    q: "Do you travel across Indore?",
    a: "Yes—100% Indore coverage, from Vijay Nagar and Saket to premium townships and venues across the city. Tell us the venue and we will plan the setup window around it.",
  },
  {
    q: "How early should we book our date?",
    a: "Every bespoke installation needs a dedicated crew and a planned setup window, so peak dates are limited by capacity rather than demand. The earlier you share your date and venue, the more room we have to design without compromise.",
  },
];

/* ---------------------------------------------------------------------------
 * Inline icons — no external icon package
 * ------------------------------------------------------------------------- */
const ICON_PATHS: Record<string, ReactNode> = {
  arrow: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  check: (
    <>
      <path d="M20 6 9 17l-5-5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  gem: (
    <>
      <path d="M6 3h12l4 6-10 12L2 9Z" />
      <path d="M2 9h20" />
      <path d="m9 3-2 6 5 12 5-12-2-6" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  message: (
    <>
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.9L3 21l1.9-4.8A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
    </>
  ),
  phone: (
    <>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  sparkle: (
    <>
      <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9Z" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
    </>
  ),
  menu: (
    <>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </>
  ),
  close: (
    <>
      <path d="M18 6 6 18M6 6l12 12" />
    </>
  ),
};

function Icon({
  name,
  size = 18,
  strokeWidth = 1.3,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICON_PATHS[name] ?? ICON_PATHS["sparkle"]}
    </svg>
  );
}

/* ===========================================================================
 * COMPONENT
 * ======================================================================== */
export default function AboutUsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  /* scroll reveal */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0, rootMargin: "0px 0px 70px 0px" },
    );
    root.querySelectorAll(".ab-reveal").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  /* mobile menu: escape to close + scroll lock */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BRAND.name,
    description:
      "Bespoke balloon and floral styling for weddings, birthdays, baby showers, anniversaries, corporate and devotional celebrations across Indore.",
    telephone: BRAND.phone,
    areaServed: { "@type": "City", name: "Indore" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Indore",
      addressRegion: "Madhya Pradesh",
      addressCountry: "IN",
    },
    slogan: BRAND.tagline,
  };

  return (
    <div className="ab-root" ref={rootRef}>
      <style>{aboutStyles}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <a className="ab-skip" href="#ab-main">
        Skip to content
      </a>

      {/* ------------------------------------------------ HEADER */}
      <header className="ab-head">
        <div className="ab-container ab-head-inner">
          <a className="ab-brand" href="/" aria-label={`${BRAND.name} — home`}>
            <span className="ab-brand-mark" aria-hidden="true">
              <svg viewBox="0 0 48 48" width="100%" height="100%">
                <circle cx="24" cy="24" r="23" fill="#fffdf6" stroke="#b98c3f" strokeWidth="1" />
                <ellipse cx="24" cy="18" rx="5.4" ry="6.8" fill="#c39a4c" />
                <path d="M22.5 25h3l-1.5 2.4z" fill="#a97c33" />
                <path
                  d="M24 27.4c1.9 2.6 3.4 3.7 2.9 6.1"
                  stroke="#b98c3f"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                />
                <text
                  x="23.6"
                  y="42"
                  textAnchor="middle"
                  fontFamily="Georgia, serif"
                  fontSize="11"
                  fill="#8d6527"
                >
                  BC
                </text>
              </svg>
            </span>
            <span className="ab-brand-text">
              <span className="ab-brand-name">{BRAND.name}</span>
              <span className="ab-brand-tag">{BRAND.tagline}</span>
            </span>
          </a>

          <nav
            id="ab-nav"
            className={`ab-nav${menuOpen ? " is-open" : ""}`}
            aria-label="Main navigation"
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a className="ab-nav-cta" href="/#concierge" onClick={() => setMenuOpen(false)}>
              Request consultation <Icon name="arrow" size={14} />
            </a>
          </nav>

          <a className="ab-btn ab-btn-sm ab-head-cta" href="/#concierge">
            Request Consultation <Icon name="arrow" size={14} />
          </a>

          <button
            type="button"
            className="ab-nav-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="ab-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={22} />
          </button>
        </div>
      </header>

      <main id="ab-main">
        {/* ------------------------------------------------ HERO */}
        <section className="ab-hero">
          <div className="ab-container ab-hero-grid">
            <div className="ab-hero-copy ab-reveal">
              <nav className="ab-crumbs" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span aria-hidden="true">/</span>
                <span aria-current="page">About us</span>
              </nav>

              <span className="ab-eyebrow">
                <span className="ab-line" /> About Balloon Creation · Indore
              </span>
              <h1 className="ab-h1">
                The doors open.
                <br />
                <em>Your moment begins.</em>
              </h1>
              <p className="ab-lede">
                {BRAND.years} years of transforming Indore venues into immersive celebrations—where
                sculptural balloon artistry, considered florals and immaculate staging feel as
                personal as they are grand.
              </p>

              <div className="ab-actions">
                <a className="ab-btn" href="/#concierge">
                  Check date availability <Icon name="arrow" size={15} />
                </a>
                <a className="ab-text-link" href="/#portfolio">
                  Explore the portfolio <Icon name="arrow" size={14} />
                </a>
              </div>

              <ul className="ab-facts" aria-label="Balloon Creation at a glance">
                <li>
                  <strong>{BRAND.years}</strong>
                  <span>Years of celebrations</span>
                </li>
                <li>
                  <strong>
                    100<em>%</em>
                  </strong>
                  <span>Indore coverage</span>
                </li>
                <li>
                  <strong>
                    100<em>%*</em>
                  </strong>
                  <span>Approved-design match</span>
                </li>
              </ul>
            </div>

            <div className="ab-hero-visual ab-reveal">
              <span className="ab-seal" aria-hidden="true">
                <strong>{BRAND.years}</strong>
                <span>Years</span>
                <em>Indore</em>
              </span>
              <figure className="ab-portrait">
                <img
                  src={weddingPhoto}
                  alt="A floral and balloon wedding arch staged inside a palace courtyard in Indore"
                  width={1024}
                  height={1024}
                  fetchPriority="high"
                  decoding="async"
                />
                <figcaption>The wedding edit · Indore</figcaption>
              </figure>
              <img
                className="ab-inset"
                src={anniversaryPhoto}
                alt="An intimate anniversary table styled with roses, candles and champagne balloons"
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
              />
              <div className="ab-quote">
                <span>The feeling we stage</span>
                <p>“The breath before the entrance.”</p>
              </div>
              <span className="ab-vertical" aria-hidden="true">
                Beautifully beyond ordinary
              </span>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ TICKER */}
        <div className="ab-ticker" aria-hidden="true">
          <div className="ab-ticker-track">
            {[0, 1].map((group) => (
              <div className="ab-ticker-group" key={group}>
                <span>Sculptural balloons</span>
                <em>✦</em>
                <span>Considered florals</span>
                <em>✦</em>
                <span>Venue-approved effects</span>
                <em>✦</em>
                <span>Immaculate staging</span>
                <em>✦</em>
                <span>Every detail, considered</span>
                <em>✦</em>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------ 10-YEAR EPOCH */}
        <section className="ab-section">
          <div className="ab-container ab-split">
            <div className="ab-media ab-reveal">
              <img
                src={hallPhoto}
                alt="A candlelit banquet hall dressed with sculptural balloons and white florals"
                width={1920}
                height={1024}
                loading="lazy"
                decoding="async"
              />
              <div className="ab-plaque">
                <strong>{BRAND.years}</strong>
                <span>Years of craft · Indore</span>
              </div>
            </div>
            <div className="ab-reveal">
              <div className="ab-head-block">
                <span className="ab-eyebrow">01 — The 10-year epoch</span>
                <h2 className="ab-h2">
                  An empty venue is only <em>the opening scene.</em>
                </h2>
              </div>
              <p className="ab-lead">
                We shape the breath before an entrance—the first flash of colour when the doors
                open, the instant a roomful of people sees a celebration made for one family, one
                milestone, one unforgettable night.
              </p>
              <p>
                From the gracious warmth of Vijay Nagar and Saket to premium townships across
                Indore, we pair the city’s hospitality with visual choreography on a grand scale:
                sculptural balloon installations, considered florals, premium themed structures and
                a finish so composed it feels effortless.
              </p>
              <p>
                {BRAND.years} years in, the instinct has not changed. Understand the people first.
                Then build the room around them. We don’t decorate to fill a space—we stage the
                feeling you want people to remember.
              </p>
              <span className="ab-sign">The Balloon Creation studio · Indore</span>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ TRIAD */}
        <section className="ab-section ab-band">
          <div className="ab-container">
            <div className="ab-head-block ab-center ab-reveal">
              <span className="ab-eyebrow">02 — The triad of dominance</span>
              <h2 className="ab-h2">
                Three promises. <em>No fine print on the feeling.</em>
              </h2>
              <p className="ab-sub">
                The details that decide whether a celebration feels beautiful—or unforgettable.
                These are the standards we hold every single time.
              </p>
            </div>

            <div className="ab-pillars">
              {PILLARS.map((p) => (
                <article className="ab-pillar ab-reveal" key={p.index}>
                  <div className="ab-pillar-top">
                    <span className="ab-icon">
                      <Icon name={p.icon} size={23} />
                    </span>
                    <span className="ab-num">{p.index}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <span className="ab-detail">{p.detail}</span>
                  <p>{p.copy}</p>
                  {p.link && (
                    <a className="ab-link" href={p.link.href}>
                      {p.link.label} <Icon name="arrow" size={13} />
                    </a>
                  )}
                </article>
              ))}
            </div>

            <p className="ab-note">
              *The exact-match promise applies to the approved design and agreed scope. Venue
              dimensions and permissions may affect special effects; we agree any required
              adjustment with you before installation.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------ VOW */}
        <section className="ab-vow">
          <img
            className="ab-vow-bg"
            src={hallPhoto}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          <div className="ab-container ab-vow-inner ab-reveal">
            <span className="ab-eyebrow">03 — The unspoken vow</span>
            <h2 className="ab-h2">
              Hours before the first guest, <em>the room is already right.</em>
            </h2>
            <p>
              While your guests are still on their way, our crew is on site—checking symmetry,
              sightlines, finishes and every detail against the approved plan. The venue is left
              immaculate and guest-ready. If a constraint appears, you hear from us before an agreed
              detail changes. The only surprise should be the reveal.
            </p>
            <ul className="ab-vow-points">
              {VOW_POINTS.map((point) => (
                <li key={point}>
                  <Icon name="check" size={14} /> {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------ PROCESS */}
        <section className="ab-section">
          <div className="ab-container">
            <div className="ab-process-head ab-reveal">
              <div className="ab-head-block">
                <span className="ab-eyebrow">04 — The approach</span>
                <h2 className="ab-h2">
                  Simple for you. <em>Meticulous behind the scenes.</em>
                </h2>
              </div>
              <p>
                Four calm steps from the first hello to the final reveal. You never have to wonder
                what happens next.
              </p>
            </div>

            <div className="ab-steps">
              {STEPS.map((step, i) => (
                <div className="ab-step ab-reveal" key={step.title}>
                  <span className="ab-step-num">0{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              ))}
            </div>

            <div className="ab-assurances">
              {ASSURANCES.map((a) => (
                <div className="ab-assurance ab-reveal" key={a.label}>
                  <Icon name={a.icon} size={17} /> {a.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ GALLERY */}
        <section className="ab-section ab-band">
          <div className="ab-container">
            <div className="ab-gallery-head ab-reveal">
              <div className="ab-head-block">
                <span className="ab-eyebrow">05 — The portfolio</span>
                <h2 className="ab-h2">
                  A city of moments, <em>beautifully staged.</em>
                </h2>
              </div>
              <a className="ab-text-link" href="/#portfolio">
                See all creations <Icon name="arrow" size={14} />
              </a>
            </div>

            <div className="ab-shots">
              {GALLERY.map((item) => (
                <a className="ab-shot ab-reveal" href="/#portfolio" key={item.name}>
                  <img
                    src={item.image}
                    alt={item.alt}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="ab-shot-label">
                    <strong>{item.name}</strong>
                    <span>{item.subtitle}</span>
                  </span>
                  <span className="ab-shot-arrow">
                    <Icon name="arrow" size={14} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ FAQ */}
        <section className="ab-section">
          <div className="ab-container ab-faq">
            <div className="ab-head-block ab-reveal">
              <span className="ab-eyebrow">06 — Before you ask</span>
              <h2 className="ab-h2">
                Thoughtful answers, <em>before you commit.</em>
              </h2>
              <p className="ab-sub">
                Every celebration begins with a question. These are the ones we are asked most
                often—answered honestly.
              </p>
              <div className="ab-faq-cta">
                <a
                  className="ab-text-link"
                  href={waLink(WA_DEFAULT)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ask us on WhatsApp <Icon name="arrow" size={14} />
                </a>
                <a className="ab-phone" href={`tel:${BRAND.phone}`}>
                  <Icon name="phone" size={14} /> {BRAND.phoneLabel}
                </a>
              </div>
            </div>

            <div className="ab-faq-list ab-reveal">
              {FAQS.map((item, i) => (
                <details className="ab-faq-item" key={item.q} open={i === 0}>
                  <summary>
                    <span>{item.q}</span>
                    <span className="ab-plus" aria-hidden="true" />
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ CLOSER */}
        <section className="ab-close">
          <div className="ab-container">
            <div className="ab-close-panel ab-reveal">
              <img src={hallPhoto} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              <div className="ab-close-copy">
                <span className="ab-eyebrow">Your date. Your story.</span>
                <h2 className="ab-h2">
                  Give your moment the <em>grand entrance</em> it deserves.
                </h2>
                <p>
                  Every bespoke installation needs a dedicated crew and a carefully planned setup
                  window. Peak dates are limited by capacity—share your date and venue, and we will
                  check availability.
                </p>
                <div className="ab-close-actions">
                  <a className="ab-btn" href="/#concierge">
                    Check date availability <Icon name="arrow" size={15} />
                  </a>
                  <a
                    className="ab-ghost"
                    href={waLink(WA_DEFAULT)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="message" size={16} /> WhatsApp the studio
                  </a>
                  <a className="ab-phone ab-phone-light" href={`tel:${BRAND.phone}`}>
                    <Icon name="phone" size={14} /> {BRAND.phoneLabel}
                  </a>
                </div>
              </div>
            </div>
            <p className="ab-note">
              *The exact-match promise applies to the approved design and agreed scope. Venue
              permissions and dimensions may affect special effects; any adjustment is agreed with
              you in advance.
            </p>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------ FOOTER */}
      <footer className="ab-foot">
        <div className="ab-container ab-foot-grid">
          <div>
            <a className="ab-brand" href="/">
              <span className="ab-brand-text">
                <span className="ab-brand-name">{BRAND.name}</span>
              </span>
            </a>
            <p>{BRAND.descriptor}</p>
          </div>
          <nav className="ab-foot-col" aria-label="Footer navigation">
            <span className="ab-foot-head">Explore</span>
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="ab-foot-col">
            <span className="ab-foot-head">The studio</span>
            <a href={`tel:${BRAND.phone}`}>
              <Icon name="phone" size={13} /> {BRAND.phoneLabel}
            </a>
            <a href={waLink(WA_DEFAULT)} target="_blank" rel="noreferrer">
              <Icon name="message" size={13} /> WhatsApp the studio
            </a>
            <span>{BRAND.city}</span>
          </div>
        </div>
        <div className="ab-container ab-foot-base">
          <span>
            © {new Date().getFullYear()} {BRAND.name}
          </span>
          <span>Crafted for your moments · Indore</span>
          <a href="#ab-main">Back to top ↑</a>
        </div>
      </footer>

      {/* ------------------------------------------------ STICKY MOBILE CTA */}
      <div className="ab-mobile-bar">
        <a className="ab-btn ab-mobile-primary" href="/#concierge">
          Check date availability <Icon name="arrow" size={15} />
        </a>
        <a
          className="ab-mobile-wa"
          href={waLink(WA_DEFAULT)}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp the Balloon Creation studio"
        >
          <Icon name="message" size={19} />
        </a>
      </div>
    </div>
  );
}

/* ===========================================================================
 * STYLES — isi file ke andar. Sab kuch `.ab-` prefix se scoped hai.
 * ======================================================================== */
const aboutStyles = `
.ab-root {
  --ab-ink: #37301f;
  --ab-ink-soft: #6b5f4c;
  --ab-gold: #a97c33;
  --ab-gold-soft: #c39a4c;
  --ab-cream: #fdfaf0;
  --ab-sand: #f6ecda;
  --ab-line: rgba(169, 124, 51, .26);
  --ab-glass: rgba(255, 253, 246, .72);
  --ab-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --ab-sans: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-family: var(--ab-sans);
  color: var(--ab-ink);
  background: linear-gradient(160deg, #fdfaf0, #f7efe0 55%, #fbf3e6);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
.ab-root *, .ab-root *::before, .ab-root *::after { box-sizing: border-box; }
.ab-root img { display: block; max-width: 100%; }
.ab-root h1, .ab-root h2, .ab-root h3, .ab-root p, .ab-root ul { margin: 0; }
.ab-root ul { padding: 0; list-style: none; }
.ab-root a { color: inherit; text-decoration: none; }
.ab-root :focus-visible { outline: 2px solid var(--ab-gold); outline-offset: 4px; }

.ab-container { width: min(1240px, calc(100% - 96px)); margin-inline: auto; }
.ab-skip { position: absolute; left: -9999px; top: 0; z-index: 200; padding: 12px 20px; background: var(--ab-ink); color: #fff; font-size: 13px; }
.ab-skip:focus { left: 16px; top: 16px; }

/* ---------- buttons ---------- */
.ab-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 9px;
  height: 50px; padding-inline: 24px; border-radius: 3px; border: 1px solid rgba(169,124,51,.5);
  background: linear-gradient(115deg, #e6cf9a, #c9a252 45%, #e8d29b 75%, #cda45a);
  color: #2a2418; font-size: 13px; font-weight: 600; letter-spacing: .01em;
  box-shadow: 0 6px 20px rgba(169,124,51,.22);
  transition: transform .3s ease, box-shadow .3s ease;
}
.ab-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(169,124,51,.3); }
.ab-btn-sm { height: 42px; padding-inline: 18px; font-size: 12px; }
.ab-text-link { display: inline-flex; align-items: center; gap: 8px; padding-bottom: 4px; border-bottom: 1px solid var(--ab-line); font-size: 13px; transition: color .25s, gap .25s, border-color .25s; }
.ab-text-link:hover { color: var(--ab-gold); gap: 12px; border-color: var(--ab-gold); }

/* ---------- header ---------- */
.ab-head { position: sticky; top: 0; z-index: 60; background: rgba(253,250,240,.86); backdrop-filter: blur(20px); border-bottom: 1px solid var(--ab-line); }
.ab-head-inner { display: flex; align-items: center; justify-content: space-between; gap: 22px; height: 92px; }
.ab-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
.ab-brand-mark { width: 50px; height: 50px; flex: none; display: block; }
.ab-brand-name { display: block; font-family: var(--ab-display); font-size: 30px; font-weight: 700; line-height: 1; color: #8a5f2c; background: linear-gradient(110deg, #8a5f2c, #b4863c 70%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.ab-brand-tag { display: block; margin-top: 5px; font-size: 11px; letter-spacing: .05em; color: var(--ab-ink-soft); }
.ab-nav { display: flex; align-items: center; gap: 30px; font-size: 14px; }
.ab-nav a { position: relative; padding-block: 4px; transition: color .2s; }
.ab-nav a:hover { color: var(--ab-gold); }
.ab-nav a[aria-current="page"] { color: var(--ab-gold); }
.ab-nav a[aria-current="page"]::after { content: ''; position: absolute; left: 0; right: 0; bottom: -4px; height: 1px; background: var(--ab-gold); }
.ab-nav-cta { display: none; }
.ab-nav-toggle { display: none; align-items: center; justify-content: center; width: 40px; height: 40px; border: 1px solid var(--ab-line); border-radius: 50%; background: transparent; color: var(--ab-ink); cursor: pointer; }

/* ---------- hero ---------- */
.ab-hero { position: relative; padding-block: 54px 76px; }
.ab-hero::before { content: ''; position: absolute; top: -230px; right: -190px; width: 620px; height: 620px; border-radius: 50%; background: radial-gradient(circle, rgba(214,180,108,.36), transparent 68%); pointer-events: none; }
.ab-hero-grid { position: relative; display: grid; grid-template-columns: 1.02fr .98fr; gap: 64px; align-items: center; }
.ab-crumbs { display: flex; align-items: center; gap: 8px; margin-bottom: 26px; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--ab-ink-soft); }
.ab-crumbs a:hover { color: var(--ab-gold); }
.ab-crumbs span[aria-current] { color: var(--ab-gold); }
.ab-eyebrow { display: inline-flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 600; letter-spacing: .13em; text-transform: uppercase; color: var(--ab-gold); }
.ab-line { width: 30px; height: 1px; background: var(--ab-gold); }
.ab-h1 { margin-top: 18px; font-family: var(--ab-display); font-size: clamp(44px, 5.3vw, 70px); font-weight: 600; line-height: 1.02; letter-spacing: -.01em; }
.ab-h1 em { font-style: italic; background: linear-gradient(110deg, #a35f45, #a97c33 70%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.ab-lede { max-width: 560px; margin-top: 24px !important; font-size: 16px; line-height: 1.9; color: var(--ab-ink-soft); }
.ab-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 16px 26px; margin-top: 30px; }
.ab-actions + .ab-facts { margin-top: 46px; }
.ab-facts { display: flex; flex-wrap: wrap; margin-top: 44px; padding-top: 24px; border-top: 1px solid var(--ab-line); }
.ab-facts li { display: flex; flex-direction: column; gap: 5px; padding-inline: 26px; border-left: 1px solid var(--ab-line); }
.ab-facts li:first-child { padding-left: 0; border-left: 0; }
.ab-facts strong { font-family: var(--ab-display); font-size: 32px; font-weight: 600; line-height: 1; }
.ab-facts strong em { color: var(--ab-gold); font-style: normal; }
.ab-facts span { font-size: 10px; letter-spacing: .13em; text-transform: uppercase; color: var(--ab-ink-soft); }

.ab-hero-visual { position: relative; padding: 10px 26px 32px 6px; }
.ab-hero-visual::before { content: ''; position: absolute; inset: 38px -8px -4px 40px; border: 1px solid var(--ab-line); border-radius: 6px; }
.ab-portrait { position: relative; margin: 0; overflow: hidden; aspect-ratio: 4 / 4.5; border-radius: 6px; background: var(--ab-sand); box-shadow: 0 40px 80px -34px rgba(90,70,30,.5); }
.ab-portrait img { width: 100%; height: 100%; object-fit: cover; object-position: center 46%; transition: transform 1.2s ease; }
.ab-hero-visual:hover .ab-portrait img { transform: scale(1.035); }
.ab-portrait::after { content: ''; position: absolute; inset: 14px; border: 1px solid rgba(255,255,255,.35); border-radius: 3px; pointer-events: none; }
.ab-portrait figcaption { position: absolute; z-index: 2; top: 22px; left: 22px; padding: 9px 13px; border: 1px solid rgba(232,210,155,.5); background: rgba(38,30,18,.4); backdrop-filter: blur(12px); color: #fbf5e6; font-size: 9px; letter-spacing: .16em; text-transform: uppercase; }
.ab-inset { position: absolute; z-index: 3; right: 4px; bottom: 36px; width: 148px; aspect-ratio: 1; object-fit: cover; border: 5px solid var(--ab-cream); border-radius: 3px; box-shadow: 0 18px 40px -16px rgba(90,70,30,.5); }
.ab-quote { position: absolute; z-index: 4; left: -14px; bottom: 62px; width: min(252px, 74%); padding: 19px 21px; border: 1px solid var(--ab-line); border-radius: 5px; background: var(--ab-glass); backdrop-filter: blur(16px); box-shadow: 0 14px 40px rgba(90,70,30,.12); }
.ab-quote span { font-size: 9px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--ab-gold); }
.ab-quote p { margin-top: 7px; font-family: var(--ab-display); font-style: italic; font-size: 21px; line-height: 1.3; }
.ab-seal { position: absolute; z-index: 5; top: -12px; right: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 94px; height: 94px; border: 1px solid var(--ab-line); border-radius: 50%; background: var(--ab-cream); box-shadow: 0 8px 24px rgba(90,70,30,.16); }
.ab-seal::before { content: ''; position: absolute; inset: 6px; border: 1px dashed var(--ab-gold); border-radius: 50%; opacity: .55; animation: ab-spin 34s linear infinite; }
.ab-seal strong { font-family: var(--ab-display); font-size: 28px; font-weight: 600; line-height: 1; color: var(--ab-gold); }
.ab-seal span { margin-top: 2px; font-size: 7.5px; letter-spacing: .2em; text-transform: uppercase; }
.ab-seal em { font-style: normal; font-size: 7px; letter-spacing: .18em; text-transform: uppercase; color: var(--ab-ink-soft); }
.ab-vertical { position: absolute; top: 50%; right: -38px; transform: translateY(-50%); writing-mode: vertical-rl; font-size: 9px; letter-spacing: .3em; text-transform: uppercase; color: var(--ab-ink-soft); white-space: nowrap; }
@keyframes ab-spin { to { transform: rotate(360deg); } }

/* ---------- ticker ---------- */
.ab-ticker { overflow: hidden; border-block: 1px solid var(--ab-line); background: rgba(249,240,224,.75); }
.ab-ticker-track { display: flex; width: max-content; animation: ab-marquee 38s linear infinite; }
.ab-ticker-group { display: flex; align-items: center; gap: 30px; padding: 15px 15px; }
.ab-ticker span { white-space: nowrap; font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase; color: var(--ab-ink-soft); }
.ab-ticker em { color: var(--ab-gold); font-style: normal; }
@keyframes ab-marquee { to { transform: translateX(-50%); } }

/* ---------- sections ---------- */
.ab-section { padding-block: clamp(64px, 7.5vw, 104px); }
.ab-band { background: rgba(249,240,224,.62); border-block: 1px solid var(--ab-line); }
.ab-split { display: grid; grid-template-columns: .94fr 1.06fr; align-items: center; gap: clamp(40px, 5.5vw, 88px); }
.ab-head-block { max-width: 760px; }
.ab-center { margin-inline: auto; text-align: center; }
.ab-h2 { margin-top: 14px; font-family: var(--ab-display); font-size: clamp(34px, 4.2vw, 52px); font-weight: 600; line-height: 1.07; }
.ab-h2 em { font-style: italic; color: #a05f45; }
.ab-sub { max-width: 620px; margin-top: 16px !important; font-size: 15px; line-height: 1.9; color: var(--ab-ink-soft); }
.ab-center .ab-sub { margin-inline: auto; }
.ab-lead { margin-top: 24px !important; font-family: var(--ab-display); font-size: 22px; line-height: 1.62; }
.ab-split p:not(.ab-lead) { margin-top: 16px; font-size: 15px; line-height: 1.95; color: var(--ab-ink-soft); }
.ab-sign { display: inline-flex; align-items: center; gap: 12px; margin-top: 26px; font-size: 10px; letter-spacing: .17em; text-transform: uppercase; color: var(--ab-gold); }
.ab-sign::before { content: ''; width: 36px; height: 1px; background: var(--ab-gold); }

/* ---------- media / plaque ---------- */
.ab-media { position: relative; padding: 0 26px 30px 0; }
.ab-media::before { content: ''; position: absolute; inset: 24px -2px 0 26px; border: 1px solid var(--ab-line); border-radius: 6px; }
.ab-media > img { position: relative; width: 100%; aspect-ratio: 4 / 4.5; object-fit: cover; border-radius: 6px; box-shadow: 0 22px 48px -22px rgba(90,70,30,.45); }
.ab-plaque { position: absolute; z-index: 2; right: -2px; bottom: 0; min-width: 146px; padding: 18px 20px; border: 1px solid var(--ab-line); background: var(--ab-cream); box-shadow: 0 14px 40px rgba(90,70,30,.14); text-align: center; }
.ab-plaque strong { display: block; font-family: var(--ab-display); font-size: 42px; font-weight: 600; line-height: 1; color: var(--ab-gold); }
.ab-plaque span { display: block; margin-top: 6px; font-size: 8.5px; letter-spacing: .18em; text-transform: uppercase; color: var(--ab-ink-soft); }

/* ---------- pillars ---------- */
.ab-pillars { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; margin-top: 46px; align-items: stretch; }
.ab-pillar { display: flex; flex-direction: column; position: relative; overflow: hidden; padding: 30px 28px 28px; border: 1px solid var(--ab-line); border-radius: 6px; background: rgba(255,253,246,.66); backdrop-filter: blur(14px); box-shadow: 0 14px 40px rgba(90,70,30,.08); transition: transform .4s ease, box-shadow .4s ease; }
.ab-pillar::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(115deg, #e6cf9a, #b98c3f, #e8d29b); transform: scaleX(0); transform-origin: left; transition: transform .45s ease; }
.ab-pillar:hover { transform: translateY(-6px); box-shadow: 0 26px 54px -18px rgba(90,70,30,.28); }
.ab-pillar:hover::before { transform: scaleX(1); }
.ab-pillar-top { display: flex; align-items: center; justify-content: space-between; }
.ab-icon { display: grid; place-items: center; width: 46px; height: 46px; border: 1px solid var(--ab-line); border-radius: 50%; background: var(--ab-cream); color: var(--ab-gold); }
.ab-num { font-family: var(--ab-display); font-size: 16px; letter-spacing: .1em; color: var(--ab-ink-soft); }
.ab-pillar h3 { margin-top: 24px; font-family: var(--ab-display); font-size: 26px; font-weight: 600; line-height: 1.18; }
.ab-detail { display: block; margin-top: 9px; font-size: 10px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--ab-gold); }
.ab-pillar p { flex: 1; margin-top: 15px; font-size: 14px; line-height: 1.9; color: var(--ab-ink-soft); }
.ab-link { align-self: flex-start; display: inline-flex; align-items: center; gap: 7px; margin-top: 18px; padding-bottom: 4px; border-bottom: 1px solid var(--ab-line); font-size: 11.5px; transition: color .25s, gap .25s, border-color .25s; }
.ab-link:hover { gap: 11px; color: var(--ab-gold); border-color: var(--ab-gold); }
.ab-note { max-width: 1000px; margin-top: 24px !important; font-size: 10.5px; line-height: 1.75; color: var(--ab-ink-soft); }

/* ---------- vow ---------- */
.ab-vow { position: relative; overflow: hidden; padding-block: clamp(70px, 8.5vw, 112px); background: #2b2417; color: #f7f1e2; }
.ab-vow-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .16; filter: saturate(.7); }
.ab-vow::after { content: ''; position: absolute; inset: 0; background: linear-gradient(110deg, rgba(34,28,18,.96), rgba(44,36,23,.82) 55%, rgba(34,28,18,.95)); }
.ab-vow-inner { position: relative; z-index: 1; max-width: 920px; margin-inline: auto; text-align: center; }
.ab-vow .ab-eyebrow { justify-content: center; color: #e0c078; }
.ab-vow .ab-h2 { color: #fbf6e9; }
.ab-vow .ab-h2 em { color: #e6c67f; }
.ab-vow p { max-width: 760px; margin: 18px auto 0 !important; font-size: 15px; line-height: 1.95; color: rgba(247,241,226,.84); }
.ab-vow-points { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 32px; margin-top: 32px; }
.ab-vow-points li { display: inline-flex; align-items: center; gap: 8px; font-size: 10.5px; letter-spacing: .13em; text-transform: uppercase; color: rgba(247,241,226,.86); }
.ab-vow-points svg { color: #e6c67f; }

/* ---------- process ---------- */
.ab-process-head { display: grid; grid-template-columns: minmax(0,1fr) 300px; align-items: end; gap: 28px 50px; }
.ab-process-head > p { max-width: 300px; justify-self: end; font-size: 13px; line-height: 1.9; color: var(--ab-ink-soft); }
.ab-steps { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 0 12px; margin-top: 48px; }
.ab-step { position: relative; padding: 28px 22px 0 0; border-top: 1px solid var(--ab-line); }
.ab-step::before { content: ''; position: absolute; top: -3px; left: 0; width: 5px; height: 5px; border-radius: 50%; background: var(--ab-gold); }
.ab-step-num { font-family: var(--ab-display); font-size: 38px; line-height: 1; color: rgba(169,124,51,.5); }
.ab-step h3 { margin-top: 15px; font-family: var(--ab-display); font-size: 22px; font-weight: 600; line-height: 1.2; }
.ab-step p { max-width: 240px; margin-top: 9px; font-size: 13.5px; line-height: 1.85; color: var(--ab-ink-soft); }
.ab-assurances { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 14px; margin-top: 46px; }
.ab-assurance { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border: 1px solid var(--ab-line); border-radius: 4px; background: rgba(255,253,246,.62); font-size: 11.5px; line-height: 1.5; color: var(--ab-ink-soft); }
.ab-assurance svg { flex: none; color: var(--ab-gold); }

/* ---------- gallery ---------- */
.ab-gallery-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px 36px; }
.ab-shots { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 16px; margin-top: 42px; }
.ab-shot { position: relative; display: block; overflow: hidden; aspect-ratio: .82; border: 1px solid var(--ab-line); border-radius: 4px; }
.ab-shot img { width: 100%; height: 100%; object-fit: cover; transition: transform .9s ease; }
.ab-shot::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(38,30,18,.78), transparent 58%); }
.ab-shot:hover img { transform: scale(1.06); }
.ab-shot-label { position: absolute; z-index: 2; left: 16px; right: 44px; bottom: 15px; color: #fdf8ec; }
.ab-shot-label strong { display: block; font-family: var(--ab-display); font-size: 21px; font-weight: 600; line-height: 1.12; }
.ab-shot-label > span { display: block; margin-top: 4px; font-size: 10px; color: rgba(253,248,236,.78); }
.ab-shot-arrow { position: absolute; z-index: 2; right: 14px; bottom: 14px; display: grid; place-items: center; width: 30px; height: 30px; border: 1px solid rgba(255,255,255,.42); border-radius: 50%; background: rgba(38,30,18,.25); backdrop-filter: blur(8px); color: #fdf8ec; }

/* ---------- faq ---------- */
.ab-faq { display: grid; grid-template-columns: .85fr 1.15fr; gap: clamp(34px, 5vw, 72px); align-items: start; }
.ab-faq .ab-head-block { position: sticky; top: 120px; }
.ab-faq-cta { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 24px; margin-top: 24px; }
.ab-phone { display: inline-flex; align-items: center; gap: 7px; padding-bottom: 3px; border-bottom: 1px solid var(--ab-line); font-size: 12px; color: var(--ab-ink); transition: color .25s, border-color .25s; }
.ab-phone:hover { color: var(--ab-gold); border-color: var(--ab-gold); }
.ab-faq-list { border-top: 1px solid var(--ab-line); }
.ab-faq-item { border-bottom: 1px solid var(--ab-line); }
.ab-faq-item summary { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 20px 2px; cursor: pointer; list-style: none; font-family: var(--ab-display); font-size: 20px; font-weight: 600; line-height: 1.32; transition: color .25s; }
.ab-faq-item summary::-webkit-details-marker { display: none; }
.ab-faq-item summary:hover { color: var(--ab-gold); }
.ab-plus { position: relative; flex: none; width: 24px; height: 24px; border: 1px solid var(--ab-line); border-radius: 50%; }
.ab-plus::before, .ab-plus::after { content: ''; position: absolute; top: 50%; left: 50%; width: 9px; height: 1px; background: var(--ab-gold); transform: translate(-50%,-50%); transition: transform .3s ease; }
.ab-plus::after { transform: translate(-50%,-50%) rotate(90deg); }
.ab-faq-item[open] .ab-plus::after { transform: translate(-50%,-50%) rotate(0deg); }
.ab-faq-item p { padding: 0 42px 20px 2px; font-size: 14px; line-height: 1.9; color: var(--ab-ink-soft); }

/* ---------- closer ---------- */
.ab-close { padding-block: clamp(60px, 7.5vw, 100px); }
.ab-close-panel { position: relative; display: flex; align-items: center; overflow: hidden; min-height: 420px; border: 1px solid var(--ab-line); border-radius: 10px; box-shadow: 0 40px 84px -44px rgba(90,70,30,.55); }
.ab-close-panel > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ab-close-panel::after { content: ''; position: absolute; inset: 0; background: linear-gradient(100deg, rgba(32,26,17,.94), rgba(38,31,20,.74) 46%, rgba(32,26,17,.16) 80%); }
.ab-close-copy { position: relative; z-index: 1; max-width: 560px; padding: clamp(32px, 4.2vw, 56px); color: #fbf6e9; }
.ab-close-copy .ab-eyebrow { color: #e3c47c; }
.ab-close-copy .ab-h2 { margin-top: 12px; color: #fdf9ee; font-size: clamp(32px, 4vw, 48px); }
.ab-close-copy .ab-h2 em { color: #e6c67f; }
.ab-close-copy > p { max-width: 460px; margin-top: 16px !important; font-size: 14px; line-height: 1.9; color: rgba(251,246,233,.86); }
.ab-close-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 13px 20px; margin-top: 26px; }
.ab-ghost { display: inline-flex; align-items: center; gap: 8px; height: 50px; padding-inline: 18px; border: 1px solid rgba(255,255,255,.38); border-radius: 3px; color: #fdf9ee; font-size: 12px; backdrop-filter: blur(10px); transition: background .3s, border-color .3s; }
.ab-ghost:hover { background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.65); }
.ab-phone-light { color: rgba(251,246,233,.85); border-color: rgba(255,255,255,.3); }
.ab-phone-light:hover { color: #fff; }

/* ---------- footer ---------- */
.ab-foot { border-top: 1px solid var(--ab-line); background: rgba(253,250,240,.8); padding-block: 46px 20px; }
.ab-foot-grid { display: grid; grid-template-columns: 1.6fr .7fr .9fr; gap: 40px; align-items: start; }
.ab-foot-grid p { max-width: 330px; margin-top: 14px; font-size: 13px; line-height: 1.9; color: var(--ab-ink-soft); }
.ab-foot-col { display: flex; flex-direction: column; align-items: flex-start; gap: 11px; font-size: 12.5px; color: var(--ab-ink-soft); }
.ab-foot-col a, .ab-foot-col > span:not(.ab-foot-head) { display: inline-flex; align-items: center; gap: 7px; transition: color .2s; }
.ab-foot-col a:hover { color: var(--ab-gold); }
.ab-foot-col svg { color: var(--ab-gold); }
.ab-foot-head { margin-bottom: 4px; font-size: 10px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--ab-gold); }
.ab-foot-base { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px 24px; margin-top: 38px; padding-top: 18px; border-top: 1px solid var(--ab-line); font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--ab-ink-soft); }

/* ---------- mobile bar ---------- */
.ab-mobile-bar { display: none; }

/* ---------- reveal ---------- */
@media (prefers-reduced-motion: no-preference) {
  .ab-reveal { opacity: 0; transform: translateY(22px); transition: opacity .55s ease, transform .7s cubic-bezier(.22,1,.36,1); }
  .ab-reveal.is-in { opacity: 1; transform: none; }
}

/* ---------- responsive ---------- */
@media (max-width: 1180px) {
  .ab-vertical { display: none; }
  .ab-hero-visual { padding-right: 16px; }
}
@media (max-width: 980px) {
  .ab-container { width: calc(100% - 56px); }
  .ab-nav { display: none; }
  .ab-head-cta { display: none; }
  .ab-nav-toggle { display: inline-flex; }
  .ab-nav.is-open { display: flex; position: absolute; top: 92px; left: 0; right: 0; flex-direction: column; align-items: flex-start; gap: 20px; padding: 24px 28px 28px; background: var(--ab-cream); border-bottom: 1px solid var(--ab-line); box-shadow: 0 24px 40px -30px rgba(60,45,20,.5); font-size: 15px; }
  .ab-nav-cta { display: inline-flex; align-items: center; gap: 8px; margin-top: 4px; padding: 13px 18px; border-radius: 3px; background: linear-gradient(115deg, #e6cf9a, #c9a252 45%, #e8d29b 75%, #cda45a); color: #2a2418; font-size: 12.5px; font-weight: 600; }
  .ab-hero-grid, .ab-split { grid-template-columns: 1fr; gap: 44px; }
  .ab-hero-copy { max-width: 700px; }
  .ab-hero-visual { width: min(540px, 100%); margin-inline: auto; padding-bottom: 40px; }
  .ab-media { width: min(540px, 100%); }
  .ab-pillars { grid-template-columns: 1fr; gap: 16px; }
  .ab-process-head { grid-template-columns: 1fr; align-items: start; }
  .ab-process-head > p { justify-self: start; max-width: 520px; }
  .ab-steps { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 32px 18px; }
  .ab-assurances { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .ab-shots { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .ab-faq { grid-template-columns: 1fr; gap: 28px; }
  .ab-faq .ab-head-block { position: static; }
  .ab-gallery-head { flex-direction: column; align-items: flex-start; gap: 16px; }
  .ab-foot-grid { grid-template-columns: 1.4fr .8fr 1fr; gap: 28px; }
}
@media (max-width: 760px) {
  .ab-container { width: calc(100% - 40px); }
  .ab-head-inner { height: 74px; }
  .ab-brand-mark { width: 42px; height: 42px; }
  .ab-brand-name { font-size: 23px; }
  .ab-brand-tag { font-size: 9.5px; }
  .ab-nav.is-open { top: 74px; }
  .ab-hero { padding-block: 36px 60px; }
  .ab-h1 { font-size: clamp(38px, 8.4vw, 52px); }
  .ab-h2 { font-size: clamp(31px, 7vw, 42px); }
  .ab-facts li { padding-inline: 16px; }
  .ab-facts strong { font-size: 26px; }
  .ab-inset { width: 116px; right: 0; bottom: 28px; }
  .ab-quote { width: min(224px, 72%); padding: 15px 17px; bottom: 38px; }
  .ab-quote p { font-size: 19px; }
  .ab-seal { width: 82px; height: 82px; }
  .ab-seal strong { font-size: 25px; }
  .ab-vow-band p, .ab-vow p { font-size: 13.5px; }
  .ab-close-panel { min-height: 0; }
  .ab-close-panel::after { background: linear-gradient(180deg, rgba(32,26,17,.9), rgba(35,28,18,.82) 60%, rgba(32,26,17,.62)); }
  .ab-close-copy { padding: 32px 24px 36px; }
  .ab-foot-grid { grid-template-columns: 1fr 1fr; }
  .ab-foot-grid > div:first-child { grid-column: 1 / -1; }
  .ab-root { padding-bottom: 76px; }
  .ab-mobile-bar { position: fixed; z-index: 90; left: 0; right: 0; bottom: 0; display: flex; align-items: center; gap: 10px; padding: 10px 14px calc(10px + env(safe-area-inset-bottom)); border-top: 1px solid var(--ab-line); background: rgba(253,250,240,.94); backdrop-filter: blur(18px); box-shadow: 0 -12px 34px -22px rgba(60,45,20,.5); }
  .ab-mobile-primary { flex: 1; height: 46px; }
  .ab-mobile-wa { display: grid; place-items: center; flex: none; width: 46px; height: 46px; border: 1px solid var(--ab-line); border-radius: 3px; background: var(--ab-cream); color: var(--ab-gold); }
}
@media (max-width: 560px) {
  .ab-brand-tag { display: none; }
  .ab-hero-visual { padding: 8px 12px 32px 0; }
  .ab-hero-visual::before { inset: 24px -2px 0 16px; }
  .ab-portrait { aspect-ratio: 4 / 4.8; }
  .ab-inset { display: none; }
  .ab-quote { position: relative; left: auto; bottom: auto; width: 100%; margin-top: 14px; }
  .ab-seal { width: 74px; height: 74px; top: -8px; }
  .ab-facts { margin-top: 28px; }
  .ab-facts li { padding-inline: 12px; }
  .ab-facts strong { font-size: 23px; }
  .ab-facts span { font-size: 8px; }
  .ab-media { padding: 0 14px 24px 0; }
  .ab-plaque { min-width: 118px; padding: 14px 15px; }
  .ab-plaque strong { font-size: 32px; }
  .ab-steps { grid-template-columns: 1fr; gap: 24px; }
  .ab-step { padding-right: 0; }
  .ab-step p { max-width: none; }
  .ab-assurances { grid-template-columns: 1fr; gap: 10px; margin-top: 30px; }
  .ab-shots { gap: 12px; margin-top: 30px; }
  .ab-shot-label strong { font-size: 17px; }
  .ab-shot-label > span { display: none; }
  .ab-vow-points { flex-direction: column; align-items: center; gap: 11px; }
  .ab-faq-item summary { font-size: 18px; }
  .ab-foot-grid { grid-template-columns: 1fr; }
  .ab-close-actions .ab-btn, .ab-close-actions .ab-ghost { width: 100%; }
}
`;
