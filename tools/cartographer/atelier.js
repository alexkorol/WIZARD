/* Presentation consumes the expedition packet; collision stays in Expedition. */
'use strict';
const $=id=>document.getElementById(id),canvas=$('map'),ctx=canvas.getContext('2d'),T=MapGen.TILE;
const TILE=18,ground=document.createElement('canvas'),g=ground.getContext('2d'),floorImage=new Image(),grassImage=new Image(),earthImage=new Image(),basaltImage=new Image();
let map,recipe='mesa',view='world',camera={x:0,y:0,scale:1},drag=null,showRoute=false,showLabels=true,exploring=false,player,seen,selected=null,walkQueue=[],lastMove=0,toastTimer;
const palettes={wildwood:{floor:'#4d6644',rim:'#273c30',wall:'#63705a',water:'#101f18',ink:'#b5c997'},necropolis:{floor:'#797560',rim:'#333b31',wall:'#7c8067',water:'#101714',ink:'#b8b49a'},causeway:{floor:'#5c7252',rim:'#213c35',wall:'#49634d',water:'#1c3631',ink:'#a5bf92'},quarry:{floor:'#69604f',rim:'#422d22',wall:'#6f6657',water:'#4a2319',ink:'#c8ad83'},sanctuary:{floor:'#707675',rim:'#253034',wall:'#8a9083',water:'#111d25',ink:'#a1b9bb'}};
Object.assign(palettes,{
 temple:{floor:'#a69672',rim:'#354338',wall:'#bdaf87',water:'#233e38',ink:'#dad0a3'},
 mesa:{floor:'#c39358',rim:'#67472e',wall:'#c7925d',water:'#201b18',ink:'#dec39b'},
 cold_river:{floor:'#aabfc0',rim:'#495d66',wall:'#87999d',water:'#294b5d',ink:'#c5dce1'},
 canyon:{floor:'#b3814e',rim:'#50372b',wall:'#936e4f',water:'#261e19',ink:'#e4bd8a'},
 cages:{floor:'#646e67',rim:'#252f2b',wall:'#95988a',water:'#101915',ink:'#c4c8ae'},
 summit:{floor:'#c2cbca',rim:'#53636c',wall:'#9caaad',water:'#1b2931',ink:'#e1e9e7'}
});
function notify(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),3500);}
for(const [i,[id,r]] of Object.entries(Expedition.RECIPES).entries()){
  const b=document.createElement('button');b.className='recipe'+(id===recipe?' active':'');b.dataset.recipe=id;b.innerHTML=`<span class="glyph">${r.glyph||['♧','♜','≋','♨','✧'][i]}</span><span>${r.name.replace('The ','')}<small>${r.subtitle||['Woodland · trails · ridgelines','Eroded burial vaults · limestone','Wetland · inlets · crossings','Open badlands · volcanic gullies','Eroded courts · astral void'][i]}</small></span>`;
  b.onclick=()=>{recipe=id;document.querySelectorAll('.recipe').forEach(e=>e.classList.toggle('active',e===b));generate({fresh:!$('keep-seed').checked});};$(r.area?'recipes':'legacy-recipes').append(b);
}
function setExtent(columns,rows){
  columns=Number(columns);rows=Number(rows);
  if(!Number.isInteger(columns)||columns<4||columns>10||!Number.isInteger(rows)||rows<3||rows>7)return;
  const value=columns+','+rows;
  if(![...$('size').options].some(o=>o.value===value))$('size').add(new Option(`Custom extent (${columns} × ${rows})`,value));
  $('size').value=value;
}
function options(){const [columns,rows]=$('size').value.split(',').map(Number);return {seed:$('seed').value,recipe,layout:Expedition.RECIPES[recipe].area?'identity':$('layout').value,columns,rows,branches:Expedition.RECIPES[recipe].area?0:+$('branches').value,loops:Expedition.RECIPES[recipe].area?0:+$('loops').value};}
function generate({fresh=false}={}){if(fresh)$('seed').value=crypto.getRandomValues(new Uint32Array(1))[0];const start=performance.now();map=Expedition.generate(options());installMap();const check=Expedition.validate(map);$('validation').textContent=check.valid?`Connected · ${map.area?'landmarks reachable':'sockets clear'} · ${(performance.now()-start).toFixed(0)} ms`:check.errors.join(' · ');const query=new URLSearchParams(options());history.replaceState(null,'','#'+query);}
function installMap(){
  recipe=map.expedition.recipe;selected=null;exploring=false;$('explore').classList.remove('active');$('explore').textContent='Explore';player={...map.entrance};seen=new Uint8Array(map.tiles.length);walkQueue=[];
  const r=Expedition.RECIPES[recipe];document.querySelectorAll('[data-legacy-only]').forEach(e=>e.hidden=!!map.area);if(!map.area)$('terrain-studies').open=true;$('region-name').textContent=r.name;$('map-title').textContent=r.name;$('region-description').textContent=map.area?r.description:Expedition.LAYOUTS[map.expedition.layout||'terrain'].name+' · '+r.description;$('seed-label').textContent=`SEED ${map.seed}`;$('map-number').textContent=`Nº ${map.seed}`;$('reading').textContent=map.expedition.reading.rule;$('selected-title').textContent='Read the ground, learn the route.';
  const values=map.area?[[map.area.features.length,'Landscape features'],[map.metrics.walkable.toLocaleString(),'Walkable tiles'],[map.metrics.routeLength,'Tiles to guardian'],[map.metrics.packs,'Encounter groups'],[map.metrics.monsters,'Encounter population']]:[[map.metrics.rooms,'Landmark districts'],[map.metrics.routeLength,'Tiles to guardian'],[map.metrics.optionalRooms,'Side destinations'],[map.metrics.loops,map.expedition.layout&&map.expedition.layout!=='terrain'?'Layout loops':'Planned loops'],[map.metrics.monsters,'Encounter population']];
  $('metrics').replaceChildren(...values.map(([n,label])=>{const el=document.createElement('div');el.className='metric';const a=document.createElement('strong'),b=document.createElement('span');a.textContent=n;b.textContent=label;el.append(a,b);return el;}));
  const valid=Expedition.validate(map);$('validation').textContent=valid.valid?'Connected · '+(map.area?'landmarks reachable':'sockets clear')+' · safe entry':valid.errors.join(' · ');$('detail').textContent=`${map.area?'The topology view traces actual walking routes between landmarks.':`Entry: ${map.expedition.reading.entryFacing}; destination approach: ${map.expedition.reading.exitFacing}.`} ${map.width} × ${map.height} tiles · ${map.metrics.coverage}% walkable · generator ${map.version}. Select a landmark for route and encounter details.`;
  bake();fit();
}
function hash(x,y){let h=Math.imul(x+map.seed,374761393)^Math.imul(y,668265263);h=Math.imul(h^(h>>>13),1274126177);return (h>>>0)/4294967296;}
function bake(){
  ground.width=map.width*TILE;ground.height=map.height*TILE;const pal=palettes[recipe];if(!map.area){g.fillStyle=pal.water;g.fillRect(0,0,ground.width,ground.height);}
  const materialPattern=image=>{if(!image.complete||!image.naturalWidth)return null;const p=g.createPattern(image,'repeat');p.setTransform(new DOMMatrix().scale(.18));return p;};
  const materials={stone:materialPattern(floorImage),grass:materialPattern(grassImage),earth:materialPattern(earthImage),basalt:materialPattern(basaltImage)};
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const t=map.tiles[y*map.width+x],px=x*TILE,py=y*TILE,v=hash(x,y),walk=MapGen.WALKABLE.has(t);
    if(walk){
      g.fillStyle=pal.floor;g.fillRect(px,py,TILE,TILE);
      // Terrain IDs select materials. Grass and soil cannot fall back to masonry.
      const surface=t===T.DOOR?'stone':t===T.GRASS?'grass':t===T.PATH||t===T.MURK?'earth':t===T.RUBBLE?'basalt':t===T.FLOOR?'stone':null;
      const material=materials[surface];
      if(material){g.globalAlpha=map.area?(map.outdoor ? .19 : .55):.88;g.fillStyle=material;g.fillRect(px,py,TILE,TILE);g.globalAlpha=1;}
      g.fillStyle='rgba(7,17,12,.08)';g.fillRect(px,py,TILE,TILE);
      if(map.area){const z=map.elevation[y*map.width+x];g.fillStyle=`rgba(255,255,255,${Math.max(0,z-1)*.065+v*.035})`;g.fillRect(px,py,TILE,TILE);if(v>.65){g.fillStyle='#15211c15';g.fillRect(px+v*9,py+5,4,1);}}
      if(t===T.DOOR){g.fillStyle='#d8b77d';g.fillRect(px+4,py+4,TILE-8,TILE-8);}
      if(t===T.BRIDGE){g.fillStyle='#716a4d';g.fillRect(px,py,TILE,TILE);g.strokeStyle='#363a2b';g.strokeRect(px+.5,py+.5,TILE-1,TILE-1);g.fillStyle='#ad9b6b';g.fillRect(px+2,py+2,TILE-4,1);}
      if(t===T.GRASS||t===T.RUBBLE){g.fillStyle=recipe==='causeway'?'#99a774':'#aaa080';g.globalAlpha=.2;for(let i=0;i<3;i++)g.fillRect(px+hash(x+i,y)*16,py+hash(x,y+i)*16,1,2);g.globalAlpha=1;}
      for(const [dx,dy] of Expedition.DIRS){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=map.width||ny>=map.height||!MapGen.WALKABLE.has(map.tiles[ny*map.width+nx])){g.fillStyle='#070c0890';g.fillRect(px+(dx===1?TILE-3:0),py+(dy===1?TILE-3:0),dx?3:TILE,dy?3:TILE);}}
    }else if(t===T.WALL){
      if(recipe==='cages'){g.fillStyle=pal.rim;g.fillRect(px,py,TILE,TILE);g.fillStyle=pal.wall;g.fillRect(px+2,py+2,TILE-4,2);for(let k=3;k<TILE;k+=5)g.fillRect(px+k,py+4,1,TILE-4);continue;}g.fillStyle=pal.rim;g.fillRect(px,py,TILE,TILE);g.fillStyle=pal.wall;g.beginPath();g.moveTo(px-2,py+3);g.lineTo(px+5,py-3);g.lineTo(px+TILE,py-1);g.lineTo(px+TILE+2,py+TILE-5);g.lineTo(px+7,py+TILE-2);g.lineTo(px,py+TILE);g.closePath();g.fill();
    }else if(t===T.TREE||t===T.ROCK){if(recipe==='canyon'){let near=false;for(let dy=-4;dy<=4&&!near;dy++)for(let dx=-4;dx<=4;dx++){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<map.width&&ny<map.height&&MapGen.WALKABLE.has(map.tiles[ny*map.width+nx])){near=true;break;}}if(!near)continue;}g.fillStyle=map.area?pal.rim:t===T.TREE?'#263e2b':'#464b3e';g.fillRect(px,py,TILE,TILE);if(map.area){g.fillStyle=`rgba(255,220,180,${v*.1})`;g.fillRect(px,py,TILE,TILE);g.strokeStyle=pal.wall;g.globalAlpha=.3;g.beginPath();g.moveTo(px,py+TILE*v);g.lineTo(px+TILE,py+TILE*v-3);g.stroke();g.globalAlpha=1;}
    }else if(t===T.WATER||t===T.DEEP||t===T.LAVA){g.fillStyle=pal.water;g.fillRect(px,py,TILE,TILE);if(v>.72){g.strokeStyle=t===T.LAVA?'#a95b2b30':'#88b7a21a';g.beginPath();g.moveTo(px,py+TILE*v);g.lineTo(px+TILE*.7,py+TILE*v-1);g.stroke();}}
  }
  if(map.area)for(let y=1;y<map.height-1;y++)for(let x=1;x<map.width-1;x++){
    const i=y*map.width+x,t=map.tiles[i];if(!MapGen.WALKABLE.has(t))continue;
    for(const [dx,dy] of Expedition.DIRS){const j=(y+dy)*map.width+x+dx;if(map.tiles[j]!==T.ROCK&&map.elevation[j]>=map.elevation[i])continue;g.strokeStyle=pal.ink;g.globalAlpha=map.tiles[j]===T.ROCK ? .65 : .2;g.lineWidth=2;const px=(x+(dx===1?1:0))*TILE,py=(y+(dy===1?1:0))*TILE;g.beginPath();g.moveTo(px,py);g.lineTo(px+(dx?0:TILE),py+(dy?0:TILE));g.stroke();}
  }g.globalAlpha=1;
  // Canopies and outcrops overlap a continuous blocked-terrain mask. Their
  // footprints and offsets vary; individual collision cells are never outlined.
  for(let y=1;y<map.height-1;y+=2)for(let x=1;x<map.width-1;x+=2){
    const t=map.tiles[y*map.width+x];if(map.area)continue;if(t!==T.TREE&&t!==T.ROCK)continue;
    const px=(x+.5+(hash(x+17,y)-.5)*1.5)*TILE,py=(y+.5+(hash(x,y+31)-.5)*1.5)*TILE;
    const radius=TILE*(1.1+hash(x+5,y+5)*.7);
    g.fillStyle='#091b1580';g.beginPath();g.ellipse(px+5,py+7,radius,radius*.75,0,0,7);g.fill();
    for(let l=0;l<4;l++){
      const ox=(hash(x+l+71,y)-.5)*radius,oy=(hash(x,y+l+47)-.5)*radius;
      g.fillStyle=t===T.TREE?['#345133','#48663a','#547242','#3e5b35'][l]:['#5a6150','#727460','#82826b','#676d57'][l];
      g.beginPath();g.ellipse(px+ox,py+oy,radius*(.5+hash(x+l,y+3)*.3),radius*.5,hash(x+l,y)*3,0,7);g.fill();
    }
  }
  for(const n of map.rooms){
    if(n.role!=='boss')continue;
    const x=(n.cx+.5)*TILE,y=(n.cy+.5)*TILE;g.strokeStyle=n.role==='boss'?'#d59b6b80':'#c5bb8e45';g.lineWidth=1;g.beginPath();g.arc(x,y,n.role==='boss'?TILE*3.2:TILE*1.4,0,Math.PI*2);g.stroke();g.beginPath();g.arc(x,y,n.role==='boss'?TILE*2.9:TILE*1.2,0,Math.PI*2);g.stroke();
    for(let i=-1;i<=1;i++){g.fillStyle='#c6b47677';g.fillRect((map.exit.x+(map.axis[1]?i:0))*TILE,(map.exit.y+(map.axis[0]?i:0))*TILE,map.axis[1]?2:TILE-2,map.axis[0]?2:TILE-2);}
  }
  for(const e of map.entities){const x=(e.x+.5)*TILE,y=(e.y+.5)*TILE;if(e.type==='torch'){const grad=g.createRadialGradient(x,y,0,x,y,60);grad.addColorStop(0,'#ffc96633');grad.addColorStop(1,'#ffc96600');g.fillStyle=grad;g.fillRect(x-60,y-60,120,120);g.fillStyle='#41351e';g.fillRect(x-3,y-2,6,7);g.fillStyle='#ffe2a1';g.beginPath();g.arc(x,y-3,2.5,0,7);g.fill();}else if(e.type==='urn'){g.fillStyle='#080e0a90';g.beginPath();g.ellipse(x+2,y+3,5,3,0,0,7);g.fill();g.fillStyle='#a38a59';g.beginPath();g.ellipse(x,y,3.3,4,0,0,7);g.fill();g.fillStyle='#493f2b';g.fillRect(x-2,y-3,4,2);}else if(e.type==='rubble'){g.fillStyle='#9f9a7d77';g.fillRect(x,y,3,2);g.fillRect(x+4,y+3,2,2);}}
}
function fit(){
  const w=canvas.clientWidth,h=canvas.clientHeight;let x0=map.width,y0=map.height,x1=0,y1=0;
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++)if(MapGen.WALKABLE.has(map.tiles[y*map.width+x])){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
  const bw=(x1-x0+7)*TILE,bh=(y1-y0+7)*TILE;
  camera.scale=Math.max(.08,Math.min((w-80)/bw,(h-125)/bh));
  camera.x=w/2-(x0+x1+1)*TILE*camera.scale/2;
  camera.y=75+(h-125)/2-(y0+y1+1)*TILE*camera.scale/2;
}
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
      for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){const t=map.tiles[y*map.width+x];if(MapGen.WALKABLE.has(t)){ctx.fillStyle=t===T.DOOR?'#d8b77d':'#899a7138';ctx.fillRect(x*TILE,y*TILE,TILE,TILE);for(const d of Expedition.DIRS)if(!MapGen.WALKABLE.has(map.tiles[(y+d[1])*map.width+x+d[0]])){const line=Math.max(1,.8/camera.scale);ctx.fillStyle='#b2b38d';ctx.fillRect(x*TILE+(d[0]===1?TILE-line:0),y*TILE+(d[1]===1?TILE-line:0),d[0]?line:TILE,d[1]?line:TILE);}}}
    } else {
      for(const e of map.expedition.graph.edges){const a=map.rooms[e.a],b=map.rooms[e.b];if(!visible({x:a.cx,y:a.cy})||!visible({x:b.cx,y:b.cy}))continue;ctx.strokeStyle=e.kind==='main'?'#cabb87':['loop','circuit'].includes(e.kind)?'#81baa5':'#727e66';ctx.setLineDash(e.kind==='branch'?[6,5]:[]);ctx.lineWidth=3/camera.scale;ctx.beginPath();if(map.area){for(const [i,p] of e.path.entries())ctx[i?'lineTo':'moveTo']((p.x+.5)*TILE,(p.y+.5)*TILE);}else{ctx.moveTo((a.cx+.5)*TILE,(a.cy+.5)*TILE);ctx.lineTo((b.cx+.5)*TILE,(b.cy+.5)*TILE);}ctx.stroke();}ctx.setLineDash([]);
      for(const n of map.rooms){if(!visible({x:n.cx,y:n.cy}))continue;ctx.fillStyle=n.role==='boss'?'#614335':n.role==='treasure'?'#49492d':'#2c4031';ctx.strokeStyle=palettes[recipe].ink;ctx.lineWidth=1/camera.scale;ctx.fillRect((n.cx-3)*TILE,(n.cy-2)*TILE,7*TILE,5*TILE);ctx.strokeRect((n.cx-3)*TILE,(n.cy-2)*TILE,7*TILE,5*TILE);}
    }
    if(showRoute){ctx.strokeStyle='#ded295';ctx.lineWidth=2/camera.scale;ctx.setLineDash([5/camera.scale,5/camera.scale]);ctx.beginPath();let started=false;for(const p of map.mainPath){if(!visible(p)){started=false;continue;}ctx[started?'lineTo':'moveTo']((p.x+.5)*TILE,(p.y+.5)*TILE);started=true;}ctx.stroke();ctx.setLineDash([]);}
    if(exploring&&view!=='graph'){ctx.fillStyle='#0d1714';for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++)if(!seen[y*map.width+x])ctx.fillRect(x*TILE-.5/camera.scale,y*TILE-.5/camera.scale,TILE+1.5/camera.scale,TILE+1.5/camera.scale);}
    if(exploring&&view==='atlas'){
      // A frontier marks known floor touching unexplored floor. It never
      // draws the outline of rooms the player has not discovered.
      ctx.strokeStyle='#e4c985';ctx.lineWidth=2/camera.scale;ctx.beginPath();
      for(let y=1;y<map.height-1;y++)for(let x=1;x<map.width-1;x++){
        const i=y*map.width+x;if(!seen[i]||!MapGen.WALKABLE.has(map.tiles[i]))continue;
        for(const [dx,dy] of Expedition.DIRS){const j=(y+dy)*map.width+x+dx;if(seen[j]||!MapGen.WALKABLE.has(map.tiles[j]))continue;
          const px=(x+(dx===1?1:0))*TILE,py=(y+(dy===1?1:0))*TILE;
          ctx.moveTo(px,py);ctx.lineTo(px+(dx?0:TILE),py+(dy?0:TILE));
        }
      }ctx.stroke();
    }
    if(selected!==null){const n=map.rooms[selected];ctx.strokeStyle='#eee1ac';ctx.lineWidth=2/camera.scale;ctx.beginPath();ctx.ellipse((n.cx+.5)*TILE,(n.cy+.5)*TILE,(n.rx||5)*TILE,(n.ry||5)*TILE,0,0,7);ctx.stroke();}
    ctx.restore();
    const labelBoxes=[];for(const n of [...map.rooms].sort((a,b)=>Number(['entry','boss'].includes(b.role))-Number(['entry','boss'].includes(a.role)))){const point={x:n.cx,y:n.cy};if(!visible(point))continue;const p=project(point),important=['entry','boss','treasure'].includes(n.role);if(showLabels&&(important||view==='graph')){ctx.font='9px "DM Sans",sans-serif';ctx.textAlign='center';const label=n.landmark;const box={x:p.x-ctx.measureText(label).width/2-7,y:p.y+12,w:ctx.measureText(label).width+14,h:20};if(!labelBoxes.some(b=>box.x<b.x+b.w+4&&box.x+box.w+4>b.x&&box.y<b.y+b.h+3&&box.y+box.h+3>b.y)){labelBoxes.push(box);ctx.fillStyle='#0c1612df';ctx.fillRect(box.x,box.y,box.w,box.h);ctx.fillStyle=important?'#d3ccaa':'#92a28b';ctx.fillText(label,p.x,p.y+25);}}if(important){ctx.fillStyle=n.role==='boss'?'#e19879':n.role==='treasure'?'#e6c476':'#a0dcc0';ctx.strokeStyle='#19261d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y-6);ctx.lineTo(p.x+5,p.y);ctx.lineTo(p.x,p.y+6);ctx.lineTo(p.x-5,p.y);ctx.closePath();ctx.fill();ctx.stroke();}}
    if(view==='world')for(const s of map.spawns){if(!visible(s))continue;const p=project(s);if(s.type==='boss')continue;ctx.fillStyle=s.type==='elite'?'#dab677':'#ae7866';for(let i=0;i<Math.min(s.count,5);i++){ctx.beginPath();ctx.arc(p.x+(i%3-1)*4,p.y+Math.floor(i/3)*4,1.4,0,7);ctx.fill();}}
    if(exploring){const p=project(player);ctx.shadowColor='#abedc2';ctx.shadowBlur=12;ctx.fillStyle='#ddffe7';ctx.beginPath();ctx.arc(p.x,p.y,4,0,7);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#abedc255';ctx.beginPath();ctx.arc(p.x,p.y,9+Math.sin(time/300),0,7);ctx.stroke();}
  }
  requestAnimationFrame(draw);
}
function inspect(n){selected=n.id;if(map.area){$('selected-title').textContent=n.landmark;$('reading').textContent=`${n.depth} walking tiles from arrival. ${map.expedition.reading.rule}`;$('detail').textContent=`${map.spawns.filter(s=>s.room===n.id).length} nearby encounter groups · encounter tier ${n.tier}. Topology lines follow walkable ground; landscape boundaries determine all connections.`;return;}$('selected-title').textContent=n.landmark;$('reading').textContent=`${n.role} district · ${n.depth} walking tiles from entry. ${map.expedition.layout&&map.expedition.layout!=='terrain'?map.expedition.reading.rule:'A landmark within continuous terrain. The graph shows planned links; nearby districts can merge.'}`;$('detail').textContent=`Planned connections: ${n.sockets.map(s=>map.rooms[s.to].landmark).join(' · ')}. Encounter tier ${n.tier}.`;}

canvas.addEventListener('pointerdown',e=>{canvas.focus();drag={x:e.clientX,y:e.clientY,cx:camera.x,cy:camera.y,moved:false};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>4)drag.moved=true;if(drag.moved){camera.x=drag.cx+dx;camera.y=drag.cy+dy;}});
canvas.addEventListener('pointerup',e=>{if(drag&&!drag.moved){const rect=canvas.getBoundingClientRect(),x=Math.floor((e.clientX-rect.left-camera.x)/camera.scale/TILE),y=Math.floor((e.clientY-rect.top-camera.y)/camera.scale/TILE);if(x>=0&&y>=0&&x<map.width&&y<map.height&&visible({x,y})){const n=map.rooms.find(n=>Math.abs(n.cx-x)<=5&&Math.abs(n.cy-y)<=5);if(n)inspect(n);if(exploring&&MapGen.WALKABLE.has(map.tiles[y*map.width+x]))walkQueue=Expedition.path(map,player,{x,y}).slice(1);}}drag=null;});canvas.addEventListener('pointercancel',()=>drag=null);
function zoom(factor,x=canvas.clientWidth/2,y=canvas.clientHeight/2){const next=Math.max(.08,Math.min(4,camera.scale*factor));camera.x=x-(x-camera.x)*next/camera.scale;camera.y=y-(y-camera.y)*next/camera.scale;camera.scale=next;}
canvas.addEventListener('wheel',e=>{e.preventDefault();const r=canvas.getBoundingClientRect();zoom(e.deltaY<0?1.12:1/1.12,e.clientX-r.left,e.clientY-r.top);},{passive:false});
canvas.addEventListener('keydown',e=>{const dirs={w:[0,-1],ArrowUp:[0,-1],s:[0,1],ArrowDown:[0,1],a:[-1,0],ArrowLeft:[-1,0],d:[1,0],ArrowRight:[1,0]};if(exploring&&dirs[e.key]){e.preventDefault();const d=dirs[e.key],p={x:player.x+d[0],y:player.y+d[1]};if(p.x>=0&&p.y>=0&&p.x<map.width&&p.y<map.height&&MapGen.WALKABLE.has(map.tiles[p.y*map.width+p.x])){player=p;walkQueue=[];reveal();}}});
$('focus').onclick=()=>{const focused=document.body.classList.toggle('map-focus');$('focus').textContent=focused?'Back to editor':'Expand map';$('focus').setAttribute('aria-pressed',focused);requestAnimationFrame(fit);};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('map-focus'))$('focus').click();});
$('layout').onchange=()=>generate({fresh:!$('keep-seed').checked});$('fit').onclick=fit;$('zoom-in').onclick=()=>zoom(1.3);$('zoom-out').onclick=()=>zoom(1/1.3);$('generate').onclick=()=>generate({fresh:!$('keep-seed').checked});$('seed').oninput=()=>{$('keep-seed').checked=true;};$('seed').onkeydown=e=>{if(e.key==='Enter')generate();};$('roll').onclick=()=>{$('seed').value=crypto.getRandomValues(new Uint32Array(1))[0];generate();};
for(const id of ['branches','loops'])$(id).oninput=()=>$(id+'-value').value=$(id).value;
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(e=>e.classList.toggle('active',e===b));});
$('route').onclick=()=>{showRoute=!showRoute;$('route').setAttribute('aria-pressed',showRoute);};$('labels').onclick=()=>{showLabels=!showLabels;$('labels').setAttribute('aria-pressed',showLabels);};
$('explore').onclick=()=>{exploring=!exploring;$('explore').classList.toggle('active',exploring);$('explore').textContent=exploring?'Leave exploration':'Explore';if(exploring){player={...map.entrance};seen.fill(0);walkQueue=[];selected=null;reveal();notify('WASD / arrows to explore. Click discovered floor to walk.');canvas.focus();}};
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('export-json').onclick=()=>download(new Blob([JSON.stringify(Expedition.toJSON(map),null,2)],{type:'application/json'}),`verdigris-${recipe}-${map.seed}.json`);
$('export-png').onclick=()=>ground.toBlob(b=>{if(b)download(b,`verdigris-${recipe}-${map.seed}.png`);});
$('import-json').onclick=()=>$('import-file').click();$('import-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>4000000)throw Error('Map file exceeds 4 MB');const candidate=Expedition.fromJSON(JSON.parse(await file.text()));if(!Expedition.RECIPES[candidate.expedition.recipe])throw Error('Unknown recipe');map=candidate;installMap();$('seed').value=map.seed;$('layout').value=map.area?'terrain':map.expedition.layout||'terrain';setExtent(map.expedition.columns,map.expedition.rows);for(const id of ['branches','loops']){$(id).value=map.expedition[id];$(id+'-value').value=$(id).value;}document.querySelectorAll('.recipe').forEach(e=>e.classList.toggle('active',e.dataset.recipe===recipe));history.replaceState(null,'','#'+new URLSearchParams(options()));notify('Expedition imported and validated.');}catch(error){notify('Import failed: '+error.message);}e.target.value='';};
for(const [image,file] of [[floorImage,'limestone-floor'],[grassImage,'grass-ground'],[earthImage,'wet-earth'],[basaltImage,'basalt-ground']]){image.onload=()=>{if(map)bake();};image.src='assets/'+file+'.png';}
function restoreLocation(){const query=new URLSearchParams(location.hash.slice(1));if(Expedition.RECIPES[query.get('recipe')])recipe=query.get('recipe');for(const id of ['seed','branches','loops'])if(query.has(id))$(id).value=query.get(id);if(Object.hasOwn(Expedition.LAYOUTS,query.get('layout')))$('layout').value=query.get('layout');setExtent(query.get('columns'),query.get('rows'));document.querySelectorAll('.recipe').forEach(e=>e.classList.toggle('active',e.dataset.recipe===recipe));for(const id of ['branches','loops'])$(id+'-value').value=$(id).value;
generate({fresh:!query.has('seed')});}
window.addEventListener('hashchange',restoreLocation);new ResizeObserver(()=>{if(map)fit();}).observe($('viewport'));restoreLocation();requestAnimationFrame(draw);
