import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/balloon/site-header";
import { SiteFooter } from "@/components/balloon/site-footer";
import { RevealObserver } from "@/components/balloon/reveal-observer";
import { Concierge } from "@/components/balloon/concierge";
import { getService, serviceDetails } from "@/lib/service-details";
import { contact, whatsappLink } from "@/lib/celebrations";

const SITE_URL = "https://ballooncreationelite.lovable.app";

export const Route = createFileRoute("/creations/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const service = loaderData;
    const url = `${SITE_URL}/creations/${service.slug}`;
    const description = service.promise.slice(0, 156);

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${service.name} — Balloon Creation`,
      serviceType: service.name,
      description: service.promise,
      url,
      provider: {
        "@type": "LocalBusiness",
        name: "Balloon Creation",
        telephone: "+91-74898-63753",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Indore",
          addressRegion: "Madhya Pradesh",
          addressCountry: "IN",
        },
      },
      areaServed: { "@type": "City", name: "Indore" },
      offers: service.packages.map((pack) => ({
        "@type": "Offer",
        name: pack.name,
        description: pack.bestFor,
        availability: "https://schema.org/InStock",
        url,
      })),
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Creations", item: `${SITE_URL}/#portfolio` },
        { "@type": "ListItem", position: 3, name: service.name, item: url },
      ],
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    };

    return {
      meta: [
        { title: `${service.name} in Indore — Balloon Creation` },
        { name: "description", content: description },
        { property: "og:title", content: `${service.name} — Balloon Creation, Indore` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: `${SITE_URL}/og-cover.jpg` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(serviceSchema) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema) },
        { type: "application/ld+json", children: JSON.stringify(faqSchema) },
      ],
    };
  },
  component: ServicePage,
  notFoundComponent: ServiceNotFound,
});

function ServiceNotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="service-missing page-width">
        <span className="eyebrow">A LITTLE LOST</span>
        <h1>That creation has moved.</h1>
        <p>Explore our signature collections — the one you are looking for is still here.</p>
        <Link to="/" hash="portfolio" className="service-back">
          <ArrowLeft size={15} /> Back to all creations
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}

function ServicePage() {
  const service = Route.useLoaderData();
  const [occasion, setOccasion] = useState(service.name);
  const others = serviceDetails.filter((item) => item.slug !== service.slug);
  const whatsappHref = whatsappLink(
    `Hello Balloon Creation! I would like to plan ${service.name.toLowerCase()} — could you share availability and a quote?`,
  );

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <RevealObserver />
      <main id="main" className="service-page">
        <nav className="page-width breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/" hash="portfolio">
            Creations
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{service.name}</span>
        </nav>

        <section className="service-hero">
          <div className="page-width service-hero-grid">
            <div className="service-hero-copy">
              <span className="eyebrow">{service.eyebrow}</span>
              <h1>{service.hook}</h1>
              <p className="service-promise">{service.promise}</p>
              <div className="service-hero-actions">
                <Button variant="luxury" asChild>
                  <a href={whatsappHref} target="_blank" rel="noreferrer">
                    <MessageCircle /> Check my date
                    <ArrowUpRight />
                  </a>
                </Button>
                <Button variant="glass" asChild>
                  <a href="#concierge">Request a quote</a>
                </Button>
              </div>
              <ul className="service-trust">
                {[
                  "Itemised quote, no surprises",
                  "Setup finished before guests",
                  "Design revisions included",
                ].map((item) => (
                  <li key={item}>
                    <Check size={14} aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="service-hero-media">
              <figure className="service-hero-main">
                <img
                  src={service.heroImage}
                  alt={`${service.name} styling by Balloon Creation, Indore`}
                  width={1024}
                  height={1024}
                  fetchPriority="high"
                />
                <figcaption>{service.tagline}</figcaption>
              </figure>
              <figure className="service-hero-accent">
                <img
                  src={service.accentImage}
                  alt={service.accentCaption}
                  width={640}
                  height={640}
                  loading="lazy"
                />
              </figure>
              <div className="service-float-card">
                <span className="eyebrow">DESIGNED FOR</span>
                <strong>{service.name}</strong>
                <span>Indore · 2-hour setup · Fully bespoke</span>
              </div>
            </div>
          </div>

          <div className="page-width service-facts">
            {service.quickFacts.map((fact) => (
              <div key={fact.label}>
                <span>{fact.label}</span>
                <strong>{fact.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="service-intro section-space page-width">
          <div className="service-intro-copy reveal">
            <span className="eyebrow">WHAT THIS IS, AND WHY IT MATTERS</span>
            <h2>{service.intro.heading}</h2>
            {service.intro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
          <div className="service-intro-aside reveal">
            <figure>
              <img
                src={service.accentImage}
                alt={service.accentCaption}
                width={900}
                height={900}
                loading="lazy"
              />
              <figcaption>{service.accentCaption}</figcaption>
            </figure>
            <blockquote className="service-pullquote">
              <Quote size={22} aria-hidden="true" />
              <p>{service.intro.pullQuote}</p>
            </blockquote>
          </div>
        </section>

        <section className="service-pillars section-space">
          <div className="page-width">
            <div className="section-heading reveal">
              <div>
                <span className="eyebrow">THE DIFFERENCE</span>
                <h2>
                  Why this is
                  <br />
                  <em>not decoration.</em>
                </h2>
              </div>
              <div className="section-intro">
                <p>
                  Three things every {service.shortName.toLowerCase()} client feels, and remembers.
                </p>
              </div>
            </div>
            <div className="service-pillar-grid">
              {service.pillars.map((pillar, index) => (
                <article className="service-pillar reveal" key={pillar.title}>
                  <span className="service-pillar-index">0{index + 1}</span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="service-includes section-space">
          <div className="page-width">
            <div className="section-heading reveal">
              <div>
                <span className="eyebrow">EVERYTHING THAT IS INCLUDED</span>
                <h2>
                  What we build,
                  <br />
                  <em>detail by detail.</em>
                </h2>
              </div>
              <div className="section-intro">
                <p>No hidden extras. Every line below appears in your quote before you confirm.</p>
                <a className="section-link" href={whatsappHref} target="_blank" rel="noreferrer">
                  ASK ABOUT YOUR DATE <MessageCircle size={15} />
                </a>
              </div>
            </div>
            <div className="service-includes-grid">
              {service.inclusions.map((item, index) => (
                <div className="service-include reveal" key={item.title}>
                  <span className="service-include-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="service-timeline section-space">
          <div className="page-width">
            <div className="section-heading reveal">
              <div>
                <span className="eyebrow">HOW IT HAPPENS</span>
                <h2>
                  From first message
                  <br />
                  <em>to final flourish.</em>
                </h2>
              </div>
              <div className="section-intro">
                <p>Four steps. One point of contact. Nothing left to chance.</p>
              </div>
            </div>
            <ol className="service-timeline-list">
              {service.timeline.map((step) => (
                <li className="reveal" key={step.step}>
                  <span className="service-step">{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </li>
              ))}
            </ol>
            <div className="service-occasions reveal">
              <span className="eyebrow">OCCASIONS WE STYLE</span>
              <ul>
                {service.occasions.map((occasionItem) => (
                  <li key={occasionItem}>{occasionItem}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="service-gallery section-space page-width" id="gallery">
          <div className="section-heading reveal">
            <div>
              <span className="eyebrow">OUR CREATIONS</span>
              <h2>
                A few moments
                <br />
                <em>we have made.</em>
              </h2>
            </div>
            <div className="section-intro">
              <p>
                Six frames from our {service.shortName.toLowerCase()} work. Yours will be built the
                same way — from scratch.
              </p>
            </div>
          </div>
          <div className="service-gallery-grid">
            {service.gallery.map((item, index) => (
              <figure
                className={`service-shot service-shot-${index + 1} reveal`}
                key={`${item.src}-${index}`}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  width={1024}
                  height={1024}
                  loading={index < 2 ? "eager" : "lazy"}
                />
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="service-packages section-space" id="packages">
          <div className="page-width">
            <div className="section-heading reveal">
              <div>
                <span className="eyebrow">WAYS TO CELEBRATE</span>
                <h2>
                  Three levels.
                  <br />
                  <em>The same standard.</em>
                </h2>
              </div>
              <div className="section-intro">
                <p>
                  Every package is quoted after a short conversation — itemised, transparent and
                  held for your date once confirmed.
                </p>
              </div>
            </div>
            <div className="service-package-grid">
              {service.packages.map((pack) => (
                <article
                  className={
                    pack.featured ? "service-package is-featured reveal" : "service-package reveal"
                  }
                  key={pack.name}
                >
                  {pack.featured && <span className="package-flag">MOST CHOSEN</span>}
                  <h3>{pack.name}</h3>
                  <p className="package-best">{pack.bestFor}</p>
                  <ul>
                    {pack.includes.map((line) => (
                      <li key={line}>
                        <Check size={14} aria-hidden="true" /> {line}
                      </li>
                    ))}
                  </ul>
                  <a className="package-link" href="#concierge">
                    Request the price guide <ArrowUpRight size={15} />
                  </a>
                </article>
              ))}
            </div>
            <p className="package-note reveal">
              <Sparkles size={14} aria-hidden="true" /> Prices depend on scale, florals and venue.
              You will always receive a written, itemised quote before any advance — and a design
              concept before you decide.
            </p>
          </div>
        </section>

        <section className="service-proof section-space">
          <div className="page-width">
            <div className="section-heading reveal">
              <div>
                <span className="eyebrow">IN THEIR WORDS</span>
                <h2>
                  Remembered long after
                  <br />
                  <em>the last guest leaves.</em>
                </h2>
              </div>
              <div className="rating-badge reveal" aria-label="Five star client feedback">
                <span className="rating-stars" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} size={15} fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                <span>Loved by Indore families</span>
              </div>
            </div>
            <div className="reviews-grid">
              {service.proof.map((item) => (
                <figure className="review-card reveal" key={item.name}>
                  <Quote className="review-mark" size={30} strokeWidth={1} aria-hidden="true" />
                  <blockquote>{item.quote}</blockquote>
                  <figcaption>
                    <span className="review-avatar" aria-hidden="true">
                      {item.name.charAt(0)}
                    </span>
                    <span>
                      <strong>{item.name}</strong>
                      <small>{item.meta}</small>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="service-faq section-space page-width" id="faq">
          <div className="faq-layout">
            <div className="faq-intro reveal">
              <span className="eyebrow">BEFORE YOU ASK</span>
              <h2>
                Honest answers
                <br />
                <em>to real questions.</em>
              </h2>
              <p>
                Anything else? A real person answers every message — usually within the hour. No
                call centre, no automated reply.
              </p>
              <a className="faq-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircle size={16} /> Ask us on WhatsApp
              </a>
            </div>
            <div className="faq-list reveal">
              {service.faqs.map((faq) => (
                <details className="faq-item" key={faq.question}>
                  <summary>
                    <span>{faq.question}</span>
                    <ChevronDown size={20} aria-hidden="true" />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="service-closing">
          <div className="page-width service-closing-inner reveal">
            <span className="eyebrow">A DATE IS THE ONE THING WE CANNOT ADD MORE OF</span>
            <h2>{service.closing.heading}</h2>
            <p>{service.closing.copy}</p>
            <p className="service-urgency">
              <Clock3 size={15} aria-hidden="true" /> {service.urgency}
            </p>
            <div className="service-closing-actions">
              <Button variant="luxury" asChild>
                <a href={whatsappHref} target="_blank" rel="noreferrer">
                  <MessageCircle /> Check availability
                  <ArrowUpRight />
                </a>
              </Button>
              <Button variant="glass" asChild>
                <a href={`tel:${contact.phone}`}>
                  <Phone /> {contact.label}
                </a>
              </Button>
            </div>
            <div className="service-closing-meta">
              <span>
                <MapPin size={14} /> Indore &amp; 60 km
              </span>
              <span>
                <Clock3 size={14} /> Open daily, 9 am – 9 pm
              </span>
              <span>
                <Check size={14} /> Free concept &amp; itemised quote
              </span>
            </div>
          </div>
        </section>

        <section className="service-others section-space page-width">
          <div className="section-heading reveal">
            <div>
              <span className="eyebrow">KEEP EXPLORING</span>
              <h2>
                Other creations
                <br />
                <em>you may love.</em>
              </h2>
            </div>
          </div>
          <div className="service-other-grid">
            {others.map((item) => (
              <Link
                key={item.slug}
                to="/creations/$slug"
                params={{ slug: item.slug }}
                className="service-other reveal"
              >
                <img src={item.heroImage} alt="" width={640} height={640} loading="lazy" />
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.tagline}</small>
                </span>
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <Concierge occasion={occasion} onOccasionChange={setOccasion} />
      </main>
      <SiteFooter />
    </>
  );
}
