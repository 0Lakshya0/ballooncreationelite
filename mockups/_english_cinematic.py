"""Clearly visible champagne-silk motion for the English collection hero.

Vector ribbons are placed INSIDE the hero instead of behind the page canvas,
so they remain visible on both desktop and phone. Existing motion preference,
pause control and reduced-motion handling apply to these effects too.
"""

HERO_MOTION = '''
<div class="hero-motion" aria-hidden="true">
  <svg class="silk-scene" viewBox="0 0 1440 900" preserveAspectRatio="none" focusable="false">
    <defs>
      <linearGradient id="champagne-silk" x1="0" y1="0" x2="1" y2=".6" gradientUnits="objectBoundingBox">
        <stop offset="0" stop-color="#bd8e3e" stop-opacity=".04"/>
        <stop offset=".34" stop-color="#d4aa57" stop-opacity=".34"/>
        <stop offset=".58" stop-color="#fff9dc" stop-opacity=".72"/>
        <stop offset=".82" stop-color="#cba253" stop-opacity=".32"/>
        <stop offset="1" stop-color="#b98d48" stop-opacity=".05"/>
      </linearGradient>
      <linearGradient id="champagne-edge" x1="0" y1="0" x2="1" y2=".4" gradientUnits="objectBoundingBox">
        <stop stop-color="#c49a50" stop-opacity="0"/>
        <stop offset=".3" stop-color="#b98b3e" stop-opacity=".48"/>
        <stop offset=".7" stop-color="#e2c488" stop-opacity=".7"/>
        <stop offset="1" stop-color="#c49a50" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <g class="silk-ribbon silk-ribbon-one" fill="none">
      <path class="silk-band" d="M-180 630C140 140 380 100 730 380S1230 790 1630 170" stroke="url(#champagne-silk)" stroke-width="80"/>
      <path d="M-180 606C140 116 380 76 730 356S1230 766 1630 146" stroke="url(#champagne-edge)" stroke-width="1.3"/>
      <path d="M-180 654C140 164 380 124 730 404S1230 814 1630 194" stroke="url(#champagne-edge)" stroke-width="1"/>
      <path class="silk-travelling-light" pathLength="1400" d="M-180 606C140 116 380 76 730 356S1230 766 1630 146" stroke="#b88a40" stroke-opacity=".6" stroke-width="2.3" stroke-linecap="round" stroke-dasharray="75 1325"/>
    </g>
    <g class="silk-ribbon silk-ribbon-two" fill="none">
      <path class="silk-band" d="M-150 230C280 690 480 730 800 410S1220 20 1640 440" stroke="url(#champagne-silk)" stroke-width="48"/>
      <path d="M-150 211C280 671 480 711 800 391S1220 1 1640 421" stroke="url(#champagne-edge)" stroke-width="1.1"/>
    </g>
  </svg>
  <span class="hero-spotlight"></span>
</div>
'''

CSS = r'''
/* Cinematic layer: clearly moving silk, no flicker and no heavy filters. */
.atelier-hero{position:relative;isolation:isolate}
.hero-copy>.motion-toggle{vertical-align:middle;margin-left:16px;font-size:8px;padding:8px 11px;min-height:32px}
.hero-motion{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;contain:strict}
.hero-layout,.hero-index{position:relative;z-index:2}
.silk-scene{display:block;width:100%;height:100%;overflow:visible}
.silk-ribbon{transform-box:view-box;transform-origin:50% 50%;animation:atelier-silk-flow 9s ease-in-out infinite alternate}
.silk-ribbon-two{transform-origin:65% 45%;animation-name:atelier-silk-counterflow;animation-duration:12s;animation-delay:-4s;opacity:.78}
.silk-travelling-light{animation:atelier-light-trace 7s linear infinite}
.hero-spotlight{position:absolute;inset:-22% -22% -22% 12%;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg,oklch(.87 .1 85 / .21) 45deg,transparent 95deg,transparent 190deg,oklch(.94 .06 88 / .36) 235deg,transparent 285deg);animation:atelier-spotlight-turn 24s linear infinite}
/* Put the main halo on the visible photo outline rather than beneath opaque layers. */
.hero-outline{border:1px solid oklch(.7 .09 82 / .5);box-shadow:0 0 0 10px oklch(.91 .07 85 / .18),0 0 0 22px oklch(.91 .07 85 / .09);animation:atelier-orbit-arch 7s ease-in-out infinite alternate}
.hero-art::after{inset:-10% -12%;background:radial-gradient(ellipse,oklch(.83 .115 84 / .38),transparent 68%);animation:atelier-visible-halo 8s ease-in-out infinite alternate}
html[data-motion="on"] .hero-main-photo img{animation:atelier-photo-pan 14s ease-in-out infinite alternate;transform-origin:50% 45%}
html[data-motion="on"] .hero-small-photo{animation:atelier-cinematic-float 5.5s ease-in-out infinite alternate}
html[data-motion="on"] .hero-copy{animation:atelier-cinematic-entry 1.35s cubic-bezier(.16,.65,.25,1) both}
html[data-motion="on"] .hero-main-photo{animation:atelier-cinematic-entry 1.65s .12s cubic-bezier(.16,.65,.25,1) both}
/* Slightly more readable ambient light in the collection area as well. */
.ambient-light{opacity:.85;animation-duration:14s}
.light-one{background:radial-gradient(ellipse,oklch(.87 .095 85 / .5),transparent 68%)}
.light-two{background:radial-gradient(ellipse,oklch(.88 .08 65 / .36),transparent 68%);animation-duration:19s}
html:not([data-motion="on"]) .hero-motion *,html:not([data-motion="on"]) .hero-outline,html:not([data-motion="on"]) .hero-main-photo img,html[data-motion-suspended] .hero-motion *,html[data-motion-suspended] .hero-outline,html[data-motion-suspended] .hero-main-photo img{animation-play-state:paused!important}
@keyframes atelier-silk-flow{from{transform:translate3d(-36px,-32px,0) rotate(-3deg) scale(1.04)}to{transform:translate3d(48px,48px,0) rotate(3deg) scale(1.1)}}
@keyframes atelier-silk-counterflow{from{transform:translate3d(30px,40px,0) rotate(3deg) scale(1.06)}to{transform:translate3d(-45px,-36px,0) rotate(-4deg) scale(1.13)}}
@keyframes atelier-light-trace{from{stroke-dashoffset:1400}to{stroke-dashoffset:0}}
@keyframes atelier-spotlight-turn{to{transform:rotate(360deg)}}
@keyframes atelier-orbit-arch{from{transform:translate3d(0,0,0) rotate(1deg) scale(.99)}to{transform:translate3d(6px,-7px,0) rotate(6deg) scale(1.04)}}
@keyframes atelier-visible-halo{from{transform:translate3d(-22px,5px,0) scale(.9);opacity:.65}to{transform:translate3d(26px,-15px,0) scale(1.12);opacity:1}}
@keyframes atelier-photo-pan{from{transform:scale(1) translate3d(0,0,0)}to{transform:scale(1.065) translate3d(-.8%,.5%,0)}}
@keyframes atelier-cinematic-float{from{transform:translate3d(0,5px,0) rotate(-7deg)}to{transform:translate3d(0,-10px,0) rotate(-4.5deg)}}
@keyframes atelier-cinematic-entry{from{opacity:0;transform:translate3d(0,30px,0)}to{opacity:1;transform:translate3d(0,0,0)}}
@media(max-width:760px){.silk-ribbon{animation-duration:7s}.silk-ribbon-two{animation-duration:10s}.silk-band{stroke-opacity:.9}.hero-spotlight{inset:-10% -60%}.hero-outline{box-shadow:0 0 0 8px oklch(.91 .07 85 / .18),0 0 0 17px oklch(.91 .07 85 / .09)}}
@media(prefers-reduced-motion:reduce){.hero-motion *,.hero-outline,.hero-main-photo img{animation:none!important}.hero-spotlight{opacity:.4}}
'''
