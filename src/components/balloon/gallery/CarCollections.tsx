import "./creation-gallery.css";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import type { GalleryMedia } from "@/lib/creation-gallery";
import { carChapters, type CarPartId } from "@/lib/gallery-car-groups";
export function CarCollectionChoices({
  items,
  renderChoice,
}: {
  items: readonly GalleryMedia[];
  renderChoice: (part: ReturnType<typeof carChapters>[number], content: ReactNode) => ReactNode;
}) {
  return (
    <div className="gc-car-choices" aria-label="Car decoration collections">
      {carChapters(items).map((part) =>
        renderChoice(
          part,
          <>
            {part.items[0] && (
              <img src={part.items[0].image} alt="" width={120} height={150} loading="lazy" />
            )}
            <span className="gc-car-choice-copy">
              <span className="eyebrow">{part.eyebrow}</span>
              <strong>{part.name}</strong>
              <span>{part.description}</span>
              <span className="gc-car-choice-details">
                {part.details.map((detail) => (
                  <span key={detail}>{detail}</span>
                ))}
              </span>
              <small>
                {part.items.length} {part.items.length === 1 ? "look" : "looks"}{" "}
                <ArrowUpRight size={17} />
              </small>
            </span>
          </>,
        ),
      )}
    </div>
  );
}
export function CarCollections({
  items,
  selected,
  onSelect,
  renderCard,
}: {
  items: readonly GalleryMedia[];
  selected: CarPartId | null;
  onSelect: (part: CarPartId | null) => void;
  renderCard: (item: GalleryMedia) => ReactNode;
}) {
  const chapter = carChapters(items).find((part) => part.id === selected);
  return (
    <div className="gc-car-collections">
      {chapter ? (
        <section data-car-group={chapter.id} aria-labelledby={`car-title-${chapter.id}`}>
          <button className="gc-wedding-back" onClick={() => onSelect(null)}>
            <ArrowLeft size={16} /> Both car collections
          </button>
          <header className="gc-car-chapter-heading">
            <span className="eyebrow">{chapter.eyebrow}</span>
            <h4 id={`car-title-${chapter.id}`}>{chapter.name}</h4>
            <p>{chapter.description}</p>
            <small>
              {chapter.items.length} {chapter.items.length === 1 ? "look" : "looks"} · gathered for
              you
            </small>
          </header>
          {chapter.items.length ? (
            <div className="gc-grid">{chapter.items.map(renderCard)}</div>
          ) : (
            <p>
              No saved looks in this car collection yet. Choose another collection or turn off Saved
              looks.
            </p>
          )}
        </section>
      ) : (
        <>
          <p className="gc-car-welcome">
            Two ways to celebrate. Choose your occasion to see its own collection of photos.
          </p>
          <CarCollectionChoices
            items={items}
            renderChoice={(part, content) => (
              <button
                key={part.id}
                className="gc-car-choice"
                onClick={() => onSelect(part.id)}
                aria-label={`Open ${part.name}`}
                disabled={!part.items.length}
              >
                {content}
              </button>
            )}
          />
        </>
      )}
    </div>
  );
}
