import { useEffect, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { MapPin, X } from "lucide-react";
import { indoreAreas } from "@/lib/indore-areas";
import { whatsappLink } from "@/lib/celebrations";
import { OPEN_AREAS_EVENT as OPEN_EVENT } from "@/lib/area-events";
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
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" className={className} aria-label={ariaLabel}>
          {children}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="areas-overlay">
          <Dialog.Content className="areas-modal">
            <div className="areas-head">
              <span className="eyebrow">WHERE WE CELEBRATE</span>
              <Dialog.Title asChild>
                <h2>Areas we serve in Indore</h2>
              </Dialog.Title>
              <Dialog.Close className="areas-close" aria-label="Close areas list">
                <X size={18} />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Browse the Indore localities we serve, or contact us to check your venue.
            </Dialog.Description>
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
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
