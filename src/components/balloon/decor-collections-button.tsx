import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import "./decor-collections-button.css";

/** Replaces the FLOWERS / BALLOONS / MEMORIES text in the home service strip. */
export function DecorCollectionsButton() {
  return (
    <Link
      to="/decor-collections"
      className="decor-discovery-button"
      aria-label="Explore decor styles — 25 styles and 150 options"
    >
      <span className="decor-entry-art" aria-hidden="true">
        <img src="/decor-types/balloon-decor.jpg" alt="" width={42} height={48} loading="lazy" />
        <img src="/decor-types/floral-decor.jpg" alt="" width={42} height={48} loading="lazy" />
      </span>
      <span className="decor-entry-copy">
        <b>Explore decor styles</b>
        <small>25 styles · 150 possibilities</small>
      </span>
      <span className="decor-entry-arrow" aria-hidden="true">
        <ArrowUpRight size={20} />
      </span>
    </Link>
  );
}
