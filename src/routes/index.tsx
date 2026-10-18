import { SmartSearch } from "@/components/balloon/smart-search";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Clock3,
  Gem,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Concierge } from "@/components/balloon/concierge";
import { RotatingLines } from "@/components/balloon/rotating-lines";
import { CategoryMarquee } from "@/components/balloon/category-marquee";
import { PortfolioDialog } from "@/components/balloon/portfolio-dialog";
import { ScrollProgress } from "@/components/balloon/scroll-progress";
import { StickyCta } from "@/components/balloon/sticky-cta";
import { TrustBand } from "@/components/balloon/trust-band";
import { Process } from "@/components/balloon/process";
import { Testimonials } from "@/components/balloon/testimonials";
import { Faq } from "@/components/balloon/faq";
import { celebrations, contact, whatsappLink, type Celebration } from "@/lib/celebrations";
import { heroSlides } from "@/lib/hero-slides";
import { indoreAreas } from "@/lib/indore-areas";
import { faqs } from "@/lib/site-content";
import logo from "@/assets/brand-logo.webp";

const SITE_URL = "https://ballooncreationelite.lovable.app";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Balloon Creation",
  description:
    "Bespoke flower and balloon styling for weddings, birthdays, anniversaries, baby showers and devotional celebrations in Indore. Expert setup in 2 hours.",
  url: SITE_URL,
  image: `${SITE_URL}/og-cover.jpg`,
  telephone: "+91-74898-63753",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Indore",
    addressRegion: "Madhya Pradesh",
    addressCountry: "IN",
  },
  areaServed: { "@type": "City", name: "Indore" },
  sameAs: [contact.instagram],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "21:00",
    },
  ],
};

const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Balloon Creation — Bespoke Celebrations in Indore" },
      {
        name: "description",
        content:
          "Bespoke flower and balloon aesthetics for extraordinary weddings, birthdays and intimate celebrations. Discover Balloon Creation, Indore’s premier event boutique.",
      },
      { name: "theme-color", content: "#fbf4e6" },
      { property: "og:title", content: "Balloon Creation — Beautifully Beyond Ordinary" },
      {
        property: "og:description",
        content:
          "Luxury flowers, sculptural balloons and magical memories. Bespoke celebrations in Indore, flawlessly set up in 2 hours.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/og-cover.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_URL}/og-cover.jpg` },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(structuredData) },
      { type: "application/ld+json", children: JSON.stringify(faqData) },
    ],
  }),
  component: Index,
});

const standards = [
  {
    icon: Sparkles,
    number: "01",
    title: "Bespoke Artistry",
    detail: "1000+ custom designs",
    copy: "Never off the shelf. Every colour, curve and detail is thoughtfully composed around your story.",
  },
  {
    icon: Clock3,
    number: "02",
    title: "Flawless Execution",
    detail: "Expert setup in 2 hours",
    copy: "Precision behind the scenes. Perfection in the spotlight. We handle the details, you live the moment.",
  },
  {
    icon: Gem,
    number: "03",
    title: "Premium Materials",
    detail: "Only the exceptional",
    copy: "Exquisite blooms, premium balloons and carefully chosen finishes. A difference you can feel.",
  },
];

const taglines: [string, string][] = [
  ["We Don’t Just Decorate, We Create", "Magical Memories."],
  ["We Decorate", "Your Happiness."],
  ["Bespoke Flower & Balloon Artistry in", "Indore."],
  ["Transforming Ordinary Spaces Into", "Extraordinary Celebrations."],
  ["Turning Your Dream Celebrations Into", "Breathtaking Reality."],
  ["Where Your Deepest Emotions Meet Our", "Finest Artistry."],
  ["Crafting Beautiful Backdrops for Your", "Lifelong Memories."],
  ["The Secret Behind Every", "Smiling and Beautiful Gathering."],
  ["Elegant Balloon & Floral Aesthetics for", "Elite Events."],
  ["Celebrating Your Love and Milestones with", "Luxury Decor."],
  ["Where Modern Luxury Meets", "Unforgettable Celebrations."],
  ["Filling Every Corner of Your Venue with", "Joy and Shine."],
  ["Breathtaking Setups for the Days", "You’ll Never Forget."],
  ["Adding a Touch of Perfection to Your", "Most Special Days."],
  ["Making Every Milestone Look", "Absolutely Legendary."],
];

const navLinks = [
  { href: "#portfolio", label: "Our creations" },
  { href: "#standard", label: "The signature standard" },
  { href: "#reviews", label: "Kind words" },
  { href: "#concierge", label: "Let’s celebrate" },
];

const heroTrust = ["2-hour expert setup", "Premium materials", "1000+ designs"];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);
  const [occasion, setOccasion] = useState("");
  const [line, setLine] = useState(0);
  const [fading, setFading] = useState<number | null>(null);
  const index = useRef(0);
  const [slide, setSlide] = useState(0);
  const [galleryItem, setGalleryItem] = useState<Celebration | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setFading(index.current);
      index.current = (index.current + 1) % taglines.length;
      setLine(index.current);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0, rootMargin: "0px 0px 80px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  useEffect(() => {
    if (!areasOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAreasOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [areasOpen]);

  function chooseOccasion(name: string) {
    setOccasion(name);
    document.getElementById("concierge")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  const current = taglines[line] ?? ["", ""];
  const out = fading === null ? null : (taglines[fading] ?? null);
  const totalSlides = heroSlides.length;
  const nearSlide = (i: number) =>
    i === slide || i === (slide + 1) % totalSlides || i === (slide - 1 + totalSlides) % totalSlides;

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="page-width nav-layout">
          <a
            href="#"
            className="brand"
            aria-label="Balloon Creation home"
            onClick={(e) => {
              const el = e.currentTarget;
              el.classList.remove("is-playing");
              void el.offsetWidth;
              el.classList.add("is-playing");
              setTimeout(() => el.classList.remove("is-playing"), 9000);
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
                <span className="brand-descriptor">We Decorate Your Happiness</span>
              </span>
            </span>
          </a>
          <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <a href="#faq" className="nav-mobile-only" onClick={() => setMenuOpen(false)}>
              FAQ
            </a>
            <a
              href={`tel:${contact.phone}`}
              className="nav-mobile-only"
              onClick={() => setMenuOpen(false)}
            >
              <Phone size={14} /> {contact.label}
            </a>
          </nav>
          <Button variant="luxury" className="nav-consultation" asChild>
            <a href="#concierge">
              Request Consultation <ArrowUpRight />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        <ScrollProgress />
      </header>
      <main id="main">
        <section className="hero">
          {heroSlides.map((s, i) =>
            nearSlide(i) ? (
              <img
                key={s.name}
                src={s.image}
                className={
                  i === slide ? "hero-image hero-slide is-active" : "hero-image hero-slide"
                }
                alt={i === slide ? `${s.name} decoration by Balloon Creation` : ""}
                aria-hidden={i !== slide}
                width={1920}
                height={1024}
                fetchPriority={i === slide ? "high" : "low"}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            ) : null,
          )}
          <div className="hero-wash" />
          <div className="page-width hero-content">
            <img
              src={logo}
              className="hero-mark"
              alt="Balloon Creation emblem"
              width={256}
              height={256}
            />
            <span className="eyebrow hero-eyebrow">
              <span className="little-line" /> BEAUTIFULLY BEYOND ORDINARY
            </span>
            <h1 className="hero-title" aria-live="polite">
              {taglines.map(([start, end], i) => (
                <span className="tagline-sizer" aria-hidden="true" key={`size-${i}`}>
                  {start} <em>{end}</em>
                </span>
              ))}
              {out && (
                <span key={`out-${fading}`} aria-hidden="true" className="tagline tagline-out">
                  {out[0]} <em>{out[1]}</em>
                </span>
              )}
              <span key={`in-${line}`} className="tagline tagline-in">
                {current[0]} <em>{current[1]}</em>
              </span>
            </h1>
            <p>
              Indore’s premier boutique for bespoke flower &amp; balloon aesthetics. Expert setup in
              2 hours.
            </p>
            <div className="hero-actions">
              <Button variant="luxury" asChild>
                <a
                  href={whatsappLink(
                    "Hello Balloon Creation! I would love to plan a bespoke celebration.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle />
                  Let’s talk on WhatsApp
                  <ArrowUpRight />
                </a>
              </Button>
              <Button variant="glass" asChild>
                <a href={`tel:${contact.phone}`}>
                  <Phone />
                  Call our concierge
                </a>
              </Button>
            </div>
            <ul className="hero-trust">
              {heroTrust.map((item) => (
                <li key={item}>
                  <Star size={12} aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
            <div className="hero-footnote">
              <span className="little-line" /> THOUGHTFULLY DESIGNED. BEAUTIFULLY REMEMBERED.
            </div>
          </div>
          <a className="explore-scroll" href="#portfolio" aria-label="Explore our creations">
            <span>EXPLORE</span>
            <ArrowDown size={17} />
          </a>
          <div className="service-badge" aria-live="polite">
            <span className="service-dot" />
            <span key={slide} className="service-name">
              {heroSlides[slide]?.name}
            </span>
          </div>
          <div className="hero-caption">
            <span>THE ART OF CELEBRATION</span>
            <span>BALLOON CREATION · INDORE</span>
          </div>
        </section>
        <div className="brand-strip">
          <div className="page-width">
            <button
              type="button"
              className="areas-pill"
              onClick={() => setAreasOpen(true)}
              aria-haspopup="dialog"
            >
              <MapPin size={14} /> Serving All Indore Areas{" "}
              <span className="areas-view">(View List)</span>
            </button>
            <SmartSearch areas={indoreAreas} onLocation={() => setAreasOpen(true)} />
            <span>
              FLOWERS <span className="strip-dot">✦</span> BALLOONS{" "}
              <span className="strip-dot">✦</span> MEMORIES
            </span>
          </div>
        </div>
        <CategoryMarquee />
        <section className="portfolio section-space page-width" id="portfolio">
          <div className="section-heading reveal">
            <div>
              <span className="eyebrow">A WORLD OF CELEBRATIONS</span>
              <RotatingLines />
            </div>
            <div className="section-intro">
              <p>
                From grand gestures to intimate joys,
                <br />
                we make every occasion unmistakably yours.
              </p>
              <span>
                EXPLORE OUR SIGNATURE CREATIONS <ArrowDown size={14} />
              </span>
            </div>
          </div>
          <div className="portfolio-grid">
            {celebrations.map((item, index) => (
              <article className={`creation reveal creation-${index + 1}`} key={item.name}>
                <button
                  type="button"
                  className="creation-image"
                  onClick={() => setGalleryItem(item)}
                  aria-label={`View ${item.name} details`}
                >
                  <img
                    src={item.image}
                    alt={`${item.name}: bespoke luxury flower and balloon styling`}
                    width={1024}
                    height={1024}
                    loading="lazy"
                  />
                  <span className="image-tag">{item.tag}</span>
                  <span className="creation-hover">VIEW DETAILS</span>
                  <span className="image-action">
                    <ArrowUpRight size={21} />
                  </span>
                </button>
                <div className="creation-caption">
                  <span className="creation-index">0{index + 1}</span>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="portfolio-note reveal">
            <span>YOUR STORY. YOUR STYLE. YOUR ONE-OF-A-KIND CELEBRATION.</span>
            <a href="#concierge">
              Let’s imagine yours <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
        <TrustBand />
        <section className="standard section-space" id="standard">
          <div className="page-width">
            <div className="standard-heading reveal">
              <span className="eyebrow">THE SIGNATURE STANDARD</span>
              <h2>
                The difference is
                <br />
                <em>in every detail.</em>
              </h2>
              <p>
                Not just a beautiful setup. An exceptional experience, from first idea to final
                flourish.
              </p>
            </div>
            <div className="standards-grid">
              {standards.map(({ icon: Icon, ...item }) => (
                <div className="standard-item reveal" key={item.number}>
                  <div className="standard-top">
                    <Icon size={26} strokeWidth={1.1} />
                    <span>{item.number}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <span className="standard-detail">{item.detail}</span>
                  <p>{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Process />
        <Testimonials />
        <Faq />
        <Concierge occasion={occasion} onOccasionChange={setOccasion} />
      </main>
      {areasOpen && (
        <div
          className="areas-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Areas we serve in Indore"
          onClick={() => setAreasOpen(false)}
        >
          <div className="areas-modal" onClick={(e) => e.stopPropagation()}>
            <div className="areas-head">
              <span className="eyebrow">WHERE WE CELEBRATE</span>
              <h2>Areas we serve in Indore</h2>
              <button
                type="button"
                className="areas-close"
                aria-label="Close areas list"
                onClick={() => setAreasOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <ul className="areas-list">
              {indoreAreas.map((area) => (
                <li key={area}>
                  <MapPin size={13} />
                  {area}
                </li>
              ))}
            </ul>
            <p className="areas-note">
              Don’t see your area?{" "}
              <a
                href={whatsappLink("Hello Balloon Creation! Do you serve my area in Indore?")}
                target="_blank"
                rel="noreferrer"
              >
                Ask us on WhatsApp
              </a>{" "}
              — we likely do.
            </p>
          </div>
        </div>
      )}
      {galleryItem && (
        <PortfolioDialog
          item={galleryItem}
          onClose={() => setGalleryItem(null)}
          onPlan={chooseOccasion}
        />
      )}
      <StickyCta />
      <footer className="site-footer">
        <div className="page-width footer-grid">
          <div className="footer-brand-col">
            <a className="footer-brand" href="#" aria-label="Balloon Creation home">
              <img src={logo} alt="" width={64} height={64} />
              <span>Balloon Creation</span>
            </a>
            <p>
              Bespoke flower &amp; balloon artistry for Indore’s most meaningful moments.
              Thoughtfully designed, flawlessly installed, beautifully remembered.
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
          <nav className="footer-col" aria-label="Footer navigation">
            <h3>Explore</h3>
            <a href="#portfolio">Our creations</a>
            <a href="#standard">The signature standard</a>
            <a href="#process">How it works</a>
            <a href="#reviews">Kind words</a>
            <a href="#faq">Questions</a>
          </nav>
          <div className="footer-col">
            <h3>Visit or call</h3>
            <a href={`tel:${contact.phone}`}>
              <Phone size={14} /> {contact.label}
            </a>
            <a href={contact.whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle size={14} /> WhatsApp concierge
            </a>
            <button type="button" onClick={() => setAreasOpen(true)}>
              <MapPin size={14} /> Areas we serve
            </button>
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
    </>
  );
}
