#!/usr/bin/env python3
"""Rebuild both decor-types drafts with the two-level detail experience.

Level 1  click a chip    -> what it is, why it is chosen, how we build it,
                           good to know, best for, every option inside, examples
Level 2  click an option -> that option's own full detail + add to enquiry

Run from mockups/:  python3 _build2.py
"""
from __future__ import annotations

import json
import pathlib
import re

from _d1_chips import CHIPS
_DEEP = {}
for _mod, _attr in (("_d3a_deep", "OPTS_A"), ("_d3b_deep", "OPTS_B")):
    try:
        _m = __import__(_mod)
        _part = getattr(_m, _attr)
    except (ImportError, AttributeError):  # deep copy not written yet
        continue
    for _chip, _opts in _part.items():
        _DEEP.setdefault(_chip, {}).update(_opts)

from _d2_opts import OPTS_G1 as _SHALLOW

# deep copy wins field by field, so a partial deep file still works
OPTS_G1 = {}
for _chip in set(_SHALLOW) | set(_DEEP):
    merged = {}
    for _opt in set(_SHALLOW.get(_chip, {})) | set(_DEEP.get(_chip, {})):
        entry = dict(_SHALLOW.get(_chip, {}).get(_opt, {}))
        for _lang, _fields in _DEEP.get(_chip, {}).get(_opt, {}).items():
            entry.setdefault(_lang, {}).update(_fields)
        merged[_opt] = entry
    OPTS_G1[_chip] = merged

ROOT = pathlib.Path(__file__).resolve().parent

# ────────────────────────────── styles ──────────────────────────────
CSS = """      /* ---------- detail sheet (chip click -> option click) ---------- */
      body.locked { overflow: hidden; }
      .detail { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; padding: 26px; }
      .detail[hidden] { display: none; }
      .detail-scrim { position: absolute; inset: 0; background: oklch(0.28 0.03 65 / 0.42); backdrop-filter: blur(7px); }
      .detail-card { position: relative; width: min(920px, 100%); max-height: min(90vh, 960px); overflow: auto; border: 1px solid var(--border); border-radius: 8px; background: linear-gradient(168deg, oklch(0.997 0.012 90 / 0.99), oklch(0.972 0.03 87 / 0.99)); box-shadow: 0 30px 80px oklch(0.3 0.04 70 / 0.32); }
      .detail-x { position: absolute; top: 13px; right: 13px; z-index: 3; width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--border); background: oklch(0.99 0.012 90 / 0.92); color: var(--foreground); font-size: 14px; line-height: 1; cursor: pointer; }
      .detail-x:hover { background: var(--secondary); }
      .detail-hero { position: relative; }
      .detail-hero img { width: 100%; height: 208px; object-fit: cover; display: block; }
      .detail-hero::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, oklch(0.99 0.012 90 / 0.98), transparent 62%); }
      .detail-body { position: relative; padding: 0 34px 30px; margin-top: -40px; }
      .detail-kicker { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); }
      .detail-body h3 { font-size: 34px; margin: 8px 0 9px; }
      .detail-intro { margin: 0 0 20px; max-width: 640px; font-size: 14px; line-height: 1.8; color: var(--muted-foreground); }
      .detail-h { display: block; margin: 22px 0 11px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--rose-gold); }
      .detail-rich { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; }
      .detail-rich.two { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .rich-block p { margin: 0; font-size: 12.5px; line-height: 1.8; color: var(--muted-foreground); }
      .rich-block .detail-h { margin-top: 0; }
      .detail-facts { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 24px; margin: 24px 0 0; padding: 15px 0; border-block: 1px solid var(--border); }
      .fact { font-size: 12px; }
      .fact b { display: block; margin-bottom: 3px; font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); }
      .bestfor { display: flex; flex-wrap: wrap; gap: 6px; margin-left: auto; }
      .bestfor i { font-style: normal; font-size: 10.5px; padding: 5px 11px; border: 1px solid var(--border); border-radius: 20px; background: var(--secondary); }
      .opt-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin: 0; padding: 0; list-style: none; }
      .opt-card { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 13px; text-align: left; cursor: pointer; border: 1px solid var(--border); border-radius: 4px; background: oklch(1 0 0 / 0.62); color: var(--foreground); font-family: var(--font-sans); font-size: 11.5px; font-weight: 600; transition: background 0.25s, border-color 0.25s; }
      .opt-card:hover { background: var(--secondary); border-color: var(--gold); }
      .opt-card .arw { margin-left: auto; color: var(--gold); font-weight: 400; }
      .plain-list { display: flex; flex-wrap: wrap; gap: 7px; margin: 0; padding: 0; list-style: none; }
      .plain-list li { padding: 7px 11px; border: 1px solid var(--border); border-radius: 3px; background: oklch(1 0 0 / 0.62); font-size: 11.5px; }
      .fact span { font-size: 12px; line-height: 1.6; }
      .comes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px 20px; margin: 0; padding: 0; list-style: none; }
      .comes li { position: relative; padding-left: 19px; font-size: 12px; line-height: 1.7; color: var(--muted-foreground); }
      .comes li::before { content: '\\2713'; position: absolute; left: 0; top: 0; color: var(--gold); font-size: 11px; }
      .pairs { display: flex; flex-wrap: wrap; gap: 7px; }
      .pairs button { padding: 7px 12px; border: 1px solid var(--border); border-radius: 3px; background: oklch(1 0 0 / 0.6); color: var(--foreground); font-family: var(--font-sans); font-size: 11px; cursor: pointer; }
      .pairs button:hover { background: var(--secondary); border-color: var(--gold); }
      .detail-mini { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .detail-mini img { display: block; width: 100%; aspect-ratio: 3 / 4; object-fit: cover; border: 1px solid var(--border); border-radius: 3px; }
      .detail-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 26px; padding-top: 20px; border-top: 1px solid var(--border); align-items: center; }
      .detail-up { display: inline-flex; align-items: center; gap: 8px; margin: 0 0 4px; padding: 9px 14px; border: 1px solid var(--border); border-radius: 3px; background: oklch(0.99 0.012 90 / 0.9); color: var(--foreground); font-family: var(--font-sans); font-size: 11px; font-weight: 600; cursor: pointer; }
      .detail-up:hover { background: var(--secondary); }
      .ghost { display: inline-flex; align-items: center; padding: 12px 18px; border: 1px solid var(--border); border-radius: 3px; background: oklch(0.995 0.015 88 / 0.7); color: var(--foreground); font-family: var(--font-sans); font-size: 11.5px; font-weight: 600; text-decoration: none; }
      .ghost:hover { background: var(--secondary); }
      .cta.on { background: var(--secondary); box-shadow: none; }
      @media (max-width: 860px) {
        .detail-rich, .detail-rich.two { grid-template-columns: 1fr; gap: 16px; }
        .opt-grid { grid-template-columns: 1fr; }
      }
      @media (max-width: 760px) {
        .detail { padding: 0; align-items: end; }
        .detail-card { max-height: 93vh; border-radius: 10px 10px 0 0; }
        .detail-hero img { height: 150px; }
        .detail-body { padding: 0 20px 22px; margin-top: -30px; }
        .detail-body h3 { font-size: 26px; }
        .bestfor { margin-left: 0; }
      }

"""

# ────────────────────────────── markup ──────────────────────────────
MARKUP = """    <!-- detail sheet: click a chip, then click any option inside it -->
    <div class="detail" id="detail" hidden>
      <div class="detail-scrim" data-close></div>
      <article class="detail-card" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button class="detail-x" type="button" data-close aria-label="__close__">✕</button>

        <div id="view-chip">
          <div class="detail-hero"><img id="detail-img" src="" alt="" /></div>
          <div class="detail-body">
            <span class="detail-kicker" id="detail-kicker"></span>
            <h3 id="detail-title"></h3>
            <p class="detail-intro" id="detail-intro"></p>

            <div class="detail-rich">
              <div class="rich-block"><span class="detail-h">__what__</span><p id="c-what"></p></div>
              <div class="rich-block"><span class="detail-h">__why__</span><p id="c-why"></p></div>
              <div class="rich-block"><span class="detail-h">__how__</span><p id="c-how"></p></div>
            </div>

            <div class="detail-facts">
              <div id="c-facts" style="display: contents"></div>
              <div class="bestfor" id="c-best"></div>
            </div>

            <span class="detail-h" id="opts-head"></span>
            <ul class="opt-grid" id="c-opts"></ul>

            <span class="detail-h">__ex__</span>
            <div class="detail-mini" id="detail-mini"></div>

            <div class="detail-actions">
              <button class="cta" type="button" id="detail-add">__add__</button>
              <a class="ghost" id="detail-wa" href="#" target="_blank" rel="noreferrer">WhatsApp →</a>
            </div>
          </div>
        </div>

        <div id="view-opt" hidden>
          <div class="detail-hero"><img id="opt-img" src="" alt="" /></div>
          <div class="detail-body">
            <button class="detail-up" type="button" id="opt-back"></button>
            <span class="detail-kicker" id="opt-kicker"></span>
            <h3 id="opt-title"></h3>
            <p class="detail-intro" id="opt-what"></p>

            <div class="detail-rich">
              <div class="rich-block"><span class="detail-h">__howMade__</span><p id="opt-how"></p></div>
              <div class="rich-block"><span class="detail-h">__whereUsed__</span><p id="opt-where"></p></div>
              <div class="rich-block"><span class="detail-h">__note__</span><p id="opt-note"></p></div>
            </div>

            <div class="detail-facts">
              <div class="fact"><b>__time__</b><span id="opt-time"></span></div>
              <div class="fact"><b>__colours__</b><span id="opt-colours"></span></div>
              <div class="bestfor" id="opt-best"></div>
            </div>

            <span class="detail-h" id="comes-head"></span>
            <ul class="comes" id="opt-comes"></ul>

            <span class="detail-h" id="pairs-head"></span>
            <div class="pairs" id="opt-pairs"></div>

            <div class="detail-actions">
              <button class="cta" type="button" id="opt-add">__addOpt__</button>
              <a class="ghost" id="opt-wa" href="#" target="_blank" rel="noreferrer">WhatsApp →</a>
            </div>
          </div>
        </div>
      </article>
    </div>

"""

# ────────────────────────────── script ──────────────────────────────
SCRIPT = """<script>
  window.DECOR_DATA = __DATA__;
  (function () {
    var T = __LABELS__;
    var D = window.DECOR_DATA || {};
    var picked = new Map();

    function renderBar() {
      var box = document.querySelector('.picked');
      if (!box) return;
      var list = Array.from(picked.keys());
      box.innerHTML = list.length
        ? list.map(function (n) { return '<span class="p">\\u2713 ' + n + '</span>'; }).join('')
        : '<span class="empty">' + T.empty + '</span>';
    }
    function setPicked(key, on) {
      if (on) picked.set(key, true); else picked.delete(key);
      renderBar();
      syncChip();
      syncOpt();
      syncChips();
    }
    // a chip looks chosen when the chip itself, or any option inside it, is picked
    function chipSelected(name) {
      if (picked.has(name)) return true;
      var prefix = name + ' \\u00b7 ';
      return Array.from(picked.keys()).some(function (k) { return k.indexOf(prefix) === 0; });
    }
    function syncChips() {
      document.querySelectorAll('.chip').forEach(function (chip) {
        var name = chip.querySelector('.nm').textContent.trim();
        chip.setAttribute('aria-pressed', chipSelected(name) ? 'true' : 'false');
      });
    }
    function chipKey(name) { return name; }
    function optKey(chip, opt) { return chip + ' \\u00b7 ' + opt; }

    var sheet = document.getElementById('detail');
    var viewChip = document.getElementById('view-chip');
    var viewOpt = document.getElementById('view-opt');
    var el = {
      img: document.getElementById('detail-img'),
      kicker: document.getElementById('detail-kicker'),
      title: document.getElementById('detail-title'),
      intro: document.getElementById('detail-intro'),
      what: document.getElementById('c-what'),
      why: document.getElementById('c-why'),
      how: document.getElementById('c-how'),
      facts: document.getElementById('c-facts'),
      best: document.getElementById('c-best'),
      optsHead: document.getElementById('opts-head'),
      opts: document.getElementById('c-opts'),
      mini: document.getElementById('detail-mini'),
      add: document.getElementById('detail-add'),
      wa: document.getElementById('detail-wa'),
      optImg: document.getElementById('opt-img'),
      optBack: document.getElementById('opt-back'),
      optKicker: document.getElementById('opt-kicker'),
      optTitle: document.getElementById('opt-title'),
      optWhat: document.getElementById('opt-what'),
      optHow: document.getElementById('opt-how'),
      optWhere: document.getElementById('opt-where'),
      optNote: document.getElementById('opt-note'),
      optTime: document.getElementById('opt-time'),
      optColours: document.getElementById('opt-colours'),
      optBest: document.getElementById('opt-best'),
      optComes: document.getElementById('opt-comes'),
      comesHead: document.getElementById('comes-head'),
      pairsHead: document.getElementById('pairs-head'),
      optPairs: document.getElementById('opt-pairs'),
      optAdd: document.getElementById('opt-add'),
      optWa: document.getElementById('opt-wa')
    };
    var openChip = null;
    var openOption = null;

    function waHref(text) {
      return 'https://wa.me/917489863753?text=' + encodeURIComponent(text);
    }

    // ---------- level 1: the chip ----------
    function showChip(name) {
      var info = D[name];
      if (!info) return;
      openChip = name;
      openOption = null;
      viewOpt.hidden = true;
      viewChip.hidden = false;
      sheet.querySelector('.detail-card').scrollTop = 0;
      el.img.src = info.photo;
      el.img.alt = name;
      el.kicker.textContent = info.kicker;
      el.title.textContent = name;
      el.intro.textContent = info.intro;
      el.what.textContent = info.what || '';
      el.why.textContent = info.why || '';
      el.how.textContent = info.how || '';
      el.facts.innerHTML = (info.facts || []).map(function (f) {
        return '<div class="fact"><b>' + f[0] + '</b>' + f[1] + '</div>';
      }).join('');
      el.best.innerHTML = (info.bestFor || []).map(function (b) { return '<i>' + b + '</i>'; }).join('');
      var opts = info.options || {};
      var keys = Object.keys(opts);
      if (keys.length) {
        el.optsHead.textContent = T.opts;
        el.opts.className = 'opt-grid';
        el.opts.innerHTML = keys.map(function (k) {
          return '<li><button class="opt-card" type="button" data-opt="' + k + '">' + k +
            '<span class="arw">\\u2192</span></button></li>';
        }).join('');
      } else {
        el.optsHead.textContent = T.optsPlain;
        el.opts.className = 'plain-list';
        el.opts.innerHTML = (info.includes || []).map(function (k) { return '<li>' + k + '</li>'; }).join('');
      }
      el.mini.innerHTML = (info.gallery || []).map(function (g) {
        return '<img src="' + g + '" alt="" loading="lazy" />';
      }).join('');
      el.wa.href = waHref(T.wa.replace('{name}', name));
      syncChip();
      openSheet();
    }

    function syncChip() {
      if (!openChip) return;
      var on = picked.has(chipKey(openChip));
      el.add.textContent = on ? T.added : T.add;
      el.add.classList.toggle('on', on);
    }

    // ---------- level 2: the option inside ----------
    function showOption(chipName, optName) {
      var info = (D[chipName] || {}).options || {};
      var o = info[optName];
      if (!o) return;
      openOption = { chip: chipName, name: optName };
      viewChip.hidden = true;
      viewOpt.hidden = false;
      sheet.querySelector('.detail-card').scrollTop = 0;
      el.optImg.src = D[chipName].photo;
      el.optImg.alt = chipName + ' — ' + optName;
      el.optBack.textContent = T.back.replace('{name}', chipName);
      el.optKicker.textContent = chipName;
      el.optTitle.textContent = optName;
      el.optWhat.textContent = o.what || '';
      el.optHow.textContent = o.how || '';
      el.optWhere.textContent = o.where || '';
      el.optNote.textContent = o.note || '';
      el.optTime.textContent = o.time || '';
      el.optColours.textContent = o.colours || '';
      el.optBest.innerHTML = (o.best || []).map(function (b) { return '<i>' + b + '</i>'; }).join('');
      el.comesHead.textContent = T.comes;
      el.comesHead.style.display = (o.comes || []).length ? 'block' : 'none';
      el.optComes.innerHTML = (o.comes || []).map(function (c) { return '<li>' + c + '</li>'; }).join('');
      el.pairsHead.textContent = T.pairs;
      el.pairsHead.style.display = (o.pairs || []).length ? 'block' : 'none';
      el.optPairs.innerHTML = (o.pairs || []).map(function (n) {
        return D[n] ? '<button type="button" data-chip="' + n + '">' + n + ' \u2192</button>'
                    : '<button type="button">' + n + '</button>';
      }).join('');
      el.optWa.href = waHref(T.waOpt.replace('{chip}', chipName).replace('{option}', optName));
      syncOpt();
      el.optAdd.focus();
    }

    function syncOpt() {
      if (!openOption) return;
      var on = picked.has(optKey(openOption.chip, openOption.name));
      el.optAdd.textContent = on ? T.added : T.addOpt;
      el.optAdd.classList.toggle('on', on);
    }

    // ---------- wiring ----------
    function openSheet() {
      sheet.hidden = false;
      document.body.classList.add('locked');
      el.add.focus();
    }
    function closeSheet() {
      sheet.hidden = true;
      document.body.classList.remove('locked');
      viewChip.hidden = false;
      viewOpt.hidden = true;
      openOption = null;
    }

    document.querySelectorAll('.chip').forEach(function (chip) {
      chip.setAttribute('aria-pressed', 'false');
      chip.setAttribute('aria-expanded', 'false');
      chip.addEventListener('click', function () {
        var name = chip.querySelector('.nm').textContent.trim();
        chip.setAttribute('aria-expanded', 'true');
        showChip(name);
      });
    });

    el.opts.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-opt]') : null;
      if (btn && openChip) showOption(openChip, btn.getAttribute('data-opt'));
    });
    el.optBack.addEventListener('click', function () { if (openChip) showChip(openChip); });
    el.optPairs.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-chip]') : null;
      if (b) showChip(b.getAttribute('data-chip'));
    });
    el.add.addEventListener('click', function () {
      if (openChip) setPicked(chipKey(openChip), !picked.has(chipKey(openChip)));
    });
    el.optAdd.addEventListener('click', function () {
      if (openOption) {
        var k = optKey(openOption.chip, openOption.name);
        setPicked(k, !picked.has(k));
      }
    });
    sheet.addEventListener('click', function (e) {
      if (e.target.hasAttribute && e.target.hasAttribute('data-close')) closeSheet();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || sheet.hidden) return;
      if (openOption) showChip(openOption.chip); else closeSheet();
    });

    var reset = document.querySelector('.reset');
    if (reset) reset.addEventListener('click', function () {
      picked.clear();
      renderBar();
      syncChip();
      syncOpt();
      syncChips();
    });
    var barCta = document.querySelector('.selbar .cta');
    if (barCta) barCta.addEventListener('click', function () {
      var list = Array.from(picked.keys());
      alert(list.length ? T.demo.replace('{list}', list.join(', ')) : T.demoEmpty);
    });

    document.querySelectorAll('.tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.tab').forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
        document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('on'); });
        tab.setAttribute('aria-selected', 'true');
        document.getElementById(tab.dataset.p).classList.add('on');
      });
    });
  })();
</script>"""

# ────────────────────────────── labels ──────────────────────────────
LABELS = {
    "en": dict(
        what="What it is", why="Why people choose it", how="How we build it",
        opts="Every option inside — tap any one for its full detail",
        optsPlain="Every option inside", ex="A few examples",
        back="\u2190 Back to {name}", howMade="How it is made", whereUsed="Where it is used",
        note="Good to know", add="Add to my enquiry", addOpt="Add this option to my enquiry",
        time="Setup time", colours="Colour & palette", comes="What comes with it",
        pairs="Pairs beautifully with",
        added="\u2713 Added — tap again to remove", close="Close",
        wa="Hello Balloon Creation! I would like to know more about {name}.",
        waOpt="Hello Balloon Creation! I would like to know more about {chip} — {option}.",
        empty="Nothing selected yet — click any chip to explore",
        demo='Demo: this is the WhatsApp message it would send \U0001F447' + chr(10) + chr(10) + chr(34) + "Hello Balloon Creation! I am looking for: {list}" + chr(34),
        demoEmpty="Demo: select a few chips first, then see what this button sends \U0001F446",
    ),
    "hi": dict(
        what="Ye kya hai", why="Log kyun chunte hain", how="Hum kaise banate hain",
        opts="Andar ke saare options — kisi bhi ek par tap karke poori detail dekho",
        optsPlain="Andar ke saare options", ex="Kuch examples",
        back="\u2190 {name} par wapas", howMade="Ye kaise banta hai", whereUsed="Kahan istemaal hota hai",
        note="Jaanne wali baat", add="Meri enquiry me jodo", addOpt="Ye option enquiry me jodo",
        time="Setup ka time", colours="Colour aur palette", comes="Saath me kya milta hai",
        pairs="Inke saath best lagta hai",
        added="\u2713 Jod diya — hataane ke liye phir dabao", close="Band karo",
        wa="Hello Balloon Creation! Mujhe {name} ke baare me aur jaankari chahiye.",
        waOpt="Hello Balloon Creation! Mujhe {chip} — {option} ke baare me aur jaankari chahiye.",
        empty="Abhi kuch select nahi kiya — kisi chip par click karke dekho",
        demo='Demo: WhatsApp par ye message jaayega \U0001F447' + chr(10) + chr(10) + chr(34) + "Hello Balloon Creation! Mujhe chahiye: {list}" + chr(34),
        demoEmpty="Demo: pehle kuch chips select karo, phir dekho ye button kya bhejta hai \U0001F446",
    ),
}


def build_data(lang: str, old: dict) -> dict:
    """Merge the new rich copy into the existing per-chip data."""
    out = {}
    for name, existing in old.items():
        rich = CHIPS.get(name, {}).get(lang)
        entry = dict(existing)
        if rich:
            entry.update(
                what=rich["what"], why=rich["why"], how=rich["how"],
                facts=[list(f) for f in rich["facts"]], bestFor=list(rich["bestFor"]),
            )
        opts = OPTS_G1.get(name, {})
        if opts:
            entry["options"] = {k: v[lang] for k, v in opts.items()}
            entry["includes"] = list(opts.keys())
        else:
            entry["options"] = {}
        out[name] = entry
    return out


def patch(path: pathlib.Path, lang: str) -> None:
    text = path.read_text(encoding="utf-8")
    data = build_data(lang, json.loads(re.search(r"window\.DECOR_DATA = (\{.*?\});\n", text, re.S).group(1)))
    labels = LABELS[lang]

    # 1. styles: swap the whole detail-sheet block
    start = "      /* ---------- detail sheet (chip click) ---------- */"
    end = "      /* ---------- OPTION B : tabs ---------- */"
    assert start in text and end in text, "css anchors missing"
    text = text[: text.index(start)] + CSS + text[text.index(end) :]

    # 2. markup: swap the sheet
    m_start = "    <!-- detail sheet"
    m_end = "    <!-- selection bar -->"
    assert m_start in text and m_end in text, "markup anchors missing"
    markup = MARKUP
    for key, value in labels.items():
        markup = markup.replace("__%s__" % key, value)
    text = text[: text.index(m_start)] + markup + text[text.index(m_end) :]

    # 3. script: swap it (function replacement, so regex never sees the JSON)
    script = SCRIPT.replace("__DATA__", json.dumps(data, ensure_ascii=False, indent=2))
    script = script.replace("__LABELS__", json.dumps(labels, ensure_ascii=False, indent=2))
    text, n = re.subn(r"<script>.*?</script>", lambda _m: script, text, flags=re.S)
    assert n == 1, f"script swap failed ({n})"

    text = text.replace("Samta\u0932", "Samtal")
    path.write_text(text, encoding="utf-8")

    rich = sum(1 for v in data.values() if v.get("what"))
    opts = sum(len(v.get("options") or {}) for v in data.values())
    print(f"  {path.name}: {len(data)} chips ({rich} with full detail), {opts} option entries")


def main() -> int:
    patch(ROOT / "decor-types-draft.html", "en")
    patch(ROOT / "decor-types-draft-hinglish.html", "hi")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
