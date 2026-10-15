#!/usr/bin/env python3
"""Build ONE final page that holds both languages — English and Hinglish — with
a language switch in the header.

Nothing here comes from the draft menu: this page is built fresh from the two
cleaned final pages (_build_final.py does the cleaning), so it never opens the
old draft.

Outputs (mockups/final/):
  decor-types-final-both.html          uses the img/ folder
  decor-types-final-both-single.html   photos inside (phone / offline)
and a copy at drafts/final-both.html for the phone link.

Run from mockups/:  python3 _build_final_both.py
"""
from __future__ import annotations

import html as htmllib
import json
import pathlib
import re

from _build_final import LANGS, WA, clean, inline

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / "final"
PUBLISH = ROOT.parent / "drafts"

DEST = "decor-types-final-both.html"
SINGLE = "decor-types-final-both-single.html"
PUBLISH_NAME = "final-both.html"

TITLE = "Balloon Creation — Decor Types | Balloon, Floral &amp; Event Decoration in Indore"
META = (
    "Balloon, floral, drape, light and effect decoration for weddings, birthdays and every "
    "celebration in Indore — in English and Hinglish."
)

UI = {
    "en": {
        "label": "Your selection",
        "clear": "Clear",
        "send": "Send on WhatsApp →",
        "waList": "Hello Balloon Creation! I am looking for: {list}",
    },
    "hi": {
        "label": "Tumhari selection",
        "clear": "Hatao",
        "send": "WhatsApp par bhejo →",
        "waList": "Hello Balloon Creation! Mujhe chahiye: {list}",
    },
}

SWITCH_CSS = """      /* ---------- language switch ---------- */
      .langsw { display: inline-flex; border: 1px solid var(--border); border-radius: 20px; background: oklch(1 0 0 / 0.6); padding: 3px; gap: 2px; }
      .langsw button { font-family: var(--font-sans); font-size: 11px; font-weight: 600; letter-spacing: 0.03em; padding: 7px 14px; border: 0; border-radius: 16px; background: none; color: var(--muted-foreground); cursor: pointer; }
      .langsw button[aria-pressed="true"] { background: oklch(0.42 0.05 65); color: oklch(0.97 0.02 88); }
      .head-right { display: flex; align-items: center; gap: 10px; }
      @media (max-width: 560px) {
        .langsw button { padding: 6px 11px; font-size: 10.5px; }
        .head-right { gap: 7px; }
      }

"""

HEADER = """    <header class="sitehead" id="top">
      <div class="wrap">
        <a class="brand" href="#top">Balloon Creation<small id="s-brandsub">Indore &middot; Balloon &amp; Floral Decor</small></a>
        <div class="head-right">
          <div class="langsw" role="group" aria-label="Language">
            <button type="button" data-lang="en" aria-pressed="true">English</button>
            <button type="button" data-lang="hi" aria-pressed="false">Hinglish</button>
          </div>
          <a class="head-wa" id="s-headwa" href="__WA__" target="_blank" rel="noreferrer">WhatsApp us &rarr;</a>
        </div>
      </div>
    </header>
"""

SECTION = """    <div class="wrap">
      <section class="block">
        <div class="head">
          <div>
            <span class="eyebrow" id="s-eyebrow">THE ART OF OUR DECOR</span>
            <h1 id="s-h1">Every decoration we create works in <em>two layers.</em></h1>
            <p id="s-intro"></p>
          </div>
        </div>
        <div class="groups" id="s-groups"></div>
      </section>
    </div>

      <footer class="sitefoot">
        <div class="wrap">
          <b>Balloon Creation</b> — <span id="s-foot">bespoke balloon &amp; floral decoration for weddings, birthdays,
          haldi, ring ceremonies, anniversaries and corporate evenings in Indore.</span><br />
          <b>WhatsApp / Call:</b> <a href="__WA__" target="_blank" rel="noreferrer">+91 74898 63753</a>
        </div>
      </footer>

"""

SHEET = """    <!-- detail sheet -->
    <div class="detail" id="detail" hidden>
      <div class="detail-scrim" data-close></div>
      <article class="detail-card" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button class="detail-x" type="button" data-close aria-label="Close">✕</button>
        <div id="view-chip">
          <div class="detail-hero"><img id="detail-img" src="" alt="" /></div>
          <div class="detail-body">
            <span class="detail-kicker" id="detail-kicker"></span>
            <h3 id="detail-title"></h3>
            <p class="detail-intro" id="detail-intro"></p>
            <div class="detail-rich">
              <div class="rich-block"><span class="detail-h" id="l-what">What it is</span><p id="c-what"></p></div>
              <div class="rich-block"><span class="detail-h" id="l-why">Why people choose it</span><p id="c-why"></p></div>
              <div class="rich-block"><span class="detail-h" id="l-how">How we build it</span><p id="c-how"></p></div>
            </div>
            <div class="detail-facts">
              <div id="c-facts" style="display: contents"></div>
              <div class="bestfor" id="c-best"></div>
            </div>
            <span class="detail-h" id="opts-head"></span>
            <ul class="opt-grid" id="c-opts"></ul>
            <span class="detail-h" id="l-ex">A few examples</span>
            <div class="detail-mini" id="detail-mini"></div>
            <div class="detail-actions">
              <button class="cta" type="button" id="detail-add">Add to my enquiry</button>
              <a class="ghost" id="detail-wa" href="#" target="_blank" rel="noreferrer">WhatsApp →</a>
            </div>
          </div>
        </div>
        <div id="view-opt" hidden>
          <button class="detail-up" type="button" id="opt-back"></button>
          <div class="detail-hero"><img id="opt-img" src="" alt="" /></div>
          <div class="detail-body">
            <span class="detail-kicker" id="opt-kicker"></span>
            <h3 id="opt-title"></h3>
            <p class="detail-intro" id="opt-what"></p>
            <p class="opt-pick" id="opt-pick" style="display: none"><b id="l-pick">When to pick it</b><span id="opt-pick-text"></span></p>
            <div class="detail-rich">
              <div class="rich-block"><span class="detail-h" id="l-howmade">How it is made</span><p id="opt-how"></p></div>
              <div class="rich-block"><span class="detail-h" id="l-where">Where it is used</span><p id="opt-where"></p></div>
              <div class="rich-block"><span class="detail-h" id="l-note">Good to know</span><p id="opt-note"></p></div>
            </div>
            <div class="detail-facts rich">
              <div class="fact-card">
                <b id="l-time">Setup time</b>
                <span class="fact-lead" id="opt-time"></span>
                <img class="fact-photo" id="opt-time-img" src="" alt="" loading="lazy" />
              </div>
              <div class="fact-card">
                <b id="l-colours">Colour &amp; palette</b>
                <span class="fact-lead" id="opt-colours"></span>
                <div class="chip-row" id="opt-palette"></div>
              </div>
              <div class="fact-card">
                <b id="l-best">Best for</b>
                <div class="chip-row" id="opt-best"></div>
              </div>
            </div>
            <span class="detail-h" id="l-ex2">A few examples</span>
            <div class="detail-mini" id="opt-ex"></div>
            <span class="detail-h" id="comes-head"></span>
            <ul class="comes" id="opt-comes"></ul>
            <span class="detail-h" id="pairs-head"></span>
            <div class="pairs" id="opt-pairs"></div>
            <div class="detail-actions">
              <button class="cta" type="button" id="opt-add">Add this option to my enquiry</button>
              <a class="ghost" id="opt-wa" href="#" target="_blank" rel="noreferrer">WhatsApp →</a>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- selection bar -->
    <div class="selbar">
      <div class="wrap">
        <span class="lbl" id="l-sel">Your selection</span>
        <div class="picked"><span class="empty" id="sel-empty"></span></div>
        <button class="reset" type="button" id="sel-clear">Clear</button>
        <button class="cta" type="button" id="sel-send">Send on WhatsApp →</button>
      </div>
    </div>
"""

SCRIPT = r"""
(function () {
  var BCE = window.BCE;
  var WA = "__WA__";
  var lang = "en";
  var D, T, TX;
  var picked = [];              // "Chip"  or  "Chip · Option"
  var openChip = null, openOption = null;

  var $ = function (id) { return document.getElementById(id); };
  var sheet = $("detail");
  var card = sheet.querySelector(".detail-card");
  var viewChip = $("view-chip");
  var viewOpt = $("view-opt");

  var el = {
    eyebrow: $("s-eyebrow"), h1: $("s-h1"), intro: $("s-intro"), groups: $("s-groups"),
    foot: $("s-foot"), headwa: $("s-headwa"), brandsub: $("s-brandsub"),
    img: $("detail-img"), kicker: $("detail-kicker"), title: $("detail-title"), introC: $("detail-intro"),
    what: $("c-what"), why: $("c-why"), how: $("c-how"), facts: $("c-facts"), best: $("c-best"),
    optsHead: $("opts-head"), opts: $("c-opts"), mini: $("detail-mini"),
    add: $("detail-add"), waChip: $("detail-wa"),
    optImg: $("opt-img"), optKicker: $("opt-kicker"), optTitle: $("opt-title"), optWhat: $("opt-what"),
    optPick: $("opt-pick"), optPickText: $("opt-pick-text"),
    optHow: $("opt-how"), optWhere: $("opt-where"), optNote: $("opt-note"),
    optTime: $("opt-time"), optTimeImg: $("opt-time-img"), optColours: $("opt-colours"),
    optPalette: $("opt-palette"), optBest: $("opt-best"), optEx: $("opt-ex"),
    optBack: $("opt-back"), optAdd: $("opt-add"), optWa: $("opt-wa"),
    comesHead: $("comes-head"), optComes: $("opt-comes"),
    pairsHead: $("pairs-head"), optPairs: $("opt-pairs"),
    selLabel: $("l-sel"), selEmpty: $("sel-empty"), selClear: $("sel-clear"), selSend: $("sel-send"),
    pickedBox: document.querySelector(".picked"),
    labels: {
      what: $("l-what"), why: $("l-why"), how: $("l-how"), ex: $("l-ex"), ex2: $("l-ex2"),
      pick: $("l-pick"), howMade: $("l-howmade"), where: $("l-where"), note: $("l-note"),
      time: $("l-time"), colours: $("l-colours"), best: $("l-best"),
    },
  };

  var TEXT = { en: { brandsub: "Indore &middot; Balloon &amp; Floral Decor", headwa: "WhatsApp us &rarr;" },
               hi: { brandsub: "Indore &middot; Balloon &amp; Floral Decor", headwa: "WhatsApp karo &rarr;" } };
  var FOOT = { en: __FOOT_EN__, hi: __FOOT_HI__ };

  function has(k) { return picked.indexOf(k) !== -1; }
  function toggle(k) {
    var i = picked.indexOf(k);
    if (i < 0) picked.push(k); else picked.splice(i, 1);
    renderBar(); syncChip(); syncOpt();
  }
  function waHref(msg) { return WA + "?text=" + encodeURIComponent(msg); }

  function renderBar() {
    el.pickedBox.innerHTML = picked.length
      ? picked.map(function (n) { return '<span class="p">\u2713 ' + n + "</span>"; }).join("")
      : '<span class="empty">' + T.empty + "</span>";
    el.selLabel.textContent = TX.ui.label;
    el.selClear.textContent = TX.ui.clear;
    el.selSend.textContent = TX.ui.send;
  }

  function chipSelected(name) {
    if (has(name)) return true;
    var prefix = name + " \u00b7 ";
    return picked.some(function (k) { return k.indexOf(prefix) === 0; });
  }

  function renderGroups() {
    el.groups.innerHTML = TX.groups.map(function (g) {
      var chips = g.chips.map(function (name) {
        var info = D[name];
        if (!info) return "";
        return '<button class="chip" type="button" aria-pressed="' + (chipSelected(name) ? "true" : "false") +
          '" data-chip="' + name + '"><span class="thumb"><img src="' + info.photo + '" alt="" loading="lazy" /></span>' +
          '<span class="txt"><span class="nm">' + name + '</span><span class="ds">' + (TX.desc[name] || "") + "</span></span>" +
          '<span class="tick">\u2713</span></button>';
      }).join("");
      return '<article class="group"><span class="group-no">' + g.no + "</span><h3>" + g.title + "</h3><p>" + g.sub +
        '</p><div class="chips">' + chips + "</div></article>";
    }).join("");
  }

  function syncChips() {
    el.groups.querySelectorAll(".chip").forEach(function (chip) {
      var name = chip.getAttribute("data-chip");
      var on = chipSelected(name);
      chip.setAttribute("aria-pressed", on ? "true" : "false");
      chip.setAttribute("aria-expanded", openChip === name ? "true" : "false");
    });
  }

  function syncChip() {
    if (!openChip) return;
    var on = has(openChip);
    el.add.textContent = on ? T.added : T.add;
    el.add.classList.toggle("on", on);
  }
  function syncOpt() {
    if (!openOption) return;
    var k = openOption.chip + " \u00b7 " + openOption.name;
    var on = has(k);
    el.optAdd.textContent = on ? T.added : T.addOpt;
    el.optAdd.classList.toggle("on", on);
  }

  function applyStatics() {
    el.eyebrow.textContent = TX.eyebrow;
    el.h1.innerHTML = TX.h1;
    el.intro.textContent = TX.intro;
    el.foot.innerHTML = FOOT[lang];
    el.brandsub.innerHTML = TEXT[lang].brandsub;
    el.headwa.innerHTML = TEXT[lang].headwa;
    el.labels.what.textContent = T.what;
    el.labels.why.textContent = T.why;
    el.labels.how.textContent = T.how;
    el.labels.ex.textContent = T.ex;
    el.labels.ex2.textContent = T.ex;
    el.labels.pick.textContent = T.pick;
    el.labels.howMade.textContent = T.howMade;
    el.labels.where.textContent = T.whereUsed;
    el.labels.note.textContent = T.note;
    el.labels.time.textContent = T.time;
    el.labels.colours.textContent = T.colours;
    el.labels.best.textContent = T.bestForLabel || T.bestFor;
    el.comesHead.textContent = T.comes;
    el.pairsHead.textContent = T.pairs;
  }

  function scrollTop() { if (card) card.scrollTop = 0; }

  function showChip(name) {
    var info = D[name];
    if (!info) return;
    openChip = name; openOption = null;
    viewOpt.hidden = true; viewChip.hidden = false;
    el.img.src = info.photo;
    el.img.alt = name;
    el.kicker.textContent = info.kicker;
    el.title.textContent = name;
    el.introC.textContent = info.intro;
    el.what.textContent = info.what || "";
    el.why.textContent = info.why || "";
    el.how.textContent = info.how || "";
    el.facts.innerHTML = (info.facts || []).map(function (f) {
      return '<div class="fact"><b>' + f[0] + "</b>" + f[1] + "</div>";
    }).join("");
    el.best.innerHTML = (info.bestFor || []).map(function (b) { return "<i>" + b + "</i>"; }).join("");
    var opts = info.options || {};
    var keys = Object.keys(opts);
    el.optsHead.textContent = keys.length ? T.opts : T.optsPlain;
    el.opts.className = keys.length ? "opt-grid" : "plain-list";
    el.opts.innerHTML = keys.length
      ? keys.map(function (k) {
          var im = (opts[k] && opts[k].img) || info.photo;
          return '<li><button class="opt-card" type="button" data-opt="' + k + '">' +
            '<span class="opt-thumb"><img src="' + im + '" alt="" loading="lazy" /></span>' + k +
            '<span class="arw">\u2192</span></button></li>';
        }).join("")
      : (info.includes || []).map(function (k) { return "<li>" + k + "</li>"; }).join("");
    el.mini.innerHTML = (info.gallery || []).map(function (g) {
      return '<img src="' + g + '" alt="" loading="lazy" />';
    }).join("");
    el.waChip.href = waHref(T.wa.replace("{name}", name));
    syncChip();
    openSheet();
    scrollTop();
  }

  function showOption(chipName, optName) {
    var info = (D[chipName] || {}).options || {};
    var o = info[optName];
    if (!o) return;
    openOption = { chip: chipName, name: optName };
    viewChip.hidden = true; viewOpt.hidden = false;
    el.optImg.src = o.img || D[chipName].photo;
    el.optImg.alt = chipName + " — " + optName;
    el.optBack.textContent = T.back.replace("{name}", chipName);
    el.optKicker.textContent = chipName;
    el.optTitle.textContent = optName;
    el.optWhat.textContent = o.what || "";
    el.optHow.textContent = o.how || "";
    el.optWhere.textContent = o.where || "";
    el.optNote.textContent = o.note || "";
    el.optPickText.textContent = o.pick || "";
    el.optPick.style.display = o.pick ? "block" : "none";
    el.optTime.textContent = o.time || "";
    el.optTimeImg.src = D[chipName].photo || o.img || "";
    el.optColours.textContent = o.colours || "";
    el.optPalette.innerHTML = (o.palette || []).map(function (p) {
      return '<span class="mini-chip"><img src="' + p.img + '" alt="" loading="lazy" />' +
        '<i class="pc-dot" style="background:' + p.c + '"></i>' + p.t + "</span>";
    }).join("");
    el.optBest.innerHTML = (o.best || []).map(function (b, i) {
      var im = ((o.bestPhotos || [])[i] || {}).img || "";
      return '<span class="mini-chip"><img src="' + im + '" alt="" loading="lazy" />' + b + "</span>";
    }).join("");
    el.optEx.innerHTML = (o.ex || []).map(function (g) {
      return '<img src="' + g + '" alt="" loading="lazy" />';
    }).join("");
    el.comesHead.textContent = T.comes;
    el.comesHead.style.display = (o.comes || []).length ? "block" : "none";
    el.optComes.innerHTML = (o.comes || []).map(function (c) { return "<li>" + c + "</li>"; }).join("");
    el.pairsHead.textContent = T.pairs;
    el.pairsHead.style.display = (o.pairs || []).length ? "block" : "none";
    el.optPairs.innerHTML = (o.pairs || []).map(function (n) {
      return D[n] ? '<button type="button" data-chip="' + n + '">' + n + " \u2192</button>"
                  : '<button type="button">' + n + "</button>";
    }).join("");
    el.optWa.href = waHref(T.waOpt.replace("{chip}", chipName).replace("{option}", optName));
    syncOpt();
    scrollTop();
  }

  function openSheet() { sheet.hidden = false; document.body.classList.add("locked"); }
  function closeSheet() {
    sheet.hidden = true; document.body.classList.remove("locked");
    viewChip.hidden = false; viewOpt.hidden = true; openOption = null;
  }

  function setLang(next) {
    lang = next;
    D = BCE[lang].data; T = BCE[lang].labels; TX = BCE[lang].text;
    document.documentElement.lang = lang === "hi" ? "hi" : "en";
    document.querySelectorAll(".langsw button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
    applyStatics();
    renderGroups();
    closeSheet();
    renderBar();
  }

  document.querySelectorAll(".langsw button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });

  el.groups.addEventListener("click", function (e) {
    var chip = e.target.closest ? e.target.closest("[data-chip]") : null;
    if (chip) showChip(chip.getAttribute("data-chip"));
  });
  el.opts.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-opt]") : null;
    if (btn && openChip) showOption(openChip, btn.getAttribute("data-opt"));
  });
  el.optPairs.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-chip]") : null;
    if (btn) showChip(btn.getAttribute("data-chip"));
  });
  el.optBack.addEventListener("click", function () { if (openOption) showChip(openOption.chip); });
  el.add.addEventListener("click", function () { if (openChip) toggle(openChip); });
  el.optAdd.addEventListener("click", function () {
    if (openOption) toggle(openOption.chip + " \u00b7 " + openOption.name);
  });
  el.selClear.addEventListener("click", function () {
    picked = []; renderBar(); syncChip(); syncOpt(); syncChips();
  });
  el.selSend.addEventListener("click", function () {
    if (!picked.length) { alert(T.empty); return; }
    window.open(waHref(TX.ui.waList.replace("{list}", picked.join(", "))), "_blank");
  });
  sheet.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", closeSheet); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (openOption) showChip(openOption.chip); else if (openChip) closeSheet();
  });

  setLang("en");
})();
"""


def extract(page: str, lang: str) -> dict:
    data = json.loads(re.search(r"window\.DECOR_DATA = (\{.*?\});\n", page, re.S).group(1))
    labels = json.loads(re.search(r"var T = (\{.*?\n\});", page, re.S).group(1))
    eyebrow = re.search(r'<span class="eyebrow"[^>]*>(.*?)</span>', page, re.S).group(1).strip()
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", page, re.S).group(1).strip()
    intro = re.search(r"</h1>\s*<p[^>]*>\s*(.*?)\s*</p>", page, re.S).group(1).strip()
    groups = []
    for gm in re.finditer(r'<article class="group">(.*?)</article>', page, re.S):
        body = gm.group(1)
        groups.append(
            {
                "no": re.search(r'<span class="group-no">(.*?)</span>', body).group(1),
                "title": htmllib.unescape(re.search(r"<h3>(.*?)</h3>", body).group(1)).strip(),
                "sub": htmllib.unescape(
                    re.search(r"<h3>.*?</h3>\s*<p>(.*?)</p>", body, re.S).group(1)
                ).strip(),
                "chips": [
                    htmllib.unescape(c).strip()
                    for c in re.findall(r'<span class="nm">([^<]*)</span>', body)
                ],
            }
        )
    desc = {}
    for m in re.finditer(
        r'<span class="txt"><span class="nm">([^<]*)</span><span class="ds">([^<]*)</span>', page
    ):
        desc[htmllib.unescape(m.group(1)).strip()] = htmllib.unescape(m.group(2)).strip()
    assert len(groups) == 3 and len(desc) == 25, f"{lang}: {len(groups)} groups, {len(desc)} descs"
    labels["bestForLabel"] = labels.get("bestForLabel") or "Best for"
    labels["waList"] = UI[lang]["waList"]
    return {
        "data": data,
        "labels": labels,
        "text": {"eyebrow": eyebrow, "h1": h1, "intro": intro, "groups": groups, "desc": desc,
                 "ui": UI[lang]},
    }


def main() -> int:
    OUT.mkdir(exist_ok=True)
    pages = {lang: clean((ROOT / cfg["src"]).read_text(encoding="utf-8"), lang)
             for lang, cfg in LANGS.items()}
    payload = {lang: extract(pages[lang], lang) for lang in pages}

    css = re.search(r"<style>(.*?)</style>", pages["en"], re.S).group(1) + SWITCH_CSS
    fonts = "\n    ".join(
        m.group(0) for m in re.finditer(r"<link[^>]*fonts\.(?:googleapis|gstatic)[^>]*>", pages["en"])
    )
    # footer line per language (kept short so it reads well in both)
    foot = {
        "en": "bespoke balloon &amp; floral decoration for weddings, birthdays, haldi, "
              "ring ceremonies, anniversaries and corporate evenings in Indore.",
        "hi": "Indore me wedding, birthday, haldi, ring ceremony, anniversary aur corporate "
              "evenings ke liye bespoke balloon aur floral decoration.",
    }

    script = (
        SCRIPT.replace("__WA__", WA)
        .replace("__FOOT_EN__", json.dumps(foot["en"]))
        .replace("__FOOT_HI__", json.dumps(foot["hi"]))
    )
    payload["en"]["text"]["foot"] = foot["en"]
    payload["hi"]["text"]["foot"] = foot["hi"]

    page = (
        "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\" />\n"
        '<meta name="viewport" content="width=device-width, initial-scale=1" />\n'
        f"<title>{TITLE}</title>\n"
        f'<meta name="description" content="{META}" />\n'
        f"    {fonts}\n<style>{css}</style>\n</head>\n<body>\n"
        + HEADER.replace("__WA__", WA)
        + SECTION.replace("__WA__", WA)
        + SHEET
        + "<script>window.BCE = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n"
        + script
        + "</script>\n  </body>\n</html>\n"
    )

    (OUT / DEST).write_text(page, encoding="utf-8")
    print(f"  {DEST}: {len(page) / 1024:.0f} KB (both languages, uses the img/ folder)")

    single = inline(page)
    (OUT / SINGLE).write_text(single, encoding="utf-8")
    print(f"  {SINGLE}: {len(single) / 1024 / 1024:.2f} MB (photos inside)")

    PUBLISH.mkdir(exist_ok=True)
    (PUBLISH / PUBLISH_NAME).write_text(single, encoding="utf-8")
    print(f"  drafts/{PUBLISH_NAME}: published copy for the phone link")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
