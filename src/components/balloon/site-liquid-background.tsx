import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import "./site-liquid-background.css";

/** One viewport-sized surface shares the approved English shader across the entire home. */
export function SiteLiquidBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<(() => void) | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let paused = false;
    let disposed = false;
    let disposeRenderer = () => {};
    try {
      paused = localStorage.getItem("bce-site-motion") === "off";
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
    const notify = () => root.dispatchEvent(new Event("bce:motionchange"));
    function apply() {
      const on = !paused && !media.matches;
      root!.dataset["motion"] = on ? "on" : "off";
      setEnabled(on);
      setReduced(media.matches);
      notify();
    }
    toggleRef.current = () => {
      paused = !paused;
      try {
        localStorage.setItem("bce-site-motion", paused ? "off" : "on");
      } catch {
        /* The control still works without persistence. */
      }
      apply();
    };
    function visibility() {
      root!.toggleAttribute("data-motion-suspended", document.hidden);
      notify();
    }
    apply();
    visibility();
    // Keep WebGL code out of the server's rendering path and dispose on route changes.
    void import("./decor/liquid-renderer")
      .then(({ mountLiquidSurfaces }) => {
        if (!disposed) disposeRenderer = mountLiquidSurfaces(root);
      })
      .catch(() => {
        /* Keep the warm CSS fallback if the optional renderer cannot load. */
      });
    media.addEventListener("change", apply);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      toggleRef.current = null;
      disposeRenderer();
      media.removeEventListener("change", apply);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return (
    <>
      <div className="site-liquid-backdrop" ref={rootRef} data-motion="on" aria-hidden="true">
        <div className="section-scope" data-inview="true">
          <span className="site-liquid-fallback" />
          <canvas className="liquid-gold-canvas" role="presentation" />
          <span className="site-liquid-colour" />
          <span className="site-liquid-readability" />
        </div>
      </div>
      <button
        type="button"
        className="site-motion-control"
        aria-label={
          reduced
            ? "Background animation disabled for reduced motion"
            : enabled
              ? "Pause background animation"
              : "Resume background animation"
        }
        aria-pressed={!enabled}
        disabled={reduced}
        onClick={() => toggleRef.current?.()}
      >
        {enabled ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}
        {reduced ? "Reduced motion" : enabled ? "Motion on" : "Motion off"}
      </button>
    </>
  );
}
