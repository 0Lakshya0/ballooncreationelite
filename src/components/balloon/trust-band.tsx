import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/site-content";

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window) || seen) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [seen]);
  return { ref, seen };
}

function Counter({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  const reduced = useRef(false);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!active) return;
    if (reduced.current) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const duration = 1300;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value]);

  return (
    <span className="trust-value">
      {display.toLocaleString("en-IN")}
      <em>{suffix}</em>
    </span>
  );
}

export function TrustBand() {
  const { ref, seen } = useInView<HTMLDivElement>();
  return (
    <section className="trust" aria-labelledby="trust-heading">
      <div className="page-width">
        <h2 id="trust-heading" className="sr-only">
          Balloon Creation at a glance
        </h2>
        <div className="trust-grid reveal" ref={ref}>
          {stats.map((stat) => (
            <div className="trust-item" key={stat.label}>
              <Counter value={stat.value} suffix={stat.suffix} active={seen} />
              <span className="trust-label">{stat.label}</span>
              <p className="trust-note">{stat.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
