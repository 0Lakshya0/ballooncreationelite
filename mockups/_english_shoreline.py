"""Photo-as-island contact crests and outward wakes, English headers only.

SVG paths hug the measured asymmetric photo corners. They remain visible above
the colour veil, beneath the foreground photo/text. The existing WebGL surface
also bends around the same obstacle; no extra canvas/context or RAF is added.
"""

CSS = r'''
.photo-shoreline{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:0;color:#fff4d8}
.photo-shoreline path{fill:none;vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
.shore-contact-shadow{stroke:#9e713e;stroke-width:4;opacity:.22}
.shore-contact{stroke:currentColor;stroke-width:2;stroke-dasharray:22 9 3 14 35 18;animation:shore-current 6s linear infinite;opacity:.95}
.shore-wake{stroke:currentColor;stroke-width:1.6;stroke-dasharray:34 8 3 11 52 12;opacity:0;animation:shore-break 3.6s ease-out infinite;transform-box:fill-box;transform-origin:right center}
.shore-wake-1{animation-delay:-1.2s}.shore-wake-2{animation-delay:-2.4s}
.scene-structures .shore-contact{animation-delay:-2s}.scene-structures .shore-wake{animation-duration:4.2s}
.scene-experiences .photo-shoreline{color:#ffe2aa}.scene-experiences .shore-contact{animation-delay:-4s}.scene-experiences .shore-wake{animation-duration:4.6s}
@keyframes shore-current{from{stroke-dashoffset:0}to{stroke-dashoffset:-202}}
@keyframes shore-break{0%{opacity:0;transform:translate(0,0) scale(1)}18%{opacity:.78}100%{opacity:0;transform:translate(-12px,5px) scale(1.045)}}
html:not([data-motion="on"]) .photo-shoreline path,html[data-motion-suspended] .photo-shoreline path,
.section-scope:not([data-inview="true"]) .photo-shoreline path{animation-play-state:paused!important}
@media(max-width:520px){.shore-contact{stroke-width:1.8}.shore-wake{stroke-width:1.35}}
@media(prefers-reduced-motion:reduce){.photo-shoreline path{animation:none!important;transform:none}.shore-contact{stroke-dasharray:none;opacity:.65}.shore-wake{opacity:0}}
'''

SCRIPT = r'''
<script>
(function(){
  'use strict';
  var ns='http://www.w3.org/2000/svg';
  var entries=[];
  document.querySelectorAll('.group .chapter-head').forEach(function(head){
    var photo=head.querySelector('.chapter-image');
    if(!photo)return;
    var svg=document.createElementNS(ns,'svg');
    svg.setAttribute('class','photo-shoreline');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
    var paths=['shore-contact-shadow','shore-contact','shore-wake shore-wake-0','shore-wake shore-wake-1','shore-wake shore-wake-2'].map(function(name){
      var p=document.createElementNS(ns,'path');p.setAttribute('class',name);svg.appendChild(p);return p;
    });
    head.insertBefore(svg,photo);
    entries.push({head:head,photo:photo,svg:svg,paths:paths});
  });
  function contour(x,y,w,h,tl,bl,gap,seed){
    // Sample an OPEN, gently irregular coast. No closed rings or rotating halo.
    var points=[],travel=0,last=null;
    function point(px,py,nx,ny){
      if(last)travel+=Math.hypot(px-last[0],py-last[1]);
      last=[px,py];
      var chop=Math.sin(travel*.15+seed)*(.45+gap*.09)+Math.sin(travel*.063+seed)*.55;
      var distance=Math.max(.5,gap+chop);
      points.push((px+nx*distance).toFixed(2)+' '+(py+ny*distance).toFixed(2));
    }
    function line(ax,ay,bx,by,nx,ny){
      var steps=Math.max(1,Math.ceil(Math.hypot(bx-ax,by-ay)/4));
      for(var j=0;j<=steps;j++){var f=j/steps;point(ax+(bx-ax)*f,ay+(by-ay)*f,nx,ny);}
    }
    function arc(cx,cy,r,from,to){
      var steps=Math.max(4,Math.ceil(Math.abs(to-from)*r/4));
      for(var j=0;j<=steps;j++){var a=from+(to-from)*j/steps;point(cx+r*Math.cos(a),cy+r*Math.sin(a),Math.cos(a),Math.sin(a));}
    }
    line(x+w*.84,y,x+tl,y,0,-1);
    arc(x+tl,y+tl,tl,-Math.PI/2,-Math.PI);
    line(x,y+tl,x,y+h-bl,-1,0);
    arc(x+bl,y+h-bl,bl,Math.PI,Math.PI/2);
    line(x+bl,y+h,x+w*.90,y+h,0,1);
    return 'M '+points.join(' L ');
  }
  function layout(){
    entries.forEach(function(e){
      var photo=e.photo,style=getComputedStyle(photo);
      var tl=parseFloat(style.borderTopLeftRadius)||0,bl=parseFloat(style.borderBottomLeftRadius)||0;
      var x=photo.offsetLeft,y=photo.offsetTop,w=photo.offsetWidth,h=photo.offsetHeight;
      e.svg.setAttribute('viewBox','0 0 '+e.head.clientWidth+' '+e.head.clientHeight);
      e.paths.forEach(function(path,i){path.setAttribute('d',contour(x,y,w,h,tl,bl,i<2?1.5:3+(i-2)*4,i<2?0:i*1.7));});
    });
    window.dispatchEvent(new Event('bce:shoreline-layout'));
  }
  layout();
  if('ResizeObserver' in window){
    var observer=new ResizeObserver(layout);
    entries.forEach(function(e){observer.observe(e.head);observer.observe(e.photo);});
    window.addEventListener('pagehide',function(){observer.disconnect();});
    window.addEventListener('pageshow',function(e){if(e.persisted){entries.forEach(function(item){observer.observe(item.head);observer.observe(item.photo);});layout();}});
  }else{window.addEventListener('resize',layout,{passive:true});}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layout);
})();
</script>
'''
