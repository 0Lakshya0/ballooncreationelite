// Standalone final-page regression checks. Run from the repo root:
// node --test mockups/tests/english-final.test.cjs
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'..');
const read=(name)=>fs.readFileSync(path.join(root,name),'utf8');
function open(name='final/decor-types-final.html',options={}){
 const errors=[];
 const console=new VirtualConsole();console.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(read(name),{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost:8090/',virtualConsole:console,...options});
 return {dom,w:dom.window,d:dom.window.document,errors};
}

test('English page has the new editorial shell, original tagline and no removed footer',()=>{
 const {dom,d,errors}=open();
 try{
  assert.equal(d.querySelectorAll('h1').length,1);
  assert.match(d.querySelector('h1').textContent,/Some days/);
  assert.equal(d.querySelector('.brand small').textContent,'We decorate your happiness');
  assert.equal(d.querySelectorAll('.chapter-head').length,3);
  assert.equal(d.querySelectorAll('.mood-card').length,3);
  assert.equal(d.querySelectorAll('footer,.sitefoot,.banner,.note').length,0);
  assert(!/draft|mockup|preview|placeholder/i.test(d.body.textContent));
  assert(!d.body.textContent.includes('Tell us your date and venue'));
  assert.deepEqual(errors,[]);
 }finally{dom.window.close();}
});

test('All 25 styles and 150 options still open with complete detail and round profile images',()=>{
 const {dom,d,w,errors}=open();
 try{
  const chips=[...d.querySelectorAll('button.chip')];assert.equal(chips.length,25);
  let options=0;
  for(const chip of chips){
   const name=chip.querySelector('.nm').textContent.trim();
   assert(chip.querySelector('.thumb img'));
   chip.click();
   assert.equal(d.querySelector('#detail').hidden,false);
   assert.equal(d.querySelector('#detail-title').textContent,name);
   assert(d.querySelector('#c-what').textContent.length>20);
   const names=Object.keys(w.DECOR_DATA[name].options);
   for(const optName of names){
    const button=[...d.querySelectorAll('#c-opts [data-opt]')].find(e=>e.getAttribute('data-opt')===optName);
    assert(button.querySelector('.opt-thumb img'));
    button.click();options++;
    assert.equal(d.querySelector('#view-opt').hidden,false);
    assert.equal(d.querySelector('#opt-title').textContent,optName);
    for(const id of ['opt-what','opt-how','opt-where','opt-note','opt-time','opt-colours'])assert(d.getElementById(id).textContent.length>0,`${name}/${optName}: ${id}`);
    d.querySelector('#opt-back').click();
    assert.equal(d.querySelector('#view-chip').hidden,false);
   }
  }
  assert.equal(options,150);
  assert.deepEqual(errors,[]);
 }finally{dom.window.close();}
});

test('Each inspiration card opens its corresponding original detail sheet',()=>{
 const {dom,d}=open();
 try{
  for(const card of d.querySelectorAll('[data-inspire]')){
   card.click();assert.equal(d.querySelector('#detail-title').textContent,card.getAttribute('data-inspire'));
   d.querySelector('.detail-x').click();assert(d.querySelector('#detail').hidden);
  }
 }finally{dom.window.close();}
});

test('Saving options, Escape back navigation, reset and WhatsApp enquiry work',()=>{
 const {dom,d,w}=open();
 try{
  d.querySelector('.chip').click();
  d.querySelector('#c-opts [data-opt]').click();
  const option=d.querySelector('#opt-title').textContent;
  d.querySelector('#opt-add').click();assert(d.querySelector('.picked').textContent.includes(option));
  let url;w.open=(target)=>{url=target;};d.querySelector('.selbar .cta').click();
  assert(url.startsWith('https://wa.me/917489863753?text='));assert(decodeURIComponent(url).includes(option));
  d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert(!d.querySelector('#view-chip').hidden);
  d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert(d.querySelector('#detail').hidden);
  d.querySelector('.reset').click();assert(d.querySelector('.picked .empty'));
 }finally{dom.window.close();}
});

test('Offline English copy embeds photos/fonts, and internal section links resolve',()=>{
 const {dom,d,errors}=open('final-english-showcase/index.html');
 try{
  for(const image of d.querySelectorAll('.atelier-hero img,.chapter-head img,.mood-card img,.chip img'))assert(image.src.startsWith('data:image/'));
  d.querySelector('.chip').click();assert(d.querySelector('#detail-img').src.startsWith('data:image/'));
  for(const link of d.querySelectorAll('a[href^="#"]')){
   const id=link.getAttribute('href').slice(1);if(id)assert(d.getElementById(id),id);
  }
  assert(read('final-english-showcase/index.html').includes('data:font/woff2;base64,'));
  assert.deepEqual(errors,[]);
 }finally{dom.window.close();}
});

test('Photo references exist and bilingual final remains on its separate original design',()=>{
 for(const match of read('final/decor-types-final.html').matchAll(/img\/([a-z0-9-]+\.jpg)/g))assert(fs.existsSync(path.join(root,'img',match[1])),match[1]);
 const bilingual=read('final-showcase/index.html');
 assert(bilingual.includes('class="langsw"'));
 assert(!bilingual.includes('class="atelier-hero"'));
});


test('Motion can be paused and resumed, persists preference, and has a safe observer fallback',()=>{
 const {dom,d,w,errors}=open();
 try{
  assert.equal(d.documentElement.getAttribute('data-motion'),'on');
  const toggle=d.querySelector('.motion-toggle');assert(toggle);
  assert.equal(d.querySelector('.section-atmosphere').getAttribute('aria-hidden'),'true');
  toggle.click();assert.equal(d.documentElement.getAttribute('data-motion'),'off');
  assert.equal(toggle.getAttribute('aria-pressed'),'true');
  assert.equal(w.localStorage.getItem('bce-english-motion'),'off');
  assert([...d.querySelectorAll('.chapter-head,.chip')].every(e=>e.classList.contains('is-visible')));
  toggle.click();assert.equal(d.documentElement.getAttribute('data-motion'),'on');
  assert.equal(toggle.getAttribute('aria-pressed'),'false');
  assert.deepEqual(errors,[]);
 }finally{dom.window.close();}
});

test('Reduced-motion users receive static, visible content and no enabled motion control',()=>{
 const {dom,d,errors}=open('final/decor-types-final.html',{beforeParse(w){
  w.matchMedia=()=>({matches:true,addEventListener(){}});
 }});
 try{
  assert.equal(d.documentElement.getAttribute('data-motion'),'off');
  assert(d.querySelector('.motion-toggle').disabled);
  assert.equal(d.querySelector('.motion-toggle span').textContent,'Motion off');
  assert([...d.querySelectorAll('.chapter-head,.chip')].every(e=>e.classList.contains('is-visible')));
  assert.deepEqual(errors,[]);
 }finally{dom.window.close();}
});


test('Seven independently contained section atmospheres replace the rejected full-page wash',()=>{
 const {dom,d}=open();
 try{
  assert.equal(d.querySelectorAll('.section-scope').length,7);
  assert.equal(d.querySelectorAll('.section-atmosphere').length,7);
  assert.equal(d.querySelectorAll('.section-tone').length,14);
  for(const scope of d.querySelectorAll('.section-scope')){
   assert.equal(scope.querySelector('.section-atmosphere').parentElement,scope);
   assert.equal(scope.querySelector('.section-atmosphere').getAttribute('aria-hidden'),'true');
   assert.equal(scope.getAttribute('data-inview'),'true'); // safe no-observer fallback
  }
  assert(d.querySelector('#elements.scene-elements'));
  assert(d.querySelector('#structures.scene-structures'));
  assert(d.querySelector('#experiences.scene-experiences'));
  assert(d.querySelector('.inspiration-section.scene-inspiration'));
  assert.equal(d.querySelectorAll('.atelier-ambient,.colour-atmosphere,.colour-layer,.silk-scene,.hero-motion,.hero-spotlight,.ambient-petals').length,0);
  assert(d.querySelector('.hero-copy .motion-toggle'));
 }finally{dom.window.close();}
});


test('Local fades have distinct opaque colour endpoints and shorter visible cycles',()=>{
 const s=read('_english_motion.py');
 assert(s.includes('hero-champagne-fade 10s'));
 assert(s.includes('elements-pearl-light 4.5s'));
 assert(s.includes('settings-blush-fade 5.5s'));
 assert(s.includes('magic-candlelight 5s'));
 assert(s.includes('inspiration-rose-fade 6s'));
 for(const name of ['hero','elements','structures','experiences','inspiration']){
  const rule=s.match(new RegExp('\\.scene-'+name+' \\.tone-one\\{([^}]+)\\}'));
  assert(rule,name);assert(!rule[1].includes('transparent'),name+' primary colour must cover its entire section');
 }
});


test('Former white slots are warm local scenes with background-only fluid depth',()=>{
 const {dom,d}=open();
 try{
  assert(d.querySelector('.discovery-panel.scene-discovery .collection-intro'));
  assert(d.querySelector('.discovery-panel.scene-discovery .collection-nav'));
  assert(d.querySelector('.atelier-process.scene-process'));
  assert.equal(d.querySelectorAll('.fluid-field').length,7);
  for(const field of d.querySelectorAll('.fluid-field')){
   assert(field.closest('.section-atmosphere[aria-hidden="true"]'));
   assert.equal(field.querySelectorAll('.fluid-lobe').length,2);
   assert(field.querySelector('.fluid-sheen'));
  }
 }finally{dom.window.close();}
});


test('Liquid gold uses local WebGL canvases with procedural surface lighting and a CSS fallback',()=>{
 const {dom,d,errors}=open();
 try{
  assert.equal(d.querySelectorAll('.liquid-gold-canvas').length,7);
  for(const canvas of d.querySelectorAll('.liquid-gold-canvas')){
   assert(canvas.closest('.section-atmosphere[aria-hidden="true"]'));
   assert(canvas.closest('.fluid-field').querySelector('.fluid-gold'));
  }
  const source=read('_english_liquid_gold.py');
  for(const marker of ['reflect(-eye,normal)','gl.drawArrays','uTime','webglcontextlost','bce:motionchange'])assert(source.includes(marker),marker);
  assert(!d.querySelector('.liquid-ready')); // jsdom has no WebGL: safe CSS surface remains.
  assert.deepEqual(errors,[]);
 }finally{dom.window.close();}
});


test('Rendered liquid material restores the cream/champagne/rose loop instead of dark bronze',()=>{
 const source=read('_english_liquid_gold.py');
 for(const marker of [
  'mod(uTime+uPhase*1.8,10.)/10.',
  'goldWeight=smoothstep(0.,.35,cycle)*(1.-smoothstep(.35,.70,cycle))',
  'roseWeight=smoothstep(.35,.70,cycle)*(1.-smoothstep(.70,1.,cycle))',
  'cream*(1.-goldWeight-roseWeight)+champagneGold*goldWeight+roseGold*roseWeight',
  'vec3(.67,.62,.56)',
 ])assert(source.includes(marker),marker);
 for(const name of ['cream','champagneGold','roseGold']){
  const channels=source.match(new RegExp('vec3 '+name+'=vec3\\(([^)]+)\\)'))[1].split(',').map(Number);
  assert.equal(channels.length,3);
  assert(channels.every(v=>v>=.58&&v<=1),name+' must retain a light warm material');
  assert(channels[0]>=channels[1]&&channels[1]>=channels[2],name+' must stay in the warm gold family');
 }
 assert(!source.includes('vec3 bronze='));
 assert(read('final-english-showcase/index.html').includes('vec3 roseGold='));
});


test('Visible colour fades sit above the opaque liquid, with animated buttons and finished connective gaps',()=>{
 const source=read('_english_refinement.py');
 const page=read('final-english-showcase/index.html');
 for(const marker of ['liquid-visible-cream','liquid-visible-champagne','liquid-visible-rose','button-gold-sweep','--colour-duration:10s','--colour-duration:11s','--colour-duration:12s','animation-play-state:paused!important','prefers-reduced-motion:reduce','section.block{padding-top:42px','margin-top:32px','chip:active','chip:focus-visible::after']){
  assert(source.includes(marker),marker);assert(page.includes(marker),marker+' must be in the publish artifact');
 }
 const {dom,d}=open();
 try{
  for(const field of d.querySelectorAll('.fluid-field')){
   assert.equal(field.firstElementChild.tagName,'CANVAS');
   assert(field.firstElementChild.nextElementSibling.matches('.liquid-veil'));
  }
  for(const selector of ['.head-wa','.atelier-button','.cta','.atelier-signoff'])assert(d.querySelector(selector),selector);
 }finally{dom.window.close();}
});


test('Mobile chapter photos are clearer without changing their layout or section counts',()=>{
 const css=read('_english_motion.py');
 assert(css.includes('.group.section-scope .chapter-image{opacity:.78;width:43%;'));
 assert(!css.includes('.chapter-image{opacity:.44;'));
 const {dom,d}=open();
 try{
  assert.deepEqual([...d.querySelectorAll('.chapter-count')].map(e=>e.textContent.trim()),['08 DECOR STYLES','09 DECOR STYLES','08 DECOR STYLES']);
  assert.equal(d.querySelectorAll('.chapter-image img').length,3);
 }finally{dom.window.close();}
});


test('Photo collisions displace the 3D liquid itself; SVG border waves are removed',()=>{
 const {dom,d,errors}=open();
 try{
  assert.equal(d.querySelectorAll('[data-photo-island="raised"]').length,3);
  assert.equal(d.querySelectorAll('.photo-shoreline,.shore-contact,.shore-wake').length,0);
  assert.equal(d.querySelectorAll('.liquid-gold-canvas').length,7);
  const shader=read('_english_liquid_gold.py'),shore=read('_english_shoreline.py');
  for(const marker of ['collisionSurface(pixel,t)','collisionSurface(pixel+vec2(1.5,0.),t)','collisionSurface(pixel+vec2(0.,1.5),t)','field+=vec3(impact.x*.016','surface(p+bend,t)','float bow=','float wake=','impact.y*.72'])assert(shader.includes(marker),marker);
  for(const marker of ['ResizeObserver','mask-image:radial-gradient','box-shadow:','bce:shoreline-layout'])assert(shore.includes(marker),marker);
  assert(!shore.includes('createElementNS'));
  assert(!shore.includes('requestAnimationFrame'));
  assert.deepEqual(errors,[]);
 }finally{dom.window.close();}
});
