import { useId } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

const photos = import.meta.glob<string>("/src/assets/categories/*.webp", {
  eager: true,
  import: "default",
});
export const categories = [
  "Birthday",
  "Kids Birthday",
  "Baby Shower",
  "Welcome Baby",
  "Naming Ceremony",
  "Anniversary",
  "Proposal",
  "Room Surprise",
  "First Night",
  "Bachelor Party",
  "Wedding",
  "House Warming",
  "Car Decoration",
  "Pet Decoration",
  "Farewell Party",
  "Corporate Events",
  "Showroom Setup",
  "Grand Opening",
  "Exhibition Stall",
  "Annual Day Function",
];

export function CategoryMarquee() {
  const headingId = useId();
  const [viewportRef, carousel] = useEmblaCarousel({ loop: true, dragFree: true, align: "start" }, [
    AutoScroll({
      speed: 0.35,
      direction: "backward",
      startDelay: 600,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      breakpoints: { "(prefers-reduced-motion: reduce)": { active: false } },
    }),
  ]);
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
          if (event.key === "ArrowLeft") carousel?.scrollPrev();
          else carousel?.scrollNext();
        }}
      >
        <ul className="category-track">
          {categories.map((name, index) => (
            <li className="category-item" key={name}>
              <span className="category-orb">
                <img
                  src={
                    photos[
                      `/src/assets/categories/category-${String(index + 1).padStart(2, "0")}.webp`
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
