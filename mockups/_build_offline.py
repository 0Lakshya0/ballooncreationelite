#!/usr/bin/env python3
"""Build single-file copies of both drafts.

Each photo is embedded once as a data URI in a lookup table; the page then
resolves its images from that table. Result: one HTML file that works on any
phone with no server, no internet and no image folder.

Run from mockups/:
    python3 _build_offline.py              -> offline/ (phone hand-off copies)
    python3 _build_offline.py --publish    -> /home/user/drafts-site/ (public
                                              repo that GitHub Pages serves)
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
OUT = ROOT / "offline"
PUBLISH_DIR = pathlib.Path("/home/user/drafts-site")

WIDTH = 420
QUALITY = 68

OFFLINE_NOTE = "OFFLINE COPY &mdash; ek hi file, photos andar. Internet ki zaroorat nahi."

PUBLISH_NOTE = {
    "decor-types-draft.html": "DRAFT PREVIEW &mdash; Balloon Creation Elite",
    "decor-types-draft-hinglish.html": "DRAFT PREVIEW &mdash; Balloon Creation Elite (Hinglish)",
}


@functools.lru_cache(maxsize=None)
def data_uri(name: str) -> str:
    path = ROOT / "img" / name
    image = Image.open(path).convert("RGB")
    if image.width > WIDTH:
        image = image.resize((WIDTH, round(image.height * WIDTH / image.width)), Image.LANCZOS)
    buf = io.BytesIO()
    image.save(buf, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


def build(src: str, dest: str, note: str, out_dir: pathlib.Path = OUT) -> None:
    text = (ROOT / src).read_text(encoding="utf-8")

    # which photos does this page use?
    files = sorted(set(re.findall(r"img/([a-z0-9-]+\.jpg)", text)))

    # 1. static markup: leave a marker instead of the path (no src = no broken icon)
    text = re.sub(r'src="img/([a-z0-9-]+\.jpg)"', r'data-img="\1"', text)

    # 2. runtime data: DECOR_DATA still points at "img/x.jpg"; the lookup fixes it
    table = {f"img/{name}": data_uri(name) for name in files}
    payload = json.dumps(table, separators=(",", ":"))

    fixer = (
        "<script>\n"
        "window.OFFLINE_IMG=" + payload + ";\n"
        "(function(){var M=window.OFFLINE_IMG;"
        "function fix(p){return (typeof p==='string'&&M[p])?M[p]:p;}"
        "var D=window.DECOR_DATA||{};"
        "for(var k in D){var e=D[k];"
        "if(e.photo)e.photo=fix(e.photo);"
        "if(e.gallery)e.gallery=e.gallery.map(fix);"
        "var ops=e.options||{};"
        "for(var o in ops){if(ops[o].img)ops[o].img=fix(ops[o].img);}}"
        "document.querySelectorAll('img[data-img]').forEach(function(im){"
        "im.src=fix('img/'+im.getAttribute('data-img'));});"
        "})();\n"
        "</script>"
    )
    text = text.replace("</body>", fixer + "\n  </body>", 1)

    banner = (
        '<div style="background:oklch(.42 .05 65);color:oklch(.97 .02 88);padding:10px 0;'
        'font-family:Manrope,sans-serif;font-size:12px;text-align:center">'
        f"{note}</div>"
    )
    text = text.replace("<body>", "<body>" + banner, 1)

    (out_dir / dest).write_text(text, encoding="utf-8")
    size = (out_dir / dest).stat().st_size / 1024 / 1024
    print(f"  {dest}: {len(files)} photos embedded once, {size:.2f} MB")


INDEX_HTML = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Balloon Creation Elite &mdash; Decor Type Drafts</title>
<meta name="description" content="Draft preview of the Decor Types section - 25 decor types, 102 options, each with its full detail.">
<style>
  :root{--ink:#463426;--cream:#fffcf6;--line:#e2d2ba;--muted:#96735b}
  *{box-sizing:border-box}
  body{margin:0;background:var(--cream);color:var(--ink);font-family:Manrope,system-ui,-apple-system,"Segoe UI",sans-serif;display:flex;justify-content:center;padding:40px 20px 64px}
  .wrap{width:100%;max-width:720px}
  h1{font-size:26px;margin:0 0 6px;letter-spacing:.2px}
  p.sub{margin:0 0 28px;color:var(--muted);font-size:15px;line-height:1.55}
  a.card{display:block;text-decoration:none;color:inherit;border:2px solid var(--line);border-radius:18px;padding:22px 24px;margin-bottom:16px;background:#fff;transition:.18s}
  a.card:hover{border-color:#c9a97e;transform:translateY(-2px)}
  a.card b{display:block;font-size:19px;margin-bottom:4px}
  a.card span{display:block;color:var(--muted);font-size:14px;line-height:1.5}
  .tag{display:block;margin-top:10px;font-size:12px;letter-spacing:.6px;text-transform:uppercase;color:#8a6a44}
  footer{margin-top:28px;color:var(--muted);font-size:13px;line-height:1.6}
</style>
</head>
<body>
<div class="wrap">
  <h1>Balloon Creation Elite</h1>
  <p class="sub">Draft preview of the &ldquo;Decor Types&rdquo; section &mdash; every chip opens its full detail, and every option inside opens its own detail too. Photos are inside the files, so they work offline as well.</p>
  <a class="card" href="draft-english.html">
    <b>English draft</b>
    <span>25 decor types &middot; 102 options with full detail &middot; ready to share with clients</span>
    <span class="tag">Open English</span>
  </a>
  <a class="card" href="draft-hinglish.html">
    <b>Hinglish draft</b>
    <span>Same content, simple Hindi + English wording</span>
    <span class="tag">Open Hinglish</span>
  </a>
  <footer>Works on any phone or computer, no login needed. Keep this link &mdash; these are drafts, not the live website.</footer>
</div>
</body>
</html>
"""

README_MD = """# Balloon Creation Elite - Decor Types drafts

Preview drafts of the "Decor Types" section: 25 decor types and 102 options, where every
chip and every option opens with its full detail.

- English draft -> `draft-english.html`
- Hinglish draft -> `draft-hinglish.html`

Both pages are **single-file**: every photo is embedded in the HTML, so they open on any
phone with no internet, no extra folders and no login.

These are drafts for review - this repo is not the live website.

Regenerate (in the main project):

```bash
cd mockups && python3 _build_offline.py --publish
```
"""


def main() -> int:
    import sys

    if "--publish" in sys.argv:
        positional = [a for a in sys.argv[1:] if not a.startswith("-")]
        out = pathlib.Path(positional[0]) if positional else PUBLISH_DIR
        out.mkdir(parents=True, exist_ok=True)
        print(f"building public drafts site in {out}:")
        build("decor-types-draft.html", "draft-english.html", PUBLISH_NOTE["decor-types-draft.html"], out)
        build(
            "decor-types-draft-hinglish.html",
            "draft-hinglish.html",
            PUBLISH_NOTE["decor-types-draft-hinglish.html"],
            out,
        )
        (out / "index.html").write_text(INDEX_HTML, encoding="utf-8")
        (out / "README.md").write_text(README_MD, encoding="utf-8")
        (out / ".nojekyll").write_text("", encoding="utf-8")
        print("  index.html + README.md + .nojekyll written")
        return 0

    OUT.mkdir(exist_ok=True)
    print("building offline single-file copies:")
    build("decor-types-draft.html", "decor-types-draft-offline.html", OFFLINE_NOTE)
    build("decor-types-draft-hinglish.html", "decor-types-draft-offline-hinglish.html", OFFLINE_NOTE)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
