#!/usr/bin/env python3
"""Build the site-ready package from the final page.

Outputs (into mockups/site-ready/):
  decorTypesData.ts     - all 25 chips + 150 options as typed data
  decor-types.css       - the section's styles, scoped under .bce-decor

The React component (DecorTypesSection.tsx) is hand-written next to them.

Run from mockups/:  python3 _build_site_ready.py
"""
from __future__ import annotations

import html as htmllib
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / "final" / "decor-types-final.html"
OUT = ROOT / "site-ready"
WRAPPER = ".bce-decor"
KEYFRAME_PREFIX = "dt-"

TYPES = '''// ── Decor Types section — data (auto-generated, do not edit by hand) ──
// Source: mockups/_build_site_ready.py

export const WA_HREF = "https://wa.me/917489863753";
export const WA_TEXT = "Hello Balloon Creation! I am looking for: ";

export type Palette = { t: string; c: string; img: string };
export type BestPhoto = { t: string; img: string };

export type ChipOption = {
  img: string;
  what: string;
  how: string;
  where: string;
  note: string;
  pick: string;
  time: string;
  colours: string;
  best: string[];
  bestPhotos: BestPhoto[];
  palette: Palette[];
  ex: string[];
  comes: string[];
  pairs: string[];
};

export type Chip = {
  desc: string;
  kicker: string;
  intro: string;
  photo: string;
  gallery: string[];
  what: string;
  why: string;
  how: string;
  facts: [string, string][];
  bestFor: string[];
  options: Record<string, ChipOption>;
};

export type ChipGroup = { no: string; title: string; sub: string; chips: string[] };

'''


def extract_data(html: str) -> dict:
    m = re.search(r"window\.DECOR_DATA = (\{.*?\});\n", html, re.S)
    assert m, "DECOR_DATA not found"
    return json.loads(m.group(1))


def chip_descriptions(html: str) -> dict[str, str]:
    """The one-line description shown under each chip name."""
    out = {}
    for m in re.finditer(
        r'<span class="txt"><span class="nm">([^<]*)</span><span class="ds">([^<]*)</span>', html
    ):
        out[htmllib.unescape(m.group(1)).strip()] = htmllib.unescape(m.group(2)).strip()
    return out


def extract_groups(html: str) -> list[dict]:
    groups = []
    for gm in re.finditer(r'<article class="group">(.*?)</article>', html, re.S):
        body = gm.group(1)
        no = re.search(r'<span class="group-no">(.*?)</span>', body).group(1)
        title = htmllib.unescape(re.search(r"<h3>(.*?)</h3>", body).group(1))
        sub = htmllib.unescape(re.search(r"<h3>.*?</h3>\s*<p>(.*?)</p>", body, re.S).group(1))
        chips = [htmllib.unescape(c) for c in re.findall(r'<span class="nm">([^<]*)</span>', body)]
        groups.append({"no": no, "title": title, "sub": sub, "chips": chips})
    assert len(groups) == 3, f"expected 3 groups, got {len(groups)}"
    return groups


def extract_css(html: str) -> str:
    m = re.search(r"<style>(.*?)</style>", html, re.S)
    assert m, "style block not found"
    return m.group(1)


def prefix_selectors(selector_list: str) -> str:
    parts = []
    for raw in selector_list.split(","):
        sel = raw.strip()
        if not sel:
            continue
        if re.match(r"^(from|to|\d+%)$", sel):  # inside keyframes
            parts.append(sel)
        elif sel.startswith(":root"):
            parts.append(WRAPPER + sel[len(":root"):])
        elif sel.startswith("body.locked"):
            parts.append("__DROP__")
        else:
            parts.append(f"{WRAPPER} {sel}")
    return ", ".join(parts)


def scope_css(css: str) -> str:
    # keyframes: rename and update their references
    names = re.findall(r"@keyframes\s+([A-Za-z_][\w-]*)", css)
    for n in names:
        css = re.sub(r"@keyframes\s+" + re.escape(n) + r"\b", f"@keyframes {KEYFRAME_PREFIX}{n}", css)
        css = re.sub(
            r"(animation(?:-name)?\s*:[^;}]*?)\b" + re.escape(n) + r"\b",
            lambda m: m.group(1) + KEYFRAME_PREFIX + n,
            css,
        )

    out: list[str] = []
    depth = 0
    kf_body_depth: int | None = None
    for line in css.split("\n"):
        stripped = line.strip()
        if kf_body_depth is None and stripped.startswith("@keyframes"):
            kf_body_depth = depth + 1
        elif kf_body_depth is not None and depth < kf_body_depth:
            kf_body_depth = None

        if kf_body_depth is None and "{" in line:
            head, _, tail = line.partition("{")
            if head.strip() and not head.strip().startswith("@"):
                prefixed = prefix_selectors(head.strip())
                if prefixed == "__DROP__":
                    depth += stripped.count("{") - stripped.count("}")
                    continue
                line = head.replace(head.strip(), prefixed) + "{" + tail

        out.append(line)
        depth += stripped.count("{") - stripped.count("}")
    return "\n".join(out)


def main() -> int:
    html = SRC.read_text(encoding="utf-8")
    data = extract_data(html)
    groups = extract_groups(html)
    descs = chip_descriptions(html)

    # the chip's one-liner lives in the markup, fold it into the data
    for name, chip in data.items():
        chip["desc"] = descs.get(name.replace("&amp;", "&"), descs.get(name, ""))
    missing = [n for n, c in data.items() if not c["desc"]]
    if missing:
        print("  ! chips without a description:", missing)
    group_chips = [name for g in groups for name in g["chips"]]
    unknown = [name for name in group_chips if name not in data]
    assert not unknown, f"group chips missing from the data: {unknown}"
    assert len(group_chips) == 25, f"expected 25 chips in the groups, got {len(group_chips)}"
    print(f"  groups: {[len(g['chips']) for g in groups]} chips, all found in the data")

    OUT.mkdir(exist_ok=True)
    data_ts = (
        TYPES
        + "export const CHIP_GROUPS: ChipGroup[] = "
        + json.dumps(groups, ensure_ascii=False, indent=2)
        + ";\n\n"
        + "export const DECOR_DATA: Record<string, Chip> = "
        + json.dumps(data, ensure_ascii=False, indent=2)
        + ";\n"
    )
    (OUT / "decorTypesData.ts").write_text(data_ts, encoding="utf-8")
    print(f"  decorTypesData.ts: {len(data)} chips, "
          f"{sum(len(c['options']) for c in data.values())} options, {len(data_ts) / 1024:.0f} KB")

    css = scope_css(extract_css(html))
    (OUT / "decor-types.css").write_text(css.strip() + "\n", encoding="utf-8")
    print(f"  decor-types.css: {len(css) / 1024:.0f} KB, scoped under {WRAPPER}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
