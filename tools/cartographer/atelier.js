/* Presentation consumes the expedition packet; collision stays in Expedition. */
'use strict';
const $=id=>document.getElementById(id),canvas=$('map'),ctx=canvas.getContext('2d'),T=MapGen.TILE;
const TILE=18,ground=document.createElement('canvas'),g=ground.getContext('2d'),floorImage=new Image();
let map,recipe='necropolis',view='world',camera={x:0,y:0,scale:1},drag=null,showRoute=false,showLabels=true,exploring=false,player,seen,selected=null,walkQueue=[],lastMove=0,toastTimer;
const palettes={necropolis:{floor:'#797560',rim:'#333b31',wall:'#7c8067',water:'#101714',ink:'#b8b49a'},causeway:{floor:'#5c7252',rim:'#213c35',wall:'#49634d',water:'#1c3631',ink:'#a5bf92'},quarry:{floor:'#69604f',rim:'#422d22',wall:'#6f6657',water:'#4a2319',ink:'#c8ad83'},sanctuary:{floor:'#707675',rim:'#253034',wall:'#8a9083',water:'#111d25',ink:'#a1b9bb'}};
function notify(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),3500);}
for(const [i,[id,r]] of Object.entries(Expedition.RECIPES).entries()){
  const b=document.createElement('button');b.className='recipe'+(id===recipe?' active':'');b.dataset.recipe=id;b.innerHTML=`<span class="glyph">${['♜','≋','♨','✧'][i]}</span><span>${r.name.replace('The ','')}<small>${['Burial chambers · limestone','Tidal islands · causeways','Basalt chambers · embers','Open courts · astral void'][i]}</small></span>`;
  b.onclick=()=>{recipe=id;document.querySelectorAll('.recipe').forEach(e=>e.classList.toggle('active',e===b));generate();};$('recipes').append(b);
}
function options(){const [columns,rows]=$('size').value.split(',').map(Number);return {seed:$('seed').value,recipe,columns,rows,branches:+$('branches').value,loops:+$('loops').value};}
function generate(){const start=performance.now();map=Expedition.generate(options());installMap();$('validation').textContent=`Connected · sockets clear · ${(performance.now()-start).toFixed(0)} ms`;const query=new URLSearchParams(options());history.replaceState(null,'','#'+query);}
function installMap(){
  recipe=map.expedition.recipe;selected=null;exploring=false;$('explore').classList.remove('active');$('explore').textContent='Explore';player={...map.entrance};seen=new Uint8Array(map.tiles.length);walkQueue=[];
  const r=Expedition.RECIPES[recipe];$('region-name').textContent=r.name;$('map-title').textContent=r.name;$('region-description').textContent=r.description;$('seed-label').textContent=`SEED ${map.seed}`;$('map-number').textContent=`Nº ${map.seed}`;$('reading').textContent=map.expedition.reading.rule;$('selected-title').textContent='Read the ground, learn the route.';
  const values=[[map.metrics.rooms,'Authored chambers'],[map.metrics.routeLength,'Tiles to guardian'],[map.metrics.optionalRooms,'Optional chambers'],[map.metrics.loops,'Return loops'],[map.metrics.monsters,'Encounter population']];
  $('metrics').replaceChildren(...values.map(([n,label])=>{const el=document.createElement('div');el.className='metric';const a=document.createElement('strong'),b=document.createElement('span');a.textContent=n;b.textContent=label;el.append(a,b);return el;}));
  const valid=Expedition.validate(map);$('validation').textContent=valid.valid?'Connected · sockets clear · safe entry':valid.errors.join(' · ');$('detail').textContent=`${map.width} × ${map.height} tiles · ${map.metrics.coverage}% walkable · generator ${map.version}. Select a chamber for socket and encounter details.`;
  bake();fit();
}
function hash(x,y){let h=Math.imul(x+map.seed,374761393)^Math.imul(y,668265263);h=Math.imul(h^(h>>>13),1274126177);return (h>>>0)/4294967296;}
function bake(){
  ground.width=map.width*TILE;ground.height=map.height*TILE;const pal=palettes[recipe];g.fillStyle=pal.water;g.fillRect(0,0,ground.width,ground.height);
  const pattern=floorImage.complete&&floorImage.naturalWidth?g.createPattern(floorImage,'repeat'):null;
  if(pattern)pattern.setTransform(new DOMMatrix().scale(.18));
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const t=map.tiles[y*map.width+x],px=x*TILE,py=y*TILE,v=hash(x,y),walk=MapGen.WALKABLE.has(t);
    if(walk){
      g.fillStyle=pal.floor;g.fillRect(px,py,TILE,TILE);
      if(pattern&&t!==T.BRIDGE){g.globalAlpha=recipe==='necropolis'||recipe==='sanctuary'?.72:.2;g.fillStyle=pattern;g.fillRect(px,py,TILE,TILE);g.globalAlpha=1;}
      g.fillStyle=`rgba(7,17,12,${.08+v*.19})`;g.fillRect(px,py,TILE,TILE);
      if(t===T.BRIDGE){g.fillStyle='#716a4d';g.fillRect(px,py,TILE,TILE);g.strokeStyle='#363a2b';g.strokeRect(px+.5,py+.5,TILE-1,TILE-1);g.fillStyle='#ad9b6b';g.fillRect(px+2,py+2,TILE-4,1);}
      if(t===T.GRASS||t===T.RUBBLE){g.fillStyle=recipe==='causeway'?'#99a774':'#aaa080';g.globalAlpha=.2;for(let i=0;i<3;i++)g.fillRect(px+hash(x+i,y)*16,py+hash(x,y+i)*16,1,2);g.globalAlpha=1;}
      for(const [dx,dy] of Expedition.DIRS){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=map.width||ny>=map.height||!MapGen.WALKABLE.has(map.tiles[ny*map.width+nx])){g.fillStyle='#070c0890';g.fillRect(px+(dx===1?TILE-3:0),py+(dy===1?TILE-3:0),dx?3:TILE,dy?3:TILE);}}
    }else if(t===T.WALL){
      g.fillStyle='#080d0ac0';g.fillRect(px+4,py+5,TILE+3,TILE+3);g.fillStyle=pal.rim;g.fillRect(px,py,TILE,TILE);g.fillStyle=pal.wall;g.fillRect(px+1,py-3,TILE-2,TILE-3);g.fillStyle=`rgba(8,17,10,${v*.25})`;g.fillRect(px+1,py-3,TILE-2,TILE-3);g.strokeStyle='#c8c3a344';g.strokeRect(px+2.5,py-2.5,TILE-5,TILE-5);g.fillStyle='#b4b39155';g.fillRect(px+2,py-3,TILE-4,1);
    }else if(t===T.DEEP||t===T.LAVA){if(v>.72){g.strokeStyle=t===T.LAVA?'#a95b2b30':'#88b7a21a';g.beginPath();g.moveTo(px,py+TILE*v);g.lineTo(px+TILE*.7,py+TILE*v-1);g.stroke();}}
  }
  for(const n of map.rooms){
    const x=(n.cx+.5)*TILE,y=(n.cy+.5)*TILE;g.strokeStyle=n.role==='boss'?'#d59b6b80':'#c5bb8e45';g.lineWidth=1;g.beginPath();g.arc(x,y,n.role==='boss'?TILE*3.2:TILE*1.4,0,Math.PI*2);g.stroke();g.beginPath();g.arc(x,y,n.role==='boss'?TILE*2.9:TILE*1.2,0,Math.PI*2);g.stroke();
    if(n.role==='entry'||n.role==='boss'){for(let i=-1;i<=1;i++){g.fillStyle='#c6b47677';g.fillRect((n.cx+(n.role==='entry'?-3:3))*TILE,(n.cy+i)*TILE,TILE-2,2);}}
  }
  for(const e of map.entities){const x=(e.x+.5)*TILE,y=(e.y+.5)*TILE;if(e.type==='torch'){const grad=g.createRadialGradient(x,y,0,x,y,60);grad.addColorStop(0,'#ffc96633');grad.addColorStop(1,'#ffc96600');g.fillStyle=grad;g.fillRect(x-60,y-60,120,120);g.fillStyle='#41351e';g.fillRect(x-3,y-2,6,7);g.fillStyle='#ffe2a1';g.beginPath();g.arc(x,y-3,2.5,0,7);g.fill();}else if(e.type==='urn'){g.fillStyle='#080e0a90';g.beginPath();g.ellipse(x+2,y+3,5,3,0,0,7);g.fill();g.fillStyle='#a38a59';g.beginPath();g.ellipse(x,y,3.3,4,0,0,7);g.fill();g.fillStyle='#493f2b';g.fillRect(x-2,y-3,4,2);}else if(e.type==='rubble'){g.fillStyle='#9f9a7d77';g.fillRect(x,y,3,2);g.fillRect(x+4,y+3,2,2);}}
}
function fit(){const w=canvas.clientWidth,h=canvas.clientHeight;camera.scale=Math.min((w-70)/(map.width*TILE),(h-140)/(map.height*TILE));camera.x=(w-map.width*TILE*camera.scale)/2;camera.y=95+(h-140-map.height*TILE*camera.scale)/2;}
function project(p){return {x:camera.x+(p.x+.5)*TILE*camera.scale,y:camera.y+(p.y+.5)*TILE*camera.scale};}
function visible(p){return !exploring||seen[p.y*map.width+p.x];}
function reveal(){$('map').setAttribute('aria-label',`Exploring expedition at tile ${player.x}, ${player.y}. Use WASD or arrow keys to move.`);for(let y=Math.max(0,player.y-8);y<=Math.min(map.height-1,player.y+8);y++)for(let x=Math.max(0,player.x-8);x<=Math.min(map.width-1,player.x+8);x++){if((x-player.x)**2+(y-player.y)**2>64)continue;let dx=x-player.x,dy=y-player.y,steps=Math.max(Math.abs(dx),Math.abs(dy)),blocked=false;for(let k=0;k<steps;k++){const sx=Math.round(player.x+dx*k/steps),sy=Math.round(player.y+dy*k/steps);if(!MapGen.WALKABLE.has(map.tiles[sy*map.width+sx])){blocked=true;break;}}if(!blocked)seen[y*map.width+x]=1;}}
function draw(time){
  const dpr=Math.min(devicePixelRatio||1,2),w=canvas.clientWidth,h=canvas.clientHeight;if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  if(map){
    if(exploring&&walkQueue.length&&time-lastMove>85){const next=walkQueue.shift();if(seen[next.y*map.width+next.x]){player=next;reveal();}else walkQueue=[];lastMove=time;}
    ctx.save();ctx.translate(camera.x,camera.y);ctx.scale(camera.scale,camera.scale);
    if(view==='world')ctx.drawImage(ground,0,0);else if(view==='atlas'){
      ctx.fillStyle='#0e1812';ctx.fillRect(0,0,ground.width,ground.height);
      for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){const t=map.tiles[y*map.width+x];if(MapGen.WALKABLE.has(t)){ctx.fillStyle='#899a7138';ctx.fillRect(x*TILE,y*TILE,TILE,TILE);for(const d of Expedition.DIRS)if(!MapGen.WALKABLE.has(map.tiles[(y+d[1])*map.width+x+d[0]])){ctx.fillStyle='#b2b38d';ctx.fillRect(x*TILE+(d[0]===1?TILE-1:0),y*TILE+(d[1]===1?TILE-1:0),d[0]?1:TILE,d[1]?1:TILE);}}}
    } else {
      for(const e of map.expedition.graph.edges){const a=map.rooms[e.a],b=map.rooms[e.b];if(!visible({x:a.cx,y:a.cy})||!visible({x:b.cx,y:b.cy}))continue;ctx.strokeStyle=e.kind==='main'?'#cabb87':e.kind==='loop'?'#81baa5':'#727e66';ctx.setLineDash(e.kind==='branch'?[6,5]:[]);ctx.lineWidth=3/camera.scale;ctx.beginPath();ctx.moveTo((a.cx+.5)*TILE,(a.cy+.5)*TILE);ctx.lineTo((b.cx+.5)*TILE,(b.cy+.5)*TILE);ctx.stroke();}ctx.setLineDash([]);
      for(const n of map.rooms){if(!visible({x:n.cx,y:n.cy}))continue;ctx.fillStyle=n.role==='boss'?'#614335':n.role==='treasure'?'#49492d':'#2c4031';ctx.strokeStyle=palettes[recipe].ink;ctx.lineWidth=1/camera.scale;ctx.fillRect((n.cx-3)*TILE,(n.cy-2)*TILE,7*TILE,5*TILE);ctx.strokeRect((n.cx-3)*TILE,(n.cy-2)*TILE,7*TILE,5*TILE);}
    }
    if(showRoute){ctx.strokeStyle='#ded295';ctx.lineWidth=2/camera.scale;ctx.setLineDash([5/camera.scale,5/camera.scale]);ctx.beginPath();let started=false;for(const p of map.mainPath){if(!visible(p)){started=false;continue;}ctx[started?'lineTo':'moveTo']((p.x+.5)*TILE,(p.y+.5)*TILE);started=true;}ctx.stroke();ctx.setLineDash([]);}
    if(exploring&&view!=='graph'){ctx.fillStyle='#0d1714';for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++)if(!seen[y*map.width+x])ctx.fillRect(x*TILE-.5/camera.scale,y*TILE-.5/camera.scale,TILE+1.5/camera.scale,TILE+1.5/camera.scale);}
    if(selected!==null){const n=map.rooms[selected];ctx.strokeStyle='#eee1ac';ctx.lineWidth=2/camera.scale;ctx.strokeRect((n.cx-5)*TILE,(n.cy-5)*TILE,11*TILE,11*TILE);}
    ctx.restore();
    for(const n of map.rooms){const point={x:n.cx,y:n.cy};if(!visible(point))continue;const p=project(point),important=['entry','boss','treasure'].includes(n.role);if(showLabels&&(important||view==='graph')){ctx.font='9px "DM Sans",sans-serif';ctx.textAlign='center';const label=n.landmark;ctx.fillStyle='#0c1612df';ctx.fillRect(p.x-ctx.measureText(label).width/2-7,p.y+12,ctx.measureText(label).width+14,20);ctx.fillStyle=important?'#d3ccaa':'#92a28b';ctx.fillText(label,p.x,p.y+25);}if(important){ctx.fillStyle=n.role==='boss'?'#e19879':n.role==='treasure'?'#e6c476':'#a0dcc0';ctx.strokeStyle='#19261d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y-6);ctx.lineTo(p.x+5,p.y);ctx.lineTo(p.x,p.y+6);ctx.lineTo(p.x-5,p.y);ctx.closePath();ctx.fill();ctx.stroke();}}
    if(view==='world')for(const s of map.spawns){if(!visible(s))continue;const p=project(s);if(s.type==='boss')continue;ctx.fillStyle=s.type==='elite'?'#dab677':'#ae7866';for(let i=0;i<Math.min(s.count,5);i++){ctx.beginPath();ctx.arc(p.x+(i%3-1)*4,p.y+Math.floor(i/3)*4,1.4,0,7);ctx.fill();}}
    if(exploring){const p=project(player);ctx.shadowColor='#abedc2';ctx.shadowBlur=12;ctx.fillStyle='#ddffe7';ctx.beginPath();ctx.arc(p.x,p.y,4,0,7);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#abedc255';ctx.beginPath();ctx.arc(p.x,p.y,9+Math.sin(time/300),0,7);ctx.stroke();}
  }
  requestAnimationFrame(draw);
}
function inspect(n){selected=n.id;$('selected-title').textContent=n.landmark;$('reading').textContent=`${n.prefab} · ${n.role} chamber · ${n.depth} walking tiles from entry. ${n.role==='treasure'?'A terminal optional branch rewards the detour.':n.role==='boss'?'The final chamber has one approach, a clear arena and an eastern extraction gate.':'Follow the central lane; pillars leave its cross-shaped approach open.'}`;$('detail').textContent=`Sockets: ${n.sockets.map(s=>Expedition.DIRS[s.direction][2]+' → '+map.rooms[s.to].landmark).join(' · ')}. Encounter tier ${n.tier}.`;}
canvas.addEventListener('pointerdown',e=>{canvas.focus();drag={x:e.clientX,y:e.clientY,cx:camera.x,cy:camera.y,moved:false};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>4)drag.moved=true;if(drag.moved){camera.x=drag.cx+dx;camera.y=drag.cy+dy;}});
canvas.addEventListener('pointerup',e=>{if(drag&&!drag.moved){const rect=canvas.getBoundingClientRect(),x=Math.floor((e.clientX-rect.left-camera.x)/camera.scale/TILE),y=Math.floor((e.clientY-rect.top-camera.y)/camera.scale/TILE);if(x>=0&&y>=0&&x<map.width&&y<map.height&&visible({x,y})){const n=map.rooms.find(n=>Math.abs(n.cx-x)<=5&&Math.abs(n.cy-y)<=5);if(n)inspect(n);if(exploring&&MapGen.WALKABLE.has(map.tiles[y*map.width+x]))walkQueue=Expedition.path(map,player,{x,y}).slice(1);}}drag=null;});canvas.addEventListener('pointercancel',()=>drag=null);
function zoom(factor,x=canvas.clientWidth/2,y=canvas.clientHeight/2){const next=Math.max(.08,Math.min(4,camera.scale*factor));camera.x=x-(x-camera.x)*next/camera.scale;camera.y=y-(y-camera.y)*next/camera.scale;camera.scale=next;}
canvas.addEventListener('wheel',e=>{e.preventDefault();const r=canvas.getBoundingClientRect();zoom(e.deltaY<0?1.12:1/1.12,e.clientX-r.left,e.clientY-r.top);},{passive:false});
canvas.addEventListener('keydown',e=>{const dirs={w:[0,-1],ArrowUp:[0,-1],s:[0,1],ArrowDown:[0,1],a:[-1,0],ArrowLeft:[-1,0],d:[1,0],ArrowRight:[1,0]};if(exploring&&dirs[e.key]){e.preventDefault();const d=dirs[e.key],p={x:player.x+d[0],y:player.y+d[1]};if(p.x>=0&&p.y>=0&&p.x<map.width&&p.y<map.height&&MapGen.WALKABLE.has(map.tiles[p.y*map.width+p.x])){player=p;walkQueue=[];reveal();}}});
$('fit').onclick=fit;$('zoom-in').onclick=()=>zoom(1.3);$('zoom-out').onclick=()=>zoom(1/1.3);$('generate').onclick=generate;$('seed').onkeydown=e=>{if(e.key==='Enter')generate();};$('roll').onclick=()=>{$('seed').value=crypto.getRandomValues(new Uint32Array(1))[0];generate();};
for(const id of ['branches','loops'])$(id).oninput=()=>$(id+'-value').value=$(id).value;
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(e=>e.classList.toggle('active',e===b));});
$('route').onclick=()=>{showRoute=!showRoute;$('route').setAttribute('aria-pressed',showRoute);};$('labels').onclick=()=>{showLabels=!showLabels;$('labels').setAttribute('aria-pressed',showLabels);};
$('explore').onclick=()=>{exploring=!exploring;$('explore').classList.toggle('active',exploring);$('explore').textContent=exploring?'Leave exploration':'Explore';if(exploring){player={...map.entrance};seen.fill(0);walkQueue=[];selected=null;reveal();notify('WASD / arrows to explore. Click discovered floor to walk.');canvas.focus();}};
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('export-json').onclick=()=>download(new Blob([JSON.stringify(Expedition.toJSON(map),null,2)],{type:'application/json'}),`verdigris-${recipe}-${map.seed}.json`);
$('export-png').onclick=()=>ground.toBlob(b=>{if(b)download(b,`verdigris-${recipe}-${map.seed}.png`);});
$('import-json').onclick=()=>$('import-file').click();$('import-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>4000000)throw Error('Map file exceeds 4 MB');const candidate=Expedition.fromJSON(JSON.parse(await file.text()));if(!Expedition.RECIPES[candidate.expedition.recipe])throw Error('Unknown recipe');map=candidate;installMap();$('seed').value=map.seed;$('size').value=map.expedition.columns+','+map.expedition.rows;for(const id of ['branches','loops']){$(id).value=map.expedition[id];$(id+'-value').value=$(id).value;}document.querySelectorAll('.recipe').forEach(e=>e.classList.toggle('active',e.dataset.recipe===recipe));history.replaceState(null,'','#'+new URLSearchParams(options()));notify('Expedition imported and validated.');}catch(error){notify('Import failed: '+error.message);}e.target.value='';};
floorImage.onload=()=>{if(map)bake();};floorImage.src='assets/limestone-floor.png';
const query=new URLSearchParams(location.hash.slice(1));if(Expedition.RECIPES[query.get('recipe')])recipe=query.get('recipe');for(const id of ['seed','branches','loops'])if(query.has(id))$(id).value=query.get(id);const extent=query.get('columns')+','+query.get('rows');if([...$('size').options].some(o=>o.value===extent))$('size').value=extent;document.querySelectorAll('.recipe').forEach(e=>e.classList.toggle('active',e.dataset.recipe===recipe));for(const id of ['branches','loops'])$(id+'-value').value=$(id).value;
new ResizeObserver(()=>{if(map)fit();}).observe($('viewport'));generate();requestAnimationFrame(draw);
