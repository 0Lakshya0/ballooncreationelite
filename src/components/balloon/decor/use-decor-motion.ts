import { useEffect, useRef, useState, type RefObject } from "react";
import { observeVisibility } from "@/lib/visibility";
import { mountLiquidSurfaces } from "./liquid-renderer";

export function useDecorMotion(rootRef: RefObject<HTMLDivElement | null>) {
  const [enabled, setEnabled] = useState(true),
    [reduced, setReduced] = useState(false);
  const toggleRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const root: HTMLDivElement = element;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let paused = false,
      disposed = false;
    try {
      paused = localStorage.getItem("bce-english-motion") === "off";
    } catch {
      /* privacy mode */
    }
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".collection-intro,.collection-nav,.chapter-head,.chip,.inspiration-head,.mood-card,.atelier-process>div:not(.section-atmosphere)",
      ),
    );
    const notify = () => root.dispatchEvent(new Event("bce:motionchange"));
    const revealAll = () => targets.forEach((el) => el.classList.add("is-visible"));
    function apply() {
      const off = paused || media.matches;
      root.dataset["motion"] = off ? "off" : "on";
      setEnabled(!off);
      setReduced(media.matches);
      if (off) revealAll();
      notify();
    }
    toggleRef.current = () => {
      if (media.matches) return;
      paused = !paused;
      try {
        localStorage.setItem("bce-english-motion", paused ? "off" : "on");
      } catch {
        /* privacy mode */
      }
      apply();
    };
    apply();
    const stops = [
      observeVisibility(root, (visible) => {
        root.dataset["inview"] = String(visible);
      }),
    ];
    root.querySelectorAll<HTMLElement>(".section-scope").forEach((scope) => {
      scope.dataset["inview"] = "false";
      stops.push(
        observeVisibility(scope, (visible) => {
          scope.dataset["inview"] = String(visible);
          notify();
        }),
      );
    });
    if (!media.matches && !paused) {
      targets.forEach((target, index) => {
        target.classList.add("motion-reveal");
        if (target.classList.contains("chip"))
          target.style.setProperty("--reveal-delay", `${(index % 4) * 45}ms`);
        let stop = () => {};
        stop = observeVisibility(target, (visible) => {
          if (visible) {
            target.classList.add("is-visible");
            stop();
          }
        });
        stops.push(() => stop());
      });
    } else revealAll();
    const photos = Array.from(root.querySelectorAll<HTMLElement>(".group.section-scope")).flatMap(
      (scope) => {
        const photo = scope.querySelector<HTMLElement>(".chapter-image"),
          head = scope.querySelector<HTMLElement>(".chapter-head");
        return photo && head ? [{ scope, photo, head }] : [];
      },
    );
    function layout() {
      if (disposed) return;
      photos.forEach(({ scope, photo }) => {
        let x = 0,
          y = 0,
          node: HTMLElement | null = photo;
        while (node && node !== scope) {
          x += node.offsetLeft;
          y += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        const w = photo.offsetWidth,
          h = photo.offsetHeight;
        scope.dataset["photoIsland"] = "raised";
        for (const [name, value] of Object.entries({
          x: x + w * 0.48,
          y: y + h * 0.58,
          rx: w * 0.72 + 65,
          ry: h * 0.68 + 70,
        }))
          scope.style.setProperty(`--impact-${name}`, `${value}px`);
      });
      root.dispatchEvent(new Event("bce:shoreline-layout"));
    }
    const disposeLiquid = mountLiquidSurfaces(root);
    const resize = "ResizeObserver" in window ? new ResizeObserver(layout) : null;
    photos.forEach(({ head, photo }) => {
      resize?.observe(head);
      resize?.observe(photo);
    });
    layout();
    void document.fonts?.ready.then(layout);
    function visibility() {
      root.toggleAttribute("data-motion-suspended", document.hidden);
      notify();
    }
    media.addEventListener("change", apply);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("resize", layout, { passive: true });
    visibility();
    return () => {
      disposed = true;
      toggleRef.current = null;
      resize?.disconnect();
      stops.forEach((stop) => stop());
      disposeLiquid();
      media.removeEventListener("change", apply);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("resize", layout);
    };
  }, [rootRef]);
  return { enabled, reduced, toggleMotion: () => toggleRef.current?.() };
}
