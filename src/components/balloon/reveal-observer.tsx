import { useEffect } from "react";

/**
 * Adds the one-time, one-way scroll reveal behaviour to any page that uses
 * `.reveal` elements. Mirrors the home page so motion feels identical.
 */
export function RevealObserver() {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }
    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0, rootMargin: "0px 0px 80px 0px" },
    );
    const observe = () =>
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => observer.observe(el));
    observe();
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
