/* SDRS Tech v7 — one scroll scheduler with cached geometry. No dependencies (IntersectionObserver, rAF, Canvas). */
(()=>{'use strict';
const d=document,$=s=>d.querySelector(s),$$=s=>[...d.querySelectorAll(s)];
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,t0=Date.now(),smallMQ=matchMedia('(max-width:1000px)'),small=()=>smallMQ.matches;
/* ENQUIRY FORM: put your POST-JSON endpoint in <form id="cf" data-endpoint="https://..."> in index.html (or here). Empty = not connected. */
const CFG={endpoint:'',minSeconds:3};
const hd=$('header'),sp=$('#sp'),nav=$('#nav'),bg=$('#bg');
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
/* ---------- menu ---------- */
const setMenu=o=>{nav.classList.toggle('open',o);bg.setAttribute('aria-expanded',o);d.body.classList.toggle('lock',o)};
bg.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
d.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){setMenu(false);bg.focus()}});
d.addEventListener('click',e=>{if(nav.classList.contains('open')&&!e.target.closest('#nav'))setMenu(false)});
$$('#menu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
/* ---------- text splitting + reveals (classes are added only when JS runs, so content is never hidden without it) ---------- */
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');setTimeout(()=>x.target.classList.add('done'),1600);io.unobserve(x.target)}}),{threshold:.01,rootMargin:'0px 0px -8% 0px'}):null;
const watch=e=>io?io.observe(e):e.classList.add('in');
const FW=[];
if(!rm){
 const split=(el,cls)=>{const w=el.textContent.trim().split(/\s+/);el.textContent='';w.forEach((t,i)=>{const a=d.createElement('span');a.className=cls;a.style.setProperty('--i',i);if(cls==='wd'){const b=d.createElement('span');b.textContent=t;a.appendChild(b)}else a.textContent=t;el.appendChild(a);el.appendChild(d.createTextNode(' '))})};
 const sps=new Set([...$$('.sp'),...$$('section:not(.hero) h2').filter(e=>!e.closest('.ogh')&&!e.classList.contains('fw'))]);
 sps.forEach(el=>{split(el,'wd');el.classList.add('sp');watch(el)});
 $$('.fw').forEach(el=>{split(el,'sw');FW.push({e:el,n:el.children.length,k:-1,t:0,h:0})});
 const add=(e,ms,big)=>{if(!e.offsetHeight)return;e.classList.add('rv');if(big)e.classList.add('big');if(ms)e.style.setProperty('--d',ms+'ms');watch(e)};
 [['.cc',90,1],['.pf article',100,1],['.pt',90,1],['.st div',45],['.sg div',55],['.hs div',80],['.svc li',50],['.rtc>div',100]].forEach(([s,g,b])=>$$(s).forEach((e,i)=>add(e,(i%6)*g,b)));
 $$('section:not(.hero) .lab,section:not(.hero) .lead:not(.fw),.ogn,.mock,.cap2,.par,.ctl,.cf,.cd,.eco,.pstate,.note').forEach(e=>add(e,0));
 $$('.truck img,.vid video,.rtl img').forEach(e=>{e.classList.add('cr');watch(e)});
}
$$('.flow,.pt').forEach(watch);
const po='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(x=>x.target.classList.toggle('off',!x.isIntersecting))):null;
$$('.mock,.flow,.eco').forEach(e=>po&&po.observe(e));
if(io&&!rm){const co=new IntersectionObserver(es=>es.forEach(x=>x.target.classList.toggle('act',x.isIntersecting)),{rootMargin:'-47% 0px -47% 0px'});$$('.cap').forEach(e=>co.observe(e))}
/* ---------- OMNIGO pinned story (steps drive the stage; stacked and fully shown on small screens / reduced motion) ---------- */
const stage=$('#stage'),steps=$$('.step'),story=$('.story');
if(stage){const route=$('#route'),sel=$('#sel');[route,sel].forEach(p=>p&&p.style.setProperty('--len',Math.ceil(p.getTotalLength())+2));
 const set=n=>{for(let i=1;i<=4;i++)stage.classList.toggle('s'+i,i<=n);steps.forEach((s,i)=>s.classList.toggle('on',i+1===n))};
 const nearest=()=>{let b=1,bd=1e9;steps.forEach((s,i)=>{const r=s.getBoundingClientRect(),dd=Math.abs(r.top+r.height/2-innerHeight/2);if(dd<bd){bd=dd;b=i+1}});return b};
 const so=io&&!rm?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting&&!small())set(+x.target.dataset.n)}),{rootMargin:'-45% 0px -45% 0px'}):null;
 if(so)steps.forEach(s=>so.observe(s));
 const mode=()=>{if(rm||small()||!so){story.classList.remove('live');set(4)}else{story.classList.add('live');set(nearest())}};
 mode();smallMQ.addEventListener('change',mode)}
const route=$('#route'),veh=$('#veh'),RL=route?Math.ceil(route.getTotalLength())+2:1;
/* ---------- active nav ---------- */
const map={technology:'technology',omnigo:'products','omnigo-works':'products',risings:'products',work:'work',brands:'brands',products:'products',about:'about',contact:'contact',statement:'',process:'',built:'',stack:'',why:'','site-footer':''};
if(io){const nio=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting)$$('#menu a').forEach(a=>a.classList.toggle('act',a.getAttribute('href')==='#'+map[x.target.id]))}),{rootMargin:'-45% 0px -50% 0px'});Object.keys(map).forEach(k=>{const e=d.getElementById(k);e&&nio.observe(e)})}
/* ---------- scroll system: ONE rAF scheduler; layout is measured once (and on resize), never read per frame ---------- */
const hero=$('.hero'),hIn=$('.hero>.w'),h1s=$$('.hero h1 span'),chips=$$('.chip').map(c=>({e:c,s:parseFloat(c.style.getPropertyValue('--cs'))||80})),
 proc=$('#process'),pr=$('#pr'),lis=pr?$$('#pr li'):[],ln=$('#ln'),pbar=$('.pbar i'),mk=$('#mock'),dash=$('.dash'),glass=$('.glass'),phone=$('.phone'),
 tr=$('.truck img'),bt=$('.bt div'),wm=$('.wmark'),wmg=$('.wmark-glow'),foot=$('#site-footer');
const stickyMQ=matchMedia('(min-height:500px) and (prefers-reduced-motion:no-preference)'),hzMQ=matchMedia('(min-width:1001px) and (min-height:620px) and (prefers-reduced-motion:no-preference)');
const top=e=>{let t=0;while(e){t+=e.offsetTop;e=e.offsetParent}return t}; /* layout position; ignores transforms */
const geo=e=>e?{t:top(e),h:e.offsetHeight}:{t:0,h:0};
const PX=$$('.px').map(e=>({e,s:+e.dataset.s||0,c:0,b:0,w:false}));
const G={proc:geo(),pr:geo(),mock:geo(),truck:geo(),bt:geo(),foot:geo(),travel:0};let hz=false,covered=false;
const L={hp:-1,mk:null,tr:null,bt:null,wm:null,pp:-1,pbar:-1,hy:-1,vt:-1,vs:1};
function measure(){
 hz=!!proc&&!!pr&&hzMQ.matches;
 if(proc){proc.classList.toggle('hz',hz);proc.style.height='';if(pr)pr.style.translate='';
  if(hz){const lp=Math.max(20,(innerWidth-1240)/2);G.travel=Math.max(0,pr.scrollWidth-(innerWidth-lp));proc.style.height=Math.round(innerHeight+G.travel+innerHeight*.25)+'px'}}
 G.proc=geo(proc);G.pr=geo(pr);G.mock=geo(mk);G.truck=geo(tr&&tr.parentElement);G.bt=geo(bt&&bt.parentElement);G.foot=geo(foot);
 FW.forEach(o=>{const g=geo(o.e);o.t=g.t;o.h=g.h});G.st=geo(stage&&stage.parentElement);if(steps.length>3){G.s3=top(steps[2])+steps[2].offsetHeight/2-innerHeight/2;G.s4=top(steps[3])+steps[3].offsetHeight/2-innerHeight/2}L.vt=-1;PX.forEach(o=>{o.b=top(o.e)+o.e.offsetHeight/2});
 L.hp=L.mk=L.tr=L.bt=L.wm=L.pp=L.pbar=-1;request()}
let pending=false;
const request=()=>{if(!pending){pending=true;requestAnimationFrame(tick)}};
function tick(){pending=false;const y=scrollY,h=innerHeight,vis=g=>g.t-y<h&&g.t+g.h-y>0;let again=false;
 /* header + progress */
 hd.classList.toggle('sc',y>24);if(sp){const m=G.docH-h;sp.style.transform='scaleX('+(m>0?Math.min(1,y/m):0).toFixed(4)+')'}
 /* hero: lines drift apart, chips rise at different speeds, content fades while the next section covers the pinned hero */
 if(hero&&!rm){const hp=Math.round(clamp(y/(h*.9))*200)/200;
  if(hp!==L.hp){L.hp=hp;const dx=(small()?.03:.07)*innerWidth;h1s.forEach((s,i)=>{s.style.translate=(hp*(i===1?1:-1)*dx).toFixed(1)+'px 0'});
   chips.forEach(c=>{c.e.style.translate='0 '+(-hp*c.s).toFixed(1)+'px';c.e.style.opacity=Math.max(0,1-hp*1.5).toFixed(2)});
   if(stickyMQ.matches){hIn.style.opacity=(1-hp*1.15).toFixed(3);hIn.style.translate='0 '+(-hp*70).toFixed(1)+'px';const c=hp>=1;if(c!==covered){covered=c;d.dispatchEvent(new CustomEvent('herocover',{detail:c}))}}
   else{hIn.style.opacity='';hIn.style.translate='';if(covered){covered=false;d.dispatchEvent(new CustomEvent('herocover',{detail:false}))}}}}
 /* word-by-word brightening */
 FW.forEach(o=>{if(o.t-y>h*1.3||o.t+o.h-y<-h*.3)return;const p=clamp((h*.88-(o.t-y))/(h*.48+o.h*.5)),k=Math.round(p*o.n);if(k!==o.k){o.k=k;[...o.e.children].forEach((x,i)=>x.classList.toggle('on',i<k))}});
 /* process timeline: pinned 1:1 horizontal scene on desktop; plain progress line elsewhere */
 if(pr){if(hz){const p=Math.round(clamp((y-G.proc.t)/Math.max(1,G.proc.h-h))*1000)/1000;
   if(p!==L.pp){L.pp=p;pr.style.translate=(-p*G.travel).toFixed(1)+'px 0';if(pbar)pbar.style.transform='scaleX('+p+')';lis.forEach((l,i)=>l.classList.toggle('on',p*(lis.length-1)+.35>=i))}}
  else if(vis({t:G.pr.t-h*.25,h:G.pr.h+h*.5})){const p=Math.round(clamp((h*.75-(G.pr.t-y))/(G.pr.h+h*.1))*500)/500;
   if(p!==L.pp){L.pp=p;if(ln){if(small()){ln.style.height=p*100+'%';ln.style.width=''}else{ln.style.width=p*100+'%';ln.style.height=''}}lis.forEach((l,i)=>l.classList.toggle('on',p>=i/lis.length+.02))}}}
 if(!rm){
  if(bt&&vis(G.bt)){const ex=bt.scrollWidth-bt.parentElement.clientWidth,q=Math.round(clamp((h-(G.bt.t-y))/(h+G.bt.h))*ex);if(q!==L.bt){L.bt=q;bt.style.transform='translateX('+(-q)+'px)'}}
  if(!small()){
   if(mk&&vis(G.mock)){const q=Math.round(((G.mock.t+G.mock.h/2-y-h/2)/h*16)*2)/2;if(q!==L.mk){L.mk=q;if(dash)dash.style.translate='0 '+q+'px';if(glass)glass.style.translate='0 '+(-q*.8)+'px';if(phone)phone.style.translate='0 '+(-q*1.6)+'px'}}
   if(tr&&vis(G.truck)){const q=Math.round(((G.truck.t+G.truck.h/2-y-h/2)/h*-22)*2)/2;if(q!==L.tr){L.tr=q;tr.style.transform='translateY('+q+'px) scale(1.08)'}}}
  else if(L.mk!==null&&L.mk!==0){L.mk=0;[dash,glass,phone].forEach(e=>e&&(e.style.translate=''));if(tr){L.tr=null;tr.style.transform=''}}
  if(wm&&vis({t:G.foot.t-h*.2,h:G.foot.h+h*.2})){const q=Math.round((1-clamp((h-(G.foot.t-y))/(G.foot.h*.85)))*42*2)/2;if(q!==L.wm){L.wm=q;wm.style.translate='0 '+q+'%';if(wmg)wmg.style.translate='0 '+q+'%'}}
  /* eased parallax layers (desktop) */
  PX.forEach(o=>{if(small()){if(o.c){o.c=0;o.e.style.translate=''}return}if(Math.abs(o.b-(y+h/2))>h*1.6)return;const t=(o.b-(y+h/2))/h*o.s,dl=t-o.c;if(Math.abs(dl)>.05){o.c+=dl*.12;o.e.style.translate='0 '+o.c.toFixed(1)+'px';again=true}})}

 /* OMNIGO: route progress + towing marker follow the scroll position (illustrative only) */
 if(route&&veh){let t;if(rm)t=1;else if(small())t=clamp((h*.85-(G.st.t-y))/(h*.7));else{const a=G.s3-h*.05,b=G.s4+h*.1;t=clamp((y-a)/(b-a))}
  t=Math.round(t*400)/400;if(t!==L.vt){L.vt=t;route.style.strokeDashoffset=(RL*(1-t)).toFixed(1);const p0=route.getPointAtLength(RL*t),p1=route.getPointAtLength(Math.min(RL,RL*t+3));if(Math.abs(p1.x-p0.x)>.05)L.vs=p1.x<p0.x?-1:1;veh.setAttribute('transform','translate('+p0.x.toFixed(1)+' '+p0.y.toFixed(1)+') scale('+L.vs+' 1)')}}
 /* pointer tilt (desktop, fine pointers only) */
 TL.forEach(o=>{const dx=o.tx-o.cx,dy=o.ty-o.cy;if(Math.abs(dx)>.01||Math.abs(dy)>.01){o.cx+=dx*.14;o.cy+=dy*.14;const m=Math.hypot(o.cx,o.cy);o.e.style.rotate=m<.02?'none':o.cx.toFixed(3)+' '+o.cy.toFixed(3)+' 0 '+m.toFixed(2)+'deg';again=true}});
 if(PT.on&&L.hp<1){const dx=PT.tx-PT.x,dy=PT.ty-PT.y;if(Math.abs(dx)>.002||Math.abs(dy)>.002){PT.x+=dx*.08;PT.y+=dy*.08;chips.forEach(c=>{c.e.style.transform='translate3d('+(PT.x*c.s*.1).toFixed(1)+'px,'+(PT.y*c.s*.1).toFixed(1)+'px,0)'});again=true}}
 if(again)request()}
let rzT=0;const remeasure=()=>{clearTimeout(rzT);rzT=setTimeout(()=>{G.docH=d.documentElement.scrollHeight;measure()},120)};
/* after a fast flick, reveal anything already scrolled past (IntersectionObserver reports only state changes) */
let idleT=0;const sweep=()=>$$('.rv:not(.in),.sp:not(.in),.cr:not(.in),.flow:not(.in),.pt:not(.in)').forEach(e=>{if(e.getBoundingClientRect().bottom<0){e.classList.add('in');setTimeout(()=>e.classList.add('done'),1600)}});
addEventListener('scroll',()=>{request();clearTimeout(idleT);idleT=setTimeout(sweep,220)},{passive:true});
addEventListener('resize',()=>{if(innerWidth>1000)setMenu(false);remeasure()});
addEventListener('load',()=>{G.docH=d.documentElement.scrollHeight;measure()});
if(d.fonts&&d.fonts.ready)d.fonts.ready.then(remeasure);
if('ResizeObserver' in window){const ro=new ResizeObserver(()=>{if(d.documentElement.scrollHeight!==G.docH)remeasure()});ro.observe($('main'))}
[stickyMQ,hzMQ].forEach(m=>m.addEventListener('change',remeasure));
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches&&!rm;
const TL=[],PT={on:fine,tx:0,ty:0,x:0,y:0};
function reg(el,region,max){if(!el||!region)return;const o={e:el,tx:0,ty:0,cx:0,cy:0};TL.push(o);
 region.addEventListener('pointermove',ev=>{const r=region.getBoundingClientRect();o.ty=((ev.clientX-r.left)/r.width*2-1)*max;o.tx=-((ev.clientY-r.top)/r.height*2-1)*max;request()},{passive:true});
 region.addEventListener('pointerleave',()=>{o.tx=o.ty=0;request()})}
if(fine){$$('.cc,.pf article').forEach(e=>reg(e,e,5));$$('.rtc>div').forEach(e=>reg(e,e,7));reg($('.dash'),$('#mock'),4);reg($('.stage'),$('.stagew'),2.5);
 addEventListener('pointermove',e=>{PT.tx=e.clientX/innerWidth*2-1;PT.ty=e.clientY/innerHeight*2-1;if(L.hp<1)request()},{passive:true})}
if(wm&&foot&&'IntersectionObserver' in window)new IntersectionObserver(es=>wm.classList.toggle('on',es[0].isIntersecting)).observe(foot);
G.docH=d.documentElement.scrollHeight;measure();
/* ---------- hero particle sphere (Canvas; paused off-screen, when covered, or in a hidden tab; one static frame under reduced motion) ---------- */
function hero2d(cv){if(cv&&cv.getContext){const ctx=cv.getContext('2d'),mob=innerWidth<760,N=mob?240:760,COL=['66,228,242','40,120,255','139,114,255','229,161,24'],ALPHA=[.22,.5,.8,1];
 let S=0,ang=.6,tx=0,ty=0,gx=0,gy=0,raf=0,vis=true;const P=[],NB=[],T=[],Q=new Float32Array(N*3),col=new Uint8Array(N);
 for(let i=0;i<N;i++){const y=1-2*(i+.5)/N,r=Math.sqrt(1-y*y),t=i*2.39996;P.push({x:Math.cos(t)*r,y,z:Math.sin(t)*r});col[i]=i%31===0?3:i%9===0?2:i%3===0?1:0}
 for(let i=0;i<N;i++){let a=-1,b=-1,da=9,db=9;for(let j=0;j<N;j++){if(j===i)continue;const q=(P[i].x-P[j].x)**2+(P[i].y-P[j].y)**2+(P[i].z-P[j].z)**2;if(q<da){db=da;b=a;da=q;a=j}else if(q<db){db=q;b=j}}NB.push([a,b])}
 for(let i=0;i<(mob?5:10);i++)T.push({x:Math.random(),y:Math.random(),s:7+Math.random()*9,r:Math.random()*6.28,v:(Math.random()-.5)*.006,dx:(Math.random()-.5)*.00014,dy:(Math.random()-.5)*.00014,c:i%3});
 const size=()=>{const dpr=Math.min(devicePixelRatio||1,1.5);S=cv.clientWidth;cv.width=cv.height=Math.round(S*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)};
 function draw(){ctx.clearRect(0,0,S,S);const R=S*.35,c=S/2,ca=Math.cos(ang),sa=Math.sin(ang),tl=.3+gy*.18,cx=Math.cos(tl),sx=Math.sin(tl);
  for(let i=0;i<N;i++){const p=P[i],x1=p.x*ca+p.z*sa,z1=-p.x*sa+p.z*ca;Q[i*3]=c+(x1+gx*.06)*R;Q[i*3+1]=c+(p.y*cx-z1*sx)*R;Q[i*3+2]=p.y*sx+z1*cx}
  ctx.lineWidth=.6;ctx.strokeStyle='rgba(66,170,255,.24)';ctx.beginPath();
  for(let i=0;i<N;i++){if(Q[i*3+2]<-.3)continue;const nb=NB[i];for(let k=0;k<2;k++){const j=nb[k];if(j>i){ctx.moveTo(Q[i*3],Q[i*3+1]);ctx.lineTo(Q[j*3],Q[j*3+1])}}}ctx.stroke();
  /* points batched into 4 depth tiers x 4 colours = 16 fills instead of one per point */
  const k=S/820+.45,B=new Array(16);for(let i=0;i<N;i++){const z=Q[i*3+2],t=z<-.35?0:z<.05?1:z<.5?2:3,id=t*4+col[i];const r=(.7+.55*t)*k,x=Q[i*3],y=Q[i*3+1],p=B[id]||(B[id]=new Path2D);p.moveTo(x+r,y);p.arc(x,y,r,0,6.283)}
  for(let id=0;id<16;id++){if(!B[id])continue;ctx.fillStyle='rgba('+COL[id%4]+','+ALPHA[id>>2]+')';ctx.fill(B[id])}
  T.forEach(t=>{t.x=(t.x+t.dx+1)%1;t.y=(t.y+t.dy+1)%1;t.r+=t.v;const x=t.x*S+gx*8,y=t.y*S+gy*8,s=t.s*k;ctx.strokeStyle='rgba('+COL[t.c===2?2:t.c]+',.55)';ctx.lineWidth=1;ctx.beginPath();for(let a=0;a<3;a++){const q=t.r+a*2.094;a?ctx.lineTo(x+Math.cos(q)*s,y+Math.sin(q)*s):ctx.moveTo(x+Math.cos(q)*s,y+Math.sin(q)*s)}ctx.closePath();ctx.stroke()})}
 const loop=()=>{ang+=.0022;gx+=(tx-gx)*.04;gy+=(ty-gy)*.04;draw();raf=requestAnimationFrame(loop)};
 const run=()=>{if(!raf&&vis&&!d.hidden&&!rm)raf=requestAnimationFrame(loop)},stop=()=>{cancelAnimationFrame(raf);raf=0};
 size();draw();let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{size();draw()},150)});
 if(!rm){if(!mob)addEventListener('pointermove',e=>{tx=e.clientX/innerWidth*2-1;ty=e.clientY/innerHeight*2-1},{passive:true});
  d.addEventListener('visibilitychange',()=>d.hidden?stop():run());d.addEventListener('herocover',e=>{vis=!e.detail;vis?run():stop()});
  if('IntersectionObserver' in window)new IntersectionObserver(es=>{vis=es[0].isIntersecting&&!covered;vis?run():stop()}).observe(cv.parentElement);else run()}}}

/* ---------- hero 3D scene: dependency-free WebGL (points, links, orbital rings, dust). Falls back to the 2D canvas above. ---------- */
const VS=`attribute vec3 aP;attribute vec3 aC;attribute vec2 aS;uniform mat4 uM,uP;uniform float uT,uK,uZ,uAlpha,uBand,uBr;varying vec3 vC;varying float vA;
void main(){vec3 p=aP*(1.0+uBr*0.016*sin(uT*0.7+aS.y*6.2831));vec4 v=uM*vec4(p,1.0);gl_Position=uP*v;
float d=clamp((-v.z-(uZ-1.1))/2.2,0.0,1.0);float wave=smoothstep(0.62,1.0,sin(dot(aP,vec3(0.35,1.0,0.2))*5.0-uT*0.9));float tw=0.7+0.3*sin(uT*1.3+aS.y*40.0);
vA=uAlpha*(1.0-d*0.8)*tw+wave*uBand;vC=aC+wave*vec3(0.45,0.6,0.8)*uBand;gl_PointSize=aS.x*uK*(1.0+wave*0.7*uBand)/(-v.z);}`;
const FS=`precision mediump float;varying vec3 vC;varying float vA;uniform float uPt;
void main(){float a=vA;if(uPt>0.5){float r=length(gl_PointCoord-0.5)*2.0;if(r>1.0)discard;a*=pow(1.0-r,1.5);}gl_FragColor=vec4(vC*a,a);}`;
const M4={mul(a,b){const o=new Float32Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let q=0;for(let k=0;k<4;k++)q+=a[k*4+j]*b[i*4+k];o[i*4+j]=q}return o},
 rx(a){const c=Math.cos(a),s=Math.sin(a);return[1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]},ry(a){const c=Math.cos(a),s=Math.sin(a);return[c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]},
 tr:(x,y,z)=>[1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1],persp(f,n,fa){const t=1/Math.tan(f/2);return[t,0,0,0,0,t,0,0,0,0,(fa+n)/(n-fa),-1,0,0,2*fa*n/(n-fa),0]}};
function swap2D(old){const n=d.createElement('canvas');n.id='cv';old.replaceWith(n);hero2d(n)}
function heroGL(cv){
 let gl=null;try{gl=cv.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true,powerPreference:'high-performance'})}catch(e){}
 if(!gl)return false;
 const mob=innerWidth<760,weak=(navigator.hardwareConcurrency||4)<=4,N=mob?1500:weak?3200:5200,NM=mob?110:300,NR=160,Z=4.4;
 let pr;try{const sh=(t,src)=>{const o=gl.createShader(t);gl.shaderSource(o,src);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o};
  pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.bindAttribLocation(pr,0,'aP');gl.bindAttribLocation(pr,1,'aC');gl.bindAttribLocation(pr,2,'aS');gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(pr))}
 catch(e){console.warn('SDRS hero: WebGL shader failed, using 2D fallback',e);swap2D(cv);return true}
 let sd=7;const rnd=()=>(sd=sd*16807%2147483647)/2147483647;
 const CY=[.26,.89,.95],BL=[.16,.47,1],VI=[.55,.45,1],AM=[.9,.63,.09],mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
 const TOT=N+NM+NR*3,buf=new Float32Array(TOT*8);let o=0;const put=(x,y,z,c,sz,ph)=>{buf[o++]=x;buf[o++]=y;buf[o++]=z;buf[o++]=c[0];buf[o++]=c[1];buf[o++]=c[2];buf[o++]=sz;buf[o++]=ph};
 for(let i=0;i<N;i++){const y=1-2*(i+.5)/N,rr=Math.sqrt(1-y*y),th=i*2.39996,rad=1+(rnd()-.5)*.03,t=(y+1)/2;
  const c=i%43===0?AM:t<.5?mix(VI,BL,t*2):mix(BL,CY,(t-.5)*2);put(Math.cos(th)*rr*rad,y*rad,Math.sin(th)*rr*rad,c,i%57===0?2.3:.7+rnd()*.7,rnd())}
 for(let i=0;i<NM;i++){const u=rnd()*2-1,th=rnd()*6.283,rr=Math.sqrt(1-u*u),R=1.7+rnd()*.9;put(Math.cos(th)*rr*R,u*R,Math.sin(th)*rr*R,rnd()<.2?VI:rnd()<.5?CY:BL,.45+rnd()*.5,rnd())}
 const RC=[CY,VI,BL],RR=[1.28,1.42,1.56];for(let k=0;k<3;k++)for(let i=0;i<NR;i++){const a=i/NR*6.28318;put(Math.cos(a)*RR[k],Math.sin(a)*RR[k],0,RC[k],1,0)}
 /* nearest-neighbour links between a subset of the sphere's points (built once) */
 const sub=[];for(let i=0;i<N;i+=3)sub.push(i);const idx=[];
 for(const i of sub){let a=-1,b=-1,da=9,db=9;for(const j of sub){if(j===i)continue;const dx=buf[i*8]-buf[j*8],dy=buf[i*8+1]-buf[j*8+1],dz=buf[i*8+2]-buf[j*8+2],q=dx*dx+dy*dy+dz*dz;if(q<da){db=da;b=a;da=q;a=j}else if(q<db){db=q;b=j}}if(da<.03)idx.push(i,a);if(db<.03)idx.push(i,b)}
 const vb=gl.createBuffer(),ib=gl.createBuffer(),nb=gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,buf,gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx),gl.STATIC_DRAW);
 const nodes=new Float32Array(6*8);gl.bindBuffer(gl.ARRAY_BUFFER,nb);gl.bufferData(gl.ARRAY_BUFFER,nodes,gl.DYNAMIC_DRAW);
 const U={};['uM','uP','uT','uK','uZ','uAlpha','uBand','uBr','uPt'].forEach(n=>U[n]=gl.getUniformLocation(pr,n));
 const attr=b=>{gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(0);gl.enableVertexAttribArray(1);gl.enableVertexAttribArray(2);gl.vertexAttribPointer(0,3,gl.FLOAT,false,32,0);gl.vertexAttribPointer(1,3,gl.FLOAT,false,32,12);gl.vertexAttribPointer(2,2,gl.FLOAT,false,32,24)};
 gl.useProgram(pr);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);gl.disable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
 const P=M4.persp(.7,.1,20);gl.uniformMatrix4fv(U.uP,false,P);gl.uniform1f(U.uZ,Z);
 let W=0,t=0,last=0,gx=0,gy=0,raf=0,vis=true,dead=false,q=0,acc=0,fr=0;
 const size=()=>{const dpr=q?1:Math.min(devicePixelRatio||1,mob?1.25:1.5);W=Math.max(2,Math.round(cv.clientWidth*dpr));cv.width=cv.height=W;gl.viewport(0,0,W,W);gl.uniform1f(U.uK,W/820*18)};
 const ringM=[M4.mul(M4.rx(1.15),M4.ry(.2)),M4.mul(M4.rx(.55),M4.ry(-.7)),M4.mul(M4.rx(1.45),M4.ry(.9))];
 function render(){const hp=Math.max(0,L.hp),pull=Math.min(1,hp);
  const view=M4.mul(M4.tr(0,-pull*.55,-Z-pull*.5),M4.mul(M4.rx(.34+gy*.22),M4.ry(t*.14+.6+gx*.4)));
  gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(U.uT,t);gl.uniform1f(U.uBr,1);
  attr(vb);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.uniformMatrix4fv(U.uM,false,view);
  if(!q){gl.uniform1f(U.uPt,0);gl.uniform1f(U.uAlpha,.34);gl.uniform1f(U.uBand,.25);gl.drawElements(gl.LINES,idx.length,gl.UNSIGNED_SHORT,0)}
  gl.uniform1f(U.uPt,1);gl.uniform1f(U.uAlpha,1.25);gl.uniform1f(U.uBand,1);gl.drawArrays(gl.POINTS,0,q===0?N:q===1?Math.floor(N*.6):Math.floor(N*.3));
  gl.uniformMatrix4fv(U.uM,false,M4.mul(M4.tr(0,-pull*.55,-Z-pull*.5),M4.mul(M4.rx(.2+gy*.1),M4.ry(-t*.05+gx*.15))));gl.uniform1f(U.uBr,0);gl.uniform1f(U.uAlpha,.6);gl.uniform1f(U.uBand,0);if(q<2)gl.drawArrays(gl.POINTS,N,NM);
  for(let k=0;k<3;k++){const m=M4.mul(view,M4.mul(M4.ry(t*.05*(k+1)),ringM[k]));gl.uniformMatrix4fv(U.uM,false,m);gl.uniform1f(U.uPt,0);gl.uniform1f(U.uAlpha,.85);attr(vb);gl.drawArrays(gl.LINE_LOOP,N+NM+k*NR,NR);
   for(let q=0;q<2;q++){const a=t*(.35+.15*k)*(q?-1:1)+q*3.14+k,j=(k*2+q)*8;nodes[j]=Math.cos(a)*RR[k];nodes[j+1]=Math.sin(a)*RR[k];nodes[j+2]=0;nodes[j+3]=1;nodes[j+4]=1;nodes[j+5]=1;nodes[j+6]=3.2;nodes[j+7]=0}
   gl.bindBuffer(gl.ARRAY_BUFFER,nb);gl.bufferSubData(gl.ARRAY_BUFFER,0,nodes);attr(nb);gl.uniform1f(U.uPt,1);gl.uniform1f(U.uAlpha,1);gl.drawArrays(gl.POINTS,k*2,2)}}
 const loop=n=>{const raw=(n-last)/1000||.016,dt=Math.min(.05,raw);last=n;t+=dt*1.35;
  /* adaptive quality: sustained slow frames shed links/dust/points and drop to 1x resolution */
  acc+=raw;if(++fr===90){if(acc/fr>.03&&q<2){q++;size()}acc=0;fr=0}
  gx+=(PT.tx-gx)*.04;gy+=(PT.ty-gy)*.04;render();raf=requestAnimationFrame(loop)};
 const run=()=>{if(!raf&&vis&&!dead&&!d.hidden&&!rm){last=performance.now();raf=requestAnimationFrame(loop)}},stop=()=>{cancelAnimationFrame(raf);raf=0};
 size();render();let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{size();render()},150)});
 cv.addEventListener('webglcontextlost',e=>{e.preventDefault();dead=true;stop();swap2D(cv)});
 addEventListener('pagehide',()=>{dead=true;stop();[vb,ib,nb].forEach(b=>gl.deleteBuffer(b));gl.deleteProgram(pr);const x=gl.getExtension('WEBGL_lose_context');if(x)x.loseContext()},{once:true});
 if(!rm){d.addEventListener('visibilitychange',()=>d.hidden?stop():run());d.addEventListener('herocover',e=>{vis=!e.detail;vis?run():stop()});
  if('IntersectionObserver' in window)new IntersectionObserver(es=>{vis=es[0].isIntersecting&&!covered;vis?run():stop()}).observe(cv.parentElement);else run()}
 return true}
const cv=$('#cv');
if(cv){const start=()=>{if(!heroGL(cv))hero2d(cv)};'requestIdleCallback' in window?requestIdleCallback(start,{timeout:700}):setTimeout(start,60)}
/* ---------- brand videos: lighter file on phones, lazy, muted autoplay only while visible, never with reduced motion / data saver ---------- */
const vids=$$('.vid video'),saver=!!(navigator.connection&&navigator.connection.saveData);
vids.forEach(v=>{v.muted=true;if(innerWidth<=760&&v.dataset.small){const s=v.querySelector('source');if(s)s.remove();v.src=v.dataset.small}});
if(vids.length&&'IntersectionObserver' in window){const vo=new IntersectionObserver(es=>es.forEach(x=>{const v=x.target;if(x.isIntersecting){if(!rm&&!saver){if(v.preload==='none')v.preload='metadata';v.play().catch(()=>{})}}else v.pause()}),{threshold:.35});vids.forEach(v=>vo.observe(v))}
/* ---------- pointer spotlight on client cards ---------- */
if(!rm&&matchMedia('(hover:hover)').matches)$$('.cc').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true}));
/* ---------- brand carousel (auto-scrolling & wrap-around) ---------- */
const trk=$('#trk');
if(trk){
  const sls=[...trk.children],dots=$('#dots');
  dots.innerHTML='';
  sls.forEach((_,idx)=>{
    const dot=d.createElement('i');
    dot.setAttribute('role','button');
    dot.setAttribute('aria-label','Go to slide '+(idx+1));
    dot.addEventListener('click',()=>{goTo(idx);restartAuto()});
    dots.appendChild(dot);
  });
  const step=()=>sls[0].offsetWidth+20,
        cur=()=>{
          const i=Math.min(sls.length-1,Math.round(trk.scrollLeft/step()));
          sls.forEach((s,j)=>s.classList.toggle('cur',j===i));
          [...dots.children].forEach((x,j)=>x.classList.toggle('on',j===i));
          return i;
        };
  trk.addEventListener('scroll',cur,{passive:true});
  cur();
  const goTo=idx=>{
    const target=((idx%sls.length)+sls.length)%sls.length;
    trk.scrollTo({left:target*step(),behavior:'smooth'});
  };
  const go=n=>goTo(cur()+n);
  $('#pv').onclick=()=>{go(-1);restartAuto()};
  $('#nx').onclick=()=>{go(1);restartAuto()};
  trk.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'){e.preventDefault();go(1);restartAuto()}
    if(e.key==='ArrowLeft'){e.preventDefault();go(-1);restartAuto()}
  });

  let autoTimer=null;
  const startAuto=()=>{
    if(autoTimer)return;
    autoTimer=setInterval(()=>{
      go(1);
    },3000);
  };
  const stopAuto=()=>{
    if(autoTimer){clearInterval(autoTimer);autoTimer=null}
  };
  const restartAuto=()=>{stopAuto();startAuto()};

  // Start auto-scroll automatically
  startAuto();

  const carParent=trk.closest('.car')||trk;
  carParent.addEventListener('pointerenter',stopAuto);
  carParent.addEventListener('pointerleave',startAuto);
  carParent.addEventListener('touchstart',stopAuto,{passive:true});
  carParent.addEventListener('touchend',startAuto,{passive:true});
  d.addEventListener('visibilitychange',()=>d.hidden?stopAuto():startAuto());
}
/* ---------- client logos: official logo, or neutral domain placeholder if it cannot load ---------- */
$$('.cl img').forEach(im=>{const f=()=>im.closest('.cl').classList.add('noimg');im.addEventListener('error',f);if(im.complete&&!im.naturalWidth)f()});
/* ---------- enquiry form (WhatsApp submission to +917569743173) ---------- */
const cf=$('#cf'),okBox=$('#ok'),waBtn=$('#wa-btn'),anotherBtn=$('#another-btn');
if(cf){
  const chk=(id,ok,msg)=>{
    const el=$('#'+id),er=$('#e-'+id);
    if(el)el.setAttribute('aria-invalid',!ok);
    if(er)er.textContent=ok?'':msg;
    return ok;
  };
  const EM=/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  const validPhone=p=>{
    if(!p)return true;
    const clean=p.replace(/[\s\-\(\)\.]/g,'');
    return /^(\+?\d{7,15})$/.test(clean);
  };

  cf.addEventListener('submit',ev=>{
    ev.preventDefault();
    const f=cf.elements,v=k=>((f[k]&&f[k].value)||'').trim(),st=$('#fs');
    if(st)st.textContent='';
    const ok=[
      chk('n',v('name').length>1,'Enter your name.'),
      chk('e',EM.test(v('email')),'Enter a valid email address.'),
      chk('p',validPhone(v('phone')),'Enter a valid phone number.'),
      chk('m',v('message').length>5,'Please describe your project (at least 6 characters).')
    ];
    const bad=['n','e','p','m'].find((_,i)=>!ok[i]);
    if(bad){
      const badEl=$('#'+bad);
      if(badEl)badEl.focus();
      return;
    }
    if(v('website'))return;

    const phoneNum='917569743173';
    const msg=`*New Project Enquiry — SDRS Tech*\n\n`+
      `• *Name:* ${v('name')}\n`+
      (v('company')?`• *Company:* ${v('company')}\n`:'')+
      `• *Email:* ${v('email')}\n`+
      (v('phone')?`• *Phone:* ${v('phone')}\n`:'')+
      (v('timeline')?`• *Timeline:* ${v('timeline')}\n`:'')+
      `\n*Project Details:*\n${v('message')}`;

    const waUrl=`https://api.whatsapp.com/send?phone=${phoneNum}&text=${encodeURIComponent(msg)}`;
    if(waBtn)waBtn.href=waUrl;

    try{
      window.open(waUrl,'_blank','noopener,noreferrer');
    }catch(_){}

    if(typeof window.gtag==='function'){
      try{
        window.gtag('event','generate_lead',{
          event_category:'Engagement',
          event_label:'WhatsApp Project Enquiry'
        });
      }catch(_){}
    }

    cf.hidden=true;
    if(okBox){
      okBox.hidden=false;
      okBox.focus();
    }
  });

  if(anotherBtn){
    anotherBtn.addEventListener('click',()=>{
      cf.reset();
      ['n','e','p','m'].forEach(id=>{
        const el=$('#'+id);if(el)el.removeAttribute('aria-invalid');
        const er=$('#e-'+id);if(er)er.textContent='';
      });
      const st=$('#fs');if(st)st.textContent='';
      if(okBox)okBox.hidden=true;
      cf.hidden=false;
      const firstInput=$('#n');
      if(firstInput)firstInput.focus();
    });
  }
}

const LG={"privacy": ["Privacy Policy", "<p class=\"rev\"><strong>Draft \u2014 not yet approved.</strong> This text is a working draft. Company facts must be confirmed and qualified legal counsel must review it before publication. It is not legally approved or confirmed compliant.</p><h2>1. Introduction</h2><p>SDRS Meta Rise Tech Private Limited (\u201cSDRS Tech\u201d, \u201cwe\u201d, \u201cour\u201d or \u201cus\u201d) respects the privacy of visitors to our website.</p><p>This Privacy Policy explains how we may collect, use, disclose and retain personal information when you visit our corporate website, contact us, submit an enquiry or interact with our online services.</p><p>This policy concerns the corporate website. Separate privacy notices may apply to our products, applications and services, including OMNIGO, as those services are developed and launched.</p><h2>2. Information We May Collect</h2><p>Depending on the website features you use, we may collect the following categories of information:</p><ul><li><strong>Contact information:</strong> Your name, email address, telephone number, company name and other details you choose to submit.</li><li><strong>Enquiry information:</strong> The contents of messages, project requirements and communications sent to us.</li><li><strong>Technical information:</strong> Information such as browser type, device information, IP address, timestamps and website usage data, where collected by our hosting infrastructure or configured services.</li><li><strong>Cookie and usage information:</strong> Information collected through cookies or similar technologies, where these are used on the website.</li></ul><p class=\"rn\"><strong>Review note:</strong> Update this section to describe the information actually collected by the live website. Do not imply that a category is collected if the website and its configured services do not collect it. From the project code: the enquiry form can collect name, company, email, phone, message and timeline, but it is not yet connected to a form service, and email sent directly to the company address is handled by the company's email provider.</p><h2>3. How We Use Information</h2><p>Where applicable, we may use information to:</p><ul><li>Respond to enquiries and requests.</li><li>Communicate about potential or existing projects.</li><li>Provide information about our services when requested.</li><li>Operate, maintain and troubleshoot the website.</li><li>Protect the website against abuse, fraud and security incidents.</li><li>Meet applicable legal obligations.</li><li>Measure website performance or improve the user experience where appropriate.</li></ul><p class=\"rn\"><strong>Review note:</strong> Do not describe marketing, analytics or profiling activities as current practices unless they are actually used. The website code currently includes no analytics or advertising scripts.</p><h2>4. Legal Grounds for Processing</h2><p>Where applicable law requires a legal basis for processing personal information, we will process information on an appropriate basis, such as consent, steps requested before entering into a contract, legitimate interests where permitted, or compliance with a legal obligation.</p><p>The appropriate basis depends on the purpose, type of information and applicable law.</p><h2>5. Sharing and Service Providers</h2><p>We may need to share information with service providers that support the website, such as hosting providers, email services, form-processing services or security providers, where those services are actually configured.</p><p>We may also disclose information when required by law or where reasonably necessary to protect rights, safety or security.</p><p class=\"rn\"><strong>Review note:</strong> Before publication, identify the actual providers used by the website (hosting, form service, email). Do not invent a provider list.</p><h2>6. International Processing</h2><p>Some service providers may process information in countries other than the country in which the visitor is located.</p><p>Where applicable, we will take steps required by relevant data protection law for such processing or transfers.</p><p class=\"rn\"><strong>Review note:</strong> The actual providers, hosting regions and relevant safeguards must be confirmed before this section is finalised.</p><h2>7. Retention</h2><p>We retain personal information only for as long as reasonably necessary for the purpose for which it was collected, subject to applicable legal obligations and legitimate recordkeeping requirements.</p><p class=\"rn\"><strong>Review note:</strong> The company must confirm its actual retention practices for website enquiries, email correspondence, technical logs and any analytics records. Do not invent specific retention periods.</p><h2>8. Security</h2><p>We take appropriate steps to protect information handled through our website, consistent with the security measures actually implemented.</p><p>No internet-based system can be represented as entirely risk-free.</p><p class=\"rn\"><strong>Review note:</strong> Do not make absolute guarantees. The company must verify the technical and organisational measures that can truthfully be described in this policy.</p><h2>9. Your Privacy Rights</h2><p>Depending on applicable law, you may have rights concerning your personal information, including requesting access, correction, deletion or withdrawal of consent where applicable.</p><p>To make a privacy request, contact us using the verified contact details published on this website. We may need to verify your identity before responding.</p><p>Applicable rights and exceptions depend on the law governing the request.</p><h2>10. Children</h2><p>This corporate website is not intended to solicit personal information from children without appropriate authorisation where required by law. If you believe a child has provided personal information inappropriately, contact us so that we can assess the request.</p><h2>11. Third-Party Websites</h2><p>Our website may link to external websites. We do not control their independent privacy practices. Please review their privacy notices before providing information to them.</p><h2>12. Changes to This Policy</h2><p>We may update this Privacy Policy when our website, business practices or legal obligations change. The updated version will be published on this page with a revised effective date.</p><h2>13. Contact</h2><p>For privacy questions or requests, contact:</p><p class=\"adr\"><strong>SDRS Meta Rise Tech Private Limited</strong><br>Location: Hyderabad, Telangana, India<br>Website: <mark class=\"pl\">[CONFIRM OFFICIAL CORPORATE DOMAIN]</mark><br>Privacy contact: <a href=\"mailto:sdrstech@gmail.com\">sdrstech@gmail.com</a><br>Effective date: <mark class=\"pl\">[INSERT DATE AFTER APPROVAL]</mark></p><p class=\"rn\"><strong>Review note:</strong> Do not publish this page with unresolved placeholders. The email shown is the company address supplied for this website; confirm it is the intended privacy contact.</p>"], "terms": ["Website Terms and Conditions", "<p class=\"rev\"><strong>Draft \u2014 not yet approved.</strong> This text is a working draft. Company facts must be confirmed and qualified legal counsel must review it before publication. It is not legally approved or confirmed compliant.</p><h2>1. Introduction</h2><p>These Terms and Conditions govern access to and use of the SDRS Tech corporate website operated by SDRS Meta Rise Tech Private Limited (\u201cSDRS Tech\u201d, \u201cwe\u201d, \u201cour\u201d or \u201cus\u201d).</p><p>By accessing or using this website, you agree to use it lawfully and in accordance with these terms.</p><p>These terms relate to the corporate website only. They do not replace a separate customer agreement, software subscription agreement, privacy notice or marketplace agreement that may apply to a specific product or service.</p><h2>2. About Our Business</h2><p>SDRS Tech provides technology and digital solutions. Depending on the relevant engagement, these may include software development, websites, applications, SaaS platforms, integrations, digital marketing and related services.</p><p>The scope, deliverables, fees, timelines and responsibilities for an individual project will be established through the applicable proposal, statement of work, order or signed agreement.</p><p>Descriptions on this website are general information and do not by themselves constitute a commitment to deliver a particular feature or outcome.</p><h2>3. Permitted Use</h2><p>You may use this website for lawful purposes, including learning about our company, reviewing our services and contacting us about a potential engagement.</p><p>You must not:</p><ul><li>Use the website for unlawful, fraudulent or harmful purposes.</li><li>Attempt to gain unauthorised access to the website, its systems or data.</li><li>Introduce malicious code or interfere with the website's operation.</li><li>Scrape, copy or reproduce protected content in a way that infringes applicable rights.</li><li>Misrepresent your identity or submit deliberately misleading enquiries.</li></ul><p>Nothing in this section restricts activities protected by applicable law.</p><h2>4. Intellectual Property</h2><p>Unless otherwise indicated, website text, branding, layouts, graphics and other original materials are owned by SDRS Tech or used with permission or under an applicable licence.</p><p>You may view and use the website for personal or legitimate business evaluation. You may not reproduce, distribute, modify or commercially exploit protected materials without appropriate permission, except where applicable law permits.</p><p>Third-party names, logos and marks remain the property of their respective owners.</p><h2>5. Client Portfolio</h2><p>The website may display examples of client projects and links to third-party websites to illustrate our work.</p><p>A portfolio listing does not by itself imply an endorsement, partnership, exclusivity arrangement or testimonial. Descriptions should reflect the work actually performed and the permissions available.</p><p>Third-party websites are controlled by their respective operators.</p><h2>6. Product Descriptions and Availability</h2><p>Product concepts, interface illustrations, prototypes and development-stage features may appear on this website.</p><p>Unless explicitly confirmed otherwise, an illustration does not guarantee that the depicted functionality is currently available.</p><p>OMNIGO is intended to provide technology connecting customers with towing providers. Its actual service scope, availability, booking features and contractual arrangements will be governed by the applicable product terms once established.</p><h2>7. Project Agreements and Fees</h2><p>A project or service engagement may require a separate written agreement specifying pricing, payment terms, scope, delivery, revisions, intellectual property ownership, support and termination.</p><p>If a separate agreement applies, its terms will govern the relevant engagement to the extent specified in that agreement and permitted by law.</p><h2>8. Third-Party Services</h2><p>This website may link to or reference third-party services. We do not control third-party services and are not responsible for their independent content, availability or policies, subject to rights and responsibilities that cannot lawfully be excluded.</p><h2>9. Website Availability</h2><p>We may update, maintain or change the website from time to time. We do not guarantee uninterrupted availability.</p><p>Nothing in these terms excludes a responsibility or remedy that cannot lawfully be excluded under applicable law.</p><h2>10. Disclaimers and Liability</h2><p>Website content is provided for general informational purposes. We will make reasonable efforts to maintain accurate information, but content may change as services and products evolve.</p><p>Any limitation of liability must be interpreted subject to applicable law and any separate agreement governing a particular engagement. Nothing in these terms is intended to exclude non-excludable statutory rights or liabilities.</p><p class=\"rn\"><strong>Review note:</strong> The final liability, indemnity and dispute provisions must be reviewed by qualified legal counsel before publication.</p><h2>11. Privacy</h2><p>Our handling of personal information is described in the applicable Privacy Policy.</p><h2>12. Changes to These Terms</h2><p>We may update these terms as the website and our services evolve. The updated version will be published with a revised effective date.</p><h2>13. Governing Law and Disputes</h2><p class=\"rn\"><strong>Review note:</strong> The governing law, jurisdiction and dispute-resolution arrangements for these website terms must be confirmed by the company and reviewed by qualified legal counsel before publication. Do not invent an exclusive jurisdiction, arbitration clause or waiver of rights.</p><h2>14. Contact</h2><p class=\"adr\"><strong>SDRS Meta Rise Tech Private Limited</strong><br>Hyderabad, Telangana, India<br>Website: <mark class=\"pl\">[CONFIRM OFFICIAL CORPORATE DOMAIN]</mark><br>Contact: <a href=\"mailto:sdrstech@gmail.com\">sdrstech@gmail.com</a><br>Effective date: <mark class=\"pl\">[INSERT DATE AFTER APPROVAL]</mark></p><h2>Separate OMNIGO agreements required</h2><p class=\"rn\"><strong>Review note:</strong> Before the OMNIGO marketplace launches, prepare separate and appropriate agreements for: customers booking towing services; towing companies and independent service providers; and drivers or other authorised platform users, where relevant. These must address the actual business model, service-provider status, pricing, cancellations, refunds, payment flows, complaints, insurance and licensing responsibilities, safety, location data, liability and dispute resolution. This corporate website policy is not a substitute for those agreements.</p>"], "cookies": ["Cookie Policy", "<p class=\"rev\"><strong>Draft \u2014 not yet approved.</strong> This text is a working draft. Company facts must be confirmed and qualified legal counsel must review it before publication. It is not legally approved or confirmed compliant.</p><h2>1. Introduction</h2><p>This Cookie Policy explains how SDRS Tech may use cookies and similar technologies on its corporate website.</p><p>A cookie is a small file that a website may store on your device. Similar technologies may store information or help recognise activity across website visits.</p><p class=\"rn\"><strong>Review note:</strong> The technologies used by this website must be verified against the deployed version before this policy is published.</p><h2>2. Types of Technologies</h2><p>Depending on the actual website configuration, cookies or similar technologies may include:</p><ul><li><strong>Essential technologies:</strong> Needed for core website functions, security or user-requested features.</li><li><strong>Preference technologies:</strong> Used to remember settings or choices.</li><li><strong>Analytics technologies:</strong> Used to understand website traffic and performance.</li><li><strong>Advertising or marketing technologies:</strong> Used to measure campaigns or support advertising, where configured.</li><li><strong>Third-party technologies:</strong> Used by embedded content or services supplied by another provider.</li></ul><p>These are categories that may be relevant; they are not a statement that every category is currently active.</p><h2>3. What We Actually Use</h2><p class=\"rn\"><strong>Review note:</strong> Before publication, inspect the deployed website and document only technologies verified in the actual deployment: first- and third-party cookies, local storage, analytics and advertising scripts, embedded content, and cookie lifetimes, purposes and providers. Do not claim the website uses no cookies or tracking merely because no cookie banner is visible.</p><p class=\"rn\"><strong>Review note:</strong> Findings from the project code (to be re-verified on the live site): the site's own code sets no cookies and uses no local or session storage; no analytics, advertising or social-media scripts are included; fonts are loaded from Google Fonts (Google may receive visitors' IP address and browser details); four client logos are loaded from the clients' own websites until copied locally; the two brand videos are hosted with the website. The hosting provider's own cookies and server logs are unknown.</p><h2>4. Managing Your Choices</h2><p>Where the website uses technologies requiring consent, the appropriate consent and preference mechanism must be implemented before those technologies are activated, where required by applicable law.</p><p>Visitors may also be able to manage cookies through their browser settings. Blocking certain cookies may affect website functionality.</p><p>A browser setting alone does not necessarily replace any legally required consent mechanism.</p><p class=\"rn\"><strong>Review note:</strong> No consent banner is currently implemented. Counsel should advise whether one is needed for the technologies confirmed above.</p><h2>5. Third Parties</h2><p>Some third-party services may use their own cookies or similar technologies. Their practices are governed by their own policies.</p><p class=\"rn\"><strong>Review note:</strong> List actual providers only after verifying the website's scripts and configuration.</p><h2>6. Changes to This Policy</h2><p>We may update this policy when the website's technologies or legal requirements change.</p><h2>7. Contact</h2><p class=\"adr\"><strong>SDRS Meta Rise Tech Private Limited</strong><br>Hyderabad, Telangana, India<br>Contact: <a href=\"mailto:sdrstech@gmail.com\">sdrstech@gmail.com</a><br>Effective date: <mark class=\"pl\">[INSERT DATE AFTER APPROVAL]</mark></p><p class=\"rn\"><strong>Review note:</strong> Do not publish this page until the actual technology audit is complete and any required consent controls have been implemented.</p>"], "security": ["Security", "<p class=\"rev\"><strong>Draft \u2014 not yet approved.</strong> This text is a working draft. Company facts must be confirmed and qualified legal counsel must review it before publication. It is not legally approved or confirmed compliant.</p><h2>1. Our Approach</h2><p>SDRS Tech recognises the importance of protecting information and maintaining the integrity and availability of its digital services.</p><p>Our security practices should be described accurately and should reflect the safeguards actually implemented across the website and any operational products.</p><p>This page provides general security information. It is not a certification, independent audit report or guarantee that every system is free from vulnerabilities.</p><h2>2. Security Measures</h2><p>Depending on the systems in use, relevant safeguards may include:</p><ul><li>Restricting access to systems and information to authorised individuals.</li><li>Protecting credentials and API secrets.</li><li>Applying updates and addressing known vulnerabilities.</li><li>Using appropriate access controls and authentication.</li><li>Maintaining backups and recovery procedures where configured.</li><li>Monitoring for suspicious activity where monitoring is available.</li><li>Handling personal information according to applicable policies and requirements.</li></ul><p class=\"rn\"><strong>Review note:</strong> The company must verify which of these safeguards are actually implemented before presenting them as existing practices. Do not state that a particular encryption method, backup schedule, monitoring tool, penetration test, certification or security standard is in place without evidence.</p><h2>3. Reporting a Security Concern</h2><p>If you believe you have identified a security issue affecting our website or services, please contact:</p><p class=\"adr\"><strong>Security contact:</strong> <a href=\"mailto:sdrstech@gmail.com\">sdrstech@gmail.com</a></p><p>Include a concise description of the issue, the affected page or service and steps to reproduce it, where safe to do so.</p><p>Do not include passwords, secret keys, payment credentials or unnecessary personal information in a report.</p><p>Do not access, alter, download or disclose information belonging to other users, and do not disrupt services while investigating a suspected issue.</p><p class=\"rn\"><strong>Review note:</strong> The company must confirm the security-reporting contact (consider a dedicated mailbox) and establish a process for reviewing reports before publishing this section.</p><h2>4. Security and OMNIGO</h2><p>OMNIGO's security arrangements must reflect its actual technical architecture and operational status.</p><p class=\"rn\"><strong>Review note:</strong> Before the platform launches, document the relevant controls. [The source draft ends here mid-sentence; the remaining text of this section was not supplied and has not been written.]</p>"]};let was=false;const T0=document.title;
function view(){const k=location.hash.replace('#/',''),on=location.hash.startsWith('#/')&&LG[k];document.body.classList.toggle('legal',!!on);
if(on){document.title=LG[k][0]+' — SDRS Tech';document.querySelector('#lc').innerHTML='<h1>'+LG[k][0]+'</h1>'+LG[k][1];scrollTo(0,0)}
else{document.title=T0;if(was){const t=document.getElementById(location.hash.slice(1));t?t.scrollIntoView():scrollTo(0,0)}}was=!!on}
addEventListener('hashchange',view);view();
})();
