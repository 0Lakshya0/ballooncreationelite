"""Rebuild only the English final, leaving all Hindi/bilingual work untouched."""
from _build_final import ROOT, OUT, PUBLISH, LANGS, clean, inline
from _english_luxe import enhance

def main():
    cfg = LANGS['en']
    text = enhance(clean((ROOT / cfg['src']).read_text(encoding='utf-8'), 'en'))
    single = inline(text)
    OUT.mkdir(exist_ok=True)
    PUBLISH.mkdir(exist_ok=True)
    (OUT / cfg['dest']).write_text(text, encoding='utf-8')
    (OUT / cfg['single']).write_text(single, encoding='utf-8')
    (PUBLISH / cfg['publish']).write_text(single, encoding='utf-8')
    (ROOT / 'index.html').write_text(text, encoding='utf-8')
    (ROOT / 'final-english-showcase' / 'index.html').write_text(single, encoding='utf-8')
    print('English final rebuilt; Hindi/bilingual files untouched.')

if __name__ == '__main__':
    main()
