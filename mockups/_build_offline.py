#!/usr/bin/env python3
"""Build single-file, offline copies of both drafts.

Each photo is embedded once as a data URI in a lookup table; the page then
resolves its images from that table. Result: one HTML file that works on any
phone with no server, no internet and no image folder.

Run from mockups/:  python3 _build_offline.py
"""
from __future__ import annotations

import base64
import io
import json
import pathlib
import re

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / "offline"

WIDTH = 420
QUALITY = 68


def data_uri(name: str) -> str:
    path = ROOT / "img" / name
    image = Image.open(path).convert("RGB")
    if image.width > WIDTH:
        image = image.resize((WIDTH, round(image.height * WIDTH / image.width)), Image.LANCZOS)
    buf = io.BytesIO()
    image.save(buf, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


def build(src: str, dest: str, note: str) -> None:
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

    (OUT / dest).write_text(text, encoding="utf-8")
    size = (OUT / dest).stat().st_size / 1024 / 1024
    print(f"  {dest}: {len(files)} photos embedded once, {size:.2f} MB")


def main() -> int:
    OUT.mkdir(exist_ok=True)
    print("building offline single-file copies:")
    build(
        "decor-types-draft.html",
        "decor-types-draft-offline.html",
        "OFFLINE COPY &mdash; ek hi file, photos andar. Internet ki zaroorat nahi.",
    )
    build(
        "decor-types-draft-hinglish.html",
        "decor-types-draft-offline-hinglish.html",
        "OFFLINE COPY &mdash; ek hi file, photos andar. Internet ki zaroorat nahi.",
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
