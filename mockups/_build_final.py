#!/usr/bin/env python3
"""Build the "final look" pages from the drafts — English and Hinglish.

Removes every trace of a draft (banner, notes to the owner, the Option B/C/D
comparison blocks, the demo wording) and adds a real site header + footer.

Outputs (mockups/final/):
  decor-types-final.html             (EN, uses the img/ folder)
  decor-types-final-single.html      (EN, photos inside — offline)
  decor-types-final-hinglish.html    (HI, uses the img/ folder)
  decor-types-final-hinglish-single.html
And a copy of each single file in drafts/ for the phone links.

mockups/index.html (the preview root) is set to the English final page.

Run from mockups/:  python3 _build_final.py
"""
from __future__ import annotations

import base64
import functools
import io
import json
import pathlib
import re

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / "final"
PUBLISH = ROOT.parent / "drafts"

WA = "https://wa.me/917489863753"

LANGS = {
    "en": {
        "src": "decor-types-draft.html",
        "dest": "decor-types-final.html",
        "single": "decor-types-final-single.html",
        "publish": "final-english.html",
        "title": "Balloon Creation — Decor Types | Balloon &amp; Floral Decoration in Indore",
        "meta": (
            "Balloon, floral, drape and light decoration for weddings, birthdays and every "
            "celebration in Indore — see every decor type we craft, what is inside it and examples."
        ),
        "head_wa": "WhatsApp us &rarr;",
        "how_to_read": "How to read this",
        "footer": (
            "<b>Balloon Creation</b> — bespoke balloon &amp; floral decoration for weddings, birthdays,\n"
            "          haldi, ring ceremonies, anniversaries and corporate evenings in Indore.<br />\n"
            "          Tell us your date and venue, and we will suggest the setups that suit your celebration.<br />\n"
            "          <b>WhatsApp / Call:</b> <a href=\"%s\" target=\"_blank\" rel=\"noreferrer\">+91 74898 63753</a>"
        ),
    },
    "hi": {
        "src": "decor-types-draft-hinglish.html",
        "dest": "decor-types-final-hinglish.html",
        "single": "decor-types-final-hinglish-single.html",
        "publish": "final-hinglish.html",
        "title": "Balloon Creation — Decor Types | Indore me balloon aur floral decoration",
        "meta": (
            "Shaadi, birthday aur har celebration ke liye balloon, floral, drape aur light decoration "
            "in Indore — har decor type, uske andar kya milta hai, aur examples."
        ),
        "head_wa": "WhatsApp karo &rarr;",
        "how_to_read": "Ise kaise padho",
        "footer": (
            "<b>Balloon Creation</b> — Indore me wedding, birthday, haldi, ring ceremony, anniversary\n"
            "          aur corporate evenings ke liye bespoke balloon aur floral decoration.<br />\n"
            "          Apni date aur venue bata do, hum uske hisaab se setups suggest kar denge.<br />\n"
            "          <b>WhatsApp / Call:</b> <a href=\"%s\" target=\"_blank\" rel=\"noreferrer\">+91 74898 63753</a>"
        ),
    },
}

HEADER = """    <header class="sitehead" id="top">
      <div class="wrap">
        <a class="brand" href="#top">Balloon Creation<small>{sub}</small></a>
        <a class="head-wa" href="{wa}" target="_blank" rel="noreferrer">{label}</a>
      </div>
    </header>
"""

CHROME_CSS = """      /* ---------- site header & footer ---------- */
      .sitehead { position: sticky; top: 0; z-index: 30; background: oklch(0.992 0.014 88 / 0.93); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
      .sitehead .wrap { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 12px 0; }
      .brand { display: block; text-decoration: none; color: var(--foreground); font-family: var(--font-display); font-size: 25px; line-height: 1.05; letter-spacing: 0.01em; }
      .brand small { display: block; margin-top: 4px; font-family: var(--font-sans); font-size: 9.5px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); }
      .head-wa { flex: none; font-family: var(--font-sans); font-size: 11.5px; font-weight: 600; text-decoration: none; color: oklch(0.27 0.03 65); background: linear-gradient(115deg, oklch(0.89 0.085 88), oklch(0.8 0.09 72) 45%, oklch(0.92 0.075 87)); border: 1px solid oklch(0.82 0.08 82 / 0.48); border-radius: 3px; padding: 10px 16px; white-space: nowrap; }
      .head-wa:hover { filter: brightness(1.04); }
      .sitefoot { margin-top: 46px; padding: 28px 0 104px; border-top: 1px solid var(--border); font-family: var(--font-sans); font-size: 13px; line-height: 1.95; color: var(--muted-foreground); }
      .sitefoot b { color: var(--foreground); }
      .sitefoot a { color: var(--gold); text-decoration: none; font-weight: 600; }
      @media (max-width: 560px) {
        .sitehead .wrap { padding: 10px 0; }
        .brand { font-size: 21px; }
        .brand small { font-size: 9px; letter-spacing: 0.12em; }
        .head-wa { font-size: 11px; padding: 9px 12px; }
      }

"""


def clean(text: str, lang: str) -> str:
    """Strip every draft / preview / owner-note trace, add real chrome."""
    cfg = LANGS[lang]

    # 1 — title & meta
    text = re.sub(
        r"<title>[^<]*</title>",
        f"<title>{cfg['title']}</title>\n    <meta name=\"description\" content=\"{cfg['meta']}\" />",
        text,
        count=1,
    )

    # 2 — the "not your live website" banner, before the page wrap
    i0 = text.index('<div class="banner">')
    i1 = text.index('<div class="wrap">\n      <!-- ================= OPTION A')
    text = text[:i0] + text[i1:]

    # 3 — the owner's note box in the page head
    i0 = text.index('<div class="note" style="max-width: 360px; margin: 0">')
    i1 = text.index("</div>", i0) + len("</div>")
    text = text[:i0] + text[i1:]

    # 4 — notes written under the chip groups
    text = re.sub(r'\s*<p class="group-foot">.*?</p>', "", text, flags=re.S)

    # 5 — the "how to read this" note box
    tag = cfg["how_to_read"]
    i0 = text.index(f'<span class="tag">{tag}</span>')
    i0 = text.rindex('<div class="note">', 0, i0)
    i1 = text.index("</div>", i0) + len("</div>")
    text = text[:i0] + text[i1:]

    # 6 — the Option B / C / D comparison blocks and the closing question note
    i0 = text.index("<!-- ================= OPTION D")
    i1 = text.index('<div class="foot">')
    i1 = text.index("</div>", i1) + len("</div>")
    text = text[:i0] + text[i1:]

    # 7 — labels: drop the demo wording, add a real message for the send button
    text = "\n".join(
        ln for ln in text.split("\n") if not ln.strip().startswith(('"demo":', '"demoEmpty":'))
    )
    i0 = text.index('"empty":')
    i0 = text.index("};", i0)
    text = text[:i0] + '  "waList": "Hello Balloon Creation! I am looking for: {list}"\n' + text[i0:]

    # 8 — the send button really opens WhatsApp with the picked list
    old_alert = (
        "      var list = Array.from(picked.keys());\n"
        "      alert(list.length ? T.demo.replace('{list}', list.join(', ')) : T.demoEmpty);"
    )
    new_send = (
        "      var list = Array.from(picked.keys());\n"
        "      if (!list.length) { alert(T.empty); return; }\n"
        "      var msg = T.waList.replace('{list}', list.join(', '));\n"
        "      window.open('" + WA + "?text=' + encodeURIComponent(msg), '_blank');"
    )
    assert old_alert in text, f"send-button anchor missing ({lang})"
    text = text.replace(old_alert, new_send, 1)

    # 9a — the banner + note styles are unused now
    i0 = text.index("/* ---------- draft banner ---------- */")
    i1 = text.index("/* ---------- annotation ---------- */")
    i2 = text.index("\n", text.index("}", text.index(".note .tag", i1)))
    text = text[:i0] + text[i2 + 1 :]

    # 9 — clear the comments naming the removed option blocks
    text = re.sub(r"<!--\s*=+\s*OPTION [ABCD][^>]*?-->", "<!-- decor types -->", text)
    text = re.sub(r"/\* -+ OPTION [ABCD][^*]*\*/", "", text)

    # 10 — real header + footer + their styles
    text = text.replace("<style>", "<style>\n" + CHROME_CSS, 1)
    header = HEADER.format(
        sub="Indore &middot; Balloon &amp; Floral Decor",
        wa=WA,
        label=cfg["head_wa"],
    )
    text = text.replace("<body>", "<body>\n" + header, 1)
    text = text.replace("    <!-- detail sheet", "      <footer class=\"sitefoot\">\n        <div class=\"wrap\">\n          " + (cfg["footer"] % WA) + "\n        </div>\n      </footer>\n\n    <!-- detail sheet", 1)

    # 11 — the word "breeze", never "draft"
    text = text.replace("a strong draft near the doors", "a strong breeze near the doors")

    return text


# ───────────────────────── single-file copy ─────────────────────────
WIDTH, QUALITY = 420, 68


@functools.lru_cache(maxsize=None)
def data_uri(name: str) -> str:
    path = ROOT / "img" / name
    image = Image.open(path).convert("RGB")
    if image.width > WIDTH:
        image = image.resize((WIDTH, round(image.height * WIDTH / image.width)), Image.LANCZOS)
    buf = io.BytesIO()
    image.save(buf, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


def inline(text: str) -> str:
    """Embed every photo once, so the page works on a phone with no server."""
    files = sorted(set(re.findall(r"img/([a-z0-9-]+\.jpg)", text)))
    text = re.sub(r'src="img/([a-z0-9-]+\.jpg)"', r'data-img="\1"', text)
    table = {f"img/{name}": data_uri(name) for name in files}
    fixer = (
        "<script>\nwindow.OFFLINE_IMG=" + json.dumps(table, separators=(",", ":")) + ";\n"
        "(function(){var M=window.OFFLINE_IMG;"
        "function fix(p){return (typeof p==='string'&&M[p])?M[p]:p;}"
        "var D=window.DECOR_DATA||{};"
        "for(var k in D){var e=D[k];"
        "if(e.photo)e.photo=fix(e.photo);"
        "if(e.gallery)e.gallery=e.gallery.map(fix);"
        "var ops=e.options||{};"
        "for(var o in ops){var x=ops[o];if(x.img)x.img=fix(x.img);"
        "if(x.palette)x.palette.forEach(function(y){y.img=fix(y.img);});"
        "if(x.bestPhotos)x.bestPhotos.forEach(function(y){y.img=fix(y.img);});"
        "if(x.ex)x.ex=x.ex.map(fix);}}"
        "document.querySelectorAll('img[data-img]').forEach(function(im){"
        "im.src=fix('img/'+im.getAttribute('data-img'));});"
        "})();\n</script>"
    )
    return text.replace("</body>", fixer + "\n  </body>", 1)


def update_menu() -> None:
    """The review menu keeps a card for every final page."""
    menu = ROOT / "menu.html"
    if not menu.exists():
        return
    text = menu.read_text(encoding="utf-8")
    if "final/decor-types-final-both.html" in text:
        return
    card = ('''        <a class="card" href="/final/decor-types-final-both.html">
          <span class="tag">Both languages</span>
          <h2>Final page &mdash; English + Hinglish</h2>
          <span class="txt">Ek hi page, header me language switch &mdash; English aur Hinglish dono.</span>
          <span class="open">OPEN COMBINED PAGE &rarr;</span>
        </a>
''')
    anchor = '        <a class="card" href="/final/decor-types-final.html">'
    if anchor in text:
        text = text.replace(anchor, card + anchor, 1)
        menu.write_text(text, encoding="utf-8")
        print("  menu.html: combined page card added")


def main() -> int:
    OUT.mkdir(exist_ok=True)
    for lang, cfg in LANGS.items():
        text = clean((ROOT / cfg["src"]).read_text(encoding="utf-8"), lang)
        (OUT / cfg["dest"]).write_text(text, encoding="utf-8")
        print(f"  {cfg['dest']}: {len(text) / 1024:.0f} KB (uses the img/ folder)")

        single = inline(text)
        (OUT / cfg["single"]).write_text(single, encoding="utf-8")
        print(f"  {cfg['single']}: {len(single) / 1024 / 1024:.2f} MB (photos inside)")

        PUBLISH.mkdir(exist_ok=True)
        (PUBLISH / cfg["publish"]).write_text(single, encoding="utf-8")
        print(f"  drafts/{cfg['publish']}: published copy for the phone link")

    # the mockup preview serves mockups/ as its root, so "/" shows the English final page
    (ROOT / "index.html").write_text((OUT / LANGS["en"]["dest"]).read_text(encoding="utf-8"), encoding="utf-8")
    print("  mockups/index.html: preview root = the English final page")
    update_menu()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
