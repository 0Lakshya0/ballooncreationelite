import { useEffect } from "react";
import { observeVisibility } from "@/lib/visibility";
export function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("motion-ready");
    const stops = Array.from(document.querySelectorAll(".reveal"), (el) => {
      let stop = () => {};
      stop = observeVisibility(el, (visible) => {
        if (visible) {
          el.classList.add("is-visible");
          stop();
        }
      });
      return () => stop();
    });
    return () => {
      stops.forEach((stop) => stop());
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);
  return null;
}
