#!/usr/bin/env python3
"""Build the "final look" version of the English decor-types page.

Takes the English draft, removes every trace of it being a draft (banner,
notes to the owner, the Option B/C/D comparison blocks, the demo wording) and
adds a real site header + footer, so it can be used on trial as-is.

It does NOT touch the real website — output goes to mockups/final/ and a copy
goes to drafts/ for the phone link.

Run from mockups/:
    python3 _build_final.py
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

SRC = ROOT / "decor-types-draft.html"
SINGLE = "decor-types-final-single.html"
NORMAL = "decor-types-final.html"

WA = "https://wa.me/917489863753"
TITLE = "Balloon Creation — Decor Types | Balloon &amp; Floral Decoration in Indore"
META = (
    "Balloon, floral, drape and light decoration for weddings, birthdays and every "
    "celebration in Indore — see every decor type we craft, what is inside it and examples."
)

HEADER = """    <header class="sitehead" id="top">
      <div class="wrap">
        <a class="brand" href="#top">Balloon Creation<small>Indore &middot; Balloon &amp; Floral Decor</small></a>
        <a class="head-wa" href="%s" target="_blank" rel="noreferrer">WhatsApp us &rarr;</a>
      </div>
    </header>
""" % WA

FOOTER = """      <footer class="sitefoot">
        <div class="wrap">
          <b>Balloon Creation</b> — bespoke balloon &amp; floral decoration for weddings, birthdays,
          haldi, ring ceremonies, anniversaries and corporate evenings in Indore.<br />
          Tell us your date and venue, and we will suggest the setups that suit your celebration.<br />
          <b>WhatsApp / Call:</b> <a href="%s" target="_blank" rel="noreferrer">+91 74898 63753</a>
        </div>
      </footer>
""" % WA

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


def clean(text: str) -> str:
    """Strip every draft / preview / owner-note trace, add real chrome."""

    # 1 — title & meta
    text = text.replace(
        "<title>DRAFT — Decor Types Section (Balloon Creation)</title>",
        f"<title>{TITLE}</title>\n    <meta name=\"description\" content=\"{META}\" />",
        1,
    )

    # 2 — the "this is not your live website" banner, before the page wrap
    i0 = text.index('<div class="banner">')
    i1 = text.index('<div class="wrap">\n      <!-- ================= OPTION A')
    text = text[:i0] + text[i1:]

    # 3 — "My note" box in the page head
    i0 = text.index('<div class="note" style="max-width: 360px; margin: 0">')
    i1 = text.index("</div>", i0) + len("</div>")
    text = text[:i0] + text[i1:]

    # 4 — notes written under the chip groups (for the owner, not for visitors)
    text = re.sub(r'\s*<p class="group-foot">.*?</p>', "", text, flags=re.S)

    # 5 — the "How to read this" note box
    i0 = text.index('<div class="note">\n          <span class="tag">How to read this</span>')
    i1 = text.index("</div>", i0) + len("</div>")
    text = text[:i0] + text[i1:]

    # 6 — the Option B / C / D comparison blocks and the closing question note
    i0 = text.index("<!-- ================= OPTION D")
    i1 = text.index('<div class="foot">')
    i1 = text.index("</div>", i1) + len("</div>")
    text = text[:i0] + text[i1:]

    # 7 — labels: drop the demo wording, keep a real message for the send button
    lines = text.split("\n")
    lines = [ln for ln in lines if not ln.strip().startswith('"demo":')]
    lines = [ln for ln in lines if not ln.strip().startswith('"demoEmpty":')]
    text = "\n".join(lines)
    i0 = text.index('"empty": "Nothing selected yet — click any chip to explore",')
    i0 = text.index("};", i0)
    text = (
        text[:i0]
        + '  "waList": "Hello Balloon Creation! I am looking for: {list}"\n'
        + text[i0:]
    )

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
    assert old_alert in text, "send-button anchor missing"
    text = text.replace(old_alert, new_send, 1)

    # 9a — the banner + note-box styles are unused now, drop them with their comments
    i0 = text.index("/* ---------- draft banner ---------- */")
    i1 = text.index("/* ---------- annotation ---------- */")
    i2 = text.index("\n", text.index("}", text.index(".note .tag", i1)))
    text = text[:i0] + text[i2 + 1:]

    # 9 — clear the section comments that name the removed option blocks
    text = re.sub(r"<!--\s*=+\s*OPTION [ABCD][^>]*?-->", "<!-- decor types -->", text)
    text = re.sub(r"/\* -+ OPTION [ABCD][^*]*\*/", "", text)

    # 10 — real header + footer + their styles
    text = text.replace("<style>", "<style>\n" + CHROME_CSS, 1)
    text = text.replace("<body>", "<body>\n" + HEADER, 1)
    text = text.replace("    <!-- detail sheet", FOOTER + "\n    <!-- detail sheet", 1)

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


def main() -> int:
    OUT.mkdir(exist_ok=True)
    text = clean(SRC.read_text(encoding="utf-8"))
    (OUT / NORMAL).write_text(text, encoding="utf-8")
    print(f"  {NORMAL}: {len(text) / 1024:.0f} KB (uses the img/ folder)")

    single = inline(text)
    (OUT / SINGLE).write_text(single, encoding="utf-8")
    size = (OUT / SINGLE).stat().st_size / 1024 / 1024
    print(f"  {SINGLE}: {size:.2f} MB (photos inside, works offline)")

    PUBLISH.mkdir(exist_ok=True)
    (PUBLISH / "final-english.html").write_text(single, encoding="utf-8")
    print("  drafts/final-english.html: published copy for the phone link")

    # the mockup preview serves mockups/ as its root, so "/" shows the final page
    (ROOT / "index.html").write_text(text, encoding="utf-8")
    print("  mockups/index.html: preview root = the final page (menu lives at menu.html)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
