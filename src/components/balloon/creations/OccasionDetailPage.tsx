import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, MessageCircle, Phone } from "lucide-react";
import { SiteHeader } from "@/components/balloon/site-header";
import { SiteLiquidBackground } from "@/components/balloon/site-liquid-background";
import { occasionMessage, occasionPages, type OccasionPage } from "@/lib/occasion-catalogue";
import { contact, whatsappLink } from "@/lib/celebrations";
import "./occasions.css";
export function OccasionDetailPage({ occasion }: { occasion: OccasionPage }) {
  const [idea, setIdea] = useState(""),
    [date, setDate] = useState(""),
    [area, setArea] = useState("");
  const message = whatsappLink(occasionMessage(occasion.name, idea, date, area));
  const related = [
    ...occasionPages.filter((item) => item.group === occasion.group && item.slug !== occasion.slug),
    ...occasionPages.filter((item) => item.group !== occasion.group),
  ].slice(0, 3);
  const minDate = new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10);
  return (
    <div className="site-liquid-shell occasion-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteLiquidBackground />
      <SiteHeader />
      <main id="main" className="occasion-page">
        <nav className="page-width breadcrumb" aria-label="Breadcrumb">
          <Link to="/" hash="portfolio">
            <ArrowLeft size={14} /> All occasions
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{occasion.name}</span>
        </nav>
        <section className="page-width occasion-hero">
          <div>
            <span className="eyebrow">YOUR OCCASION, MADE SIMPLE</span>
            <h1>{occasion.heading}</h1>
            <p className="occasion-lead">{occasion.promise}</p>
            <div className="occasion-actions">
              <a className="occasion-primary" href="#ideas">
                See 3 styling ideas <ArrowUpRight size={18} />
              </a>
              <a className="occasion-secondary" href={message} target="_blank" rel="noreferrer">
                <MessageCircle size={18} /> Help me choose
              </a>
            </div>
            <p className="occasion-reassurance">
              You do not need a finished plan. Start with an idea, or simply tell us about your
              occasion.
            </p>
          </div>
          <figure>
            <img
              src={occasion.heroImage}
              alt={`${occasion.name} decoration inspiration`}
              width={256}
              height={256}
              fetchPriority="high"
            />
            <figcaption>
              Styling inspiration. Your final setup is planned for your space.
            </figcaption>
          </figure>
        </section>
        <section className="page-width occasion-section" aria-labelledby="included-heading">
          <div className="occasion-section-heading">
            <span className="eyebrow">A CLEAR STARTING POINT</span>
            <h2 id="included-heading">What we can help with</h2>
            <p>
              Choose the parts you need. Exact materials, size and extras are confirmed in your
              quote.
            </p>
          </div>
          <ul className="occasion-inclusions">
            {occasion.inclusions.map((item) => (
              <li key={item}>
                <Check size={19} />
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="page-width occasion-section" id="ideas" aria-labelledby="ideas-heading">
          <div className="occasion-section-heading">
            <span className="eyebrow">START WITH AN IDEA</span>
            <h2 id="ideas-heading">Three easy ways to begin</h2>
            <p>
              These are ideas to discuss, not fixed-price packages. We can mix colours and details
              to suit your venue.
            </p>
          </div>
          <div className="occasion-ideas">
            {occasion.packages.map((pack, index) => (
              <article
                className={idea === pack.name ? "occasion-idea is-selected" : "occasion-idea"}
                key={pack.name}
              >
                <span className="occasion-step">0{index + 1}</span>
                <h3>{pack.name}</h3>
                <p>{pack.bestFor}</p>
                <ul>
                  {pack.includes.map((line) => (
                    <li key={line}>
                      <Check size={16} />
                      {line}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  aria-pressed={idea === pack.name}
                  onClick={() => setIdea(idea === pack.name ? "" : pack.name)}
                >
                  {idea === pack.name ? "Selected — tap to clear" : "Choose this idea"}
                  <Check size={16} />
                </button>
              </article>
            ))}
          </div>
          <p className="occasion-help">
            Not sure yet?{" "}
            <button type="button" onClick={() => setIdea("")}>
              Let us suggest an idea
            </button>
            . You can still contact us without selecting anything.
          </p>
          <p className="sr-only" role="status">
            {idea ? `Selected: ${idea}` : "No idea selected. You can ask us for suggestions."}
          </p>
        </section>
        <section className="page-width occasion-section occasion-planning-note">
          <h2>Good to know</h2>
          <p>{occasion.planningNote}</p>
          <p>
            Share a photo or measurements of your space when you message us. We will discuss
            practical options before you book.
          </p>
        </section>
        <section
          className="page-width occasion-section occasion-enquiry"
          id="concierge"
          aria-labelledby="enquiry-heading"
        >
          <div>
            <span className="eyebrow">LET’S MAKE IT EASY</span>
            <h2 id="enquiry-heading">Tell us what you have in mind</h2>
            <p>
              Already selected: <strong>{occasion.name}</strong>
            </p>
            <p>
              {idea ? `Idea: ${idea}` : "No idea chosen? That is completely fine — we can help."}
            </p>
            <ol className="occasion-next-steps">
              <li>Send your date and venue, if you know them.</li>
              <li>We discuss the look, what is included and a quote.</li>
              <li>You decide after the details are clear.</li>
            </ol>
          </div>
          <div className="occasion-enquiry-fields">
            <label>
              Event date <span>(optional)</span>
              <input
                type="date"
                aria-label="Preferred event date"
                min={minDate}
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>
            <label>
              Venue or area <span>(optional)</span>
              <input
                value={area}
                onChange={(event) => setArea(event.target.value)}
                maxLength={120}
                placeholder="For example, Vijay Nagar or your venue name"
              />
            </label>
            <a className="occasion-primary" href={message} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> Discuss {occasion.name} on WhatsApp{" "}
              <ArrowUpRight size={18} />
            </a>
            <p className="occasion-small">
              WhatsApp opens with your draft. Nothing is sent or booked until you choose to proceed.
            </p>
            <div className="occasion-contact-alternatives">
              <a href={`tel:${contact.phone}`}>
                <Phone size={17} /> Call {contact.label}
              </a>
              <Link to="/" search={{ occasion: occasion.name }} hash="concierge">
                Request a callback <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        <section className="page-width occasion-section occasion-faq">
          <div className="occasion-section-heading">
            <span className="eyebrow">QUICK ANSWERS</span>
            <h2>Questions you may have</h2>
          </div>
          {occasion.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                {faq.question}
                <ChevronDown size={19} />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </section>
        <section className="page-width occasion-section">
          <div className="occasion-section-heading">
            <h2>Planning something else?</h2>
            <p>You can explore another occasion at any time.</p>
          </div>
          <div className="occasion-related">
            {related.map((item) => (
              <Link to="/creations/$slug" params={{ slug: item.slug }} key={item.slug}>
                <img src={item.heroImage} alt="" width={72} height={72} loading="lazy" />
                <span>{item.name}</span>
                <ArrowUpRight size={18} />
              </Link>
            ))}
          </div>
          <Link className="occasion-back" to="/" hash="portfolio">
            <ArrowLeft size={17} /> Back to all 20 occasions
          </Link>
        </section>
      </main>
    </div>
  );
}
