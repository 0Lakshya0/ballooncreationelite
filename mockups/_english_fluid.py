"""Local, lightweight fluid highlights and warm glass depth for the English final.

No whole-page animation, canvas, blur filters, ribbons or new dependencies.
The colour fades remain unchanged; curved gradients move on top of them.
"""

CSS = r'''
/* Warm connective canvas replaces the unstyled white slots; it does not animate. */
body{background:linear-gradient(140deg,#f5e6cb,#faeedb 55%,#f1ddbe)}
.sitehead{background:#fff3dcf2;border-bottom-color:#ddc397}
.selbar{background:#fff2daf5;border-top-color:#d8bc8e}
.discovery-panel{padding:32px 30px 0;margin-bottom:32px;border-radius:16px;border:1px solid #dfc59d;background:#f6e7cd;box-shadow:inset 0 1px 0 #fff8e7d9,0 12px 36px #7550270a}
.discovery-panel .collection-intro{margin-bottom:26px}
.discovery-panel .collection-nav{margin-bottom:0;border-top-color:#d7bb8e;border-bottom:0}
.discovery-panel .collection-nav a{border-right-color:#d7bb8e;padding-block:21px}
.scene-discovery .tone-one{background:linear-gradient(120deg,#efd19b,#f4deb5 65%,#e9c689);animation:discovery-gold-fade 5s ease-in-out infinite alternate}
.scene-discovery .tone-two{background:linear-gradient(140deg,#f7e1be,transparent 75%);animation:section-tone-breathe 7s ease-in-out infinite alternate-reverse}
.atelier-process.scene-process{background:#f3e0c0;border:1px solid #d9bd93;border-radius:14px;padding:34px 30px;box-shadow:inset 0 1px 0 #fff6dfd9,0 10px 30px #7752290a}
.scene-process .tone-one{background:linear-gradient(125deg,#ead0a1,#f3dfbc 65%,#e8c58e);animation:process-amber-fade 6.5s ease-in-out infinite alternate}
.scene-process .tone-two{background:linear-gradient(140deg,#f2d4b2,transparent 78%);animation:section-tone-breathe 8s ease-in-out infinite alternate}
.atelier-process>.section-atmosphere{padding:0;border:0}
.atelier-process p{color:#685035}
.atelier-process span{color:#77562e}
.atelier-signoff{border-top:1px solid #dcc197;margin-top:26px}
/* Soft raised material, not tilting text/cards. The geometry stays stable. */
.group.section-scope{box-shadow:inset 0 1px 0 #fff8e3b3,0 15px 34px #77512b12;border-color:#d9bd91}
.scene-experiences{box-shadow:inset 0 1px 0 #d7b37f45,0 18px 38px #49331e21!important}
.inspiration-section.scene-inspiration{box-shadow:inset 0 1px 0 #fff6e0c9,0 15px 34px #77512b10}
.chip,.scene-experiences .chip{background:linear-gradient(135deg,#fff5e5f7,#f3e2c7f2);border-color:#e0c79f;box-shadow:inset 0 1px 0 #fffaf0eb,0 4px 10px #7250300b}
.chip .ds{color:#6f5b42}
.chip[aria-pressed="true"],.scene-experiences .chip[aria-pressed="true"]{background:linear-gradient(135deg,#edd09e,#f4e3bc);border-color:#9f7134;box-shadow:inset 0 1px 0 #fff9e6,0 4px 12px #79512612}
.chip:hover,.scene-experiences .chip:hover{background:linear-gradient(135deg,#fff5df,#f0dbb8);border-color:#b28b53;box-shadow:inset 0 1px 0 #fffaf0,0 10px 24px #65421920}
.opt-card{background:linear-gradient(140deg,#fff4df,#f5e6cb);box-shadow:inset 0 1px 0 #fff9e9}
.hero-main-photo,.mood-card{box-shadow:0 16px 34px #63432019}
/* Each scene owns clipped, rounded colour volumes. No effect crosses a boundary. */
.fluid-field{position:absolute;inset:0;pointer-events:none;overflow:hidden;contain:strict}
.fluid-lobe,.fluid-sheen{position:absolute;display:block;pointer-events:none;transform-origin:center}
.fluid-gold{width:95%;height:155%;left:-42%;top:-32%;border-radius:50%;background:radial-gradient(ellipse at 58% 48%,#ac752f40 0%,#eec06a3d 25%,#f9dc9824 47%,transparent 68%);animation:fluid-gold-volume 9s ease-in-out infinite alternate}
.fluid-rose{width:100%;height:150%;right:-48%;bottom:-46%;border-radius:50%;background:radial-gradient(ellipse at 45% 42%,#b4725440 0%,#e9b19245 25%,#efc6a126 47%,transparent 68%);animation:fluid-rose-volume 12s ease-in-out infinite alternate;animation-delay:-4s}
.fluid-sheen{width:115%;height:125%;left:-12%;top:-32%;background:radial-gradient(ellipse at 40% 45%,#fff8de75 0%,#fff7de30 30%,transparent 64%);animation:fluid-surface-light 11s ease-in-out infinite alternate;animation-delay:-3s}
.scene-experiences .fluid-gold{background:radial-gradient(ellipse,#e8b6643b 0%,#af793329 38%,transparent 67%)}
.scene-experiences .fluid-rose{opacity:.45}
.scene-experiences .fluid-sheen{background:radial-gradient(ellipse,#ffe0a426,transparent 64%)}
.scene-discovery .fluid-gold,.scene-process .fluid-gold{opacity:.8}
html:not([data-motion="on"]) .fluid-field *,html[data-motion-suspended] .fluid-field *,.section-scope:not([data-inview="true"]) .fluid-field *{animation-play-state:paused!important}
@keyframes discovery-gold-fade{from{opacity:0}to{opacity:1}}
@keyframes process-amber-fade{from{opacity:0}to{opacity:.85}}
@keyframes fluid-gold-volume{from{transform:perspective(700px) translate3d(-7%,-6%,0) rotate(-11deg) rotateY(-8deg) scale(.93)}to{transform:perspective(700px) translate3d(20%,12%,0) rotate(10deg) rotateY(8deg) scale(1.12)}}
@keyframes fluid-rose-volume{from{transform:perspective(700px) translate3d(8%,10%,0) rotate(9deg) rotateX(-6deg) scale(1.04)}to{transform:perspective(700px) translate3d(-21%,-12%,0) rotate(-12deg) rotateX(8deg) scale(.92)}}
@keyframes fluid-surface-light{from{transform:translate3d(-9%,3%,0) rotate(-7deg)}to{transform:translate3d(18%,16%,0) rotate(8deg)}}
@media(max-width:760px){.discovery-panel{padding:25px 21px 0;margin-bottom:26px;border-radius:12px}.atelier-process.scene-process{padding:28px 23px}.fluid-gold,.fluid-rose{width:130%;height:130%}.fluid-gold{left:-60%;top:-15%}.fluid-rose{right:-70%;bottom:-20%}.fluid-sheen{width:145%;left:-35%}}
@media(max-width:520px){.discovery-panel{padding:26px 17px 0}.discovery-panel .collection-intro h2{font-size:46px}.discovery-panel .collection-nav a{padding-block:18px;font-size:8px;gap:6px}.discovery-panel .collection-nav a span{font-size:13px}.atelier-process.scene-process{padding:28px 22px;border-radius:12px}.atelier-process.scene-process>div:not(.section-atmosphere){border-bottom-color:#d5b887}.atelier-process.scene-process>div:last-child{border:0}.fluid-sheen{opacity:.8}}
@media(prefers-reduced-motion:reduce){.fluid-field *{animation:none!important;transform:none}.fluid-lobe{opacity:.35}}
'''
