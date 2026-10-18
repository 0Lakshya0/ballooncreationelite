import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, MessageCircle, X } from "lucide-react";
import type { Celebration } from "@/lib/celebrations";
import { whatsappLink } from "@/lib/celebrations";
import { Button } from "@/components/ui/button";

type Props = {
  item: Celebration;
  onClose: () => void;
  onPlan: (name: string) => void;
};

export function PortfolioDialog({ item, onClose, onPlan }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [shot, setShot] = useState(0);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [onClose]);

  const images = item.gallery.length ? item.gallery : [item.image];
  const active = images[Math.min(shot, images.length - 1)] ?? item.image;

  return (
    <div
      className="creation-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="creation-dialog-title"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="creation-modal" ref={panel}>
        <button
          type="button"
          className="creation-close"
          aria-label="Close"
          onClick={onClose}
          ref={closeButton}
        >
          <X size={18} />
        </button>
        <div className="creation-media">
          <img
            key={active}
            className="creation-hero"
            src={active}
            alt={`${item.name} styling by Balloon Creation`}
            width={1024}
            height={1024}
          />
          {images.length > 1 && (
            <div className="creation-thumbs" role="group" aria-label="More views">
              {images.map((src, index) => (
                <button
                  type="button"
                  key={src}
                  className={index === shot ? "is-active" : undefined}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={index === shot}
                  onClick={() => setShot(index)}
                >
                  <img src={src} alt="" width={256} height={256} loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="creation-copy">
          <span className="eyebrow">{item.tag}</span>
          <h2 id="creation-dialog-title">{item.name}</h2>
          <p>{item.intro}</p>
          <ul className="creation-highlights">
            {item.highlights.map((point) => (
              <li key={point}>
                <Check size={15} aria-hidden="true" /> {point}
              </li>
            ))}
          </ul>
          <div className="creation-actions">
            <Button
              variant="luxury"
              asChild
              onClick={() => {
                onPlan(item.name);
                onClose();
              }}
            >
              <a href="#concierge">
                Plan this look <ArrowUpRight />
              </a>
            </Button>
            <Button variant="glass" asChild>
              <a
                href={whatsappLink(
                  `Hello Balloon Creation! I loved your "${item.name}" styling. I would like something similar.`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle /> Ask on WhatsApp
              </a>
            </Button>
          </div>
          <p className="creation-fineprint">
            Setup completed in 2 hours · Custom palette · Indore &amp; nearby
          </p>
        </div>
      </div>
    </div>
  );
}
