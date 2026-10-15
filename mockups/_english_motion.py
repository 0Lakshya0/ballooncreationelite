"""English-only colour crossfade, pause preferences and one-shot scroll reveals.

The background cycles through theme-approved cream, champagne and rose-gold.
Only two full-screen layer opacities animate; text, photos and controls keep
stable colours. No ribbons, floating particles, moving halos or photo loops.
"""

AMBIENT = '''
<div class="atelier-ambient colour-atmosphere" aria-hidden="true">
  <span class="colour-base"></span>
  <span class="colour-layer colour-champagne"></span>
  <span class="colour-layer colour-rose"></span>
</div>
'''

TOGGLE = '''<button type="button" class="motion-toggle" aria-pressed="false" aria-label="Pause background colour animation" title="Pause background colour animation"><svg class="motion-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5.5 3v10M10.5 3v10" stroke="currentColor" stroke-width="1.3"/></svg><span>Motion on</span></button>'''

CSS = r'''
/* Theme-colour fade only: a continuous 24-second cream → gold → rose → cream cycle. */
body{isolation:isolate;background:var(--background)}
.atelier-ambient{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;contain:strict}
.colour-base,.colour-layer{position:absolute;inset:0;display:block;pointer-events:none}
.colour-base{background:linear-gradient(135deg,#fffdf5 5%,#fbf3df 65%,#fffaf0)}
.colour-layer{opacity:0;animation-duration:24s;animation-timing-function:ease-in-out;animation-iteration-count:infinite}
.colour-champagne{background:radial-gradient(ellipse at 80% 18%,#edce91bb,transparent 70%),linear-gradient(125deg,#f8e8bd,#fff5dc);animation-name:atelier-champagne-fade}
.colour-rose{background:radial-gradient(ellipse at 75% 28%,#e6bdac77,transparent 75%),linear-gradient(135deg,#f9e8d9,#efd3c3 65%,#fbefdf);animation-name:atelier-rose-fade}
/* Transparent surfaces let the fade show throughout the page, not behind an opaque hero. */
.atelier-hero{background:transparent}
.chapter-head{background:oklch(.955 .035 85 / .7)}
.chapter-image::after{background:linear-gradient(90deg,oklch(.955 .035 85 / .85),transparent 38%)}
.hero-copy>.motion-toggle{vertical-align:middle;margin-left:16px;font-size:8px;padding:8px 11px;min-height:32px}
.motion-toggle{display:inline-flex;align-items:center;justify-content:center;gap:7px;flex:none;padding:9px 12px;min-height:36px;border:1px solid var(--border);border-radius:20px;color:var(--gold);background:oklch(.995 .015 88 / .65);font:500 8px var(--font-sans);letter-spacing:.03em;cursor:pointer}
.motion-toggle:hover{background:var(--secondary);border-color:var(--gold)}
.motion-icon{width:11px;height:11px;flex:none}
.motion-toggle[aria-pressed="true"] .motion-icon{opacity:.45}
.motion-toggle:disabled{cursor:default}
/* Retain a quiet, one-time entrance; no continuously moving foreground content. */
html[data-motion="on"] .motion-reveal{opacity:0;transform:translate3d(0,18px,0);transition:opacity .8s ease,transform .95s cubic-bezier(.16,.7,.24,1);transition-delay:var(--reveal-delay,0ms)}
html[data-motion="on"] .motion-reveal.is-visible{opacity:1;transform:none}
html[data-motion="on"] .chip.motion-reveal.is-visible:hover{transform:translate3d(0,-4px,0)}
html:not([data-motion="on"]) .colour-layer,html[data-motion-suspended] .colour-layer{animation-play-state:paused!important}
html[data-motion="off"] .motion-reveal{opacity:1;transform:none;transition:none}
html:not([data-motion]) .motion-toggle{display:none}
@keyframes atelier-champagne-fade{0%,100%{opacity:0}32%{opacity:1}66%{opacity:0}}
@keyframes atelier-rose-fade{0%,28%,100%{opacity:0}66%{opacity:1}}
@media(max-width:760px){.motion-toggle{font-size:7px;padding:7px 9px;min-height:32px}}
@media(max-width:380px){.hero-copy>.motion-toggle{margin-left:10px}.motion-toggle{gap:4px;padding:7px}}
@media(max-width:520px){.chapter-image::after{background:linear-gradient(90deg,oklch(.955 .035 85 / .9) 5%,oklch(.955 .035 85 / .5) 50%,transparent)}}
@media(prefers-reduced-motion:reduce){
 .colour-layer{animation:none!important;opacity:0}
 html[data-motion] .motion-reveal{opacity:1;transform:none;transition:none}
}
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
  function revealAll(){targets.forEach(function(el){el.classList.add('is-visible');});}
  function apply(){
    var reduced=!!(preference&&preference.matches);
    var off=paused||reduced;
    root.setAttribute('data-motion',off?'off':'on');
    if(toggle){
      toggle.setAttribute('aria-pressed',off?'true':'false');
      toggle.querySelector('span').textContent=off?'Motion off':'Motion on';
      toggle.setAttribute('aria-label',reduced?'Animations off — following your device setting':off?'Resume background colour animation':'Pause background colour animation');
      toggle.title=reduced?'Following your device’s reduced-motion preference':off?'Resume background colour animation':'Pause background colour animation';
      toggle.disabled=reduced;
    }
    if(off)revealAll();
  }
  // An unsupported browser still gets every section immediately: no hidden content.
  if('IntersectionObserver' in window && !(preference&&preference.matches) && !paused){
    observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});
    },{threshold:0.07,rootMargin:'0px 0px 45px 0px'});
    targets.forEach(function(el){
      el.classList.add('motion-reveal');
      if(el.classList.contains('chip')){
        var siblings=Array.from(el.parentElement.children);
        el.style.setProperty('--reveal-delay',(siblings.indexOf(el)%4)*45+'ms');
      }
      observer.observe(el);
    });
  }else{revealAll();}
  if(toggle)toggle.addEventListener('click',function(){
    paused=!paused;
    try{localStorage.setItem('bce-english-motion',paused?'off':'on');}catch(e){}
    apply();
  });
  if(preference){if(preference.addEventListener)preference.addEventListener('change',apply);else if(preference.addListener)preference.addListener(apply);}
  function visibility(){root.toggleAttribute('data-motion-suspended',document.hidden);}
  document.addEventListener('visibilitychange',visibility);
  window.addEventListener('pagehide',function(){if(observer)observer.disconnect();});
  window.addEventListener('pageshow',function(e){if(e.persisted){revealAll();visibility();}});
  apply();visibility();
})();
</script>
'''
