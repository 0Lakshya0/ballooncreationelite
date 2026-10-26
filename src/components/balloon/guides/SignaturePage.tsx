import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Flower2, Palette, Ruler } from "lucide-react";
import { sitePhotos } from "@/lib/supplied-site-photos";
import { GuideShell } from "./GuideShell";
const principles = [
  {
    icon: Palette,
    title: "Designed around you",
    text: "Your occasion, your colours, your kind of celebration. Start with a feeling or a reference; we shape the idea around the space, not the other way around.",
  },
  {
    icon: Flower2,
    title: "Considered in every detail",
    text: "Flowers, balloons, props and finishing touches should feel like one design. We discuss the actual materials and quantities, not just a beautiful inspiration photo.",
  },
  {
    icon: Ruler,
    title: "Planned for your venue",
    text: "Access, measurements, mounting rules and the ready-by time matter. Practical planning supports a beautiful setup and a more comfortable event day.",
  },
];
const steps = [
  [
    "01",
    "We listen first",
    "Share the occasion, the people it is for and what would make it feel personal. Being unsure is a perfectly good starting point.",
  ],
  [
    "02",
    "We make the plan clear",
    "Discuss the palette, scale, materials, placement and extras. Review what is included, what is not, and the quote before deciding.",
  ],
  [
    "03",
    "We prepare for the day",
    "Agree venue access, installation timing and any permissions. Confirm collection or removal arrangements if these are part of your plan.",
  ],
];
export function SignaturePage() {
  return (
    <GuideShell current="The signature standard">
      <header className="guide-hero guide-hero-image">
        <div>
          <span className="eyebrow">THE SIGNATURE STANDARD</span>
          <h1>
            Beautiful by design.
            <br />
            <em>Thoughtful by nature.</em>
          </h1>
          <p>
            A celebration should feel personal, not complicated. Our approach brings the creative
            details and the practical ones into the same conversation.
          </p>
          <Link to="/lets-celebrate" className="luxury-button">
            Tell us your idea <ArrowUpRight size={18} />
          </Link>
        </div>
        <figure>
          <img
            src={sitePhotos.wedding.image}
            alt={sitePhotos.wedding.detail}
            width={800}
            height={600}
          />
          <figcaption>
            A visual starting point. Your design and inclusions are agreed for your own occasion.
          </figcaption>
        </figure>
      </header>
      <section className="guide-section" aria-labelledby="principles-heading">
        <div className="guide-section-title">
          <span className="eyebrow">WHAT THE STANDARD MEANS</span>
          <h2 id="principles-heading">More than a beautiful backdrop.</h2>
          <p>Three things we bring into the planning conversation.</p>
        </div>
        <div className="guide-principles">
          {principles.map(({ icon: Icon, title, text }, i) => (
            <article key={title}>
              <div className="guide-card-top">
                <Icon size={28} strokeWidth={1.3} aria-hidden="true" />
                <span>0{i + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="guide-section guide-process" aria-labelledby="approach-heading">
        <div className="guide-section-title">
          <span className="eyebrow">FROM FIRST IDEA TO EVENT DAY</span>
          <h2 id="approach-heading">A simple way forward.</h2>
          <p>No need to arrive with everything decided.</p>
        </div>
        <ol>
          {steps.map(([number, title, text]) => (
            <li key={number}>
              <span className="guide-step-number">{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="guide-checklist guide-note" aria-labelledby="before-confirming">
        <div>
          <span className="eyebrow">CONFIDENCE COMES FROM CLARITY</span>
          <h2 id="before-confirming">
            Before you confirm,
            <br />
            know what you are choosing.
          </h2>
          <p>A good plan is easy to understand. Ask us to walk you through these details.</p>
        </div>
        <ul>
          {[
            "The design, materials and actual inclusions",
            "The venue, access and agreed ready-by time",
            "The complete quote and any optional extras",
            "Booking, changes, cancellation and removal terms",
          ].map((text) => (
            <li key={text}>
              <Check size={19} aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </section>
      <section className="guide-invitation">
        <div>
          <h2>Your story is the starting point.</h2>
          <p>A colour you love. A milestone that matters. A space waiting to be transformed.</p>
        </div>
        <div className="guide-actions">
          <Link className="luxury-button" to="/lets-celebrate">
            Let’s celebrate <ArrowUpRight size={18} />
          </Link>
          <Link className="guide-text-link" to="/faqs">
            Read the FAQs <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </GuideShell>
  );
}
