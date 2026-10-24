import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarHeart, MessageCircle, Phone } from "lucide-react";
import { contact, whatsappLink } from "@/lib/celebrations";

const wa = whatsappLink("Hello Balloon Creation! I would like to plan a celebration.");

/** Floating WhatsApp bubble (desktop) + a thumb-friendly action bar (mobile). */
export function StickyCta() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setShown(window.scrollY > Math.max(520, window.innerHeight * 0.82));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      document.dispatchEvent(new Event("bce:layoutchange")),
    );
    return () => cancelAnimationFrame(frame);
  }, [shown, pathname]);

  // These pages already have their own contact/selection bar: do not duplicate it.
  if (pathname === "/about" || pathname === "/decor-collections" || pathname === "/our-creations")
    return null;

  return (
    <>
      <a
        className={shown ? "wa-float is-shown" : "wa-float"}
        href={wa}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Balloon Creation on WhatsApp"
        aria-hidden={!shown}
        tabIndex={shown ? 0 : -1}
      >
        <MessageCircle size={22} />
        <span>Chat with us</span>
      </a>
      <div className={shown ? "mobile-cta is-shown" : "mobile-cta"} aria-hidden={!shown}>
        <a href={`tel:${contact.phone}`} tabIndex={shown ? 0 : -1}>
          <Phone size={17} /> Call
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="is-primary"
          tabIndex={shown ? 0 : -1}
        >
          <MessageCircle size={17} /> WhatsApp
        </a>
        <Link
          to="/"
          hash="concierge"
          tabIndex={shown ? 0 : -1}
          onClick={(event) => {
            const el = document.getElementById("concierge");
            if (el) {
              event.preventDefault();
              el.scrollIntoView({
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "auto"
                  : "smooth",
              });
            }
          }}
        >
          <CalendarHeart size={17} /> Book
        </Link>
      </div>
    </>
  );
}
