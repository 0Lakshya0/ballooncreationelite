import { openAreasDialog } from "@/lib/area-events";
import { AreasTrigger } from "@/components/balloon/areas-dialog";
import { SiteHeader } from "@/components/balloon/site-header";
import { TrustBand } from "@/components/balloon/trust-band";
import { Process } from "@/components/balloon/process";
import { Faq } from "@/components/balloon/faq";
import { indoreAreas } from "@/lib/indore-areas";
import { faqs } from "@/lib/site-content";
import { SmartSearch } from "@/components/balloon/smart-search";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteLiquidBackground } from "@/components/balloon/site-liquid-background";
import { DecorCollectionsButton } from "@/components/balloon/decor-collections-button";
import { observeVisibility } from "@/lib/visibility";
import "@/components/balloon/decor/home-integration.css";
import "@/components/balloon/readability.css";
import {
  ArrowDown,
  ArrowUpRight,
  Clock3,
  Gem,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Concierge } from "@/components/balloon/concierge";
import { RotatingLines } from "@/components/balloon/rotating-lines";
import { CategoryMarquee } from "@/components/balloon/category-marquee";
import { celebrations, contact } from "@/lib/celebrations";
import { heroSlides } from "@/lib/hero-slides";
import logoAsset from "@/assets/profile-logo.jpg.asset.json";
const logo = logoAsset.url;

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { occasion?: string } =>
    typeof search["occasion"] === "string" && search["occasion"]
      ? { occasion: search["occasion"] }
      : {},
  head: () => ({
    meta: [
      { title: "Balloon Creation — Bespoke Celebrations in Indore" },
      {
        name: "description",
        content:
          "Bespoke flower and balloon aesthetics for extraordinary weddings, birthdays and intimate celebrations. Discover Balloon Creation, Indore’s premier event boutique.",
      },
      { property: "og:title", content: "Balloon Creation — Beautifully Beyond Ordinary" },
      {
        property: "og:description",
        content:
          "Luxury flowers, sculptural balloons and magical memories. Bespoke celebrations in Indore, flawlessly set up in 2 hours.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://ballooncreationelite.lovable.app/og-cover.jpg" },
      { name: "theme-color", content: "#fbf4e6" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }),
      },
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

function Index() {
  const search = Route.useSearch();
  const [occasion, setOccasion] = useState(search.occasion ?? "");
  const [line, setLine] = useState(0);
  const [fading, setFading] = useState<number | null>(null);
  const index = useRef(0);
  const [slide, setSlide] = useState(0);
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
    const stops = Array.from(document.querySelectorAll(".reveal"), (element) => {
      let stop = () => {};
      stop = observeVisibility(element, (visible) => {
        if (visible) {
          element.classList.add("is-visible");
          stop();
        }
      });
      return () => stop();
    });
    return () => {
      stops.forEach((stop) => stop());
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  const nearSlide = (i: number) =>
    i === slide ||
    i === (slide + 1) % heroSlides.length ||
    i === (slide - 1 + heroSlides.length) % heroSlides.length;
  const current = taglines[line] ?? ["", ""];
  const out = fading === null ? null : (taglines[fading] ?? null);
  return (
    <div className="site-liquid-shell">
      <SiteLiquidBackground />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
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
              width={512}
              height={512}
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
                  href={`${contact.whatsapp}?text=${encodeURIComponent("Hello Balloon Creation! I would love to plan a bespoke celebration.")}`}
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
              <li>2-hour expert setup</li>
              <li>Premium materials</li>
              <li>1000+ designs</li>
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
            <AreasTrigger className="areas-pill">
              <MapPin size={14} /> Serving All Indore Areas{" "}
              <span className="areas-view">(View List)</span>
            </AreasTrigger>
            <SmartSearch areas={indoreAreas} onLocation={openAreasDialog} />
            <DecorCollectionsButton />
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
                <Link
                  className="creation-image"
                  to="/creations/$slug"
                  params={{ slug: item.slug }}
                  aria-label={`Explore ${item.name}`}
                >
                  <img
                    src={item.image}
                    alt={`${item.name}: bespoke luxury flower and balloon styling`}
                    width={1024}
                    height={1024}
                    loading="lazy"
                  />
                  <span className="image-tag">{item.tag}</span>
                  <span className="creation-hover">EXPLORE THE EXPERIENCE</span>
                  <span className="image-action">
                    <ArrowUpRight size={21} />
                  </span>
                </Link>
                <div className="creation-caption">
                  <span className="creation-index">0{index + 1}</span>
                  <div>
                    <h3>
                      <Link to="/creations/$slug" params={{ slug: item.slug }}>
                        {item.name}
                      </Link>
                    </h3>
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
        <Faq />
        <Concierge occasion={occasion} onOccasionChange={setOccasion} />
      </main>
    </div>
  );
}
