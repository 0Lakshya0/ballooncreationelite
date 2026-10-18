import { MessageCircle, ArrowUpRight } from "lucide-react";
import { processSteps } from "@/lib/site-content";
import { whatsappLink } from "@/lib/celebrations";

export function Process() {
  return (
    <section className="process section-space" id="process" aria-labelledby="process-heading">
      <div className="page-width">
        <div className="section-heading reveal">
          <div>
            <span className="eyebrow">FROM FIRST MESSAGE TO FINAL FLOURISH</span>
            <h2 id="process-heading">
              Three steps.
              <br />
              <em>One flawless celebration.</em>
            </h2>
          </div>
          <div className="section-intro">
            <p>Simple for you. Meticulous behind the scenes.</p>
            <a
              className="section-link"
              href={whatsappLink(
                "Hello Balloon Creation! I would like to start planning a celebration.",
              )}
              target="_blank"
              rel="noreferrer"
            >
              START ON WHATSAPP <MessageCircle size={15} />
            </a>
          </div>
        </div>
        <div className="process-grid reveal">
          {processSteps.map((step) => (
            <article className="process-step" key={step.step}>
              <span className="process-number">{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
        <div className="process-cta reveal">
          <p>Planning something with a date already in mind?</p>
          <a href="#concierge" className="process-cta-link">
            Check availability <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
