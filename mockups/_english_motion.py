"""Section-specific, theme-matched atmospheres for the English final.

Each surface owns clipped colour layers and its own animation timing.
One IntersectionObserver handles both one-time reveals and viewport pausing.
No fixed/global animated background, ribbons, particles or animation library.
"""
from __future__ import annotations

AMBIENT = ''  # Deliberately no page-wide animated layer.

TOGGLE = '''<button type="button" class="motion-toggle" aria-pressed="false" aria-label="Pause section animations" title="Pause section animations"><svg class="motion-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5.5 3v10M10.5 3v10" stroke="currentColor" stroke-width="1.3"/></svg><span>Motion on</span></button>'''


def decorate(text: str) -> str:
    """Keep each atmosphere physically inside the section it belongs to."""
    for original, replacement in [
        ('class="atelier-hero"', 'class="atelier-hero section-scope scene-hero"'),
        ('class="group" id="elements"', 'class="group section-scope scene-elements" id="elements"'),
        ('class="group" id="structures"', 'class="group section-scope scene-structures" id="structures"'),
        ('class="group" id="experiences"', 'class="group section-scope scene-experiences" id="experiences"'),
        ('class="inspiration-section wrap"', 'class="inspiration-section wrap section-scope scene-inspiration"'),
    ]:
        assert original in text, original
        text = text.replace(original, replacement, 1)
    import re
    layer = '<div class="section-atmosphere" aria-hidden="true"><span class="section-tone tone-one"></span><span class="section-tone tone-two"></span></div>'
    text, count = re.subn(r'<(?:section|article)\b[^>]*class="[^"]*section-scope[^"]*"[^>]*>', lambda m: m.group(0) + layer, text)
    assert count == 5, count
    return text


CSS = r'''
/* A quiet ivory canvas. Atmospheres are local, clipped and independently timed. */
body{background:#fcfaf5}
.section-scope{position:relative;isolation:isolate;overflow:hidden}
.section-atmosphere{position:absolute;inset:0;z-index:-1;pointer-events:none;overflow:hidden;border-radius:inherit;contain:strict}
.section-tone{position:absolute;inset:0;display:block;pointer-events:none;opacity:.3;animation:section-tone-breathe 18s ease-in-out infinite alternate}
/* 01: opening — broad champagne colour crossfade, only inside the hero. */
.scene-hero{background:#fbf5e8}
.scene-hero .tone-one{background:radial-gradient(ellipse at 82% 30%,#e7c78799,transparent 75%),linear-gradient(120deg,#fffaf0,#f5e5bf);animation:hero-champagne-fade 20s ease-in-out infinite}
.scene-hero .tone-two{background:linear-gradient(130deg,#fffdf600,#edcfb188);animation:hero-pearl-fade 20s ease-in-out infinite}
/* Collections receive generous frames, rather than one continuous page tint. */
.groups{gap:32px}
.group.section-scope{padding:28px;border:1px solid #e6d8c5;border-radius:14px;box-shadow:0 8px 32px #79623e06}
.group.section-scope .chapter-head{background:transparent;border:0;border-bottom:1px solid #dacaad;border-radius:0;min-height:210px;margin-bottom:24px}
.group.section-scope .chapter-heading{padding:18px 14px 28px;max-width:68%}
.group.section-scope .chapter-head h3{font-size:40px}
.group.section-scope .chapter-image{width:36%;border-radius:90px 4px 4px 4px;overflow:hidden;bottom:18px}
.group.section-scope .chapter-count{right:12px;bottom:30px}
.chip{background:#fffdf8e8;border-color:#e7ddcf}
.chip:hover{background:#fffefa}
/* 02: the elements — pearlescent ivory breathing behind the material cards. */
.scene-elements{background:#f8f6ed}
.scene-elements .tone-one{background:radial-gradient(ellipse at 12% 24%,#e6d8b2a3,transparent 62%);animation:elements-pearl-light 14s ease-in-out infinite alternate;animation-delay:-3s}
.scene-elements .tone-two{background:linear-gradient(115deg,#fffefbd9,transparent 68%);animation:elements-pearl-light 21s ease-in-out infinite alternate-reverse;animation-delay:-8s}
.scene-elements .chapter-image::after{background:linear-gradient(90deg,#f8f6ed,transparent 42%)}
/* 03: the settings — a warm blush/champagne crossfade, independent of the hero. */
.scene-structures{background:#f7ebe1}
.scene-structures .tone-one{background:linear-gradient(115deg,#efd0bb99,#fff3dc55);animation:settings-blush-fade 17s ease-in-out infinite alternate;animation-delay:-6s}
.scene-structures .tone-two{background:radial-gradient(ellipse at 80% 12%,#efce8b99,transparent 74%);animation:settings-blush-fade 23s ease-in-out infinite alternate-reverse;animation-delay:-11s}
.scene-structures .chapter-image::after{background:linear-gradient(90deg,#f7ebe1,transparent 42%)}
/* 04: the magic — a candlelit bronze/chocolate contrast within the same gold palette. */
.scene-experiences{background:#42372b;border-color:#65503a!important;box-shadow:0 16px 40px #49331e12!important}
.scene-experiences .tone-one{background:radial-gradient(ellipse at 92% 12%,#b88b4d80,transparent 72%);animation:magic-candlelight 10s ease-in-out infinite alternate;animation-delay:-2s}
.scene-experiences .tone-two{background:radial-gradient(ellipse at 2% 96%,#c19a5659,transparent 66%);animation:magic-candlelight 15s ease-in-out infinite alternate-reverse;animation-delay:-7s}
.scene-experiences .chapter-head{border-color:#b9955a50!important}
.scene-experiences .chapter-heading>span,.scene-experiences .chapter-no{color:#d8b982}
.scene-experiences .chapter-head h3{color:#fff7e7}
.scene-experiences .chapter-head h3 em{color:#e5c59a}
.scene-experiences .chapter-head p{color:#e0d2bc}
.scene-experiences .chapter-image::after{background:linear-gradient(90deg,#42372b,transparent 48%)}
.scene-experiences .chip{background:#fffaf0f5;border-color:#ebd8b6}
.scene-experiences .chip:hover{background:#fffdf7;border-color:#d7b56f}
/* 05: inspiration — a softer rose-gold atmosphere framing the photography. */
.inspiration-section.scene-inspiration{margin-top:76px;padding:44px 34px 34px;border-radius:16px;border:1px solid #e8d8c9;background:#fbf1e7}
.scene-inspiration .tone-one{background:radial-gradient(ellipse at 90% 20%,#dfb4a16b,transparent 70%);animation:inspiration-rose-fade 22s ease-in-out infinite alternate;animation-delay:-9s}
.scene-inspiration .tone-two{background:linear-gradient(135deg,#fff9e9aa,transparent 72%);animation:inspiration-rose-fade 27s ease-in-out infinite alternate-reverse;animation-delay:-15s}
.scene-inspiration .inspiration-head{margin-bottom:34px}
.scene-inspiration .mood-card{box-shadow:0 12px 30px #5a372215}
.atelier-process{margin-top:58px;padding-block:34px}
.atelier-signoff{padding-block:34px 40px}
.hero-copy>.motion-toggle{vertical-align:middle;margin-left:16px;font-size:8px;padding:8px 11px;min-height:32px}
.motion-toggle{display:inline-flex;align-items:center;justify-content:center;gap:7px;flex:none;padding:9px 12px;min-height:36px;border:1px solid var(--border);border-radius:20px;color:var(--gold);background:oklch(.995 .015 88 / .65);font:500 8px var(--font-sans);letter-spacing:.03em;cursor:pointer}
.motion-toggle:hover{background:var(--secondary);border-color:var(--gold)}
.motion-icon{width:11px;height:11px;flex:none}
.motion-toggle[aria-pressed="true"] .motion-icon{opacity:.45}
.motion-toggle:disabled{cursor:default}
html[data-motion="on"] .motion-reveal{opacity:0;transform:translate3d(0,18px,0);transition:opacity .8s ease,transform .95s cubic-bezier(.16,.7,.24,1);transition-delay:var(--reveal-delay,0ms)}
html[data-motion="on"] .motion-reveal.is-visible{opacity:1;transform:none}
html[data-motion="on"] .chip.motion-reveal.is-visible:hover{transform:translate3d(0,-4px,0)}
html:not([data-motion="on"]) .section-tone,html[data-motion-suspended] .section-tone,.section-scope:not([data-inview="true"]) .section-tone{animation-play-state:paused!important}
html[data-motion="off"] .motion-reveal{opacity:1;transform:none;transition:none}
html:not([data-motion]) .motion-toggle{display:none}
@keyframes section-tone-breathe{from{opacity:.2}to{opacity:.8}}
@keyframes hero-champagne-fade{0%,100%{opacity:.12}42%{opacity:.95}75%{opacity:.3}}
@keyframes hero-pearl-fade{0%,25%,100%{opacity:.05}70%{opacity:.65}}
@keyframes elements-pearl-light{from{opacity:.18}to{opacity:.88}}
@keyframes settings-blush-fade{from{opacity:.15}to{opacity:.85}}
@keyframes magic-candlelight{from{opacity:.25}to{opacity:.9}}
@keyframes inspiration-rose-fade{from{opacity:.15}to{opacity:.85}}
@media(max-width:1100px){.group.section-scope{padding:23px}.group.section-scope .chapter-head h3{font-size:35px}}
@media(max-width:760px){.group.section-scope{padding:19px;border-radius:12px}.group.section-scope .chapter-heading{padding:14px 6px 24px;max-width:77%}.group.section-scope .chapter-head{min-height:195px}.group.section-scope .chapter-head h3{font-size:32px}.group.section-scope .chapter-image{width:36%}.inspiration-section.scene-inspiration{padding:30px 23px 23px;margin-top:56px}.motion-toggle{font-size:7px;padding:7px 9px;min-height:32px}}
@media(max-width:520px){.group.section-scope{padding:15px}.group.section-scope .chapter-heading{max-width:90%;padding:10px 2px 22px}.group.section-scope .chapter-heading>span{font-size:6px;letter-spacing:.08em}.group.section-scope .chapter-head h3{font-size:32px;max-width:235px}.group.section-scope .chapter-head p{max-width:220px}.group.section-scope .chapter-image{opacity:.44;width:43%;border-radius:60px 3px 3px 3px}.group.section-scope .chapter-count{font-size:5px;right:1px;bottom:28px}.group.section-scope .chips{gap:9px}.group.section-scope .chip{padding:12px 10px}.inspiration-section.scene-inspiration{padding:28px 17px 18px;border-radius:12px}.scene-inspiration .inspiration-head h2{font-size:42px}.scene-experiences .chapter-head p{color:#e0d2bc}.groups{gap:24px}.scene-inspiration .mood-card{border-radius:130px 130px 4px 4px}}
@media(max-width:380px){.hero-copy>.motion-toggle{margin-left:10px}.motion-toggle{gap:4px;padding:7px}.group.section-scope{padding:12px}.group.section-scope .chip{padding:11px 9px}.group.section-scope .chapter-head h3{font-size:30px}}
@media(prefers-reduced-motion:reduce){.section-tone{animation:none!important;opacity:.25}html[data-motion] .motion-reveal{opacity:1;transform:none;transition:none}}
'''

SCRIPT = r'''
<script>
(function(){
  var root=document.documentElement;
  var toggle=document.querySelector('.motion-toggle');
  var preference=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
  var paused=false;
  try{paused=localStorage.getItem('bce-english-motion')==='off';}catch(e){}
  var observer=null;
  var targets=Array.from(document.querySelectorAll('.collection-intro,.collection-nav,.chapter-head,.chip,.inspiration-head,.mood-card,.atelier-process>div'));
  var scopes=Array.from(document.querySelectorAll('.section-scope'));
  function revealAll(){targets.forEach(function(el){el.classList.add('is-visible');});}
  function apply(){
    var reduced=!!(preference&&preference.matches);
    var off=paused||reduced;
    root.setAttribute('data-motion',off?'off':'on');
    if(toggle){
      toggle.setAttribute('aria-pressed',off?'true':'false');
      toggle.querySelector('span').textContent=off?'Motion off':'Motion on';
      toggle.setAttribute('aria-label',reduced?'Animations off — following your device setting':off?'Resume section animations':'Pause section animations');
      toggle.title=reduced?'Following your device’s reduced-motion preference':off?'Resume section animations':'Pause section animations';
      toggle.disabled=reduced;
    }
    if(off)revealAll();
  }
  if('IntersectionObserver' in window){
    observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.target.classList.contains('section-scope')){
          entry.target.setAttribute('data-inview',entry.isIntersecting?'true':'false');
        }else if(entry.isIntersecting){
          entry.target.classList.add('is-visible');observer.unobserve(entry.target);
        }
      });
    },{threshold:0.04,rootMargin:'0px 0px 40px 0px'});
    scopes.forEach(function(el){observer.observe(el);});
    if(!(preference&&preference.matches)&&!paused){
      targets.forEach(function(el){
        el.classList.add('motion-reveal');
        if(el.classList.contains('chip'))el.style.setProperty('--reveal-delay',(Array.from(el.parentElement.children).indexOf(el)%4)*45+'ms');
        observer.observe(el);
      });
    }else{revealAll();}
  }else{
    revealAll();scopes.forEach(function(el){el.setAttribute('data-inview','true');});
  }
  if(toggle)toggle.addEventListener('click',function(){
    paused=!paused;
    try{localStorage.setItem('bce-english-motion',paused?'off':'on');}catch(e){}
    apply();
  });
  if(preference){if(preference.addEventListener)preference.addEventListener('change',apply);else if(preference.addListener)preference.addListener(apply);}
  function visibility(){root.toggleAttribute('data-motion-suspended',document.hidden);}
  document.addEventListener('visibilitychange',visibility);
  window.addEventListener('pagehide',function(){if(observer)observer.disconnect();});
  window.addEventListener('pageshow',function(e){if(e.persisted){revealAll();if(observer)scopes.forEach(function(el){observer.observe(el);});visibility();}});
  apply();visibility();
})();
</script>
'''
