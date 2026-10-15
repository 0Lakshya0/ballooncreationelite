"""English-only finishing: visible composited fades, tactile controls, warm gaps.

The colour veil sits ABOVE the metal, so an opaque WebGL canvas cannot hide
it. Native CSS timing keeps the palette visibly changing even on slow GPUs.
"""

CSS = r'''
/* Restore the earlier colour animation above, not underneath, the 3D surface. */
.section-scope{--colour-duration:10s;--colour-offset:0s}
.scene-discovery{--colour-duration:9s;--colour-offset:-2s}
.scene-elements{--colour-duration:9s;--colour-offset:-4s}
.scene-structures{--colour-duration:11s;--colour-offset:-3s}
.scene-experiences{--colour-duration:10s;--colour-offset:-6s}
.scene-inspiration{--colour-duration:12s;--colour-offset:-5s}
.scene-process{--colour-duration:13s;--colour-offset:-8s}
/* A much lighter readability veil no longer bleaches the material colour. */
.liquid-ready .liquid-veil{background:linear-gradient(105deg,#fff7e84d,#fff5e320 55%,transparent);animation:liquid-visible-cream var(--colour-duration) ease-in-out var(--colour-offset) infinite}
.liquid-veil::before,.liquid-veil::after{content:"";position:absolute;inset:0;display:block;pointer-events:none;mix-blend-mode:normal;animation-duration:var(--colour-duration);animation-delay:var(--colour-offset);animation-timing-function:ease-in-out;animation-iteration-count:infinite;opacity:0}
.liquid-veil::before{background:linear-gradient(120deg,#e9bb71,#e2ae58 70%,#f4d397);animation-name:liquid-visible-champagne}
.liquid-veil::after{background:linear-gradient(125deg,#e8b59d,#dc9f89 72%,#f1c9ae);animation-name:liquid-visible-rose}
@keyframes liquid-visible-cream{0%,100%{background-color:#fff5e699}35%,70%{background-color:#fff5e600}}
@keyframes liquid-visible-champagne{0%,70%,100%{opacity:0}35%{opacity:.52}}
@keyframes liquid-visible-rose{0%,35%,100%{opacity:0}70%{opacity:.58}}
.scene-experiences.liquid-ready .liquid-veil{background:linear-gradient(105deg,#392a1cd9,#392b1b88 65%,#392b1b33);animation:none}
html:not([data-motion="on"]) .liquid-veil::before,html:not([data-motion="on"]) .liquid-veil::after,
html[data-motion-suspended] .liquid-veil::before,html[data-motion-suspended] .liquid-veil::after,
.section-scope:not([data-inview="true"]) .liquid-veil::before,.section-scope:not([data-inview="true"]) .liquid-veil::after{animation-play-state:paused!important}
.liquid-ready .hero-copy>p,.liquid-ready .chapter-head p{color:#3f2c1c}
.scene-hero .atelier-kicker,.scene-hero .hero-footnote,.scene-hero .hero-index,.scene-hero .hero-index a,.scene-hero .hero-index>span{color:#5c432b}
.scene-experiences.liquid-ready .chapter-head p{color:#fff4df}
/* Treat the connective space as intentional warm paper, not empty white strips. */
body{background:radial-gradient(ellipse at 5% 24%,#eac79966,transparent 42%),radial-gradient(ellipse at 95% 70%,#dba79138,transparent 45%),linear-gradient(120deg,#f4dfbd,#faecd4 50%,#efd7b9)}
section.block{padding-top:42px;background:linear-gradient(180deg,#e8c89126,transparent 220px)}
.groups{gap:28px}
.discovery-panel{border-radius:22px 6px 22px 6px;margin-bottom:28px}
.group.section-scope{border-radius:20px 6px 20px 6px;border-color:#caa46f99;box-shadow:inset 0 1px 0 #fff7df,0 14px 30px #68421c12}
.group.section-scope .chapter-head{border-bottom-color:#ad834d40}
.inspiration-section.scene-inspiration{margin-top:36px;border-radius:24px 6px 24px 6px}
.atelier-process.scene-process{margin-top:32px;border-radius:20px 6px 20px 6px}
.atelier-signoff{position:relative;margin-top:24px;padding:26px 30px!important;border:1px solid #caaa7b70;border-radius:16px;background:linear-gradient(110deg,#ecd2a9cc,#faead0,#e9c7b1b3);box-shadow:inset 0 1px 0 #fff5e2}
.atelier-signoff>a{padding:10px 13px;border:1px solid #b18d5f77;border-radius:20px;background:#fff4de88}
/* A restrained travelling light on primary buttons. No bouncing text. */
.head-wa,.atelier-button,.cta{position:relative;isolation:isolate;overflow:hidden;box-shadow:inset 0 1px 0 #fff8e2b3,0 5px 15px #714a2420;transition:transform .25s,box-shadow .25s,border-color .25s}
.head-wa::after,.atelier-button::after,.cta::after{content:"";position:absolute;z-index:-1;inset:-50% -100%;background:linear-gradient(110deg,transparent 42%,#fff8e6aa 50%,transparent 58%);transform:translateX(-48%);pointer-events:none;animation:button-gold-sweep 5.8s cubic-bezier(.2,.65,.3,1) infinite}
.atelier-button::after{animation-delay:-1.5s}.cta::after{animation-delay:-3s}
@keyframes button-gold-sweep{0%,40%{transform:translateX(-48%)}75%,100%{transform:translateX(48%)}}
.head-wa:hover,.atelier-button:hover,.cta:hover{transform:translateY(-3px);box-shadow:inset 0 1px 0 #fff9e6,0 10px 22px #714a2433}
.head-wa:active,.atelier-button:active,.cta:active,.chip:active,.opt-card:active{transform:translateY(1px) scale(.98)}
.atelier-button>span,.collection-nav a b{transition:transform .3s}
.atelier-button:hover>span,.atelier-button:focus-visible>span,.collection-nav a:hover b{transform:translate(3px,-3px)}
.chip{overflow:hidden;border-radius:12px 4px 12px 4px!important;transition:transform .28s,box-shadow .28s,border-color .28s,background .28s}
.chip::after{content:"";position:absolute;left:12px;right:12px;bottom:0;height:2px;background:linear-gradient(90deg,#be8d46,#d99e88);transform:scaleX(0);transform-origin:left;transition:transform .35s;pointer-events:none}
.chip:hover::after,.chip:focus-visible::after,.chip[aria-pressed="true"]::after{transform:scaleX(1)}
.opt-card{transition:transform .25s,box-shadow .25s,border-color .25s}
.opt-card:hover{transform:translateY(-3px);box-shadow:0 8px 20px #6945241a}
.collection-nav a{transition:background .25s,color .25s}.collection-nav a:hover{background:#edc89555}
html:not([data-motion="on"]) .head-wa::after,html:not([data-motion="on"]) .atelier-button::after,html:not([data-motion="on"]) .cta::after,
html[data-motion-suspended] .head-wa::after,html[data-motion-suspended] .atelier-button::after,html[data-motion-suspended] .cta::after{animation-play-state:paused!important}
@media(max-width:760px){section.block{padding-top:28px}.groups{gap:22px}.inspiration-section.scene-inspiration{margin-top:28px}.atelier-process.scene-process{margin-top:26px}.atelier-signoff{padding:24px 22px!important}}
@media(max-width:520px){.group.section-scope{border-radius:16px 5px 16px 5px}.discovery-panel{border-radius:18px 5px 18px 5px}.liquid-ready .liquid-veil{background:linear-gradient(110deg,#fff7e852,#fff4e32b 65%,transparent)}.scene-experiences.liquid-ready .liquid-veil{background:linear-gradient(110deg,#392a1cdf,#392b1b99 70%,#392b1b55);animation:none}.atelier-signoff{gap:18px}.inspiration-section.scene-inspiration{border-radius:18px 5px 18px 5px}}
@media(prefers-reduced-motion:reduce){.liquid-veil::before,.liquid-veil::after,.head-wa::after,.atelier-button::after,.cta::after{animation:none!important;opacity:0}.head-wa:hover,.atelier-button:hover,.cta:hover,.opt-card:hover{transform:none}.chip::after{transition:none}}
'''
