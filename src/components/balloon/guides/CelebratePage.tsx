import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown, MessageCircle, Phone } from "lucide-react";
import { occasionChoices, isKnownOccasion } from "@/lib/occasion-choices";
import { celebrationPlanMessage } from "@/lib/celebration-guides";
import { contact, whatsappLink } from "@/lib/celebrations";
import { Concierge } from "../concierge";
import { GuideShell } from "./GuideShell";
export function CelebratePage({ initialOccasion = "" }: { initialOccasion?: string }) {
  const [occasion, setOccasion] = useState(isKnownOccasion(initialOccasion) ? initialOccasion : "");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [vision, setVision] = useState("");
  const [today] = useState(() => new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10));
  const hash = useRouterState({ select: (state) => state.location.hash });
  const [callbackOpen, setCallbackOpen] = useState(false);
  useEffect(() => {
    // The URL fragment is not sent to the server; account for first SSR hydration too.
    if (hash === "callback" || window.location.hash.endsWith("#callback")) setCallbackOpen(true);
  }, [hash]);
  useEffect(() => {
    setOccasion(isKnownOccasion(initialOccasion) ? initialOccasion : "");
  }, [initialOccasion]);
  const message = celebrationPlanMessage({ occasion, date, venue, vision });
  return (
    <GuideShell current="Let’s celebrate">
      <header className="guide-hero guide-hero-plan">
        <div>
          <span className="eyebrow">LET’S CELEBRATE</span>
          <h1>
            Your next beautiful
            <br />
            <em>memory starts here.</em>
          </h1>
          <p>
            A grand celebration or a little surprise. Share what you know, leave the rest open, and
            let’s find a starting point together.
          </p>
        </div>
        <aside className="guide-note">
          <span className="guide-topic">NO FINISHED PLAN NEEDED</span>
          <h2>
            A conversation,
            <br />
            not a commitment.
          </h2>
          <p>
            Pick an occasion, add any details you know, then review your message in WhatsApp.
            Nothing is sent automatically.
          </p>
        </aside>
      </header>
      <section className="guide-section" aria-labelledby="plan-heading">
        <div className="guide-section-title">
          <span className="eyebrow">A SIMPLE FIRST STEP</span>
          <h2 id="plan-heading">Tell us a little. We’ll take it from there.</h2>
          <p>
            Everything in this planner is optional. If you are unsure, just ask us to suggest an
            idea.
          </p>
        </div>
        <div className="guide-planner">
          <div className="guide-note guide-plan-fields">
            <label>
              What are you celebrating?
              <select
                aria-label="What are you celebrating?"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
              >
                <option value="">Help me choose / something else</option>
                {occasionChoices.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
            <div className="guide-field-pair">
              <label>
                Preferred date <span>(optional)</span>
                <input
                  type="date"
                  aria-label="Preferred date (optional)"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <label>
                Venue or area <span>(optional)</span>
                <input
                  aria-label="Venue or area (optional)"
                  value={venue}
                  maxLength={160}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="For example, Vijay Nagar"
                  autoComplete="off"
                />
              </label>
            </div>
            <label>
              Your ideas <span>(optional)</span>
              <textarea
                aria-label="Your ideas (optional)"
                rows={4}
                maxLength={700}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="A colour, a theme, the people it is for…"
              />
            </label>
            <p className="guide-small">
              Please share event details only. No address, payment or identity documents are needed
              to start.
            </p>
          </div>
          <aside className="guide-note guide-plan-summary" aria-labelledby="plan-summary-heading">
            <span className="eyebrow">YOUR STARTING POINT</span>
            <h3 id="plan-summary-heading">A plan with room to grow.</h3>
            <dl>
              <div>
                <dt>Occasion</dt>
                <dd>{occasion || "Please help me choose"}</dd>
              </div>
              <div>
                <dt>Preferred date</dt>
                <dd>{date || "Not decided yet"}</dd>
              </div>
              <div>
                <dt>Venue / area</dt>
                <dd>{venue.trim() || "Not decided yet"}</dd>
              </div>
            </dl>
            <p>
              We will discuss ideas, availability, inclusions and a quote. This is not a confirmed
              booking.
            </p>
            <a
              className="luxury-button"
              href={whatsappLink(message)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} /> Review in WhatsApp <ArrowUpRight size={17} />
            </a>
            <a className="guide-text-link" href={`tel:${contact.phone}`}>
              <Phone size={17} /> Prefer a call? {contact.label}
            </a>
            <p className="guide-small">
              These planner details stay on this page until you choose to open WhatsApp. You review
              and send the message there.
            </p>
          </aside>
        </div>
      </section>
      <section className="guide-section guide-next" aria-labelledby="what-happens-heading">
        <div className="guide-section-title">
          <span className="eyebrow">WHAT HAPPENS NEXT?</span>
          <h2 id="what-happens-heading">You stay in the conversation.</h2>
        </div>
        <ol>
          <li>
            <span>01</span>
            <h3>Share your starting point</h3>
            <p>Send the message, call us or request a callback below.</p>
          </li>
          <li>
            <span>02</span>
            <h3>Discuss the details</h3>
            <p>Talk through your design, venue, timing and what is possible.</p>
          </li>
          <li>
            <span>03</span>
            <h3>Confirm when you are ready</h3>
            <p>Review the agreed scope, quote and booking terms first.</p>
          </li>
        </ol>
      </section>
      <details
        className="guide-callback"
        id="callback"
        open={callbackOpen}
        onToggle={(e) => setCallbackOpen(e.currentTarget.open)}
      >
        <summary>
          <div>
            <span className="eyebrow">PREFER US TO GET IN TOUCH?</span>
            <h2>Request a callback</h2>
            <p>
              Have a date and venue in mind? Share your contact details through our consultation
              form.
            </p>
          </div>
          <ChevronDown size={24} aria-hidden="true" />
        </summary>
        <p className="guide-small">
          If your date or venue is undecided, WhatsApp or a call is the easier starting point.
          Submitting a request does not reserve a date.
        </p>
        <Concierge occasion={occasion} onOccasionChange={setOccasion} compact />
      </details>
      <div className="guide-reassurance">
        <p>Questions before you begin?</p>
        <Link className="guide-text-link" to="/faqs">
          Read the FAQs <ArrowUpRight size={16} />
        </Link>
        <Link className="guide-text-link" to="/signature-standard">
          Discover our approach <ArrowUpRight size={16} />
        </Link>
      </div>
    </GuideShell>
  );
}
