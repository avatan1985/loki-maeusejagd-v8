
const cvs=document.getElementById('c'),ctx=cvs.getContext('2d',{alpha:false});const DPR=Math.max(1,Math.min(2,devicePixelRatio||1));
function R(){cvs.width=innerWidth*DPR;cvs.height=innerHeight*DPR;ctx.setTransform(DPR,0,0,DPR,0,0)}R();addEventListener('resize',R);
const LAYERS={kitchen:[img('kitchen_far.png'),img('kitchen_mid.png'),img('kitchen_near.png')],garden:[img('garden_far.png'),img('garden_mid.png'),img('garden_near.png')],cellar:[img('cellar_far.png'),img('cellar_mid.png'),img('cellar_near.png')],attic:[img('attic_far.png'),img('attic_mid.png'),img('attic_near.png')],street:[img('street_far.png'),img('street_mid.png'),img('street_near.png')]};
const SPR={loki:img('sprites_loki.png'),merlin:img('sprites_merlin.png')};const META={w:240,h:192,rows:{idle:0,run:1},frames:{idle:8,run:8}};
function img(src){const i=new Image();i.src=src;return i}
let state='menu',score=0,lvl=1,biomes=['kitchen','garden','cellar','attic','street'],bi=0,cam={x:0,y:0},map={w:3600,h:2400};
let loki={x:map.w/2,y:map.h/2,vx:0,vy:0,r:20},merlin=null,mice=[];
function spawnM(n){for(let i=0;i<n;i++)mice.push({x:80+Math.random()*(map.w-160),y:80+Math.random()*(map.h-160),r:10,vx:(Math.random()*2-1)*120,vy:(Math.random()*2-1)*120})}
function reset(){score=0;lvl=1;bi=0;lokix();mice.length=0;spawnM(14)}
function lokix(){loki={x:map.w/2,y:map.h/2,vx:0,vy:0,r:20}}
document.getElementById('play').onclick=()=>{reset();state='play';loop(performance.now())}
const keys=new Set();addEventListener('keydown',e=>keys.add(e.key.toLowerCase()));addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
function loop(t){if(state!=='play'){drawMenu();requestAnimationFrame(loop);return}const dt=0.016;
let ax=(keys.has('a')||keys.has('arrowleft')?-1:0)+(keys.has('d')||keys.has('arrowright')?1:0);
let ay=(keys.has('w')||keys.has('arrowup')?-1:0)+(keys.has('s')||keys.has('arrowdown')?1:0);
let len=Math.hypot(ax,ay)||1;ax/=len;ay/=len;loki.vx+=ax*1400*dt;loki.vy+=ay*1400*dt;let sp=Math.hypot(loki.vx,loki.vy);const mv=420;if(sp>mv){loki.vx=loki.vx/sp*mv;loki.vy=loki.vy/sp*mv}
loki.x+=loki.vx*dt;loki.y+=loki.vy*dt;loki.vx*=0.88;loki.vy*=0.88;loki.x=Math.max(20,Math.min(map.w-20,loki.x));loki.y=Math.max(20,Math.min(map.h-20,loki.y));
for(const m of mice){m.vx+=(Math.random()*2-1)*20; m.vy+=(Math.random()*2-1)*20; let s=Math.hypot(m.vx,m.vy); if(s>180){m.vx=m.vx/s*180;m.vy=m.vy/s*180} m.x+=m.vx*dt; m.y+=m.vy*dt; if(m.x<10||m.x>map.w-10) m.vx*=-1; if(m.y<10||m.y>map.h-10) m.vy*=-1;}
for(let i=mice.length-1;i>=0;i--){const m=mice[i];const d=Math.hypot(m.x-loki.x,m.y-loki.y); if(d<loki.r+m.r){mice.splice(i,1); score++; if(score%10===0){lvl++; bi=(bi+1)%biomes.length; } }}
cam.x=Math.max(0,Math.min(map.w - cvs.width/DPR, loki.x - cvs.width/DPR/2)); cam.y=Math.max(0,Math.min(map.h - cvs.height/DPR, loki.y - cvs.height/DPR/2));
draw(); document.getElementById('sc').textContent=score; document.getElementById('lvl').textContent=lvl; requestAnimationFrame(loop)}
function draw(){ctx.clearRect(0,0,cvs.width/DPR,cvs.height/DPR);const [far,mid,near]=LAYERS[biomes[bi]];tile(far,0.2);tile(mid,0.5);tile(near,0.8);
for(const m of mice){ctx.fillStyle='#cbd1ea';ctx.beginPath();ctx.arc(m.x-cam.x,m.y-cam.y,5,0,Math.PI*2);ctx.fill()}
drawSprite(SPR.loki,(Math.hypot(loki.vx,loki.vy)>30?'run':'idle'),loki.x,loki.y,false)}
function tile(img,par){if(!img.complete)return;const w=cvs.width/DPR,h=cvs.height/DPR;const ox=-cam.x*par%img.width,oy=-cam.y*par%img.height;for(let x=ox-img.width;x<w+img.width;x+=img.width)for(let y=oy-img.height;y<h+img.height;y+=img.height)ctx.drawImage(img,x,y)}
function drawSprite(sheet,anim,x,y,flip){const row=(anim==='idle'?0:1);const fr=8;const t=Math.floor(performance.now()/100)%fr;const sx=t*META.w,sy=row*META.h; if(flip){ctx.save();ctx.translate(x-cam.x,y-cam.y);ctx.scale(-1,1);ctx.drawImage(sheet,sx,sy,META.w,META.h,-META.w/2,-META.h/2,META.w,META.h);ctx.restore()} else {ctx.drawImage(sheet,sx,sy,META.w,META.h,x-cam.x-META.w/2,y-cam.y-META.h/2,META.w,META.h)}}
function drawMenu(){ctx.fillStyle='#0b0e1a';ctx.fillRect(0,0,cvs.width/DPR,cvs.height/DPR);ctx.fillStyle='#ecf1ff';ctx.font='24px system-ui';ctx.fillText('Loki – Mäusejagd v8 α (compact)', 24, 48);}
