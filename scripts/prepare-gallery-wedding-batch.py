"""Prepare Wedding batch1 from retained originals. Preserve all previous references.
PYTHONPATH=.cache/photo-tools python3 scripts/prepare-gallery-wedding-batch.py
"""
from pathlib import Path
import hashlib
import json
from PIL import Image, ImageOps
root = Path(__file__).resolve().parent.parent
intake = root / 'photo-intake/gallery-wedding-batch-1'
manifest = json.loads((intake / 'selection.json').read_text())
output = root / 'src/assets/gallery-wedding-batch-1'
output.mkdir(parents=True, exist_ok=True)
# A resized/recompressed duplicate is not byte-identical. Verify both files and the image match.
for d in manifest.get('duplicates', []):
    a = intake / d['source']
    b = root / d['existingSource']
    assert hashlib.sha256(a.read_bytes()).hexdigest() == d['sha256']
    assert hashlib.sha256(b.read_bytes()).hexdigest() == d['existingSHA256']
    def dhash(path):
        im = ImageOps.exif_transpose(Image.open(path)).convert('L').resize((17, 16))
        return sum((im.getpixel((x,y)) > im.getpixel((x+1,y))) << (y*16+x) for y in range(16) for x in range(16))
    assert (dhash(a) ^ dhash(b)).bit_count() == d['detection']['hammingDistance'] == 0
imports = ['import type { GalleryMedia } from "./creation-gallery";']
entries = []
for i, p in enumerate(manifest['photos']):
    source = intake / p['source']
    assert hashlib.sha256(source.read_bytes()).hexdigest() == p['sha256']
    im = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    assert not p.get('crop'), 'Wedding sources retain the complete scene'
    if p.get('rotate'): im = im.rotate(p['rotate'], expand=True)
    im.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
    im.save(output / (p['id'] + '.webp'), 'WEBP', quality=82, method=6)
    imports.append(f'import photo{i} from "@/assets/gallery-wedding-batch-1/{p["id"]}.webp";')
    data = {k: p[k] for k in ['id', 'reference', 'title', 'occasion', 'group', 'detail', 'position', 'weddingPart']}
    data.update(kind='image', width=im.width, height=im.height)
    entries.append(json.dumps(data, ensure_ascii=False)[:-1] + f', "image": photo{i}' + '}')
(root / 'src/lib/gallery-wedding.ts').write_text('// Generated from retained Wedding intake. Supplied photos only.\n' + '\n'.join(imports) + '\nexport const galleryWeddingMedia: GalleryMedia[] = [\n' + ',\n'.join(entries) + '\n];\n')
print(f'Prepared {len(entries)} unique uploads; {sum(p.stat().st_size for p in output.glob("*.webp")):,} bytes')
