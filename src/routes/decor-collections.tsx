import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import DecorTypesSection from "@/components/balloon/decor/DecorTypesSection";
import { contact } from "@/lib/celebrations";
import "@/components/balloon/decor/collections-page.css";

export const Route = createFileRoute("/decor-collections")({
  head: () => ({
    meta: [
      { title: "Explore Decor Styles — Balloon Creation" },
      {
        name: "description",
        content:
          "Explore 25 decor styles and 150 detailed options for your celebration. Flowers, balloons, beautiful settings and finishing touches by Balloon Creation, Indore.",
      },
    ],
  }),
  component: DecorCollectionsPage,
});

function DecorCollectionsPage() {
  return (
    <div className="decor-collections-page">
      <header className="collections-page-header">
        <div className="page-width">
          <Link to="/" className="collections-home">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to home</span>
          </Link>
          <a className="collections-wordmark" href="/">
            Balloon Creation<small>We decorate your happiness</small>
          </a>
          <a
            className="collections-enquire"
            href={`${contact.whatsapp}?text=${encodeURIComponent("Hello Balloon Creation! I would love help choosing decor for my celebration.")}`}
            target="_blank"
            rel="noreferrer"
          >
            Let’s celebrate <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </header>
      <main>
        <h1 className="sr-only">Explore our decor collections</h1>
        <DecorTypesSection />
      </main>
    </div>
  );
}
