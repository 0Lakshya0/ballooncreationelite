import { type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, ArrowDown } from "lucide-react";
import type { GalleryMedia } from "@/lib/creation-gallery";
import { weddingChapters } from "@/lib/gallery-wedding-groups";
export function WeddingChapters({
  items,
  renderCard,
  onBack,
}: {
  items: readonly GalleryMedia[];
  renderCard: (item: GalleryMedia) => ReactNode;
  onBack: () => void;
}) {
  const chapters = weddingChapters(items);
  const jump = (id: string) =>
    document
      .getElementById(`wedding-${id}`)
      ?.scrollIntoView?.({ behavior: "instant", block: "start" });
  return (
    <div className="gc-wedding-chapters">
      <div className="gc-wedding-welcome">
        <button className="gc-wedding-back" onClick={onBack}>
          <ArrowLeft size={16} />
          All collections
        </button>
        <p>
          Your wedding, chapter by chapter. Everything is already arranged below—start with Mehndi,
          then discover the rest.
        </p>
      </div>
      <nav className="gc-wedding-jumps" aria-label="Wedding moments">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => jump(chapter.id)}
            aria-label={`Jump to ${chapter.name}`}
          >
            <img src={chapter.items[0]!.image} alt="" width={52} height={52} loading="lazy" />
            <span>
              {chapter.name}
              <small>
                {chapter.items.length} {chapter.items.length === 1 ? "look" : "looks"}
              </small>
            </span>
            <ArrowDown size={16} />
          </button>
        ))}
      </nav>
      {chapters.map((chapter, index) => (
        <section
          className="gc-wedding-chapter"
          id={`wedding-${chapter.id}`}
          data-wedding-group={chapter.id}
          key={chapter.id}
          aria-labelledby={`wedding-title-${chapter.id}`}
          style={{ "--gc-collection-radius": chapter.radius } as CSSProperties}
        >
          <header>
            <span className="gc-wedding-chapter-number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <span className="eyebrow">{chapter.eyebrow}</span>
              <h4 id={`wedding-title-${chapter.id}`}>{chapter.name}</h4>
              <p>{chapter.description}</p>
              <small>
                {chapter.items.length} {chapter.items.length === 1 ? "look" : "looks"} · already
                gathered for you
              </small>
            </div>
          </header>
          <div className="gc-grid">{chapter.items.map(renderCard)}</div>
        </section>
      ))}
    </div>
  );
}
