"""Reflective liquid-gold height-field renderer, embedded in the English page.

GLSL reconstructs a flowing 3D surface normal, view vector and studio lighting.
No remote texture, video, dependency or claim of a physical-fluid simulation.
A single throttled RAF draws only visible sections, initialized lazily. Existing
CSS local colour motion remains the graceful fallback if WebGL is unavailable.
"""

CSS = r'''
.liquid-gold-canvas{position:absolute;inset:0;display:block;width:100%;height:100%;opacity:0;pointer-events:none}
.liquid-veil{position:absolute;inset:0;display:none;pointer-events:none;background:linear-gradient(105deg,#fff6e6d6 0%,#fff4e3d1 34%,#fff2df7a 58%,#fff2df26 100%)}
.liquid-ready .liquid-gold-canvas{opacity:.94}
.liquid-ready .liquid-veil{display:block}
.liquid-ready .fluid-lobe,.liquid-ready .fluid-sheen{display:none}
.scene-experiences .liquid-veil{background:linear-gradient(105deg,#312416d9,#392b1b80 50%,#392b1b33)}
.scene-experiences.liquid-ready .liquid-gold-canvas{opacity:.88}
.liquid-ready .hero-copy>p,.liquid-ready .chapter-head p{color:#493622}
.scene-experiences.liquid-ready .chapter-head p{color:#fff4df}
.scene-inspiration .liquid-veil{background:linear-gradient(105deg,#ffeedfba,#ffeddb70 60%,#ffecd53d)}
.scene-process .liquid-veil,.scene-discovery .liquid-veil{background:linear-gradient(110deg,#fff1d6c4,#fff1d699 65%,#fff1d666)}
@media(max-width:520px){.liquid-veil{background:linear-gradient(110deg,#fff6e6d9,#fff2e1b5 65%,#fff2df6b)}.scene-experiences .liquid-veil{background:linear-gradient(110deg,#312416df,#392b1b99 70%,#392b1b55)}}
'''

SCRIPT = r'''
<script>
(function(){
  'use strict';
  if(!('WebGLRenderingContext' in window))return;
  var root=document.documentElement;
  var states=Array.from(document.querySelectorAll('.section-scope')).map(function(scope,index){
    return {scope:scope,canvas:scope.querySelector('.liquid-gold-canvas'),gl:null,time:index*2.7,phase:index*.9,disabled:false,registered:false,frame:0};
  });
  var request=0,last=0;
  var vertex='attribute vec2 aPosition;varying vec2 vUv;void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}';
  var fragment=`
precision mediump float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform float uPhase;
// A continuous, folded surface: height and analytical derivatives.
vec3 surface(vec2 p,float t){
  float w1=p.x*2.15+sin(p.y*1.25+t*.28)*.86-t*.46;
  float w2=p.y*2.8+p.x*.52+t*.39;
  float w3=p.x*4.35-p.y*2.25+sin(p.x*.93+t*.21)*.62-t*.24;
  float h=.48*sin(w1)+.25*sin(w2)+.115*sin(w3);
  float dx=.48*cos(w1)*2.15+.25*cos(w2)*.52+.115*cos(w3)*(4.35+.5766*cos(p.x*.93+t*.21));
  float dy=.48*cos(w1)*1.075*cos(p.y*1.25+t*.28)+.25*cos(w2)*2.8-.115*cos(w3)*2.25;
  return vec3(h,dx,dy);
}
void main(){
  float t=uTime*.8+uPhase;
  float aspect=uResolution.x/uResolution.y;
  vec2 p=(vUv-.5)*vec2(3.8*max(aspect,1.),3.8/max(aspect,1.));
  p+=vec2(uPhase*.25,-t*.11);
  vec3 field=surface(p,t);
  vec3 normal=normalize(vec3(-field.y*.9,-field.z*.9,1.));
  vec3 eye=normalize(vec3(-p*.12,2.8-field.x*.12));
  vec3 reflected=reflect(-eye,normal);
  float fresnel=pow(1.-max(dot(normal,eye),0.),3.);
  // Warm studio reflections, not a rainbow gradient.
  float broad=.5+.5*sin(reflected.x*5.2+reflected.y*3.8+field.x*.55);
  // Restore the approved ten-second cream → champagne → rose → cream cycle.
  // Only the metal's material palette changes; the flowing surface stays intact.
  float cycle=mod(uTime+uPhase*1.8,10.)/10.;
  float goldWeight=smoothstep(0.,.35,cycle)*(1.-smoothstep(.35,.70,cycle));
  float roseWeight=smoothstep(.35,.70,cycle)*(1.-smoothstep(.70,1.,cycle));
  vec3 cream=vec3(1.,.973,.91);
  vec3 champagneGold=vec3(.949,.824,.58);
  vec3 roseGold=vec3(.949,.792,.69);
  vec3 gold=cream*(1.-goldWeight-roseWeight)+champagneGold*goldWeight+roseGold*roseWeight;
  // Lighter warm folds replace the old near-black bronze shadows.
  vec3 shadowGold=gold*vec3(.67,.62,.56);
  vec3 champagne=mix(gold,vec3(1.,.985,.94),.62);
  vec3 metal=mix(shadowGold,gold,smoothstep(.07,.88,broad));
  vec2 box1=vec2((reflected.y-.35)*3.7,(reflected.x+.12)*1.4);
  vec2 box2=vec2((reflected.x-.68)*8.,(reflected.y+.16)*2.2);
  float softbox=exp(-dot(box1,box1));
  float edgebox=exp(-dot(box2,box2));
  float highlight=pow(max(dot(reflected,normalize(vec3(-.45,.8,1.))),0.),36.);
  float diffuse=.72+.28*max(dot(normal,normalize(vec3(-.4,.75,1.2))),0.);
  metal*=diffuse;
  metal=mix(metal,champagne,clamp(softbox*.82+edgebox*.6,0.,.94));
  metal+=champagne*highlight*.42+gold*fresnel*.18;
  // Gentle curvature shadow makes the valleys and raised folds read as volume.
  metal*=.86+.14*smoothstep(-.65,.6,field.x);
  metal=pow(clamp(metal,0.,1.),vec3(.88));
  gl_FragColor=vec4(metal,1.);
}`;
  function shader(gl,type,source){
    var s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);return null;}return s;
  }
  function init(state){
    if(state.disabled||!state.canvas)return false;
    try{
      var gl=state.canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false,powerPreference:'low-power'});
      if(!gl){state.disabled=true;state.canvas.dataset.renderer='fallback';return false;}
      var high=gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER,gl.HIGH_FLOAT);
      var source=high&&high.precision>0?fragment.replace('precision mediump float;','precision highp float;'):fragment;
      var vs=shader(gl,gl.VERTEX_SHADER,vertex),fs=shader(gl,gl.FRAGMENT_SHADER,source);
      if(!vs||!fs){if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs);state.disabled=true;state.canvas.dataset.renderer='fallback';return false;}
      var program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);state.disabled=true;state.canvas.dataset.renderer='fallback';return false;}
      gl.useProgram(program);
      var buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      var attr=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
      state.gl=gl;state.program=program;state.uniforms={resolution:gl.getUniformLocation(program,'uResolution'),time:gl.getUniformLocation(program,'uTime'),phase:gl.getUniformLocation(program,'uPhase')};
      state.scope.classList.add('liquid-ready');state.canvas.dataset.renderer='webgl';
      if(!state.registered){
        state.canvas.addEventListener('webglcontextlost',function(e){e.preventDefault();state.disabled=true;state.gl=null;state.scope.classList.remove('liquid-ready');state.canvas.dataset.renderer='fallback';});
        state.canvas.addEventListener('webglcontextrestored',function(){state.disabled=false;state.gl=null;wake();});state.registered=true;
      }
      return true;
    }catch(e){state.disabled=true;state.scope.classList.remove('liquid-ready');state.canvas.dataset.renderer='fallback';return false;}
  }
  function allowed(){return root.getAttribute('data-motion')==='on'&&!document.hidden;}
  function active(state){return !state.disabled&&state.scope.getAttribute('data-inview')==='true';}
  function draw(state,dt){
    if(!state.gl&&!init(state))return false;
    var gl=state.gl,rect=state.scope.getBoundingClientRect();
    // Intentionally capped resolution and frame rate; not devicePixelRatio-scaled.
    var width=Math.max(1,Math.min(800,Math.round(rect.width*.7)));
    var height=Math.max(1,Math.min(900,Math.round(rect.height*.6)));
    if(state.canvas.width!==width||state.canvas.height!==height){state.canvas.width=width;state.canvas.height=height;gl.viewport(0,0,width,height);}
    state.time+=dt;gl.useProgram(state.program);
    gl.uniform2f(state.uniforms.resolution,width,height);gl.uniform1f(state.uniforms.time,state.time);gl.uniform1f(state.uniforms.phase,state.phase);
    gl.drawArrays(gl.TRIANGLES,0,6);state.frame++;state.canvas.dataset.frame=String(state.frame);return true;
  }
  function tick(now){
    request=0;if(!allowed()){last=0;return;}
    var visible=states.filter(active);if(!visible.length){last=0;return;}
    if(last&&now-last<33){request=requestAnimationFrame(tick);return;}
    var dt=last?Math.min((now-last)/1000,.12):0;last=now;
    var painted=false;visible.forEach(function(state){painted=draw(state,dt)||painted;});
    if(painted)request=requestAnimationFrame(tick);else last=0;
  }
  function wake(){
    if(!allowed()){if(request)cancelAnimationFrame(request);request=0;last=0;return;}
    if(!request){last=0;request=requestAnimationFrame(tick);}
  }
  window.addEventListener('bce:motionchange',wake);
  window.addEventListener('resize',wake,{passive:true});
  document.addEventListener('visibilitychange',wake);
  window.addEventListener('pagehide',function(){if(request)cancelAnimationFrame(request);request=0;last=0;});
  window.addEventListener('pageshow',wake);
  wake();
})();
</script>
'''
