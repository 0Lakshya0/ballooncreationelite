/**
 * Decor Types — the section is ready to place on the live site.
 *
 * Usage (when the owner says go):
 *   import DecorTypesSection from "@/components/balloon/DecorTypesSection";
 *   ...
 *   <DecorTypesSection />
 *
 * It brings its own styles (decor-types.css, scoped under .bce-decor) and its own
 * data (decorTypesData.ts), so nothing else on the page is affected.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  CHIP_GROUPS,
  DECOR_DATA,
  WA_HREF,
  WA_TEXT,
  type Chip,
  type ChipOption,
} from "./decorTypesData";
import "./decor-types.css";

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

const waLink = (message: string) => `${WA_HREF}?text=${encodeURIComponent(message)}`;

export default function DecorTypesSection({ imgBase = "img" }: DecorTypesSectionProps = {}) {
  const img = (src: string) => resolveImg(src, imgBase);
  const [openChip, setOpenChip] = useState<string | null>(null);
  const [openOption, setOpenOption] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const cardRef = useRef<HTMLElement | null>(null);

  const chip: Chip | null = openChip ? DECOR_DATA[openChip] : null;
  const option: ChipOption | null =
    chip && openOption ? chip.options[openOption] ?? null : null;

  const openSheet = openChip !== null;
  const pickedSet = useMemo(() => new Set(picked), [picked]);

  const showChip = useCallback((name: string) => {
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

  // lock the page behind the sheet, and let Esc step back
  useEffect(() => {
    if (!openSheet) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenOption((current) => {
        if (current) return null;
        setOpenChip(null);
        return null;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [openSheet]);

  const sendOnWhatsApp = () => {
    if (!picked.length) return;
    window.open(waLink(WA_TEXT + picked.join(", ")), "_blank", "noopener");
  };

  return (
    <div className="bce-decor">
      <div className="wrap">
        <section className="block">
          <div className="head">
            <div>
              <span className="eyebrow">THE ART OF OUR DECOR</span>
              <h1>
                Every decoration we create works in <em>two layers.</em>
              </h1>
              <p>
                First, what it is made of — balloons, flowers, fabric, light. Then how it is built
                and where it stands — backdrop, arch, stage, ceiling. And finally, the extra magic
                on top.
              </p>
            </div>
          </div>

          <div className="groups">
            {CHIP_GROUPS.map((group) => (
              <article className="group" key={group.no}>
                <span className="group-no">{group.no}</span>
                <h3>{group.title}</h3>
                <p>{group.sub}</p>
                <div className="chips">
                  {group.chips.map((name) => {
                    const data = DECOR_DATA[name];
                    if (!data) return null;
                    const on = chipSelected(name);
                    return (
                      <button
                        className="chip"
                        key={name}
                        type="button"
                        aria-pressed={on}
                        aria-expanded={openChip === name}
                        onClick={() => showChip(name)}
                      >
                        <span className="thumb">
                          <img src={img(data.photo)} alt="" loading="lazy" />
                        </span>
                        <span className="txt">
                          <span className="nm">{name}</span>
                          <span className="ds">{data.desc}</span>
                        </span>
                        <span className="tick">✓</span>
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* ---------------- detail sheet ---------------- */}
      <div className="detail" hidden={!openSheet}>
        <div className="detail-scrim" onClick={closeSheet} />
        <article
          className="detail-card"
          role="dialog"
          aria-modal="true"
          aria-label={openOption ?? openChip ?? ""}
          ref={cardRef}
        >
          <button className="detail-x" type="button" onClick={closeSheet} aria-label={LABELS.close}>
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
                            <img src={img(o.img || chip.photo)} alt="" loading="lazy" />
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
            <div>
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
                          <img src={img(option.bestPhotos[index]?.img ?? chip.photo)} alt="" loading="lazy" />
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
                        {p} →
                      </button>
                    ) : (
                      <button type="button" key={p}>
                        {p}
                      </button>
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
        </article>
      </div>

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
          <button className="cta" type="button" onClick={sendOnWhatsApp}>
            {LABELS.send}
          </button>
        </div>
      </div>
    </div>
  );
}
