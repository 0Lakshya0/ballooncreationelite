import { useAIConcierge } from "@/lib/ai-concierge-context";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { contact } from "@/lib/celebrations";
import { localBloonAnswer } from "@/lib/bloon-identity";
import { normalizeSearch, rankSearch, searchServices, type SearchService } from "@/lib/site-search";

export function SmartSearch({ areas, onLocation }: { areas: string[]; onLocation: () => void }) {
  const askAI = useAIConcierge();
  const router = useRouter({ warn: false });
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [placement, setPlacement] = useState({ above: false, height: 320 });
  // Keep a query typed into the server-rendered field before hydration finishes.
  useLayoutEffect(() => {
    if (input.current?.value) {
      setQ(input.current.value);
      setOpen(true);
    }
  }, []);
  useLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      const r = box.current?.getBoundingClientRect();
      if (!r) return;
      const view = window.visualViewport;
      const top = view?.offsetTop || 0;
      const below = top + (view?.height || innerHeight) - r.bottom - 8;
      const aboveSpace = r.top - top - 8;
      const above = below < 240 && aboveSpace > below;
      const height = Math.max(48, Math.min(320, Math.floor((above ? aboveSpace : below) - 12)));
      setPlacement((previous) =>
        previous.above === above && previous.height === height ? previous : { above, height },
      );
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    window.visualViewport?.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("scroll", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      window.visualViewport?.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("scroll", measure);
    };
  }, [open]);
  const [ph, setPh] = useState("");
  useEffect(() => {
    const lines = [
      "You have any question? Write here...",
      "Want to search something? Search here...",
      "Want to know something? Write here...",
      "Looking for a Birthday Surprise?",
      "Search for 'Baby Shower' or 'Welcome Baby'...",
      "Try searching: 'First Night Decoration'...",
      "Ask us: 'Do you serve in Vijay Nagar?'",
      "Want to see 'Car Decoration' photos?",
      "Type 'Wedding' to explore our magic...",
    ];
    let i = 0,
      pos = 0,
      del = false,
      t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const line = lines[i]!;
      if (!del) {
        pos++;
        setPh(line.slice(0, pos));
        if (pos === line.length) {
          del = true;
          t = setTimeout(tick, 2500);
          return;
        }
        t = setTimeout(tick, 120);
      } else {
        pos--;
        setPh(line.slice(0, pos));
        if (pos === 0) {
          del = false;
          i = (i + 1) % lines.length;
          t = setTimeout(tick, 700);
          return;
        }
        t = setTimeout(tick, 55);
      }
    };
    t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, []);
  const term = normalizeSearch(q);
  const services = useMemo(
    () =>
      localBloonAnswer(q)
        ? []
        : rankSearch(
            q,
            searchServices,
            (s) => s.name,
            (s) => s.aliases,
          ),
    [q],
  );
  const places = useMemo(
    () => (localBloonAnswer(q) ? [] : rankSearch(q, areas, (p) => p)),
    [q, areas],
  );
  const reply = /\b(prices?|costs?|rates?)\b/i.test(q)
    ? "price"
    : /\b(times?|duration)\b/i.test(q)
      ? "time"
      : /\b(contact|phone)\b/i.test(q)
        ? "contact"
        : null;
  const unmatched = !!term && !services.length && !places.length && !reply;
  const shownServices = unmatched ? searchServices.slice(0, 5) : services.slice(0, 8);
  const dismiss = () => setOpen(false);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  const done = () => {
    dismiss();
    setQ("");
  };
  const pickService = (item: SearchService) => {
    done();
    if (router) void router.navigate({ to: "/creations/$slug", params: { slug: item.slug } });
  };
  const pickPlace = (place: string) => {
    done();
    onLocation();
    toast.success(`Yes! We cover ${place}.`);
  };
  const ask = () => {
    const question = q.trim();
    done();
    askAI?.(question);
  };
  return (
    <div
      className="smart-search"
      ref={box}
      onKeyDown={(event) => {
        if (event.key === "Escape") dismiss();
        if (
          event.key !== "Enter" ||
          event.nativeEvent.isComposing ||
          event.target !== box.current?.querySelector("input") ||
          !q.trim() ||
          reply
        )
          return;
        event.preventDefault();
        if (!unmatched && services[0]) pickService(services[0]);
        else if (!unmatched && places[0]) pickPlace(places[0]);
        else if (askAI) ask();
      }}
    >
      <Search size={16} className="smart-icon" aria-hidden="true" />
      <input
        ref={input}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={(event) => {
          setQ(event.currentTarget.value);
          setOpen(true);
        }}
        placeholder={ph || "Search services or Indore areas…"}
        aria-label="Search services or locations"
        aria-expanded={open}
        aria-controls="smart-search-results"
        autoComplete="off"
        maxLength={1500}
      />
      {open && (
        <div
          style={{
            top: placement.above ? "auto" : "calc(100% + 8px)",
            bottom: placement.above ? "calc(100% + 8px)" : "auto",
            maxHeight: placement.height,
          }}
          id="smart-search-results"
          className="smart-results"
          role="region"
          aria-label="Search results"
        >
          {reply === "price" ? (
            <a
              className="smart-empty"
              href={`${contact.whatsapp}?text=${encodeURIComponent("Hi, I would like a custom quote.")}`}
              target="_blank"
              rel="noreferrer"
            >
              💰 Estimates start ₹1,999. Click for Custom Quote.
            </a>
          ) : reply === "time" ? (
            <div className="smart-empty" role="status">
              ⏱️ Setup takes 2-3 hours only.
            </div>
          ) : reply === "contact" ? (
            <>
              <a
                className="smart-empty"
                href={`${contact.whatsapp}?text=${encodeURIComponent("Hi, I would like to discuss a decoration.")}`}
                target="_blank"
                rel="noreferrer"
              >
                📞 Click here to Call or WhatsApp us directly.
              </a>
              <a className="smart-empty" href={`tel:${contact.phone}`}>
                Call {contact.label}
              </a>
            </>
          ) : (
            <>
              {unmatched && (
                <div className="smart-empty" role="status">
                  No exact match for “{q.trim()}” yet. Explore popular occasions below, or ask Bloon
                  for help.
                </div>
              )}
              {shownServices.length > 0 && (
                <>
                  <span className="smart-head">
                    {unmatched ? "Popular occasions" : "🎈 Services"}
                  </span>
                  {shownServices.map((item) => (
                    <a
                      key={item.slug}
                      href={`/creations/${item.slug}`}
                      onClick={(event) => {
                        if (router) {
                          event.preventDefault();
                          pickService(item);
                        } else done();
                      }}
                    >
                      🎈 {item.name}
                    </a>
                  ))}
                </>
              )}
              {places.length > 0 && (
                <>
                  <span className="smart-head">📍 Locations</span>
                  {places.slice(0, 8).map((place) => (
                    <button type="button" key={place} onClick={() => pickPlace(place)}>
                      📍 {place}
                    </button>
                  ))}
                </>
              )}
              {unmatched && (
                <>
                  {askAI && (
                    <button type="button" onClick={ask}>
                      Ask Bloon ↗
                    </button>
                  )}
                  <a
                    className="smart-empty"
                    href={`${contact.whatsapp}?text=${encodeURIComponent(`Hi, can you help with ${q.trim()}?`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Discuss your idea on WhatsApp
                  </a>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
