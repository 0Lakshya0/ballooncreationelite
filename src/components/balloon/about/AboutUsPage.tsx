import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { contact, celebrations } from "@/lib/celebrations";
import { observeVisibility } from "@/lib/visibility";
import wedding from "@/assets/wedding.jpg";
import anniversary from "@/assets/anniversary.jpg";
import hall from "@/assets/celebration-hero.jpg";
import "./about.css";

// Owner-supplied About page, adapted to the existing router and bundled imagery.
const BRAND = { name: "Balloon Creation", tagline: "We decorate your happiness", years: 10 };
const WA_DEFAULT =
  "Hello Balloon Creation! I would like to check availability for my celebration in Indore.";
const wa = `${contact.whatsapp}?text=${encodeURIComponent(WA_DEFAULT)}`;
const NAV = [
  { label: "Our creations", hash: "portfolio" },
  { label: "About us", hash: null },
  { label: "Let’s celebrate", hash: "concierge" },
];
const PILLARS = [
  {
    icon: "pin",
    title: "Indore, citywide",
    detail: "100% Indore coverage",
    copy: "From the polished avenues of Vijay Nagar and Saket to premium townships across the city, our concierge-led planning and polished on-site finish travel with you.",
  },
  {
    icon: "gem",
    title: "What you approve is what we build",
    detail: "100% exact-match promise*",
    copy: "Choose a design from our portfolio. Your approved palette, composition, structure and key details become the installation benchmark—no unapproved substitutions.",
    hash: "portfolio",
    link: "Explore the portfolio",
  },
  {
    icon: "sparkle",
    title: "Every celebration. Every scale.",
    detail: "One creative team",
    copy: "Weddings, birthdays, baby showers, anniversaries, corporate events and devotional celebrations—elevated with premium structures, venue-approved cold-spark moments and smoke entries.",
    hash: "concierge",
    link: "Plan your occasion",
  },
];
const STEPS = [
  [
    "The first conversation",
    "Share your date, venue and the feeling you are after. We listen before we sketch.",
  ],
  [
    "The design",
    "A considered concept shaped around your people, your palette and the room itself.",
  ],
  [
    "The approval",
    "You approve the design and scope before we build. What you approve becomes our benchmark.",
  ],
  [
    "The reveal",
    "Our crew arrives early, styles on site, checks every angle and leaves the venue immaculate.",
  ],
];
const ASSURANCES = [
  ["users", "A dedicated setup crew"],
  ["gem", "On-site styling checks"],
  ["shield", "Approved scope, respected"],
  ["clock", "Early arrival, immaculate handover"],
];
const FAQS = [
  [
    "What does the exact-match promise actually cover?",
    "The design you approve—palette, composition, structure and key details—becomes our installation benchmark. The promise applies to that approved design and agreed scope. If your venue introduces a constraint, we tell you before anything changes.",
  ],
  [
    "Are cold sparks and smoke entries safe at my venue?",
    "We use venue-approved cold-spark and smoke effects, staged by our crew within the permissions your venue allows. Share the venue with us early and we will confirm what is possible before the design is finalised.",
  ],
  [
    "Do you travel across Indore?",
    "Yes—100% Indore coverage, from Vijay Nagar and Saket to premium townships and venues across the city. Tell us the venue and we will plan the setup window around it.",
  ],
  [
    "How early should we book our date?",
    "Every bespoke installation needs a dedicated crew and a planned setup window, so peak dates are limited by capacity rather than demand. The earlier you share your date and venue, the more room we have to design without compromise.",
  ],
];
const ICONS: Record<string, ReactNode> = {
  arrow: (
    <>
      <path d="M7 17 17 7M8 7h9v9" />
    </>
  ),
  check: <path d="m20 6-11 11-5-5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  gem: (
    <>
      <path d="M6 3h12l4 6-10 12L2 9ZM2 9h20m-11-6-2 6 5 12 5-12-2-6" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  message: (
    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.9L3 21l1.9-4.8A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3a8.4 8.4 0 0 1 8.5 8.5Z" />
  ),
  phone: (
    <path d="M22 17v3a2 2 0 0 1-2.2 2A20 20 0 0 1 2 4.2 2 2 0 0 1 4 2h3l1 6-2 2a16 16 0 0 0 8 8l2-2Z" />
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  sparkle: (
    <>
      <path d="m12 3 2 5 5 2-5 2-2 5-2-5-5-2 5-2Zm7 12 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-4" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="m18 6-12 12M6 6l12 12" />,
};
function Icon({ name, size = 18 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}
export function Photo({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = !src || failedSrc === src;
  return (
    <span
      className={`ab-photo ${className}${failed ? " ab-photo-fallback" : ""}`}
      role={failed && alt ? "img" : undefined}
      aria-label={failed && alt ? alt : undefined}
      aria-hidden={!alt ? true : undefined}
    >
      {!failed && (
        <img
          src={src}
          alt={alt}
          width={1024}
          height={1024}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          onError={() => setFailedSrc(src)}
          ref={(node) => {
            if (node?.complete && node.naturalWidth === 0) setFailedSrc(src);
          }}
        />
      )}
    </span>
  );
}
function HomeLink({
  children,
  hash,
  className,
  onClick,
}: {
  children: ReactNode;
  hash?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      to="/"
      {...(hash ? { hash } : {})}
      {...(className ? { className } : {})}
      {...(onClick ? { onClick } : {})}
    >
      {children}
    </Link>
  );
}
function CTA({ children = "Check date availability" }: { children?: ReactNode }) {
  return (
    <HomeLink hash="concierge" className="ab-btn">
      {children}
      <Icon name="arrow" size={15} />
    </HomeLink>
  );
}
function Heading({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <div className="ab-head-block">
      <span className="ab-eyebrow">{eyebrow}</span>
      <h2 className="ab-h2">{children}</h2>
    </div>
  );
}
const NOTE =
  "*The exact-match promise applies to the approved design and agreed scope. Venue dimensions and permissions may affect special effects; we agree any required adjustment with you before installation.";
export default function AboutUsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null),
    toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    root.classList.add("ab-motion-ready");
    const stops = Array.from(root.querySelectorAll(".ab-reveal"), (node) => {
      let stop = () => {};
      stop = observeVisibility(node, (visible) => {
        if (visible) {
          node.classList.add("is-in");
          stop();
        }
      });
      return () => stop();
    });
    return () => {
      stops.forEach((stop) => stop());
      root.classList.remove("ab-motion-ready");
    };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const resize = () => {
      if (window.innerWidth > 980) setMenuOpen(false);
    };
    document.addEventListener("keydown", close);
    window.addEventListener("resize", resize);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", close);
      window.removeEventListener("resize", resize);
    };
  }, [menuOpen]);
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BRAND.name,
    description: "Bespoke balloon and floral styling for celebrations across Indore.",
    telephone: contact.phone,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <a className="ab-skip" href="#ab-main">
        Skip to content
      </a>
      <header className="ab-head">
        <div className="ab-container ab-head-inner">
          <HomeLink className="ab-brand">
            <span className="ab-brand-mark" aria-hidden="true">
              <svg viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="23" fill="#fffdf6" stroke="#b98c3f" />
                <ellipse cx="24" cy="18" rx="5.4" ry="6.8" fill="#c39a4c" />
                <path
                  d="m22.5 25 1.5 2.4 1.5-2.4M24 27.4c2 3 3.4 3.7 2.9 6.1"
                  stroke="#b98c3f"
                  fill="none"
                />
                <text
                  x="24"
                  y="42"
                  textAnchor="middle"
                  fontFamily="Georgia,serif"
                  fontSize="11"
                  fill="#8d6527"
                >
                  BC
                </text>
              </svg>
            </span>
            <span>
              <span className="ab-brand-name">{BRAND.name}</span>
              <span className="ab-brand-tag">{BRAND.tagline}</span>
            </span>
          </HomeLink>
          <nav
            id="ab-nav"
            className={`ab-nav${menuOpen ? " is-open" : ""}`}
            aria-label="About page navigation"
          >
            {NAV.map((item) =>
              item.hash ? (
                <HomeLink key={item.label} hash={item.hash} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </HomeLink>
              ) : (
                <Link
                  key={item.label}
                  to="/about"
                  aria-current="page"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
            <HomeLink
              className="ab-nav-cta ab-btn"
              hash="concierge"
              onClick={() => setMenuOpen(false)}
            >
              Request consultation <Icon name="arrow" size={14} />
            </HomeLink>
          </nav>
          <div className="ab-head-cta">
            <CTA>Request Consultation</CTA>
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="ab-nav-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="ab-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={22} />
          </button>
        </div>
      </header>
      <main id="ab-main">
        <section className="ab-hero">
          <div className="ab-container ab-hero-grid">
            <div className="ab-hero-copy ab-reveal">
              <nav className="ab-crumbs" aria-label="Breadcrumb">
                <HomeLink>Home</HomeLink>
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
                <CTA />
                <HomeLink className="ab-text-link" hash="portfolio">
                  Explore the portfolio <Icon name="arrow" size={14} />
                </HomeLink>
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
                <Photo src={wedding} alt="Floral wedding celebration styling" priority />
                <figcaption>The wedding edit · Indore</figcaption>
              </figure>
              <Photo className="ab-inset" src={anniversary} alt="Intimate anniversary styling" />
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
        <div className="ab-ticker" aria-hidden="true">
          <div className="ab-ticker-track">
            {[0, 1].map((group) => (
              <div className="ab-ticker-group" key={group}>
                {[
                  "Sculptural balloons",
                  "Considered florals",
                  "Venue-approved effects",
                  "Immaculate staging",
                  "Every detail, considered",
                ].map((text) => (
                  <span key={text}>
                    {text}
                    <em>✦</em>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <section className="ab-section">
          <div className="ab-container ab-split">
            <div className="ab-media ab-reveal">
              <Photo src={hall} alt="A celebration hall with floral and balloon styling" />
              <div className="ab-plaque">
                <strong>{BRAND.years}</strong>
                <span>Years of craft · Indore</span>
              </div>
            </div>
            <div className="ab-reveal">
              <Heading eyebrow="01 — The 10-year epoch">
                An empty venue is only <em>the opening scene.</em>
              </Heading>
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
        <section className="ab-section ab-band">
          <div className="ab-container">
            <div className="ab-center ab-reveal">
              <Heading eyebrow="02 — The triad of dominance">
                Three promises. <em>No fine print on the feeling.</em>
              </Heading>
              <p className="ab-sub">
                The details that decide whether a celebration feels beautiful—or unforgettable.
                These are the standards we hold every single time.
              </p>
            </div>
            <div className="ab-pillars">
              {PILLARS.map((p, i) => (
                <article className="ab-pillar ab-reveal" key={p.title}>
                  <div className="ab-pillar-top">
                    <span className="ab-icon">
                      <Icon name={p.icon} size={23} />
                    </span>
                    <span className="ab-num">0{i + 1}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <span className="ab-detail">{p.detail}</span>
                  <p>{p.copy}</p>
                  {p.hash && (
                    <HomeLink className="ab-text-link" hash={p.hash}>
                      {p.link}
                      <Icon name="arrow" size={13} />
                    </HomeLink>
                  )}
                </article>
              ))}
            </div>
            <p className="ab-note">{NOTE}</p>
          </div>
        </section>
        <section className="ab-vow">
          <Photo className="ab-vow-bg" src={hall} alt="" />
          <div className="ab-container ab-vow-inner ab-reveal">
            <Heading eyebrow="03 — The unspoken vow">
              Hours before the first guest, <em>the room is already right.</em>
            </Heading>
            <p>
              While your guests are still on their way, our crew is on site—checking symmetry,
              sightlines, finishes and every detail against the approved plan. The venue is left
              immaculate and guest-ready. If a constraint appears, you hear from us before an agreed
              detail changes. The only surprise should be the reveal.
            </p>
            <ul className="ab-vow-points">
              {[
                "Approved before we build",
                "Checked before we leave",
                "Informed before we change",
              ].map((point) => (
                <li key={point}>
                  <Icon name="check" size={14} />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="ab-section">
          <div className="ab-container">
            <div className="ab-process-head ab-reveal">
              <Heading eyebrow="04 — The approach">
                Simple for you. <em>Meticulous behind the scenes.</em>
              </Heading>
              <p>
                Four calm steps from the first hello to the final reveal. You never have to wonder
                what happens next.
              </p>
            </div>
            <div className="ab-steps">
              {STEPS.map(([title, copy], i) => (
                <div className="ab-step ab-reveal" key={title}>
                  <span className="ab-step-num">0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              ))}
            </div>
            <div className="ab-assurances">
              {ASSURANCES.map(([icon, label]) => (
                <div className="ab-assurance ab-reveal" key={label}>
                  <Icon name={icon!} size={17} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="ab-section ab-band">
          <div className="ab-container">
            <div className="ab-gallery-head ab-reveal">
              <Heading eyebrow="05 — The portfolio">
                A city of moments, <em>beautifully staged.</em>
              </Heading>
              <HomeLink className="ab-text-link" hash="portfolio">
                See all creations <Icon name="arrow" size={14} />
              </HomeLink>
            </div>
            <div className="ab-shots">
              {celebrations.slice(1, 4).map((item) => (
                <HomeLink className="ab-shot ab-reveal" hash="portfolio" key={item.name}>
                  <Photo src={item.image} alt={item.name + " celebration styling"} />
                  <span className="ab-shot-label">
                    <strong>{item.name}</strong>
                    <span>{item.subtitle}</span>
                  </span>
                  <span className="ab-shot-arrow">
                    <Icon name="arrow" size={14} />
                  </span>
                </HomeLink>
              ))}
            </div>
          </div>
        </section>
        <section className="ab-section">
          <div className="ab-container ab-faq">
            <div className="ab-head-block ab-reveal">
              <Heading eyebrow="06 — Before you ask">
                Thoughtful answers, <em>before you commit.</em>
              </Heading>
              <p className="ab-sub">
                Every celebration begins with a question. These are the ones we are asked most
                often—answered honestly.
              </p>
              <div className="ab-faq-cta">
                <a className="ab-text-link" href={wa} target="_blank" rel="noreferrer">
                  Ask us on WhatsApp <Icon name="arrow" size={14} />
                </a>
                <a className="ab-phone" href={`tel:${contact.phone}`}>
                  <Icon name="phone" size={14} />
                  {contact.label}
                </a>
              </div>
            </div>
            <div className="ab-faq-list ab-reveal">
              {FAQS.map(([q, a], i) => (
                <details className="ab-faq-item" key={q} open={i === 0}>
                  <summary>
                    <span>{q}</span>
                    <span className="ab-plus" aria-hidden="true" />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="ab-close">
          <div className="ab-container">
            <div className="ab-close-panel ab-reveal">
              <Photo src={hall} alt="" />
              <div className="ab-close-copy">
                <Heading eyebrow="Your date. Your story.">
                  Give your moment the <em>grand entrance</em> it deserves.
                </Heading>
                <p>
                  Every bespoke installation needs a dedicated crew and a carefully planned setup
                  window. Peak dates are limited by capacity—share your date and venue, and we will
                  check availability.
                </p>
                <div className="ab-close-actions">
                  <CTA />
                  <a className="ab-ghost" href={wa} target="_blank" rel="noreferrer">
                    <Icon name="message" size={16} />
                    WhatsApp the studio
                  </a>
                  <a className="ab-phone" href={`tel:${contact.phone}`}>
                    <Icon name="phone" size={14} />
                    {contact.label}
                  </a>
                </div>
              </div>
            </div>
            <p className="ab-note">{NOTE}</p>
          </div>
        </section>
      </main>
      <div className="ab-mobile-bar">
        <CTA />
        <a
          className="ab-mobile-wa"
          href={wa}
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
