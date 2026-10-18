import { useEffect, useId, useState, type ReactNode } from "react";
import { MapPin, X } from "lucide-react";
import { indoreAreas } from "@/lib/indore-areas";
import { whatsappLink } from "@/lib/celebrations";

/** Opens the "areas we serve" dialog from anywhere on the site. */
const OPEN_EVENT = "bc:open-areas";

export const openAreasDialog = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(OPEN_EVENT));
};

export function AreasTrigger({
  className,
  children,
  ariaLabel,
}: {
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    const openDialog = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, openDialog);
    return () => window.removeEventListener(OPEN_EVENT, openDialog);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={ariaLabel}
      >
        {children}
      </button>
      {open && (
        <div
          className="areas-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setOpen(false)}
        >
          <div className="areas-modal" onClick={(event) => event.stopPropagation()}>
            <div className="areas-head">
              <span className="eyebrow">WHERE WE CELEBRATE</span>
              <h2 id={titleId}>Areas we serve in Indore</h2>
              <button
                type="button"
                className="areas-close"
                aria-label="Close areas list"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <ul className="areas-list">
              {indoreAreas.map((area) => (
                <li key={area}>
                  <MapPin size={13} />
                  {area}
                </li>
              ))}
            </ul>
            <p className="areas-note">
              Don’t see your area?{" "}
              <a
                href={whatsappLink("Hello Balloon Creation! Do you serve my area in Indore?")}
                target="_blank"
                rel="noreferrer"
              >
                Ask us on WhatsApp
              </a>{" "}
              — we likely do.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
