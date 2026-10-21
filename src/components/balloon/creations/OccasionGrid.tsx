import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown, ChevronUp, Search } from "lucide-react";
import { occasionPages } from "@/lib/occasion-catalogue";
import "./occasions.css";
const groups = ["All occasions", "Family", "Couples", "Home & milestones", "Work & events"];
export function OccasionGrid() {
  const [group, setGroup] = useState("All occasions"),
    [query, setQuery] = useState("");
  const [limit, setLimit] = useState(6);
  const heading = useRef<HTMLHeadingElement>(null);
  const filtered = group !== "All occasions" || query.trim().length > 0;
  const visible = occasionPages.filter(
    (item) =>
      (group === "All occasions" || item.group === group) &&
      `${item.name} ${item.promise}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const displayed = filtered ? visible : visible.slice(0, limit);
  return (
    <div className="occasion-browser">
      <div className="occasion-browser-top">
        <div>
          <h3 ref={heading} tabIndex={-1} className="occasion-browser-heading">
            Choose your occasion
          </h3>
          <p>The same occasions as the circles above. Pick one to see simple ideas.</p>
        </div>
        <label className="occasion-search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Find an occasion</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLimit(6);
            }}
            placeholder="Birthday, wedding, office…"
          />
        </label>
      </div>
      <div className="occasion-filters" role="group" aria-label="Filter occasions">
        {groups.map((name) => (
          <button
            type="button"
            key={name}
            aria-pressed={name === group}
            onClick={() => {
              setGroup(name);
              setLimit(6);
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <p className="occasion-count" role="status">
        Showing {displayed.length} of {visible.length}{" "}
        {visible.length === 1 ? "occasion" : "occasions"}
      </p>
      {visible.length ? (
        <div className="occasion-grid" id="occasion-results">
          {displayed.map((item) => (
            <article className="occasion-card" key={item.slug}>
              <Link
                to="/creations/$slug"
                params={{ slug: item.slug }}
                aria-label={`Explore ${item.name}`}
              >
                <div className="occasion-card-image">
                  <img
                    src={item.heroImage}
                    alt={`${item.name} decoration inspiration`}
                    width={256}
                    height={256}
                    loading="lazy"
                    decoding="async"
                  />
                  <span>
                    <ArrowUpRight size={20} />
                  </span>
                </div>
                <div className="occasion-card-copy">
                  <h3>{item.name}</h3>
                  <p>{item.promise}</p>
                  <span className="occasion-card-more">
                    See ideas & details <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="occasion-empty">
          <h3>No matching occasion</h3>
          <p>
            Try a different word, or browse all occasions. You can also ask us about a custom setup.
          </p>
          <button
            type="button"
            onClick={() => {
              setGroup("All occasions");
              setQuery("");
              setLimit(6);
            }}
          >
            Reset search & filters
          </button>
        </div>
      )}
      {!filtered && visible.length > 6 && (
        <div className="occasion-browse-actions">
          {displayed.length < visible.length && (
            <button
              type="button"
              className="luxury-button"
              aria-controls="occasion-results"
              onClick={() => setLimit((current) => Math.min(current + 6, visible.length))}
            >
              Explore more occasions <ChevronDown size={18} aria-hidden="true" />
            </button>
          )}
          {displayed.length > 6 && (
            <button
              type="button"
              className="occasion-show-fewer"
              aria-controls="occasion-results"
              onClick={() => {
                setLimit(6);
                heading.current?.focus();
              }}
            >
              Show fewer occasions <ChevronUp size={16} aria-hidden="true" />
            </button>
          )}
          <p>Browse at your own pace, or use search to find your occasion directly.</p>
        </div>
      )}
      <p className="occasion-help">
        Not sure what to choose?{" "}
        <Link to="/" hash="concierge">
          Tell us what you are planning
        </Link>{" "}
        — we will help you find a starting point.
      </p>
    </div>
  );
}
