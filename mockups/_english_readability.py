"""Larger, soft editorial copy without sentence backplates, shared with the native collection."""
CSS = r'''
/* Soft readable ink: retain the larger type, avoid near-black weight. */
body{--reading-ink:#73614f;--reading-accent:#80694f;--reading-control:#62503c}
.english-motion-tools{display:flex;justify-content:flex-end;align-items:center;padding-block:12px;position:relative;z-index:2}
.english-motion-tools .motion-toggle{margin:0;font-size:14px;font-weight:500;min-height:44px;padding:10px 16px;color:var(--reading-accent);background:#fff6e8f5;border-color:#b48b58}
.hero-copy>p,.collection-intro .collection-note p,.group.section-scope .chapter-head p,.inspiration-head>p,.atelier-process p{font-size:16px;line-height:1.8;font-weight:400;color:var(--reading-ink)}
.atelier-kicker,.hero-copy .atelier-kicker,.collection-note>span,.group.section-scope .chapter-heading>span,.atelier-process>div:not(.section-atmosphere)>span,.hero-footnote,.hero-index a,.hero-index>span{font-size:13px;line-height:1.65;letter-spacing:.055em;color:var(--reading-accent);font-weight:500}
.discovery-panel .collection-nav a{font-size:15px;line-height:1.5}
.scene-experiences .chapter-heading>span{color:#ffe5b4}
.group.section-scope .chapter-count{font-size:13px;line-height:1.4;letter-spacing:.03em;max-width:44%;text-align:center;z-index:3;color:var(--reading-accent);background:#fff6e8}
.chip .nm{font-size:16px;line-height:1.5;font-weight:500;color:var(--reading-accent)}
.chip .ds{font-size:14px;line-height:1.65;font-weight:400;color:var(--reading-ink)}
.chip{min-height:116px}
.chip,.scene-experiences .chip{background:linear-gradient(135deg,#fff8ecfa,#faefdffa)}
.chip[aria-pressed="true"] .nm,.chip[aria-pressed="true"] .ds{color:var(--reading-control)}
.group-foot,.gallery figcaption,.gallery figcaption span,.gallery .more span,.gallery .more a{font-size:14px;line-height:1.7;color:var(--reading-accent)}
.mood-copy small{font-size:13px;line-height:1.5;letter-spacing:.06em;color:#fff7e8}
.mood-copy>span{font-size:15px;line-height:1.5;color:#fff7e8}
.atelier-process.scene-process p{color:var(--reading-ink)}
.atelier-process.scene-process span{color:var(--reading-accent)}
.atelier-signoff>a,.atelier-button,.atelier-link,.head-wa{font-size:14px;line-height:1.5;letter-spacing:.025em}
.brand small{font-size:13px;line-height:1.5;letter-spacing:.025em;color:var(--reading-ink);text-transform:none}
.header-links a{font-size:14px}
.hero-index .scroll-cue{font-size:13px;gap:6px}
.hero-seal span,.hero-caption{font-size:13px;line-height:1.5;letter-spacing:.025em}
.hero-small-photo figcaption{font-size:16px}
.detail-kicker,.detail-h{font-size:14px;line-height:1.6;color:var(--reading-accent)}
.detail-body .detail-intro,.detail-body .rich-block p,.detail-body .opt-pick,.detail-body .fact,.detail-body .fact-card,.detail-body .fact-card span,.detail-body .inc-list li{font-size:16px;line-height:1.8;color:var(--reading-ink)}
.detail-body .fact-card b,.detail-body .bestfor i,.detail-body .pairs button,.detail-body .pair-tag,.detail-body .opt-card,.detail-actions .cta,.detail-actions .ghost,.detail-up{font-size:14px;line-height:1.6}
.detail-body .mini-chip,.detail-body .plain-list li,.detail-body .fact b,.detail-body .opt-pick b{font-size:14px;line-height:1.6}
.detail-body .comes li,.detail-body .fact-lead{font-size:16px;line-height:1.8;color:var(--reading-ink)}
.detail-body .pairs button,.detail-body .pair-tag,.detail-body .opt-card,.detail-up{color:var(--reading-control)}
.detail-body .opt-card{min-height:72px}
.detail-body .detail-actions{flex-wrap:wrap}
.selbar .lbl,.selbar .reset,.picked .p,.picked .empty,.selbar .cta{font-size:14px;line-height:1.55;letter-spacing:.02em;color:var(--reading-accent)}
.picked .p,.picked .empty{color:var(--reading-ink)}
.selbar .cta{color:var(--reading-control);min-height:44px}
.english-motion-tools .motion-toggle,.chip .nm,.collection-nav a{font-weight:500}
.detail-body .detail-intro,.detail-body .rich-block p,.detail-body .opt-pick,.detail-body .fact,.detail-body .fact-card,.detail-body .comes li{font-weight:400}
.detail-body .detail-h,.detail-body .detail-kicker{font-weight:500;color:var(--reading-accent)}
/* Keep editorial sentences and kickers unboxed; cards and real controls retain their surfaces. */
.hero-copy>p,.collection-intro .collection-note p,.group.section-scope .chapter-head p,.inspiration-head>p,.atelier-kicker,.collection-note>span,.group.section-scope .chapter-heading>span,.atelier-process>div:not(.section-atmosphere)>span,.hero-caption,.mood-copy{background:transparent;box-shadow:none;border:0;border-radius:0;padding:0}
.collection-intro .collection-note p{max-width:380px}
.scene-experiences.group.section-scope .chapter-head p,.scene-experiences .chapter-heading>span{color:#fff4df}
@media(max-width:760px){
 .hero-layout{gap:28px}.hero-seal{width:100px;height:100px}
 .collection-intro .collection-note{max-width:100%}.discovery-panel .collection-nav a{padding-inline:10px}
 .chip .nm{font-size:15px}.chip .ds{font-size:14px}.chip{min-height:180px}
 .sitehead .wrap{flex-wrap:wrap}.sitehead .brand{min-width:0}.head-wa{font-size:14px}
}
@media(max-width:520px){
 .hero-layout{padding-top:20px}.hero-copy>p{max-width:100%}.hero-actions{flex-wrap:wrap;gap:18px}
 .discovery-panel .collection-nav a{flex-direction:column;align-items:flex-start;gap:5px;font-size:14px}
 .group.section-scope .chapter-heading{max-width:94%}.group.section-scope .chapter-head p{max-width:250px}
 .group.section-scope .chapter-heading>span{font-size:13px;letter-spacing:.035em}
 .group.section-scope .chapter-count{font-size:13px;bottom:12px;right:4px;padding:5px 7px}
 .detail-body .opt-grid{grid-template-columns:minmax(0,1fr)}
 .selbar .wrap{grid-template-columns:minmax(0,1fr) auto;gap:8px 12px}
 .selbar .picked{grid-column:1/-1;grid-row:2;max-height:72px}
 .selbar .cta{grid-column:1/-1;grid-row:3;width:100%;text-align:center}
 .hero-index>div{flex-wrap:wrap;gap:16px}.hero-index a,.hero-index .scroll-cue{font-size:13px;gap:6px}
 .sitehead .wrap{gap:12px}.sitehead .brand{font-size:28px}.sitehead .head-wa{margin-left:auto}
}
'''
