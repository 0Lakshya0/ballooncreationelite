import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown, MessageCircle, Search } from "lucide-react";
import { guideFaqs } from "@/lib/celebration-guides";
import { whatsappLink } from "@/lib/celebrations";
import { GuideShell } from "./GuideShell";
const topics = ["All questions", "Planning", "Design & venue", "Booking & changes", "On the day"];
export function FaqPage() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All questions");
  const results = guideFaqs.filter(
    (item) =>
      (topic === "All questions" || item.topic === topic) &&
      `${item.question} ${item.answer}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <GuideShell current="FAQs">
      <header className="guide-hero guide-hero-faq">
        <div>
          <span className="eyebrow">A LITTLE CLARITY, BEFORE THE CELEBRATION</span>
          <h1>
            FAQs,
            <br />
            <em>made simple.</em>
          </h1>
          <p>
            From your first idea to the final setup. Find a clear answer, without having to know
            every detail already.
          </p>
        </div>
        <aside className="guide-note">
          <MessageCircle size={27} strokeWidth={1.3} aria-hidden="true" />
          <h2>A real conversation is welcome.</h2>
          <p>
            Not finding your answer? Tell us what you are planning. You do not need a finished
            brief.
          </p>
          <a
            className="guide-text-link"
            href={whatsappLink(
              "Hello Balloon Creation! I have a question about planning a celebration.",
            )}
            target="_blank"
            rel="noreferrer"
          >
            Ask us on WhatsApp <ArrowUpRight size={16} />
          </a>
        </aside>
      </header>
      <section className="guide-section" aria-labelledby="guide-faq-heading">
        <div className="guide-section-title">
          <span className="eyebrow">FIND WHAT YOU NEED</span>
          <h2 id="guide-faq-heading">Good questions. Clear answers.</h2>
        </div>
        <label className="guide-search">
          <Search size={20} aria-hidden="true" />
          <span className="sr-only">Search frequently asked questions</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try booking, colours, venue…"
          />
        </label>
        <div className="guide-filters" role="group" aria-label="FAQ topics">
          {topics.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={topic === name}
              onClick={() => setTopic(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <p className="guide-count" role="status">
          {results.length} {results.length === 1 ? "answer" : "answers"}
        </p>
        <div className="guide-questions">
          {results.map((item) => (
            <details key={item.question}>
              <summary>
                <span>{item.question}</span>
                <ChevronDown size={20} aria-hidden="true" />
              </summary>
              <div>
                <span className="guide-topic">{item.topic}</span>
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
        {!results.length && (
          <div className="guide-note">
            <h3>No answer matched that search.</h3>
            <p>Try a simpler word, browse a different topic, or ask us directly.</p>
            <button
              className="guide-text-link"
              type="button"
              onClick={() => {
                setQuery("");
                setTopic("All questions");
              }}
            >
              Reset search & topics
            </button>
          </div>
        )}
      </section>
      <section className="guide-invitation">
        <div>
          <span className="eyebrow">WHEN YOU FEEL READY</span>
          <h2>
            Let’s turn your questions
            <br />
            into a starting point.
          </h2>
          <p>Start with an occasion. The rest can be a conversation.</p>
        </div>
        <Link className="luxury-button" to="/lets-celebrate">
          Plan your celebration <ArrowUpRight size={18} />
        </Link>
      </section>
    </GuideShell>
  );
}
