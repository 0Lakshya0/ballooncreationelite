import { Quote, Star } from "lucide-react";
import { testimonials } from "@/lib/site-content";

export function Testimonials() {
  return (
    <section className="reviews section-space" id="reviews" aria-labelledby="reviews-heading">
      <div className="page-width">
        <div className="section-heading reveal">
          <div>
            <span className="eyebrow">KIND WORDS</span>
            <h2 id="reviews-heading">
              Remembered long after
              <br />
              <em>the last guest leaves.</em>
            </h2>
          </div>
          <div className="rating-badge reveal" aria-label="Five star client feedback">
            <span className="rating-stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
            <span>Loved by Indore families</span>
          </div>
        </div>
        <div className="reviews-grid">
          {testimonials.map((item, index) => (
            <figure className={`review-card reveal review-${index + 1}`} key={item.name}>
              <Quote className="review-mark" size={30} strokeWidth={1} aria-hidden="true" />
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <span className="review-avatar" aria-hidden="true">
                  {item.name.charAt(0)}
                </span>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.meta}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
