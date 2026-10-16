"""Raised photo obstacles: reveal the rendered 3D collision, never SVG borders.

A single ResizeObserver updates real photo geometry. The existing seven WebGL
surfaces render the bow wave, split current and wake; no extra context or RAF.
"""

CSS = r'''
/* Keep the approved image position/opacity; give the obstacle a solid raised foot. */
.group.section-scope .chapter-image{box-shadow:-1px 1px 0 #eedbb9,-3px 3px 0 #c6a57a,-5px 5px 0 #9d794e,-9px 13px 15px #4d351e40}
/* Do not bleach away the 3D collision with the foreground colour veil.
   Only the photo neighbourhood is softly unmasked; all section fades remain. */
.section-scope[data-photo-island] .liquid-veil{-webkit-mask-image:radial-gradient(ellipse var(--impact-rx) var(--impact-ry) at var(--impact-x) var(--impact-y),#00000012 38%,#000 100%);mask-image:radial-gradient(ellipse var(--impact-rx) var(--impact-ry) at var(--impact-x) var(--impact-y),#00000012 38%,#000 100%)}
@media(max-width:520px){.group.section-scope .chapter-image{box-shadow:-1px 1px 0 #eedbb9,-2px 3px 0 #c6a57a,-4px 5px 0 #9d794e,-7px 10px 12px #4d351e3b}}
'''

SCRIPT = r'''
<script>
(function(){
  'use strict';
  var entries=Array.from(document.querySelectorAll('.group.section-scope')).map(function(scope){
    return {scope:scope,photo:scope.querySelector('.chapter-image'),head:scope.querySelector('.chapter-head')};
  }).filter(function(item){return item.photo;});
  function layout(){
    entries.forEach(function(e){
      var x=0,y=0,node=e.photo;
      while(node&&node!==e.scope){x+=node.offsetLeft;y+=node.offsetTop;node=node.offsetParent;}
      var w=e.photo.offsetWidth,h=e.photo.offsetHeight;
      e.scope.setAttribute('data-photo-island','raised');
      e.scope.style.setProperty('--impact-x',(x+w*.48)+'px');
      e.scope.style.setProperty('--impact-y',(y+h*.58)+'px');
      e.scope.style.setProperty('--impact-rx',(w*.72+65)+'px');
      e.scope.style.setProperty('--impact-ry',(h*.68+70)+'px');
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
