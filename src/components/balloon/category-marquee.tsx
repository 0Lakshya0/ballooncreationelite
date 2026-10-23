import { Link } from "@tanstack/react-router";
import { occasionEntries } from "@/lib/occasion-entries";
import "./creations/occasions.css";
import { useEffect, useId } from "react";
import { bindCategoryMotion } from "@/lib/category-motion";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

const photos = import.meta.glob<string>("/src/assets/categories/*.webp", {
  eager: true,
  import: "default",
});
export const categories = occasionEntries.map((item) => item.name);

export function CategoryMarquee() {
  const headingId = useId();
  const [viewportRef, carousel] = useEmblaCarousel({ loop: true, dragFree: true, align: "start" }, [
    AutoScroll({
      speed: 0.35,
      direction: "backward",
      startDelay: 0,
      // Own the bounded press/release lifecycle; do not wait for drag to settle.
      stopOnInteraction: true,
      stopOnMouseEnter: false,
      stopOnFocusIn: false,
      breakpoints: { "(prefers-reduced-motion: reduce)": { active: false } },
    }),
  ]);
  useEffect(() => (carousel ? bindCategoryMotion(carousel) : undefined), [carousel]);
  return (
    <section className="category-section" id="categories" aria-labelledby={headingId}>
      <div className="page-width category-heading">
        <span className="eyebrow">EVERY OCCASION, BEAUTIFULLY YOURS</span>
        <h2 id={headingId}>A celebration for every story.</h2>
      </div>
      <div
        className="category-window"
        ref={viewportRef}
        tabIndex={0}
        aria-label="Celebration categories"
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          const autoScroll = carousel?.plugins().autoScroll;
          const wasPlaying = autoScroll?.isPlaying();
          autoScroll?.stop();
          if (event.key === "ArrowLeft") carousel?.scrollPrev(true);
          else carousel?.scrollNext(true);
          if (wasPlaying) autoScroll?.play(0);
        }}
      >
        <ul className="category-track">
          {occasionEntries.map(({ name, slug, photo }) => (
            <li className="category-item" key={name}>
              <Link
                className="category-link"
                to="/creations/$slug"
                params={{ slug }}
                aria-label={`Explore ${name}`}
              >
                <span className="category-orb">
                  <img
                    src={
                      photos[
                        `/src/assets/categories/category-${String(photo).padStart(2, "0")}.webp`
                      ]
                    }
                    alt=""
                    width={256}
                    height={256}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </span>
                <span className="category-label">{name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
