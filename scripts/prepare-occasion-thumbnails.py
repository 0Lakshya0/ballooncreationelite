"""Build small real-photo circle portraits from unchanged uploaded originals.
Run: PYTHONPATH=.cache/photo-tools python3 scripts/prepare-occasion-thumbnails.py
Requires Pillow. Explicit occasion/source mapping: circle-selection.json.
"""
import json
import sys
from pathlib import Path
from PIL import Image, ImageOps
ROOT = Path(__file__).resolve().parent.parent
intake = ROOT / 'photo-intake/homepage-real'
photos = {p['id']: p for p in json.loads((intake / 'selection.json').read_text())['photos']}
circle_selection = json.loads((intake / 'circle-selection.json').read_text())
photos.update({p['id']: p for p in circle_selection.get('additionalPhotos', [])})
matches = circle_selection['matches']
output = ROOT / 'src/assets/occasion-real'
output.mkdir(parents=True, exist_ok=True)
imports, rows = [], []
for i, (slug, photo_id) in enumerate(matches.items()):
    # --only-new adds a batch without re-encoding previously approved portraits.
    target = output / f'{slug}.webp'
    item = photos[photo_id]
    if '--only-new' not in sys.argv or not target.exists():
        image = ImageOps.exif_transpose(Image.open(intake / item['source'])).convert('RGB')
        if item.get('rotate'):
            image = image.rotate(item['rotate'], expand=True)
        # Square crop centres the decoration using the selected desktop focal point.
        centre = tuple(float(n.strip('%')) / 100 for n in item['desktop'].split())
        image = ImageOps.fit(image, (320, 320), Image.Resampling.LANCZOS, centering=centre)
        image.save(output / f'{slug}.webp', 'WEBP', quality=82, method=6)
    imports.append(f'import photo{i} from "@/assets/occasion-real/{slug}.webp";')
    rows.append(f'  "{slug}": photo{i},')
source = '''// Generated from circle-selection.json; originals remain unchanged.
import type { occasionEntries } from "./occasion-entries";
''' + '\n'.join(imports) + '''

type OccasionSlug = (typeof occasionEntries)[number]["slug"];
// All 19 existing occasion circles have an explicitly assigned supplied photo.
export const realOccasionPhotos: Record<OccasionSlug, string> = {
''' + '\n'.join(rows) + '\n};\n'
(ROOT / 'src/lib/occasion-photos.ts').write_text(source)
print(f'Prepared {len(matches)} square portraits; {sum(p.stat().st_size for p in output.glob("*.webp")):,} bytes')
