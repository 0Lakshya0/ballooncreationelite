"""Prepare birthday batch 1; preserve originals, rotate jungle 90deg CCW, omit duplicate.
PYTHONPATH=.cache/photo-tools python3 scripts/prepare-gallery-birthday-batch.py
"""
from pathlib import Path
import json
from PIL import Image, ImageOps
root=Path(__file__).resolve().parent.parent
intake=root/'photo-intake/gallery-birthday-batch-1'
rows=json.loads((intake/'selection.json').read_text())['photos']
output=root/'src/assets/gallery-birthday-batch-1'
output.mkdir(parents=True,exist_ok=True)
imports=['import type { GalleryMedia } from "./creation-gallery";']
entries=[]
for i,p in enumerate(rows):
 im=ImageOps.exif_transpose(Image.open(intake/p['source'])).convert('RGB')
 if p['rotate']: im=im.rotate(p['rotate'],expand=True)
 im.thumbnail((1600,1600),Image.Resampling.LANCZOS)
 im.save(output/(p['id']+'.webp'),'WEBP',quality=82,method=6)
 imports.append(f'import photo{i} from "@/assets/gallery-birthday-batch-1/{p["id"]}.webp";')
 data={k:p[k] for k in ['id','reference','title','occasion','detail','position']}
 data.update(kind='image',group='Birthdays',width=im.width,height=im.height)
 entries.append(json.dumps(data,ensure_ascii=False)[:-1]+f', "image": photo{i}'+'}')
(root/'src/lib/gallery-batches.ts').write_text('// Generated from retained birthday-batch intake. No generated images.\n'+'\n'.join(imports)+'\nexport const galleryBatchMedia: GalleryMedia[] = [\n'+',\n'.join(entries)+'\n];\n')
print(f'Prepared {len(rows)} unique uploads; {sum(p.stat().st_size for p in output.glob("*.webp")):,} bytes')
