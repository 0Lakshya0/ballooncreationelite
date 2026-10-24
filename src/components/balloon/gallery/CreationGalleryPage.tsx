import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Play,
  X,
} from "lucide-react";
import { SiteHeader } from "../site-header";
import { SiteLiquidBackground } from "../site-liquid-background";
import {
  galleryGroups,
  galleryMedia,
  galleryMessage,
  readGalleryShortlist,
  SHORTLIST_KEY,
  type GalleryGroup,
  type GalleryMedia,
} from "@/lib/creation-gallery";
import { whatsappLink } from "@/lib/celebrations";
import "./creation-gallery.css";

export function GalleryMediaView({ item }: { item: GalleryMedia }) {
  const [failed, setFailed] = useState(false);
  if (item.kind === "video")
    return (
      <div className="gc-video-wrap">
        <video
          key={item.id}
          controls
          playsInline
          preload="none"
          poster={item.image}
          width={item.width}
          height={item.height}
          aria-label={item.title}
          onError={() => setFailed(true)}
        >
          <source src={item.video} />
          {item.captions && (
            <track
              kind="captions"
              src={item.captions.src}
              srcLang={item.captions.language}
              label={item.captions.label}
              default
            />
          )}
          Your browser cannot play this video.
        </video>
        {failed && <p role="alert">This film couldn’t load. Please close it and try again.</p>}
      </div>
    );
  return (
    <img
      src={item.image}
      alt={`${item.occasion}: ${item.detail}`}
      width={item.width}
      height={item.height}
      decoding="async"
    />
  );
}

export function CreationGalleryPage() {
  const opener = useRef<HTMLButtonElement | null>(null);
  const [group, setGroup] = useState<GalleryGroup>("All moments");
  const [saved, setSaved] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [kind, setKind] = useState("all");
  const [limit, setLimit] = useState(9);
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    try {
      setSaved(readGalleryShortlist(localStorage.getItem(SHORTLIST_KEY)));
    } catch {
      /* browsing works without storage */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(SHORTLIST_KEY, JSON.stringify(saved));
      } catch {
        /* private browsing: keep session state */
      }
    }
  }, [saved, ready]);
  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      document.dispatchEvent(new Event("bce:layoutchange")),
    );
    return () => {
      cancelAnimationFrame(frame);
      document.dispatchEvent(new Event("bce:layoutchange"));
    };
  }, [saved.length]);
  const filtered = useMemo(
    () =>
      galleryMedia.filter(
        (item) =>
          (group === "All moments" || item.group === group) &&
          (!savedOnly || saved.includes(item.id)) &&
          (kind === "all" || kind === item.kind),
      ),
    [group, savedOnly, saved, kind],
  );
  const shortlist = galleryMedia.filter((item) => saved.includes(item.id));
  const active = galleryMedia.find((item) => item.id === activeId);
  const activeIndex = filtered.findIndex((item) => item.id === activeId);
  const hasFilms = galleryMedia.some((item) => item.kind === "video");
  const toggle = (id: string) => {
    if (savedOnly && saved.includes(id) && activeId === id) setActiveId(null);
    setSaved((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id],
    );
  };
  const changeGroup = (next: GalleryGroup) => {
    setGroup(next);
    setLimit(9);
  };
  const step = (direction: number) => {
    const next = filtered[(activeIndex + direction + filtered.length) % filtered.length];
    if (next) setActiveId(next.id);
  };
  const browse = () =>
    document
      .getElementById("gallery-moments")
      ?.scrollIntoView({ behavior: "instant", block: "start" });
  const reset = () => {
    setGroup("All moments");
    setSavedOnly(false);
    setKind("all");
    setLimit(9);
  };
  const hero = galleryMedia.find((item) => item.id === "baby-shower")!;
  const accent = galleryMedia.find((item) => item.id === "kids-birthday-princess")!;
  return (
    <div className="site-liquid-shell gc-page">
      <SiteLiquidBackground />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <div className="page-width gc-breadcrumb">
          <Link to="/">
            <ArrowLeft size={15} /> Home
          </Link>
          <span aria-hidden="true">/</span>
          <span>Our creations</span>
        </div>
        <section className="page-width gc-hero" aria-labelledby="gc-title">
          <div className="gc-hero-copy">
            <span className="eyebrow">OUR CREATIONS · A LITTLE INSPIRATION</span>
            <h1 id="gc-title">
              Beautiful moments.
              <br />
              <em>Made personal.</em>
            </h1>
            <p>
              The flowers. The colours. That one detail you fall in love with. Find a setting that
              feels like you, and let’s imagine your celebration.
            </p>
            <div className="gc-hero-actions">
              <button className="luxury-button" onClick={browse}>
                Explore the gallery <ArrowDown size={17} />
              </button>
              <Link to="/lets-celebrate" className="gc-text-link">
                Help me choose <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="gc-hero-note">
              <span className="gc-note-line" />
              <p>
                Your colours. Your space.
                <br />
                <strong>Your kind of celebration.</strong>
              </p>
            </div>
          </div>
          <div className="gc-hero-art">
            <figure className="gc-hero-main">
              <img
                src={hero.image}
                alt="Soft floral and balloon baby shower setting"
                width={hero.width}
                height={hero.height}
                fetchPriority="high"
                decoding="async"
              />
              <figcaption>A new beginning, beautifully celebrated.</figcaption>
            </figure>
            <figure className="gc-hero-small">
              <img
                src={accent.image}
                alt="Pastel princess-themed birthday decoration"
                width={accent.width}
                height={accent.height}
                decoding="async"
              />
              <figcaption>A little storybook magic</figcaption>
            </figure>
            <span className="gc-art-label">THE LITTLE DETAILS. THE BIG FEELINGS.</span>
          </div>
        </section>
        <section className="gc-reading-strip" aria-label="Make the gallery yours">
          <div className="page-width">
            <p>
              <span>01</span> Find your feeling
            </p>
            <p>
              <span>02</span> Save what you love
            </p>
            <p>
              <span>03</span> Make it your own
            </p>
          </div>
        </section>
        <section
          className="page-width gc-browse"
          id="gallery-moments"
          aria-labelledby="gc-browse-title"
        >
          <div className="gc-section-head">
            <div>
              <span className="eyebrow">THE MOMENTS, THE POSSIBILITIES</span>
              <h2 id="gc-browse-title" tabIndex={-1}>
                Find your kind of <em>beautiful.</em>
              </h2>
            </div>
            <p>
              Start with an occasion, or simply follow your heart.
              <br />
              Tap any photo to see the details.
            </p>
          </div>
          <div className="gc-tools">
            <div className="gc-filters" role="group" aria-label="Filter by occasion">
              {galleryGroups.map((label) => (
                <button
                  key={label}
                  aria-pressed={group === label}
                  onClick={() => changeGroup(label)}
                >
                  {label}
                  <span>
                    {label === "All moments"
                      ? galleryMedia.length
                      : galleryMedia.filter((item) => item.group === label).length}
                  </span>
                </button>
              ))}
            </div>
            <button
              className="gc-saved-filter"
              aria-pressed={savedOnly}
              onClick={() => {
                setSavedOnly((value) => !value);
                setLimit(9);
              }}
            >
              <Heart size={17} fill={savedOnly ? "currentColor" : "none"} /> Saved looks{" "}
              <span>{saved.length}</span>
            </button>
          </div>
          {hasFilms && (
            <div className="gc-format-filters" role="group" aria-label="Media format">
              {[
                ["all", "All media"],
                ["image", "Photos"],
                ["video", "Films"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  aria-pressed={kind === value}
                  onClick={() => {
                    setKind(value!);
                    setLimit(9);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <p className="gc-result-count" role="status">
            {filtered.length
              ? `Showing ${Math.min(limit, filtered.length)} of ${filtered.length} ${savedOnly ? "saved " : ""}moments`
              : savedOnly
                ? "No saved looks in this collection yet."
                : "No moments in this collection yet."}
          </p>
          {filtered.length ? (
            <div className="gc-grid">
              {filtered.slice(0, limit).map((item) => (
                <article className="gc-card" key={item.id} data-gallery-id={item.id}>
                  <div className="gc-picture">
                    <button
                      className="gc-open"
                      aria-label={`Open ${item.occasion}: ${item.title}`}
                      onClick={(event) => {
                        opener.current = event.currentTarget;
                        setActiveId(item.id);
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.detail}
                        width={item.width}
                        height={item.height}
                        loading="lazy"
                        decoding="async"
                        style={{ objectPosition: item.position }}
                      />
                      <span className="gc-view-hint">
                        {item.kind === "video" ? (
                          <>
                            <Play size={16} fill="currentColor" /> Watch film
                          </>
                        ) : (
                          <>
                            View the moment <ArrowUpRight size={16} />
                          </>
                        )}
                      </span>
                    </button>
                    <button
                      className="gc-heart"
                      aria-label={`${saved.includes(item.id) ? "Unsave" : "Save"} ${item.title}`}
                      aria-pressed={saved.includes(item.id)}
                      onClick={() => toggle(item.id)}
                    >
                      <Heart size={19} fill={saved.includes(item.id) ? "currentColor" : "none"} />
                    </button>
                    {item.kind === "video" && (
                      <span className="gc-film-label">
                        <Play size={13} /> FILM
                      </span>
                    )}
                  </div>
                  <div className="gc-card-copy">
                    <div>
                      <span>{item.occasion}</span>
                      <small>{item.reference}</small>
                    </div>
                    <h3>
                      <button
                        onClick={(event) => {
                          opener.current = event.currentTarget;
                          setActiveId(item.id);
                        }}
                      >
                        {item.title}
                      </button>
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="gc-empty">
              <Heart size={30} />
              <h3>Your favourites start with a little heart.</h3>
              <p>Save the looks you love, then share them together when you’re ready.</p>
              <button className="glass-button" onClick={reset}>
                Browse all moments <ArrowRight size={16} />
              </button>
            </div>
          )}
          {filtered.length > limit && (
            <div className="gc-more">
              <button className="glass-button" onClick={() => setLimit((value) => value + 9)}>
                Discover {Math.min(9, filtered.length - limit)} more moments <ArrowDown size={17} />
              </button>
              <p>Take your time. The right idea is worth finding.</p>
            </div>
          )}
        </section>
        <section className="page-width gc-process" aria-labelledby="gc-process-title">
          <div>
            <span className="eyebrow">FROM A FEELING TO YOUR CELEBRATION</span>
            <h2 id="gc-process-title">
              Love the look?
              <br />
              <em>Let’s make it yours.</em>
            </h2>
            <p>
              You don’t need to have every detail decided. A favourite photo is a lovely place to
              start.
            </p>
            <a
              className="gc-text-link"
              href={whatsappLink(galleryMessage(shortlist))}
              target="_blank"
              rel="noreferrer"
            >
              {shortlist.length ? "Discuss my saved looks" : "Start a conversation"}{" "}
              <ArrowUpRight size={18} />
            </a>
          </div>
          <ol>
            <li>
              <span>01</span>
              <div>
                <h3>Tell us what caught your eye</h3>
                <p>
                  A colour, a backdrop or just the feeling. Save a few favourites and share them in
                  one message.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>We shape it around your space</h3>
                <p>
                  Share your occasion, date and venue. We’ll discuss scale, colours and practical
                  details together.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>You decide with a clear plan</h3>
                <p>
                  Confirm the materials, inclusions, availability and quote before choosing. No
                  booking happens automatically.
                </p>
              </div>
            </li>
          </ol>
        </section>
        <div className="page-width gc-end">
          <span>YOUR STORY. YOUR OWN BEAUTIFUL WAY.</span>
          <Link to="/lets-celebrate">
            Let’s celebrate <ArrowUpRight size={18} />
          </Link>
        </div>
      </main>
      {shortlist.length > 0 && (
        <aside className="gc-shortlist-bar" aria-label="Your saved looks">
          <div>
            <Heart size={18} fill="currentColor" />
            <strong>
              {shortlist.length} saved {shortlist.length === 1 ? "look" : "looks"}
            </strong>
            <button onClick={() => setSaved([])}>Clear</button>
          </div>
          <a href={whatsappLink(galleryMessage(shortlist))} target="_blank" rel="noreferrer">
            Discuss my shortlist <ArrowUpRight size={16} />
          </a>
        </aside>
      )}
      <Dialog.Root
        open={!!active}
        onOpenChange={(open) => {
          if (!open) setActiveId(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="gc-viewer-overlay" />
          {active && (
            <Dialog.Content
              className="gc-viewer"
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
                else document.getElementById("gc-browse-title")?.focus({ preventScroll: true });
              }}
              onKeyDown={(event) => {
                if ((event.target as HTMLElement).closest("video,input,textarea")) return;
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  step(1);
                }
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  step(-1);
                }
              }}
            >
              <Dialog.Close className="gc-viewer-close" aria-label="Close photo viewer">
                <X size={23} />
              </Dialog.Close>
              <div className="gc-viewer-media">
                <GalleryMediaView key={active.id} item={active} />
              </div>
              <div className="gc-viewer-copy">
                <span className="eyebrow">
                  {active.occasion} · {active.reference}
                </span>
                <Dialog.Title>{active.title}</Dialog.Title>
                <Dialog.Description>{active.detail}</Dialog.Description>
                <p className="gc-viewer-note">
                  Love this direction? Colours, flowers and scale can be discussed for your own
                  space.
                </p>
                <button
                  className="glass-button"
                  aria-pressed={saved.includes(active.id)}
                  onClick={() => toggle(active.id)}
                >
                  {saved.includes(active.id) ? <Check size={17} /> : <Heart size={17} />}
                  {saved.includes(active.id) ? "Saved to your shortlist" : "Save this look"}
                </button>
                <a
                  className="luxury-button"
                  href={whatsappLink(galleryMessage([active]))}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ask about this look <ArrowUpRight size={17} />
                </a>
                <div className="gc-viewer-navigation">
                  <button aria-label="Previous moment" onClick={() => step(-1)}>
                    <ChevronLeft size={21} />
                  </button>
                  <span>
                    {activeIndex + 1} / {filtered.length}
                  </span>
                  <button aria-label="Next moment" onClick={() => step(1)}>
                    <ChevronRight size={21} />
                  </button>
                </div>
              </div>
            </Dialog.Content>
          )}
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
