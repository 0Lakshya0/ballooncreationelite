import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CHIP_GROUPS, DECOR_DATA, type Chip, type ChipOption } from "./decor-data";
import * as Dialog from "@radix-ui/react-dialog";
import { contact } from "@/lib/celebrations";
import { useDecorMotion } from "./use-decor-motion";
import "./approved-decor.css";
import "./integration.css";

/** Photos live in a folder — web path of that folder can be changed with the imgBase prop. */
export type DecorTypesSectionProps = {
  /** Default "img" (photos next to the page). On the site: imgBase="/decor-types" */
  imgBase?: string;
};

const resolveImg = (src: string, base: string) =>
  src.startsWith("img/") ? `${base}/${src.slice(4)}` : src;

const LABELS = {
  opts: "Every option inside — tap any one for its full detail",
  what: "What it is",
  why: "Why people choose it",
  how: "How we build it",
  ex: "A few examples",
  howMade: "How it is made",
  whereUsed: "Where it is used",
  note: "Good to know",
  pick: "When to pick it",
  time: "Setup time",
  colours: "Colour & palette",
  bestFor: "Best for",
  comes: "What comes with it",
  pairs: "Pairs beautifully with",
  add: "Add to my enquiry",
  addOpt: "Add this option to my enquiry",
  added: "✓ Added — tap again to remove",
  back: "← Back to {name}",
  empty: "Nothing selected yet — tap any chip above",
  send: "Send on WhatsApp →",
  clear: "Clear",
  label: "Your selection",
  close: "Close",
};

const chipKey = (chip: string) => chip;
const optKey = (chip: string, option: string) => `${chip} · ${option}`;

const waLink = (message: string) => `${contact.whatsapp}?text=${encodeURIComponent(message)}`;

export default function DecorTypesSection({
  imgBase = "/decor-types",
}: DecorTypesSectionProps = {}) {
  const img = (src: string) => resolveImg(src, imgBase);
  const rootRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const { enabled, reduced, toggleMotion } = useDecorMotion(rootRef);
  const [openChip, setOpenChip] = useState<string | null>(null);
  const [openOption, setOpenOption] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const chip: Chip | null = openChip ? (DECOR_DATA[openChip] ?? null) : null;
  const option: ChipOption | null = chip && openOption ? (chip.options[openOption] ?? null) : null;

  const openSheet = openChip !== null;
  const pickedSet = useMemo(() => new Set(picked), [picked]);

  const showChip = useCallback((name: string, trigger?: HTMLElement) => {
    if (trigger) returnFocus.current = trigger;
    setOpenChip(name);
    setOpenOption(null);
    if (cardRef.current) cardRef.current.scrollTop = 0;
  }, []);

  const closeSheet = useCallback(() => {
    setOpenChip(null);
    setOpenOption(null);
  }, []);

  const goBack = useCallback(() => setOpenOption(null), []);

  const toggle = useCallback((key: string) => {
    setPicked((list) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key]));
  }, []);

  const chipSelected = useCallback(
    (name: string) =>
      pickedSet.has(chipKey(name)) || picked.some((k) => k.startsWith(`${name} · `)),
    [picked, pickedSet],
  );

  useEffect(() => {
    if (cardRef.current) cardRef.current.scrollTop = 0;
  }, [openChip, openOption]);
  const selectionLink = waLink(
    picked.length
      ? "Hello Balloon Creation! I am looking for: " + picked.join(", ")
      : "Hello Balloon Creation! I would love help choosing decor for my celebration.",
  );

  return (
    <div className="bce-decor" id="decor-types" ref={rootRef} data-motion={enabled ? "on" : "off"}>
      <div className="english-motion-tools wrap">
        <button
          className="motion-toggle"
          type="button"
          onClick={toggleMotion}
          disabled={reduced}
          aria-pressed={!enabled}
          aria-label={
            reduced
              ? "Animations off — following your device setting"
              : enabled
                ? "Pause section animations"
                : "Resume section animations"
          }
        >
          <span aria-hidden="true">{enabled ? "Ⅱ" : "▷"}</span>
          <span>{enabled ? "Motion on" : "Motion off"}</span>
        </button>
      </div>
      <div className="wrap">
        <section className="block" aria-label="Decor collections">
          <section
            className="discovery-panel section-scope scene-discovery"
            aria-labelledby="decor-collections-title"
          >
            <Atmosphere />
            <div className="head collection-intro">
              <div>
                <span className="atelier-kicker">THE DECOR COLLECTIONS</span>
                <h2 id="decor-collections-title">
                  Find your kind
                  <br />
                  of <em>beautiful.</em>
                </h2>
              </div>
              <div className="collection-note">
                <p>
                  Start with the details you love. Explore the materials, discover your setting,
                  then add that extra spark.
                </p>
                <span>
                  25 decor styles <b>·</b> 150 ways to make them yours
                </span>
              </div>
            </div>
            <nav className="collection-nav" aria-label="Decor collections">
              {CHAPTERS.map((c, i) => (
                <a href={"#decor-" + c.id} key={c.id}>
                  <span>0{i + 1}</span>
                  {c.label}
                  <b aria-hidden="true">↗</b>
                </a>
              ))}
            </nav>
          </section>
          <div className="groups">
            {CHIP_GROUPS.map((group, i) => {
              const chapter = CHAPTERS[i];
              if (!chapter) return null;
              return (
                <article
                  className={"group section-scope scene-" + chapter.id}
                  id={"decor-" + chapter.id}
                  key={group.no}
                  aria-labelledby={"decor-" + chapter.id + "-title"}
                >
                  <Atmosphere />
                  <div className="chapter-head">
                    <div className="chapter-heading">
                      <span>
                        <b className="chapter-no">{group.no}</b>
                        {chapter.kicker}
                      </span>
                      <h3 id={"decor-" + chapter.id + "-title"}>
                        {chapter.title} <em>{chapter.emphasis}</em>
                      </h3>
                      <p>{chapter.intro}</p>
                    </div>
                    <div className="chapter-image">
                      <img
                        src={img("img/" + chapter.photo)}
                        alt={chapter.alt}
                        loading="lazy"
                        width={640}
                        height={1147}
                      />
                    </div>
                    <span className="chapter-count">
                      {String(group.chips.length).padStart(2, "0")} DECOR STYLES
                    </span>
                  </div>
                  <div className="chips">
                    {group.chips.map((name) => {
                      const data = DECOR_DATA[name];
                      if (!data) return null;
                      return (
                        <button
                          className="chip"
                          key={name}
                          type="button"
                          aria-pressed={chipSelected(name)}
                          aria-haspopup="dialog"
                          aria-expanded={openChip === name}
                          onClick={(e) => showChip(name, e.currentTarget)}
                        >
                          <span className="thumb">
                            <img src={img(data.photo)} alt="" loading="lazy" />
                          </span>
                          <span className="txt">
                            <span className="nm">{name}</span>
                            <span className="ds">{data.desc}</span>
                          </span>
                          <span className="tick" aria-hidden="true">
                            ✓
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
      <section
        className="inspiration-section wrap section-scope scene-inspiration"
        aria-labelledby="decor-inspiration-title"
      >
        <Atmosphere />
        <div className="inspiration-head">
          <div>
            <span className="atelier-kicker">A MOOD FOR EVERY MOMENT</span>
            <h2 id="decor-inspiration-title">
              What does your
              <br />
              <em>happy look like?</em>
            </h2>
          </div>
          <p>
            There’s no one way to celebrate.
            <br />
            Here are a few beautiful places to start.
          </p>
        </div>
        <div className="inspiration-grid">
          {MOODS.map((m) => (
            <button
              className="mood-card"
              type="button"
              key={m.chip}
              aria-haspopup="dialog"
              onClick={(e) => showChip(m.chip, e.currentTarget)}
            >
              <img
                src={img("img/" + m.photo)}
                alt={m.alt}
                loading="lazy"
                width={640}
                height={960}
              />
              <span className="mood-shade" />
              <span className="mood-copy">
                <small>{m.kicker}</small>
                <strong>{m.title}</strong>
                <span>
                  {m.cta}
                  <b aria-hidden="true">↗</b>
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>
      <section
        className="atelier-process wrap section-scope scene-process"
        aria-label="How to create your celebration"
      >
        <Atmosphere />
        <div>
          <span>01 / DISCOVER</span>
          <h3>Follow your inspiration.</h3>
          <p>Open a style and explore every detail.</p>
        </div>
        <div>
          <span>02 / MAKE IT YOURS</span>
          <h3>Save what you love.</h3>
          <p>Add your favourite styles to your enquiry.</p>
        </div>
        <div>
          <span>03 / LET’S CREATE</span>
          <h3>Bring it all together.</h3>
          <p>Send your selection and let’s plan the magic.</p>
        </div>
      </section>
      <div className="atelier-signoff wrap">
        <span>We decorate your happiness</span>
        <Link to="/lets-celebrate" hash="callback">
          PLAN YOUR CELEBRATION ↗
        </Link>
      </div>

      {/* ---------------- detail sheet ---------------- */}
      <Dialog.Root
        open={openSheet}
        onOpenChange={(open) => {
          if (!open) closeSheet();
        }}
      >
        <Dialog.Portal container={rootRef.current}>
          <div className="detail">
            <Dialog.Overlay className="detail-scrim" />
            <Dialog.Content
              aria-modal="true"
              className="detail-card"
              ref={cardRef}
              onEscapeKeyDown={(e) => {
                if (openOption) {
                  e.preventDefault();
                  goBack();
                }
              }}
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                returnFocus.current?.focus();
              }}
            >
              <Dialog.Title className="decor-sr-only">
                {openOption ?? openChip ?? "Decor details"}
              </Dialog.Title>
              <Dialog.Description className="decor-sr-only">
                Explore the details and save your favourites to your enquiry.
              </Dialog.Description>
              <button
                className="detail-x"
                type="button"
                onClick={closeSheet}
                aria-label={LABELS.close}
              >
                ✕
              </button>

              {chip && !option && (
                <div>
                  <div className="detail-hero">
                    <img src={img(chip.photo)} alt={openChip ?? ""} />
                  </div>
                  <div className="detail-body">
                    <span className="detail-kicker">{chip.kicker}</span>
                    <h3>{openChip}</h3>
                    <p className="detail-intro">{chip.intro}</p>

                    <div className="detail-rich">
                      <div className="rich-block">
                        <span className="detail-h">{LABELS.what}</span>
                        <p>{chip.what}</p>
                      </div>
                      <div className="rich-block">
                        <span className="detail-h">{LABELS.why}</span>
                        <p>{chip.why}</p>
                      </div>
                      <div className="rich-block">
                        <span className="detail-h">{LABELS.how}</span>
                        <p>{chip.how}</p>
                      </div>
                    </div>

                    <div className="detail-facts">
                      <div style={{ display: "contents" }}>
                        {chip.facts.map(([k, v]) => (
                          <div className="fact" key={k}>
                            <b>{k}</b>
                            {v}
                          </div>
                        ))}
                      </div>
                      <div className="bestfor">
                        {chip.bestFor.map((b) => (
                          <i key={b}>{b}</i>
                        ))}
                      </div>
                    </div>

                    <span className="detail-h">{LABELS.opts}</span>
                    <ul className="opt-grid" id="c-opts">
                      {Object.keys(chip.options).map((name) => {
                        const o = chip.options[name];
                        return (
                          <li key={name}>
                            <button
                              className="opt-card"
                              type="button"
                              data-opt={name}
                              onClick={() => setOpenOption(name)}
                            >
                              <span className="opt-thumb">
                                <img src={img(o?.img || chip.photo)} alt="" loading="lazy" />
                              </span>
                              {name}
                              <span className="arw">→</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    <span className="detail-h">{LABELS.ex}</span>
                    <div className="detail-mini">
                      {chip.gallery.map((g) => (
                        <img src={img(g)} alt="" loading="lazy" key={g} />
                      ))}
                    </div>

                    <div className="detail-actions">
                      <button
                        className={`cta${pickedSet.has(chipKey(openChip ?? "")) ? " on" : ""}`}
                        type="button"
                        onClick={() => toggle(chipKey(openChip ?? ""))}
                      >
                        {pickedSet.has(chipKey(openChip ?? "")) ? LABELS.added : LABELS.add}
                      </button>
                      <a
                        className="ghost"
                        href={waLink(
                          `Hello Balloon Creation! I would like to know more about ${openChip}.`,
                        )}
                        target="_blank"
                        rel="noreferrer"
                      >
                        WhatsApp →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {chip && option && openOption && (
                <div className="option-view">
                  <button className="detail-up" type="button" onClick={goBack}>
                    {LABELS.back.replace("{name}", openChip ?? "")}
                  </button>
                  <div className="detail-hero">
                    <img src={img(option.img || chip.photo)} alt={openOption} />
                  </div>
                  <div className="detail-body">
                    <span className="detail-kicker">{openChip}</span>
                    <h3>{openOption}</h3>
                    <p className="detail-intro">{option.what}</p>
                    {option.pick && (
                      <p className="opt-pick">
                        <b>{LABELS.pick}</b>
                        <span>{option.pick}</span>
                      </p>
                    )}

                    <div className="detail-rich">
                      <div className="rich-block">
                        <span className="detail-h">{LABELS.howMade}</span>
                        <p>{option.how}</p>
                      </div>
                      <div className="rich-block">
                        <span className="detail-h">{LABELS.whereUsed}</span>
                        <p>{option.where}</p>
                      </div>
                      <div className="rich-block">
                        <span className="detail-h">{LABELS.note}</span>
                        <p>{option.note}</p>
                      </div>
                    </div>

                    <div className="detail-facts rich">
                      <div className="fact-card">
                        <b>{LABELS.time}</b>
                        <span className="fact-lead">{option.time}</span>
                        <img className="fact-photo" src={img(chip.photo)} alt="" loading="lazy" />
                      </div>
                      <div className="fact-card">
                        <b>{LABELS.colours}</b>
                        <span className="fact-lead">{option.colours}</span>
                        <div className="chip-row">
                          {option.palette.map((p) => (
                            <span className="mini-chip" key={p.t}>
                              <img src={img(p.img)} alt="" loading="lazy" />
                              <i className="pc-dot" style={{ background: p.c }} />
                              {p.t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="fact-card">
                        <b>{LABELS.bestFor}</b>
                        <div className="chip-row">
                          {option.best.map((b, index) => (
                            <span className="mini-chip" key={b}>
                              <img
                                src={img(option.bestPhotos[index]?.img ?? chip.photo)}
                                alt=""
                                loading="lazy"
                              />
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <span className="detail-h">{LABELS.ex}</span>
                    <div className="detail-mini">
                      {option.ex.map((s) => (
                        <img src={img(s)} alt="" loading="lazy" key={s} />
                      ))}
                    </div>

                    <span className="detail-h">{LABELS.comes}</span>
                    <ul className="comes">
                      {option.comes.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>

                    <span className="detail-h">{LABELS.pairs}</span>
                    <div className="pairs">
                      {option.pairs.map((p) =>
                        DECOR_DATA[p] ? (
                          <button type="button" key={p} onClick={() => showChip(p)}>
                            <img
                              src={img(DECOR_DATA[p]?.photo ?? chip.photo)}
                              alt=""
                              loading="lazy"
                            />
                            {p} →
                          </button>
                        ) : (
                          <span className="pair-tag" key={p}>
                            <img src={img(chip.photo)} alt="" loading="lazy" />
                            {p}
                          </span>
                        ),
                      )}
                    </div>

                    <div className="detail-actions">
                      <button
                        className={`cta${pickedSet.has(optKey(openChip ?? "", openOption)) ? " on" : ""}`}
                        type="button"
                        onClick={() => toggle(optKey(openChip ?? "", openOption))}
                      >
                        {pickedSet.has(optKey(openChip ?? "", openOption))
                          ? LABELS.added
                          : LABELS.addOpt}
                      </button>
                      <a
                        className="ghost"
                        href={waLink(
                          `Hello Balloon Creation! I would like to know more about ${openChip} — ${openOption}.`,
                        )}
                        target="_blank"
                        rel="noreferrer"
                      >
                        WhatsApp →
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ---------------- selection bar ---------------- */}
      <div className="selbar">
        <div className="wrap">
          <span className="lbl">{LABELS.label}</span>
          <div className="picked">
            {picked.length ? (
              picked.map((k) => (
                <span className="p" key={k}>
                  ✓ {k}
                </span>
              ))
            ) : (
              <span className="empty">{LABELS.empty}</span>
            )}
          </div>
          <button className="reset" type="button" onClick={() => setPicked([])}>
            {LABELS.clear}
          </button>
          <a className="cta" href={selectionLink} target="_blank" rel="noreferrer">
            {LABELS.send}
          </a>
        </div>
      </div>
    </div>
  );
}

const CHAPTERS = [
  {
    id: "elements",
    label: "The elements",
    kicker: "THE PALETTE OF YOUR CELEBRATION",
    title: "It starts with",
    emphasis: "the details.",
    intro:
      "Balloons, blooms, fabrics and light. Meet the beautiful ingredients that bring your vision to life.",
    photo: "floral-decor.jpg",
    alt: "Soft floral arrangements in an elegant celebration setting",
  },
  {
    id: "structures",
    label: "The settings",
    kicker: "A SETTING TO FALL IN LOVE WITH",
    title: "Give your moment",
    emphasis: "its stage.",
    intro:
      "A grand entrance. An intimate corner. A picture-perfect backdrop. Find a setting made for your story.",
    photo: "mandap-pandal.jpg",
    alt: "Draped floral mandap with warm lanterns",
  },
  {
    id: "experiences",
    label: "The magic",
    kicker: "THE FINISHING TOUCH",
    title: "Make it",
    emphasis: "unforgettable.",
    intro:
      "The joyful surprises and little bursts of wonder that turn a beautiful gathering into a memory.",
    photo: "cold-pyro.jpg",
    alt: "Celebration fountains lighting up an event",
  },
];
const MOODS = [
  {
    chip: "Balloon Decor",
    photo: "round-backdrop.jpg",
    alt: "Soft pastel balloon backdrop for a joyful birthday celebration",
    kicker: "FOR THE JOYFUL LITTLE THINGS",
    title: "A little playful.",
    cta: "Explore balloon decor",
  },
  {
    chip: "Mandap & Pandal",
    photo: "mandap-pandal.jpg",
    alt: "Romantic floral mandap and draped wedding setting",
    kicker: "FOR YOUR FOREVER MOMENTS",
    title: "A little romantic.",
    cta: "Discover wedding settings",
  },
  {
    chip: "Lighting Decor",
    photo: "candle-aisle.jpg",
    alt: "A glowing candlelit walkway with warm ambient lighting",
    kicker: "FOR A NIGHT TO REMEMBER",
    title: "A little magical.",
    cta: "Discover the glow",
  },
];
function Atmosphere() {
  return (
    <div className="section-atmosphere" aria-hidden="true">
      <span className="section-tone tone-one" />
      <span className="section-tone tone-two" />
      <div className="fluid-field">
        <canvas className="liquid-gold-canvas" aria-hidden="true" role="presentation" />
        <span className="liquid-veil" />
        <span className="fluid-lobe fluid-gold" />
        <span className="fluid-lobe fluid-rose" />
        <span className="fluid-sheen" />
      </div>
    </div>
  );
}
