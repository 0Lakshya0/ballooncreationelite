"""English-only editorial treatment. Does not change the bilingual final page.

Applied by _build_final.py after clean(), before embedding the photos.
All original chip buttons and all 150 detail records remain intact.
"""
from __future__ import annotations

import re
import base64
from pathlib import Path
from _english_motion import AMBIENT, TOGGLE, CSS as MOTION_CSS, SCRIPT as MOTION_SCRIPT

HERO = '''
    <main id="main-content">
    <section class="atelier-hero" aria-labelledby="hero-title">
      <div class="wrap hero-layout">
        <div class="hero-copy">
          <span class="atelier-kicker"><span></span> THE ART OF CELEBRATING</span>
          <h1 id="hero-title">Some days<br>deserve a little<br><em>magic.</em></h1>
          <p>Beautiful spaces. Heartfelt details. A celebration that feels unmistakably <i>you.</i></p>
          <div class="hero-actions">
            <a class="atelier-button" href="#collections">Find your inspiration <span aria-hidden="true">↗</span></a>
            <a class="atelier-link" href="https://wa.me/917489863753?text=Hello%20Balloon%20Creation!%20I%20would%20love%20to%20plan%20my%20celebration." target="_blank" rel="noreferrer">Let’s dream it up <span aria-hidden="true">↗</span></a>
          </div>
          <div class="hero-footnote"><span class="fine-line"></span> FROM THE FIRST IDEA TO THE FINAL LITTLE DETAIL</div>
        </div>
        <div class="hero-art">
          <div class="hero-outline" aria-hidden="true"></div>
          <figure class="hero-main-photo">
            <img src="img/balloon-decor.jpg" alt="Blush, ivory and gold balloons with delicate floral accents" fetchpriority="high" width="640" height="1147">
            <figcaption>A little wonder, beautifully made.</figcaption>
          </figure>
          <figure class="hero-small-photo">
            <img src="img/mandap-pandal.jpg" alt="A floral wedding mandap dressed in soft drapes and warm light" width="640" height="1147">
            <figcaption>Made for your moments.</figcaption>
          </figure>
          <div class="hero-seal" aria-hidden="true"><span>WITH LOVE,<br>ALWAYS.</span><svg viewBox="0 0 32 32" fill="none"><path d="M16 27S3 19 3 10a7 7 0 0 1 13-3 7 7 0 0 1 13 3c0 9-13 17-13 17Z" stroke="currentColor" stroke-width="1.2"/></svg></div>
          <span class="hero-caption">BALLOONS · BLOOMS · BEAUTIFUL MEMORIES</span>
        </div>
      </div>
      <div class="wrap hero-index"><span>YOUR MOMENT. YOUR WAY.</span><div><a href="#elements">01 / The elements</a><a href="#structures">02 / The settings</a><a href="#experiences">03 / The magic</a></div><a href="#collections" class="scroll-cue" aria-label="Scroll to the decor collections">EXPLORE <span aria-hidden="true">↓</span></a></div>
    </section>
    <div class="atelier-ribbon"><span>Thoughtfully imagined.</span><i aria-hidden="true">✦</i><span>Beautifully brought to life.</span><i aria-hidden="true">✦</i><span>Entirely yours.</span></div>
'''

CATALOGUE_HEAD = '''        <div class="head collection-intro" id="collections">
          <div><span class="atelier-kicker">THE DECOR COLLECTIONS</span>
          <h2>Find your kind<br>of <em>beautiful.</em></h2></div>
          <div class="collection-note"><p>Start with the details you love. Explore the materials, discover your setting, then add that extra spark.</p><span>25 decor styles <b>·</b> 150 ways to make them yours</span></div>
        </div>
        <nav class="collection-nav" aria-label="Decor collections"><a href="#elements"><span>01</span> The elements <b>↗</b></a><a href="#structures"><span>02</span> The settings <b>↗</b></a><a href="#experiences"><span>03</span> The magic <b>↗</b></a></nav>
'''

CHAPTERS = [
    ('elements', '01', 'THE PALETTE OF YOUR CELEBRATION', 'It starts with <em>the details.</em>',
     'Balloons, blooms, fabrics and light. Meet the beautiful ingredients that bring your vision to life.',
     'floral-decor.jpg', 'Soft floral arrangements in an elegant celebration setting', '08 DECOR STYLES'),
    ('structures', '02', 'A SETTING TO FALL IN LOVE WITH', 'Give your moment <em>its stage.</em>',
     'A grand entrance. An intimate corner. A picture-perfect backdrop. Find a setting made for your story.',
     'mandap-pandal.jpg', 'Draped floral mandap with warm lanterns', '09 DECOR STYLES'),
    ('experiences', '03', 'THE FINISHING TOUCH', 'Make it <em>unforgettable.</em>',
     'The joyful surprises and little bursts of wonder that turn a beautiful gathering into a memory.',
     'cold-pyro.jpg', 'Celebration fountains lighting up an event', '08 DECOR STYLES'),
]

CLOSING = '''
    <section class="inspiration-section wrap" aria-labelledby="inspiration-title">
      <div class="inspiration-head"><div><span class="atelier-kicker">A MOOD FOR EVERY MOMENT</span><h2 id="inspiration-title">What does your<br><em>happy look like?</em></h2></div><p>There’s no one way to celebrate.<br>Here are a few beautiful places to start.</p></div>
      <div class="inspiration-grid">
        <button class="mood-card" type="button" data-inspire="Balloon Decor"><img src="img/round-backdrop.jpg" alt="Soft pastel balloon backdrop for a joyful birthday celebration" loading="lazy" width="640" height="960"><span class="mood-shade"></span><span class="mood-copy"><small>FOR THE JOYFUL LITTLE THINGS</small><strong>A little playful.</strong><span>Explore balloon decor <b aria-hidden="true">↗</b></span></span></button>
        <button class="mood-card" type="button" data-inspire="Mandap &amp; Pandal"><img src="img/mandap-pandal.jpg" alt="Romantic floral mandap and draped wedding setting" loading="lazy" width="640" height="1147"><span class="mood-shade"></span><span class="mood-copy"><small>FOR YOUR FOREVER MOMENTS</small><strong>A little romantic.</strong><span>Discover wedding settings <b aria-hidden="true">↗</b></span></span></button>
        <button class="mood-card" type="button" data-inspire="Lighting Decor"><img src="img/candle-aisle.jpg" alt="A glowing candlelit walkway with warm ambient lighting" loading="lazy" width="640" height="960"><span class="mood-shade"></span><span class="mood-copy"><small>FOR A NIGHT TO REMEMBER</small><strong>A little magical.</strong><span>Discover the glow <b aria-hidden="true">↗</b></span></span></button>
      </div>
    </section>
    <section class="atelier-process wrap" aria-label="How to create your celebration"><div><span>01 / DISCOVER</span><h3>Follow your inspiration.</h3><p>Open a style and explore every detail.</p></div><div><span>02 / MAKE IT YOURS</span><h3>Save what you love.</h3><p>Add your favourite styles to your enquiry.</p></div><div><span>03 / LET’S CREATE</span><h3>Bring it all together.</h3><p>Send your selection and let’s plan the magic.</p></div></section>
    <div class="atelier-signoff wrap"><span>We decorate your happiness</span><a href="#top" aria-label="Back to the top">BACK TO TOP ↑</a></div>
    </main>
'''

CSS = r'''
/* English editorial collection — all overrides stay in this standalone page. */
:root{--background:#fbf8f3;--foreground:#3e282d;--secondary:#f3e8e3;--muted-foreground:#756568;--border:#e6d9d2;--gold:#986b46;--rose-gold:#804450;--wine:#542d3b;--blush:#e8c7c0;--font-display:"Cormorant Garamond",Georgia,serif;--font-sans:"Manrope",Arial,sans-serif}
html{scroll-behavior:smooth;scroll-padding-top:104px}
body{background:#fbf8f3;padding-bottom:105px}
button,a{-webkit-tap-highlight-color:transparent}
a:focus-visible,button:focus-visible{outline:3px solid #a16655;outline-offset:5px}
.wrap{width:min(1240px,calc(100% - 96px))}
.sitehead{background:#fbf8f3f2;backdrop-filter:blur(18px);border-bottom:1px solid #e7dcd5}
.sitehead .wrap{padding:21px 0;gap:20px}
.brand{font-size:30px;letter-spacing:-.6px;color:var(--wine)}
.brand small{font-size:8px;letter-spacing:.16em;font-weight:500;margin-top:6px;color:#806568}
.header-links{display:flex;gap:30px;margin-left:auto;margin-right:22px}
.header-links a{font-size:11px;color:#655052;text-decoration:none;transition:color .2s}
.header-links a:hover{color:#a06169}
.head-wa{background:transparent;border:1px solid #cbb9b1;border-radius:30px;padding:12px 21px;font-size:10px;letter-spacing:.03em;color:var(--wine)}
.head-wa:hover{background:var(--wine);color:#fff;border-color:var(--wine)}
.skip-link{position:fixed;top:-80px;left:20px;z-index:100;background:white;padding:14px;color:var(--wine)}
.skip-link:focus{top:10px}
.atelier-hero{background:radial-gradient(ellipse at 75% 28%,#f5e8de 0,transparent 56%),#f6eee6;overflow:hidden}
.hero-layout{display:grid;grid-template-columns:1.04fr 1fr;gap:48px;align-items:center;min-height:648px;padding-top:44px;padding-bottom:42px}
.atelier-kicker{display:inline-flex;align-items:center;gap:10px;color:#9c6d59;font-family:var(--font-sans);font-size:9px;letter-spacing:.2em;font-weight:600;line-height:1.7}
.atelier-kicker>span{width:24px;height:1px;background:currentColor}
.hero-copy{padding-bottom:8px}
.hero-copy h1{font-size:clamp(68px,6.7vw,101px);font-weight:400;letter-spacing:-3.4px;line-height:.99;color:var(--wine);margin:28px 0 24px}
.hero-copy h1 em{color:#ad7474;font-weight:400;font-style:italic}
.hero-copy>p{font-size:13px;line-height:1.9;color:#7b6566;max-width:340px;margin:0}
.hero-actions{display:flex;align-items:center;gap:24px;margin-top:30px;flex-wrap:wrap}
.atelier-button{display:inline-flex;align-items:center;justify-content:space-between;gap:24px;padding:17px 22px;background:var(--wine);color:#fff9f2;text-decoration:none;font-size:10px;font-weight:600;border-radius:3px;transition:background .2s,transform .2s}
.atelier-button:hover{background:#744052;transform:translateY(-2px)}
.atelier-button>span{font-size:17px;font-weight:400}
.atelier-link{color:var(--wine);font-size:10px;text-underline-offset:6px;text-decoration-color:#b29188}
.atelier-link span{margin-left:8px}
.hero-footnote{display:flex;align-items:center;gap:12px;font-size:7px;letter-spacing:.15em;color:#927976;margin-top:42px}
.fine-line{width:36px;height:1px;background:#c9aaa1;flex:none}
.hero-art{position:relative;min-width:0;height:538px;isolation:isolate}
.hero-outline{position:absolute;width:80%;height:92%;top:-9px;right:-15px;border:1px solid #ceb6a5;border-radius:240px 240px 6px 6px;z-index:-1;transform:rotate(4deg)}
.hero-main-photo{margin:0 0 0 auto;width:80%;height:500px;overflow:hidden;border-radius:230px 230px 3px 3px;position:relative;background:#e4d6c5}
.hero-main-photo img{width:100%;height:100%;object-fit:cover;object-position:50% 56%;display:block}
.hero-main-photo::after{content:"";position:absolute;inset:65% 0 0;background:linear-gradient(transparent,#3d242a85)}
.hero-main-photo figcaption{position:absolute;bottom:25px;left:0;right:0;text-align:center;color:#fff6ed;font:italic 21px var(--font-display);z-index:1}
.hero-small-photo{position:absolute;left:-18px;bottom:18px;width:36%;height:255px;margin:0;background:#fff9f0;padding:7px 7px 28px;transform:rotate(-7deg);box-shadow:0 14px 35px #57362a20}
.hero-small-photo img{width:100%;height:100%;object-fit:cover;display:block}
.hero-small-photo figcaption{position:absolute;bottom:8px;left:0;right:0;text-align:center;font:italic 13px var(--font-display);color:#775455}
.hero-seal{position:absolute;right:-17px;top:39px;width:99px;height:99px;border-radius:50%;border:1px solid #d6beb0;background:#fbf5e9ed;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;transform:rotate(12deg);box-shadow:0 0 0 5px #fbf5e97a}
.hero-seal span{text-align:center;font-size:8px;letter-spacing:.18em;line-height:1.5;color:#8f6456}
.hero-seal svg{width:21px;height:21px;color:#a77971}
.hero-caption{position:absolute;bottom:5px;right:7px;font-size:7px;letter-spacing:.18em;color:#92776c}
.hero-index{display:flex;align-items:center;justify-content:space-between;padding:20px 0 22px;border-top:1px solid #dfcfc4;gap:18px}
.hero-index>span{font-size:8px;letter-spacing:.16em;color:#9a7e72}
.hero-index>div{display:flex;gap:28px}
.hero-index a{font-size:9px;color:#72565b;text-decoration:none}
.hero-index a:hover{text-decoration:underline;text-underline-offset:5px}
.hero-index .scroll-cue{font-size:8px;letter-spacing:.12em;display:flex;gap:14px;align-items:center}
.scroll-cue span{font-size:18px}
.atelier-ribbon{display:flex;justify-content:center;align-items:center;gap:35px;background:var(--wine);color:#f1dfd6;padding:21px 22px}
.atelier-ribbon span{font:italic 22px var(--font-display);font-weight:400}
.atelier-ribbon i{font-size:11px;color:#bd9582;font-style:normal}
section.block{padding:86px 0 0}
.collection-intro{margin-bottom:32px;gap:32px;align-items:end;scroll-margin-top:110px}
.collection-intro h2,.inspiration-head h2{font-size:62px;font-weight:400;line-height:1.02;letter-spacing:-1.6px;margin-top:17px;color:var(--wine)}
.collection-intro h2 em,.inspiration-head h2 em{color:#a56b71}
.collection-note{max-width:330px;padding-bottom:3px}
.collection-intro .collection-note p{font-size:12px;line-height:1.9;margin:0 0 14px;color:#806c6b}
.collection-note>span{font-size:8px;letter-spacing:.055em;color:#9c786d;text-transform:uppercase}
.collection-note b{margin:0 8px;font-weight:400}
.collection-nav{display:flex;border-block:1px solid var(--border);margin-bottom:46px}
.collection-nav a{flex:1;display:flex;gap:15px;align-items:center;justify-content:start;color:#61434b;text-decoration:none;font-size:11px;padding:19px 24px;border-right:1px solid var(--border);transition:background .2s}
.collection-nav a:first-child{padding-left:0}
.collection-nav a:last-child{border-right:0}
.collection-nav a:hover{background:#f4e9e2}
.collection-nav a span{font:italic 18px var(--font-display);color:#a97f6d}
.collection-nav a b{font-size:14px;font-weight:400;margin-left:auto;color:#987366}
.groups{display:flex;flex-direction:column;gap:48px}
.group{position:relative;background:transparent;backdrop-filter:none;box-shadow:none;padding:0;border:0;border-radius:0;scroll-margin-top:110px}
.chapter-head{position:relative;overflow:hidden;min-height:214px;border:1px solid #e4d6cc;border-radius:5px;background:#f0e6de;display:flex;align-items:center;margin-bottom:20px}
.chapter-heading{position:relative;z-index:1;padding:28px 35px;max-width:68%}
.chapter-heading>span{display:flex;align-items:center;gap:13px;font-size:8px;font-weight:600;letter-spacing:.14em;color:#9d7566;line-height:1.5}
.chapter-heading .chapter-no{font:italic 20px var(--font-display);font-weight:400;border-right:1px solid #d7beb0;padding-right:13px}
.chapter-head h3{font-size:37px;font-weight:400;letter-spacing:-.6px;color:var(--wine);line-height:1.15;margin:14px 0 10px}
.chapter-head h3 em{color:#a36e73}
.chapter-head p{font-size:11px;line-height:1.85;max-width:385px;margin:0;color:#7c6967}
.chapter-image{position:absolute;top:0;bottom:0;right:0;width:39%}
.chapter-image img{width:100%;height:100%;object-fit:cover;object-position:center 54%;display:block}
.chapter-image::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#f0e6de,transparent 38%)}
.chapter-count{position:absolute;bottom:16px;right:18px;padding:7px 11px;background:#fff8eddf;border:1px solid #fff4e3a0;font-size:7px;letter-spacing:.1em;color:#75534b;border-radius:20px}
.chips{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.chip{position:relative;align-items:center;gap:13px;min-height:105px;padding:16px 13px;background:#fffcf8;border:1px solid #eadfd7;border-radius:5px;box-shadow:0 3px 8px #69412c03;transition:transform .25s,box-shadow .25s,border-color .25s}
.chip:hover{background:#fffdfa;transform:translateY(-4px);border-color:#c9a78f;box-shadow:0 9px 22px #623b2820}
.chip .thumb{width:55px;height:65px;border:0;border-radius:32px 32px 3px 3px;overflow:hidden;background:#ebdfd3}
.chip .thumb img{transition:transform .5s}
.chip:hover .thumb img{transform:scale(1.08)}
.chip .txt{min-width:0;padding-right:3px}
.chip .nm{font-size:11px;font-weight:600;line-height:1.55;color:#57343e}
.chip .ds{font-size:9px;line-height:1.65;color:#918079;margin-top:4px}
.chip .tick{position:absolute;right:7px;top:6px;font-size:9px}
.chip[aria-pressed="true"]{background:#f1e3df;border-color:#b28383}
.chip[aria-pressed="true"] .tick{color:var(--wine)}
.divider{display:none}
.inspiration-section{padding-top:86px}
.inspiration-head{display:flex;justify-content:space-between;align-items:end;gap:24px;margin-bottom:30px}
.inspiration-head h2{font-size:53px}
.inspiration-head>p{font-size:11px;line-height:1.9;color:#8b7570;margin:0 0 5px;max-width:270px}
.inspiration-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
.mood-card{position:relative;display:block;padding:0;overflow:hidden;border:0;border-radius:160px 160px 5px 5px;background:#e4d2c5;aspect-ratio:3/4.1;text-align:left;cursor:pointer;color:#fff8ef;isolation:isolate}
.mood-card img{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:cover;transition:transform .7s}
.mood-card:hover img{transform:scale(1.045)}
.mood-shade{position:absolute;inset:25% 0 0;background:linear-gradient(transparent,#35222ccf)}
.mood-copy{position:absolute;bottom:28px;left:27px;right:27px}
.mood-copy small{font:500 7px var(--font-sans);letter-spacing:.15em;display:block;color:#efe0d4}
.mood-copy strong{display:block;font:italic 37px var(--font-display);margin:10px 0 20px;letter-spacing:-.3px}
.mood-copy>span{display:flex;align-items:center;justify-content:space-between;border-top:1px solid #ffffff50;padding-top:13px;font:500 9px var(--font-sans)}
.mood-copy b{font-size:18px;font-weight:400}
.atelier-process{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-block:1px solid #e4d5cd;margin-top:62px;padding:30px 0;gap:40px}
.atelier-process>div{border-right:1px solid #e4d5cd;padding-right:24px}
.atelier-process>div:last-child{border:0}
.atelier-process span{font-size:7px;color:#a08170;letter-spacing:.16em}
.atelier-process h3{font-size:23px;color:#684750;margin:10px 0 7px}
.atelier-process p{font-size:10px;line-height:1.8;color:#8a7571;margin:0}
.atelier-signoff{display:flex;justify-content:space-between;align-items:center;padding:32px 0 36px;gap:20px}
.atelier-signoff>span{font:italic 23px var(--font-display);color:#9c7271}
.atelier-signoff>a{font-size:7px;letter-spacing:.14em;text-decoration:none;color:#98776a}
.selbar{background:#fffaf5f5;backdrop-filter:blur(20px);border-top:1px solid #e4d4c9;box-shadow:0 -5px 26px #573c2c09;z-index:35}
.selbar .wrap{padding:14px 0;gap:18px;min-height:70px}
.selbar .lbl{font-size:8px;letter-spacing:.16em;color:#976d5b}
.picked .empty{font-size:10px;font-style:normal;color:#9c8680}
.picked .p{font-size:9px;color:var(--wine);background:#f5e8e4;border-color:#e5cfc7}
.cta{background:var(--wine);border:1px solid var(--wine);color:#fff8f0;border-radius:3px;font-size:10px;padding:13px 20px;transition:background .2s}
.cta:hover{background:#774155;border-color:#774155}
.reset{color:#9c8279;font-size:9px;text-underline-offset:4px}
.detail-scrim{background:#38232c75;backdrop-filter:blur(10px)}
.detail-card{border-color:#ddc9be;background:#fffbf7;border-radius:12px;box-shadow:0 30px 90px #31162350}
.detail-hero::after{background:linear-gradient(to top,#fffbf7,transparent 70%)}
.detail-body h3{color:var(--wine);font-size:42px;letter-spacing:-.5px}
.detail-h,.detail-kicker{color:#9b6b5a}
.opt-card{border-color:#eadcd2;background:#fffcf8;border-radius:8px}
.opt-card:hover{border-color:#ba9680;background:#f7eeea}
.detail-x,.detail-up{background:#fffaf0ed;border-color:#dec8bb;color:var(--wine)}
@media(min-width:1500px){.hero-layout{min-height:730px}.hero-art{height:595px}.hero-main-photo{height:560px}.hero-small-photo{height:285px}.hero-copy h1{font-size:108px}}
@media(max-width:1100px){.wrap{width:calc(100% - 64px)}.hero-layout{gap:25px;min-height:600px}.hero-art{height:490px}.hero-main-photo{height:455px;width:85%}.hero-small-photo{height:220px;left:-8px}.hero-copy h1{font-size:76px}.hero-actions{gap:18px}.hero-footnote{font-size:6px;letter-spacing:.08em}.chips{grid-template-columns:repeat(3,minmax(0,1fr))}.chapter-heading{max-width:72%}.header-links{gap:19px;margin-right:5px}.inspiration-grid{gap:16px}.mood-copy{left:20px;right:20px}.mood-copy strong{font-size:31px}.hero-index>div{gap:18px}}
@media(max-width:760px){.wrap{width:calc(100% - 40px)}.sitehead .wrap{padding:17px 0}.brand{font-size:26px}.brand small{font-size:7px;letter-spacing:.09em}.header-links{display:none}.head-wa{font-size:9px;padding:10px 15px}.hero-layout{grid-template-columns:1fr 1fr;gap:14px;min-height:495px;padding-top:32px;padding-bottom:20px}.hero-copy h1{font-size:59px;letter-spacing:-2px;margin:20px 0}.hero-copy>p{font-size:11px;line-height:1.85}.atelier-kicker{font-size:7px;letter-spacing:.13em}.hero-actions{margin-top:24px;gap:17px}.atelier-button{padding:13px 17px;font-size:9px;gap:17px}.atelier-link{font-size:9px}.hero-footnote{display:none}.hero-art{height:410px}.hero-main-photo{height:375px;width:86%}.hero-main-photo figcaption{font-size:16px;padding:0 12px;bottom:20px}.hero-small-photo{width:45%;height:178px;left:-8px;bottom:5px}.hero-small-photo figcaption{font-size:10px}.hero-seal{width:70px;height:70px;right:-3px;top:20px}.hero-seal span{font-size:6px}.hero-seal svg{width:15px;height:15px}.hero-caption{font-size:5px;bottom:10px}.hero-index{padding:15px 0}.hero-index>span{display:none}.hero-index>div{gap:20px}.hero-index a{font-size:8px}.atelier-ribbon{gap:17px;padding:17px 15px}.atelier-ribbon span{font-size:18px}.atelier-ribbon i{font-size:8px}section.block{padding-top:58px}.collection-intro h2{font-size:49px}.collection-note{max-width:250px}.collection-intro .collection-note p{font-size:10px}.collection-note>span{font-size:7px}.collection-intro{gap:24px;flex-wrap:nowrap;margin-bottom:26px}.collection-nav{margin-bottom:32px}.collection-nav a{font-size:10px;padding:15px 12px;gap:10px}.collection-nav a span{font-size:15px}.chapter-heading{padding:24px;max-width:75%}.chapter-head{min-height:195px}.chapter-head h3{font-size:31px}.chapter-head p{font-size:10px;max-width:300px}.chapter-heading>span{font-size:7px}.chapter-count{font-size:6px;right:10px;bottom:10px}.chips{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.chip{padding:13px;min-height:96px}.chip .nm{font-size:11px}.chip .ds{font-size:9px}.chip .thumb{width:51px;height:62px}.groups{gap:36px}.inspiration-section{padding-top:60px}.inspiration-head h2{font-size:43px}.inspiration-head>p{font-size:10px}.inspiration-grid{gap:12px}.mood-card{border-radius:100px 100px 4px 4px;aspect-ratio:3/4.7}.mood-copy{bottom:19px;left:16px;right:16px}.mood-copy strong{font-size:25px;margin:8px 0 12px}.mood-copy small{font-size:5px}.mood-copy>span{font-size:7px}.atelier-process{gap:22px;margin-top:42px;padding:23px 0}.atelier-process>div{padding-right:12px}.atelier-process h3{font-size:21px}.atelier-process p{font-size:9px}.atelier-process span{font-size:6px}.selbar .wrap{gap:10px}.selbar .lbl{font-size:7px}.selbar .cta{padding:12px 15px;font-size:9px}.picked .empty{font-size:9px}.detail-body h3{font-size:32px}.atelier-signoff>span{font-size:20px}}
@media(max-width:520px){body{padding-bottom:125px}.wrap{width:calc(100% - 36px)}.hero-layout{grid-template-columns:1fr;padding-top:36px;padding-bottom:22px;gap:27px}.hero-copy h1{font-size:clamp(48px,15.6vw,64px);line-height:.98;letter-spacing:-2px;margin:22px 0}.hero-copy>p{max-width:290px;font-size:12px}.hero-copy .atelier-kicker{font-size:8px}.hero-actions{gap:22px}.atelier-button{padding:15px 19px;font-size:10px}.atelier-link{font-size:10px}.hero-art{height:395px;margin:0 14px 0 18px}.hero-main-photo{width:81%;height:367px}.hero-small-photo{width:40%;height:206px;left:-12px;bottom:0}.hero-small-photo figcaption{font-size:12px}.hero-main-photo figcaption{font-size:20px}.hero-seal{width:80px;height:80px;right:-10px;top:23px}.hero-seal span{font-size:7px}.hero-caption{font-size:6px;right:-4px;bottom:3px}.hero-index>div{gap:18px}.hero-index a{font-size:7px}.hero-index .scroll-cue{font-size:0;gap:0}.scroll-cue span{font-size:18px}.atelier-ribbon{gap:12px;flex-wrap:wrap;padding:18px}.atelier-ribbon span{font-size:17px}.atelier-ribbon span:last-child,.atelier-ribbon i:last-of-type{display:none}.collection-intro{display:block}.collection-intro h2{font-size:52px}.collection-note{max-width:100%;margin-top:18px}.collection-intro .collection-note p{font-size:11px;max-width:295px}.collection-note>span{font-size:7px}.collection-nav a{font-size:9px;padding:15px 8px;gap:6px}.collection-nav a:first-child{padding-left:0}.collection-nav a b{display:none}.chapter-head{min-height:220px}.chapter-heading{padding:22px;max-width:88%}.chapter-heading>span{font-size:6px;gap:9px;letter-spacing:.12em}.chapter-heading .chapter-no{font-size:18px;padding-right:9px}.chapter-head h3{font-size:32px;max-width:235px;margin:15px 0 12px}.chapter-head p{max-width:225px;font-size:10px;color:#725b59}.chapter-image{width:48%;opacity:.7}.chapter-image::after{background:linear-gradient(90deg,#f0e6de 5%,#f0e6de85 50%,transparent)}.chapter-count{bottom:10px;right:10px;font-size:5px}.chips{gap:9px}.chip{padding:12px 10px;min-height:147px;align-items:flex-start;flex-direction:column;gap:10px}.chip .thumb{width:44px;height:49px;border-radius:25px 25px 3px 3px}.chip .txt{padding:0}.chip .nm{font-size:10px}.chip .ds{font-size:8px;line-height:1.6}.inspiration-head{display:block}.inspiration-head h2{font-size:46px}.inspiration-head>p{margin-top:19px;font-size:11px}.inspiration-grid{grid-template-columns:1fr;gap:20px}.mood-card{aspect-ratio:4/4.4;border-radius:150px 150px 5px 5px}.mood-copy{left:25px;right:25px;bottom:25px}.mood-copy small{font-size:7px}.mood-copy strong{font-size:37px;margin:12px 0 17px}.mood-copy>span{font-size:10px}.atelier-process{grid-template-columns:1fr;gap:22px;padding:28px 0}.atelier-process>div{padding:0 0 21px;border-right:0;border-bottom:1px solid #e4d5cd}.atelier-process>div:last-child{padding-bottom:0}.atelier-process span{font-size:7px}.atelier-process h3{font-size:25px}.atelier-process p{font-size:10px}.atelier-signoff{align-items:start;flex-direction:column;gap:15px}.atelier-signoff>span{font-size:24px}.selbar .wrap{display:grid;grid-template-columns:1fr auto;gap:8px 12px;padding:11px 0}.selbar .lbl{grid-column:1;font-size:7px}.selbar .picked{grid-column:1;grid-row:2;min-width:0;max-height:45px;overflow:auto}.selbar .reset{grid-row:1;grid-column:2;justify-self:end;padding:0}.selbar .cta{grid-column:2;grid-row:2;font-size:9px;padding:12px 15px}.picked .empty{font-size:8px;line-height:1.5}.picked .p{font-size:8px;padding:4px 7px}.sitehead .wrap{gap:10px}.brand{font-size:24px}.head-wa{font-size:8px;padding:10px 12px}.detail-body h3{font-size:31px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation:none!important;transition:none!important}.chip:hover,.atelier-button:hover{transform:none}}
'''


# Restore the original cream/champagne/rose-gold palette, keeping the editorial layout.
ORIGINAL_PALETTE = r'''
:root{--background:oklch(0.985 0.018 88);--foreground:oklch(0.29 0.025 65);--secondary:oklch(0.955 0.035 85);--muted-foreground:oklch(0.47 0.026 65);--border:oklch(0.77 0.065 80 / 0.4);--gold:oklch(0.52 0.085 75);--rose-gold:oklch(0.54 0.088 24);--champagne:oklch(0.92 0.06 84);--wine:var(--foreground);--blush:var(--champagne);--original-gold-fill:linear-gradient(115deg,oklch(0.89 0.085 88),oklch(0.8 0.09 72) 45%,oklch(0.92 0.075 87) 75%,oklch(0.83 0.07 38))}
body{background:radial-gradient(circle at 15% 0%,var(--secondary),var(--background) 55%)}
.sitehead{background:oklch(0.992 0.014 88 / .95);border-color:var(--border)}
.atelier-hero{background:radial-gradient(ellipse at 75% 28%,oklch(0.94 0.055 85),transparent 60%),var(--background)}
.brand small,.atelier-kicker,.chapter-heading>span,.chapter-heading .chapter-no,.collection-note>span,.collection-nav a span,.collection-nav a b,.hero-footnote,.hero-caption,.hero-index>span,.atelier-process span,.atelier-signoff>a,.selbar .lbl{color:var(--gold)}
.hero-copy h1 em,.collection-intro h2 em,.inspiration-head h2 em,.chapter-head h3 em,.atelier-signoff>span{color:var(--rose-gold)}
.header-links a,.hero-copy>p,.hero-index a,.collection-intro .collection-note p,.chapter-head p,.chip .ds,.inspiration-head>p,.atelier-process p,.picked .empty,.reset{color:var(--muted-foreground)}
.header-links a:hover{color:var(--gold)}
.head-wa,.atelier-button,.cta{background:var(--original-gold-fill);border:1px solid oklch(0.82 0.08 82 / .6);color:var(--foreground)}
.head-wa:hover,.atelier-button:hover,.cta:hover{background:var(--original-gold-fill);border-color:var(--gold);color:var(--foreground);filter:brightness(1.04)}
.atelier-link{color:var(--foreground);text-decoration-color:var(--gold)}
.hero-outline,.hero-seal,.hero-index,.collection-nav,.collection-nav a,.atelier-process,.atelier-process>div{border-color:var(--border)}
.fine-line{background:var(--gold)}
.hero-seal{background:oklch(0.985 0.025 88 / .95)}
.hero-seal span,.hero-seal svg,.hero-small-photo figcaption{color:var(--gold)}
.hero-small-photo{background:oklch(0.995 0.015 88)}
.atelier-ribbon{background:linear-gradient(110deg,oklch(0.93 0.055 85),oklch(0.88 0.075 82),oklch(0.94 0.045 88));color:var(--foreground);border-block:1px solid var(--border)}
.atelier-ribbon i{color:var(--gold)}
.collection-nav a,.chip .nm,.atelier-process h3{color:var(--foreground)}
.collection-nav a:hover{background:var(--secondary)}
.chapter-head{background:var(--secondary);border-color:var(--border)}
.chapter-image::after{background:linear-gradient(90deg,var(--secondary),transparent 38%)}
.chapter-count{background:oklch(0.995 0.015 88 / .9);color:var(--gold);border-color:var(--border)}
.chip,.opt-card{background:oklch(0.995 0.01 90 / .7);border-color:var(--border)}
.chip:hover,.opt-card:hover{background:var(--secondary);border-color:var(--gold);box-shadow:0 9px 22px oklch(0.48 0.06 72 / .13)}
.chip[aria-pressed="true"],.picked .p{background:linear-gradient(115deg,oklch(0.93 0.06 84),oklch(0.96 0.04 86));border-color:var(--gold);color:var(--foreground)}
.selbar{background:oklch(0.99 0.015 88 / .95);border-color:var(--border)}
.detail-card{background:linear-gradient(168deg,oklch(0.997 0.012 90 / .99),oklch(0.972 0.03 87 / .99));border-color:var(--border)}
.detail-hero::after{background:linear-gradient(to top,oklch(0.99 0.012 90 / .98),transparent 70%)}
.detail-scrim{background:oklch(0.28 0.03 65 / .42)}
.detail-h{color:var(--rose-gold)}
.detail-kicker{color:var(--gold)}
.detail-x,.detail-up{background:oklch(0.99 0.012 90 / .94);border-color:var(--border);color:var(--foreground)}
a:focus-visible,button:focus-visible{outline-color:var(--gold)}
@media(max-width:520px){.chapter-image::after{background:linear-gradient(90deg,var(--secondary) 5%,oklch(0.955 0.035 85 / .6) 50%,transparent)}}
'''

SCRIPT = r'''
<script>
(function(){
  // Inspiration cards reuse the original, fully populated detail sheets.
  document.querySelectorAll('[data-inspire]').forEach(function(button){
    button.addEventListener('click',function(){
      var name=button.getAttribute('data-inspire');
      var chip=Array.from(document.querySelectorAll('button.chip')).find(function(c){return c.querySelector('.nm').textContent.trim()===name;});
      if(chip)chip.click();
    });
  });
  // Trap keyboard focus inside the two-level dialog; restore its opener on close.
  var sheet=document.getElementById('detail'),previous=null;
  function focusables(){return Array.from(sheet.querySelectorAll('button,a[href],input,select,textarea,[tabindex="0"]')).filter(function(n){return !n.closest('[hidden]')&&n.getClientRects().length;});}
  document.addEventListener('click',function(e){if(sheet.hidden)previous=e.target.closest('button,a[href]');},true);
  new MutationObserver(function(changes){
    if(!changes.some(function(c){return c.attributeName==='hidden'&&c.target===sheet;}))return;
    if(sheet.hidden){if(previous)previous.focus({preventScroll:true});}
    else {var close=sheet.querySelector('[data-close].detail-x');if(close)close.focus({preventScroll:true});}
  }).observe(sheet,{attributes:true,attributeFilter:['hidden']});
  sheet.addEventListener('keydown',function(e){
    if(e.key!=='Tab')return;
    var items=focusables();if(!items.length)return;
    var first=items[0],last=items[items.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
})();
</script>
'''


def enhance(text: str) -> str:
    """Decorate the English-only shell without touching its existing data/JS."""
    assert '<h1>Every decoration' in text
    # Convert the existing introduction into the catalogue header; hero is the only h1.
    start = text.index('        <div class="head">')
    end = text.index('        <div class="groups">', start)
    text = text[:start] + CATALOGUE_HEAD + '\n' + text[end:]
    for index, chapter in enumerate(CHAPTERS):
        anchor, number, kicker, title, intro, photo, alt, count = chapter
        pattern = r'<article class="group">\s*<span class="group-no">' + number + r'</span>.*?(?=<div class="chips">)'
        header = f'''<article class="group" id="{anchor}" aria-labelledby="{anchor}-title">
          <div class="chapter-head"><div class="chapter-heading"><span><b class="chapter-no">{number}</b>{kicker}</span><h3 id="{anchor}-title">{title}</h3><p>{intro}</p></div><div class="chapter-image"><img src="img/{photo}" alt="{alt}" loading="lazy" width="640" height="1147"></div><span class="chapter-count">{count}</span></div>\n            '''
        text, n = re.subn(pattern, lambda _: header, text, count=1, flags=re.S)
        assert n == 1, anchor
    text = text.replace('<body>', '<body>\n' + AMBIENT + '<a class="skip-link" href="#main-content">Skip to content</a>', 1)
    text = text.replace('        <a class="head-wa"', '        <nav class="header-links" aria-label="Main navigation"><a href="#collections">The collections</a><a href="#inspiration-title">Find your mood</a></nav>\n        <a class="head-wa"', 1)
    text = text.replace('</header>', '</header>\n' + HERO, 1)
    text = text.replace('    <!-- detail sheet:', CLOSING + '\n    <!-- detail sheet:', 1)
    text = text.replace('<a href="#collections" class="scroll-cue"', TOGGLE + '<a href="#collections" class="scroll-cue"', 1)
    # Bundle fonts so the look is consistent without Google Fonts/network access.
    fonts = ""
    for family, display, styles in [
        ("cormorant-garamond", "Cormorant Garamond", ["normal", "italic"]),
        ("manrope", "Manrope", ["normal"]),
    ]:
        for style in styles:
            path = Path(__file__).parent / "fonts" / f"{family}-latin-wght-{style}.woff2"
            encoded = base64.b64encode(path.read_bytes()).decode("ascii")
            fonts += f"@font-face{{font-family:'{display}';font-style:{style};font-weight:100 900;font-display:swap;src:url(data:font/woff2;base64,{encoded}) format('woff2')}}\n"
    text = re.sub(r'<link[^>]*fonts\.(?:googleapis|gstatic)[^>]*>', '', text)
    text = text.replace('</style>', fonts + CSS + ORIGINAL_PALETTE + MOTION_CSS + '\n</style>', 1)
    text = text.replace('</body>', SCRIPT + MOTION_SCRIPT + '\n</body>', 1)
    return text
