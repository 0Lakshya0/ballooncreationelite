import { ChevronDown, MessageCircle } from "lucide-react";
import { faqs } from "@/lib/site-content";
import { whatsappLink } from "@/lib/celebrations";

export function Faq() {
  return (
    <section className="faq section-space" id="faq" aria-labelledby="faq-heading">
      <div className="page-width faq-layout">
        <div className="faq-intro reveal">
          <span className="eyebrow">GOOD TO KNOW</span>
          <h2 id="faq-heading">
            A few things
            <br />
            <em>worth asking.</em>
          </h2>
          <p>
            Anything else on your mind? We answer every message personally — usually within the
            hour.
          </p>
          <a
            className="faq-whatsapp"
            href={whatsappLink(
              "Hello Balloon Creation! I have a question about your celebrations.",
            )}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} /> Ask us on WhatsApp
          </a>
        </div>
        <div className="faq-list reveal">
          {faqs.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>
                <span>{item.question}</span>
                <ChevronDown size={20} aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
