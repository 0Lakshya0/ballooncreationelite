"""Prepare family batch2 (7 Baby Shower +2 Kids Birthday) from retained originals. Preserve all previous references.
PYTHONPATH=.cache/photo-tools python3 scripts/prepare-gallery-family-batch-2.py
"""
from pathlib import Path
import hashlib
import json
from PIL import Image, ImageOps
root = Path(__file__).resolve().parent.parent
intake = root / 'photo-intake/gallery-family-batch-2'
manifest = json.loads((intake / 'selection.json').read_text())
output = root / 'src/assets/gallery-family-batch-2'
output.mkdir(parents=True, exist_ok=True)
imports = ['import type { GalleryMedia } from "./creation-gallery";']
entries = []
for i, p in enumerate(manifest['photos']):
    source = intake / p['source']
    assert hashlib.sha256(source.read_bytes()).hexdigest() == p['sha256']
    im = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    if p.get('crop'): im = im.crop(tuple(p['crop']))
    if p.get('rotate'): im = im.rotate(p['rotate'], expand=True)
    im.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
    im.save(output / (p['id'] + '.webp'), 'WEBP', quality=82, method=6)
    imports.append(f'import photo{i} from "@/assets/gallery-family-batch-2/{p["id"]}.webp";')
    data = {k: p[k] for k in ['id', 'reference', 'title', 'occasion', 'group', 'detail', 'position']}
    data.update(kind='image', width=im.width, height=im.height)
    entries.append(json.dumps(data, ensure_ascii=False)[:-1] + f', "image": photo{i}' + '}')
(root / 'src/lib/gallery-family-batch-2.ts').write_text('// Generated from retained family batch2 intake. Supplied photos only.\n' + '\n'.join(imports) + '\nexport const galleryFamilyBatch2Media: GalleryMedia[] = [\n' + ',\n'.join(entries) + '\n];\n')
print(f'Prepared {len(entries)} unique uploads; {sum(p.stat().st_size for p in output.glob("*.webp")):,} bytes')
