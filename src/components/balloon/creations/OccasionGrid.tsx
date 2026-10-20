import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Search } from "lucide-react";
import { occasionPages } from "@/lib/occasion-catalogue";
import "./occasions.css";
const groups = ["All occasions", "Family", "Couples", "Home & milestones", "Work & events"];
export function OccasionGrid() {
  const [group, setGroup] = useState("All occasions"),
    [query, setQuery] = useState("");
  const visible = occasionPages.filter(
    (item) =>
      (group === "All occasions" || item.group === group) &&
      `${item.name} ${item.promise}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <div className="occasion-browser">
      <div className="occasion-browser-top">
        <div>
          <h3>Choose your occasion</h3>
          <p>The same occasions as the circles above. Pick one to see simple ideas.</p>
        </div>
        <label className="occasion-search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Find an occasion</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
            onClick={() => setGroup(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <p className="occasion-count" role="status">
        {visible.length} {visible.length === 1 ? "occasion" : "occasions"}
      </p>
      {visible.length ? (
        <div className="occasion-grid">
          {visible.map((item) => (
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
            }}
          >
            Show all occasions
          </button>
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
