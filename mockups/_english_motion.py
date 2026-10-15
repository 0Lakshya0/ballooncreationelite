"""Gentle English-only ambience. CSS motion + one shared, one-shot observer.

No canvas, animation library, scroll listener, remote resource or RAF loop.
Motion respects device preferences, can be paused, and stops in hidden tabs.
"""

AMBIENT = '''
<div class="atelier-ambient" aria-hidden="true">
  <span class="ambient-light light-one"></span>
  <span class="ambient-light light-two"></span>
  <span class="ambient-light light-three"></span>
  <div class="ambient-petals"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
</div>
'''

TOGGLE = '''<button type="button" class="motion-toggle" aria-pressed="false" aria-label="Pause background animations" title="Pause background animations"><svg class="motion-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5.5 3v10M10.5 3v10" stroke="currentColor" stroke-width="1.3"/></svg><span>Motion on</span></button>'''

CSS = r'''
/* Warm light, not glitter: slow transform-only ambience behind the content. */
body{isolation:isolate}
.atelier-ambient{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;contain:strict}
.ambient-light{position:absolute;display:block;border-radius:50%;opacity:.7;will-change:transform;animation:atelier-light-drift 24s ease-in-out infinite alternate}
.light-one{width:min(76vw,980px);height:min(76vw,980px);left:-32%;top:-10%;background:radial-gradient(ellipse,oklch(.88 .085 85 / .36),transparent 65%)}
.light-two{width:min(80vw,1050px);height:min(80vw,1050px);right:-34%;top:12%;background:radial-gradient(ellipse,oklch(.87 .07 55 / .25),transparent 66%);animation-duration:31s;animation-delay:-11s;animation-direction:alternate-reverse}
.light-three{width:70vw;height:70vw;left:20%;bottom:-65%;background:radial-gradient(ellipse,oklch(.91 .07 90 / .3),transparent 65%);animation-duration:28s;animation-delay:-18s}
.ambient-petals{position:absolute;inset:0}
.ambient-petals i{position:absolute;width:7px;height:14px;border:1px solid oklch(.68 .09 80 / .28);border-radius:90% 10% 90% 10%;background:oklch(.82 .08 83 / .09);animation:atelier-petal-drift 21s ease-in-out infinite alternate;opacity:.65}
.ambient-petals i:nth-child(1){left:2%;top:24%;animation-delay:-4s}
.ambient-petals i:nth-child(2){right:2%;top:62%;animation-delay:-13s;animation-duration:27s;width:5px;height:9px}
.ambient-petals i:nth-child(3){left:4%;top:78%;animation-delay:-9s;animation-duration:25s}
.ambient-petals i:nth-child(4){right:5%;top:12%;animation-delay:-18s;animation-duration:30s}
.ambient-petals i:nth-child(5){left:7%;top:43%;animation-delay:-6s;animation-duration:26s;width:4px;height:8px}
.ambient-petals i:nth-child(6){right:3%;top:87%;animation-delay:-14s;animation-duration:22s}
.ambient-petals i:nth-child(7){right:9%;top:39%;animation-delay:-8s;animation-duration:33s;width:4px;height:8px}
.ambient-petals i:nth-child(8){left:13%;top:7%;animation-delay:-19s;animation-duration:29s;width:5px;height:10px}
.atelier-hero{background:radial-gradient(ellipse at 75% 28%,oklch(.94 .055 85 / .75),transparent 65%),oklch(.985 .018 88 / .58)}
.hero-art::after{content:"";position:absolute;z-index:-1;pointer-events:none;inset:-7% -8%;border-radius:50%;background:radial-gradient(ellipse,oklch(.86 .09 83 / .27),transparent 68%);animation:atelier-halo-breathe 14s ease-in-out infinite alternate}
.motion-toggle{display:inline-flex;align-items:center;justify-content:center;gap:7px;flex:none;padding:9px 12px;min-height:36px;border:1px solid var(--border);border-radius:20px;color:var(--gold);background:oklch(.995 .015 88 / .5);font:500 8px var(--font-sans);letter-spacing:.03em;cursor:pointer}
.motion-toggle:hover{background:var(--secondary);border-color:var(--gold)}
.motion-icon{width:11px;height:11px;flex:none}
.motion-toggle[aria-pressed="true"] .motion-icon{opacity:.45}
.motion-toggle:disabled{cursor:default}
.hero-main-photo img{transition:transform 1.4s cubic-bezier(.2,.7,.2,1)}
@media(hover:hover) and (prefers-reduced-motion:no-preference){
 .hero-main-photo:hover img{transform:scale(1.025)}
 .hero-seal{transition:transform .8s ease}
 .hero-seal:hover{transform:rotate(2deg)}
 .atelier-button{position:relative;overflow:hidden;isolation:isolate}
 .atelier-button::after{content:"";position:absolute;inset:-50% -70%;background:linear-gradient(110deg,transparent 35%,#fff8df66 50%,transparent 65%);transform:translateX(-70%);transition:transform 1s ease;pointer-events:none;z-index:-1}
 .atelier-button:hover::after{transform:translateX(70%)}
}
html[data-motion="on"] .hero-small-photo{animation:atelier-photo-float 9s ease-in-out infinite alternate}
html[data-motion="on"] .hero-copy{animation:atelier-intro-in 1.15s cubic-bezier(.18,.65,.3,1) both}
html[data-motion="on"] .hero-main-photo{animation:atelier-intro-in 1.4s .12s cubic-bezier(.18,.65,.3,1) both}
html[data-motion="on"] .motion-reveal{opacity:0;transform:translate3d(0,22px,0);transition:opacity .85s ease,transform 1.05s cubic-bezier(.16,.7,.24,1);transition-delay:var(--reveal-delay,0ms)}
html[data-motion="on"] .motion-reveal.is-visible{opacity:1;transform:none}
html[data-motion="off"] .atelier-ambient *,html[data-motion="off"] .hero-art::after,html[data-motion-suspended] .atelier-ambient *,html[data-motion-suspended] .hero-art::after,html[data-motion-suspended] .hero-small-photo{animation-play-state:paused!important}
html[data-motion="off"] .hero-small-photo,html[data-motion="off"] .hero-copy,html[data-motion="off"] .hero-main-photo{animation:none}
html[data-motion="off"] .motion-reveal{opacity:1;transform:none;transition:none}
html:not([data-motion]) .atelier-ambient *,html:not([data-motion]) .hero-art::after{animation-play-state:paused}
html:not([data-motion]) .motion-toggle{display:none}
html[data-motion="on"] .chip.motion-reveal.is-visible:hover{transform:translate3d(0,-4px,0)}
@keyframes atelier-light-drift{from{transform:translate3d(-3%,-3%,0) scale(.92)}to{transform:translate3d(12%,7%,0) scale(1.1)}}
@keyframes atelier-petal-drift{from{transform:translate3d(0,15px,0) rotate(-16deg)}to{transform:translate3d(12px,-55px,0) rotate(37deg)}}
@keyframes atelier-halo-breathe{from{transform:scale(.93);opacity:.55}to{transform:scale(1.06);opacity:.95}}
@keyframes atelier-photo-float{from{transform:translate3d(0,0,0) rotate(-7deg)}to{transform:translate3d(0,-7px,0) rotate(-6deg)}}
@keyframes atelier-intro-in{from{opacity:0;transform:translate3d(0,16px,0)}to{opacity:1;transform:translate3d(0,0,0)}}
@media(max-width:760px){.hero-index{flex-wrap:wrap}.hero-index>div{flex:1}.motion-toggle{font-size:7px;padding:7px 9px;min-height:32px}.hero-index .scroll-cue{display:none}.light-one,.light-two{width:110vw;height:110vw}.ambient-petals i:nth-child(n+5){display:none}}
@media(max-width:380px){.hero-index>div{gap:11px}.motion-toggle{gap:4px;padding:7px}.hero-index{gap:10px}}
@media(prefers-reduced-motion:reduce){
 .atelier-ambient *, .hero-art::after,.hero-small-photo{animation:none!important;will-change:auto}
 html[data-motion] .motion-reveal,html[data-motion] .hero-copy,html[data-motion] .hero-main-photo{opacity:1;transform:none;animation:none;transition:none}
 .atelier-button::after{display:none}
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
      toggle.setAttribute('aria-label',reduced?'Animations off — following your device setting':off?'Resume background animations':'Pause background animations');
      toggle.title=reduced?'Following your device’s reduced-motion preference':off?'Resume background animations':'Pause background animations';
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
