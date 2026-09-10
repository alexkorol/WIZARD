/* Original WIZARD expedition grammar. Pure JS; no renderer or platform dependency. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./mapgen.js'),require('./landscape.js'),require('./layouts.js'),require('./map-types.js'));
  else root.Expedition = factory(root.MapGen,root.Landscape,root.CartographerLayouts,root.CartographerTypes);
})(typeof self !== 'undefined' ? self : this, function (MapGen,Landscape,Layouts,MapTypes) {
  'use strict';
  const VERSION = '5.0.0';
  const T = MapGen.TILE;
  const DIRS = [[0,-1,'north'],[1,0,'east'],[0,1,'south'],[-1,0,'west']];
  const RECIPES = {
    wildwood: { name:'Woodland', zone:'wilds', theme:'forest', room:'woodland', floor:T.GRASS, void:T.VOID, outdoor:true, landmark:'Forest clearing', description:'Continuous woodland, worn trails, uneven ridgelines and sheltered clearings.' },
    necropolis: { name:'Necropolis', zone:'dungeon', theme:'crypt', room:'ossuary', floor:T.FLOOR, void:T.VOID, landmark:'Ancestor court', description:'Limestone chambers, ancestor courts and copper-sealed burial vaults.' },
    causeway: { name:'Wetland', zone:'wilds', theme:'swamp', room:'wetland', outdoor:true, floor:T.GRASS, void:T.DEEP, landmark:'Flood marker', description:'Broad tidal wetlands, winding dry ground, branching inlets and short crossings.' },
    quarry: { name:'Quarry', zone:'caves', theme:'lava', room:'badlands', outdoor:true, floor:T.RUBBLE, void:T.LAVA, landmark:'Kiln circle', description:'Weathered open badlands, basalt ridgelines and branching volcanic gullies.' },
    sanctuary: { name:'Sanctuary', zone:'sanctum', theme:'arcane', room:'court', floor:T.FLOOR, void:T.VOID, landmark:'Celestial dial', description:'Suspended stone courts and narrow bridges around an open astral void.' }
  };
  Object.assign(RECIPES,MapTypes.TYPES);
  function random(seed) { let s=seed>>>0; return n=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return n ? Math.floor(s/4294967296*n) : s/4294967296;}; }
  function number(v, fallback, min, max) {return Number.isFinite(Number(v))?Math.max(min,Math.min(max,Math.floor(Number(v)))):fallback;}
  function seedOf(v) {return typeof v==='number'||(typeof v==='string'&&/^\d+$/.test(v))?Number(v)>>>0:MapGen.hashString(String(v===undefined?'verdigris':v));}
  function distances(map, start) {
    const w=map.width,h=map.height,distance=new Int32Array(w*h).fill(-1),parent=new Int32Array(w*h).fill(-1),queue=new Int32Array(w*h);
    const begin=start.y*w+start.x;let head=0,tail=1;queue[0]=begin;distance[begin]=0;
    while(head<tail){const a=queue[head++],x=a%w,y=Math.floor(a/w);
      for(const [dx,dy] of DIRS){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=w||ny>=h)continue;const b=ny*w+nx;
        if(distance[b]<0&&MapGen.WALKABLE.has(map.tiles[b])){distance[b]=distance[a]+1;parent[b]=a;queue[tail++]=b;}
      }
    }return {distance,parent,count:tail};
  }
  function path(map,from,to) {const {distance,parent}=distances(map,from);let i=to.y*map.width+to.x;if(distance[i]<0)return [];const out=[];while(i>=0){out.push({x:i%map.width,y:Math.floor(i/map.width)});i=parent[i];}return out.reverse();}
  function generate(options={}) {
    if(Object.hasOwn(MapTypes.TYPES,options.recipe))return generateArea(options);
    const recipe=Object.hasOwn(RECIPES,options.recipe)?options.recipe:'wildwood', biome=RECIPES[recipe];
    const seed=seedOf(options.seed), cols=number(options.columns,4,4,10),rows=number(options.rows,3,3,7),size=18;
    const topology=random(seed^0xa511e9b3), roomsRng=random(seed^0x63d83595),encounters=random(seed^0xb5297a4d),decor=random(seed^0x1b56c4e9);
    const branching=number(options.branches,3,0,18),loopBudget=number(options.loops,1,0,8);
    let width=cols*size+24,height=rows*size+24,tiles=new Uint8Array(width*height).fill(biome.void);
    let nodes=[],edges=[];const used=new Map();
    function node(c,r,role='combat') {const key=c+','+r;if(used.has(key))return used.get(key);const n={id:nodes.length,c,r,x:1+c*size,y:1+r*size,cx:8+c*size,cy:8+r*size,role,sockets:[],variant:roomsRng(4),rotation:roomsRng(4)};nodes.push(n);used.set(key,n);return n;}
    function link(a,b,kind) {if(edges.some(e=>(e.a===a.id&&e.b===b.id)||(e.a===b.id&&e.b===a.id)))return false;edges.push({a:a.id,b:b.id,kind});return true;}
    let row=1+topology(rows-2),current=node(0,row,'entry');let spine=[current.id];
    for(let col=1;col<cols;col++) {
      if(col>1&&col<cols-1&&topology(3)===0){const nr=Math.max(0,Math.min(rows-1,row+(topology(2)?1:-1)));if(nr!==row){const n=node(col-1,nr);link(current,n,'main');current=n;row=nr;spine.push(n.id);}}
      const n=node(col,row,col===cols-1?'boss':'combat');link(current,n,'main');current=n;spine.push(n.id);
    }
    let bossNode=current;
    // Add optional pockets from a bounded frontier; no disconnected repair tunnels.
    for(let k=0;k<branching;k++) {
      const frontier=[];for(const n of nodes){if(n.role==='boss')continue;for(const d of DIRS){const c=n.c+d[0],r=n.r+d[1];if(c>=0&&c<cols&&r>=0&&r<rows&&!used.has(c+','+r))frontier.push({n,c,r});}}
      if(!frontier.length)break;const f=frontier[topology(frontier.length)],n=node(f.c,f.r,'optional');link(f.n,n,'branch');
    }
    let loops=0;const candidates=[];for(const a of nodes)for(const b of nodes)if(a.id<b.id&&a.role!=='boss'&&b.role!=='boss'&&Math.abs(a.c-b.c)+Math.abs(a.r-b.r)===1)candidates.push([a,b]);
    while(candidates.length&&loops<loopBudget){const [a,b]=candidates.splice(topology(candidates.length),1)[0];if(link(a,b,'loop'))loops++;}
    for(const n of nodes)if(n.role==='optional'&&edges.filter(e=>e.a===n.id||e.b===n.id).length===1)n.role='treasure';
    const layout=Object.hasOwn(Layouts.TYPES,options.layout)?options.layout:'terrain';
    let shape;
    if(layout==='terrain')tiles.set(Landscape.realize({seed,recipe,width,height,rooms:nodes,edges,floor:biome.floor,space:biome.void,outdoor:!!biome.outdoor}));
    else {
      shape=Layouts.generate({layout,seed,columns:cols,rows,branches:branching,loops:loopBudget,floor:biome.floor,space:biome.void,outdoor:!!biome.outdoor});
      nodes=shape.nodes;edges=shape.edges;spine=shape.spine;bossNode=nodes.find(n=>n.role==='boss');width=shape.width;height=shape.height;tiles=shape.tiles;
    }
    const entry=nodes[0],entrance=shape?shape.entrance:{x:entry.cx-3,y:entry.cy},boss={x:bossNode.cx,y:bossNode.cy},exit=shape?shape.exit:{x:bossNode.cx+3,y:bossNode.cy};
    const reading=shape?shape.reading:{entryFacing:'east',exitFacing:'east',rule:Layouts.TYPES.terrain.rule+' Follow trails and terrain boundaries; the guardian lies broadly east. Nearby clearings may merge.'};
    const map={version:layout==='terrain'?'3.0.0':'4.0.0',seed,zone:biome.zone,theme:biome.theme,width,height,tiles,rooms:nodes,entrance,exit,boss,axis:shape?shape.axis:[1,0],palette:MapGen.THEMES[biome.theme].palette,outdoor:!!biome.outdoor,entities:[],spawns:[],expedition:{recipe,layout,columns:cols,rows,branches:branching,loops:loopBudget,intrinsicLoops:shape?shape.intrinsicLoops:0,graph:{nodes,edges,spine},reading}};
    map.mainPath=path(map,entrance,boss);
    const distance=distances(map,entrance).distance,maxDist=distance[boss.y*width+boss.x];
    for(const n of nodes){
      const depth=distance[n.cy*width+n.cx],onRoute=spine.includes(n.id);
      n.landmark=n.role==='entry'?(biome.outdoor?'Trailhead':'Processional gate'):n.role==='boss'?(biome.outdoor?'Guardian clearing':'Guardian sanctuary'):n.role==='treasure'?(biome.outdoor?'Hidden offering':'Sealed offering'):biome.landmark+' '+(n.id+1);
      n.depth=depth;n.tier=n.role==='entry'?0:n.role==='boss'?4:Math.min(3,1+Math.floor(depth/Math.max(1,maxDist)*3));
      map.entities.push({type:'landmark',x:n.cx,y:n.cy,room:n.id,label:n.landmark});
      if(n.role==='treasure')map.entities.push({type:'chest',x:n.cx+2,y:n.cy,room:n.id});
      if(n.role==='entry')continue;
      map.spawns.push({type:n.role==='boss'?'boss':n.role==='treasure'?'elite':'pack',x:n.cx,y:n.cy,room:n.id,tier:n.tier,count:n.role==='boss'?1:3+encounters(4),onRoute});
      if(!biome.outdoor)for(const d of [-1,1])map.entities.push({type:'torch',x:n.cx+d*4,y:n.cy-2,room:n.id});
      for(let k=0;k<4;k++){const x=n.cx-4+decor(9),y=n.cy+(decor(2)?-4:4);if(MapGen.WALKABLE.has(tiles[y*width+x]))map.entities.push({type:decor(2)?'urn':'rubble',x,y,room:n.id});}
    }
    map.metrics=metrics(map);return map;
  }
  function generateArea(options){
    const recipe=options.recipe,seed=seedOf(options.seed),columns=number(options.columns,6,4,10),rows=number(options.rows,4,3,7);
    const a=MapTypes.build({type:recipe,seed,columns,rows}),spec=RECIPES[recipe],rng=random(seed^0xb5297a4d);
    const map={version:VERSION,seed,zone:spec.zone,theme:spec.theme,width:a.width,height:a.height,tiles:a.tiles,elevation:a.elevation,rooms:[],entrance:a.entrance,boss:a.boss,exit:a.exit,axis:[0,-1],palette:MapGen.THEMES[spec.theme].palette,outdoor:!!spec.outdoor,entities:[],spawns:[],area:{type:recipe,features:a.features},expedition:{recipe,layout:'identity',columns,rows,branches:0,loops:0,intrinsicLoops:0,reading:{entryFacing:'terrain approach',exitFacing:'landmark destination',rule:spec.rule},graph:{nodes:[],edges:[],spine:[]}}};
    const all=[{...a.entrance,label:'Arrival',role:'entry'},...a.anchors,{...a.boss,label:recipe==='mesa'?'Plateau guardian':recipe==='summit'?'Summit guardian':recipe==='cages'?'Warden':recipe==='temple'?'Inner sanctuary':'Guardian',role:'boss'}];
    const d=distances(map,map.entrance),max=d.distance[map.boss.y*map.width+map.boss.x];map.mainPath=path(map,map.entrance,map.boss);
    const routeSet=new Set(map.mainPath.map(p=>p.y*map.width+p.x));
    map.rooms=all.map((p,id)=>({id,c:0,r:0,cx:p.x,cy:p.y,x:p.x-3,y:p.y-3,w:7,h:7,rx:3,ry:3,role:p.role||'combat',sockets:[],variant:0,rotation:0,prefab:'landscape-feature',landmark:p.label,depth:d.distance[p.y*map.width+p.x],tier:p.role==='entry'?0:p.role==='boss'?4:Math.min(3,1+Math.floor(d.distance[p.y*map.width+p.x]/Math.max(1,max)*3))}));
    const graph=map.expedition.graph,last=map.rooms.length-1;graph.nodes=map.rooms;graph.spine=[0,last];graph.edges.push({a:0,b:last,kind:'main',path:map.mainPath});
    for(let i=1;i<last;i++){
      const n=map.rooms[i];let nearest=0,best=Infinity;
      for(let j=0;j<i;j++){const m=map.rooms[j],dd=(m.cx-n.cx)**2+(m.cy-n.cy)**2;if(dd<best){best=dd;nearest=j;}}
      const m=map.rooms[nearest];graph.edges.push({a:nearest,b:i,kind:'branch',path:path(map,{x:m.cx,y:m.cy},{x:n.cx,y:n.cy})});
    }
    for(const n of map.rooms){map.entities.push({type:'landmark',x:n.cx,y:n.cy,room:n.id,label:n.landmark});if(n.role==='treasure')map.entities.push({type:'chest',x:n.cx,y:n.cy,room:n.id});}
    const target=Math.min(180,Math.floor(d.count/150)),spots=[];
    for(let i=0;i<map.tiles.length;i++)if(d.distance[i]>16&&MapGen.WALKABLE.has(map.tiles[i]))spots.push(i);
    for(let k=spots.length-1;k>0;k--){const j=rng(k+1);[spots[k],spots[j]]=[spots[j],spots[k]];}
    for(const i of spots){if(map.spawns.length>=target)break;const x=i%map.width,y=Math.floor(i/map.width);
      if(Math.hypot(x-map.boss.x,y-map.boss.y)<10||map.spawns.some(p=>(p.x-x)**2+(p.y-y)**2<64))continue;
      if(!DIRS.every(([dx,dy])=>MapGen.WALKABLE.has(map.tiles[(y+dy*2)*map.width+x+dx*2])))continue;
      let room=0,best=Infinity;for(const n of map.rooms){const dd=(n.cx-x)**2+(n.cy-y)**2;if(dd<best){best=dd;room=n.id;}}
      map.spawns.push({type:rng(8)?'pack':'elite',x,y,room,tier:Math.min(3,1+Math.floor(d.distance[i]/Math.max(1,max)*3)),count:3+rng(4),onRoute:routeSet.has(i)});
    }
    map.spawns.push({type:'boss',...map.boss,room:last,tier:4,count:1,onRoute:true});
    map.metrics=metrics(map);return map;
  }
  function metrics(map){const d=distances(map,map.entrance);const walkable=Array.from(map.tiles).filter(t=>MapGen.WALKABLE.has(t)).length;return {walkable,reachable:d.count,coverage:Math.round(100*walkable/map.tiles.length),routeLength:map.mainPath.length,rooms:map.rooms.length,loops:map.expedition.graph.edges.length-map.rooms.length+1,optionalRooms:map.rooms.filter(n=>map.expedition.layout&&map.expedition.layout!=='terrain'?['optional','treasure'].includes(n.role):!map.expedition.graph.spine.includes(n.id)).length,packs:map.spawns.length,monsters:map.spawns.reduce((s,p)=>s+p.count,0)};}
  function validate(map){
    const errors=[],d=distances(map,map.entrance),walk=Array.from(map.tiles).filter(t=>MapGen.WALKABLE.has(t)).length;
    if(d.count!==walk)errors.push('Disconnected walkable region');
    for(const [name,p] of [['entry',map.entrance],['exit',map.exit],['boss',map.boss]])if(!p||d.distance[p.y*map.width+p.x]<0)errors.push('Unreachable '+name);
    const occupied=new Set();for(const p of map.spawns){const i=p.y*map.width+p.x;if(d.distance[i]<0)errors.push('Unreachable spawn');if(d.distance[i]<9)errors.push('Unsafe entry');if(occupied.has(i))errors.push('Overlapping spawn');occupied.add(i);}
    for(const n of map.rooms)if(d.distance[n.cy*map.width+n.cx]<0)errors.push('Unreachable landmark');
    for(const n of map.rooms)for(const s of n.sockets){const other=map.rooms[s.to];if(!other||!other.sockets.some(t=>t.to===n.id&&t.direction===(s.direction+2)%4))errors.push('Socket mismatch');if(!MapGen.WALKABLE.has(map.tiles[s.y*map.width+s.x]))errors.push('Blocked socket');}
    if(!path(map,map.entrance,map.exit).length)errors.push('No extraction route');
    return {valid:!errors.length,errors};
  }
  function toJSON(map){return {...MapGen.toJSON(map),format:'wizard-expedition',version:map.version,rooms:map.rooms,expedition:map.expedition,metrics:map.metrics,outdoor:map.outdoor,...(map.area?{area:map.area,elevation:Array.from({length:map.height},(_,y)=>Array.from(map.elevation.slice(y*map.width,(y+1)*map.width),v=>v.toString(16)).join(''))}:{})};}
  function fromJSON(data){
    if(!data||data.format!=='wizard-expedition'||![VERSION,'4.0.0','3.0.0','2.0.0'].includes(data.version))throw new Error('Unsupported expedition format or version');
    if(!Number.isInteger(data.width)||!Number.isInteger(data.height)||data.width<1||data.height<1||data.width>256||data.height>256)throw new Error('Invalid map dimensions');
    if(!Array.isArray(data.tiles)||data.tiles.length!==data.height||data.tiles.some(r=>typeof r!=='string'||r.length!==data.width||!/^[0-9a-e]+$/.test(r)))throw new Error('Invalid tile rows');
    const point=p=>p&&Number.isInteger(p.x)&&Number.isInteger(p.y)&&p.x>=0&&p.y>=0&&p.x<data.width&&p.y<data.height;
    if(![data.entrance,data.exit,data.boss].every(point)||!Array.isArray(data.spawns)||data.spawns.length>256||!data.spawns.every(point)||!Array.isArray(data.rooms)||data.rooms.length>100||!data.rooms.every(n=>Array.isArray(n.sockets)&&n.sockets.length<=4)||!data.expedition?.graph)throw new Error('Invalid expedition metadata');
    const id=n=>Number.isInteger(n)&&n>=0&&n<data.rooms.length;
    if(!Object.hasOwn(RECIPES,data.expedition.recipe)||!Array.isArray(data.entities)||data.entities.length>2000||!data.entities.every(point)||!data.rooms.every((n,i)=>n.id===i&&point({x:n.cx,y:n.cy})&&typeof n.landmark==='string'&&n.landmark.length<100&&typeof n.prefab==='string'&&n.prefab.length<100&&['entry','boss','combat','optional','treasure'].includes(n.role)&&n.sockets.every(s=>id(s.to)&&Number.isInteger(s.direction)&&s.direction>=0&&s.direction<4&&point(s)))||!data.spawns.every(s=>id(s.room)&&Number.isInteger(s.count)&&s.count>=1&&s.count<=6)||!Array.isArray(data.expedition.graph.edges)||data.expedition.graph.edges.length>300||!data.expedition.graph.edges.every(e=>id(e.a)&&id(e.b))||!Array.isArray(data.expedition.graph.spine)||!data.expedition.graph.spine.every(id)||typeof data.expedition.reading?.rule!=='string')throw new Error('Invalid rooms, graph, entities or encounters');
    if(data.expedition.layout!==undefined&&data.expedition.layout!=='identity'&&!Object.hasOwn(Layouts.TYPES,data.expedition.layout))throw new Error('Unknown layout');
    if(data.version===VERSION&&(!Number.isInteger(data.expedition.columns)||data.expedition.columns<4||data.expedition.columns>10||!Number.isInteger(data.expedition.rows)||data.expedition.rows<3||data.expedition.rows>7))throw new Error('Invalid map extent');
    if(data.version===VERSION&&(!data.area||!Object.hasOwn(MapTypes.TYPES,data.area.type)||data.area.type!==data.expedition.recipe||data.expedition.layout!=='identity'||!Array.isArray(data.area.features)||data.area.features.length>500||!data.area.features.every(f=>point(f)&&typeof f.kind==='string'&&f.kind.length<40&&typeof f.label==='string'&&f.label.length<100)||!Array.isArray(data.elevation)||data.elevation.length!==data.height||!data.elevation.every(row=>typeof row==='string'&&row.length===data.width&&/^[0-4]+$/.test(row))))throw new Error('Invalid landscape features or elevation');
    if(data.version!==VERSION&&(data.area!==undefined||data.elevation!==undefined||data.expedition.layout==='identity'||RECIPES[data.expedition.recipe].area))throw new Error('Map type requires version 5');
    const map=MapGen.fromJSON(data);if(data.version===VERSION){map.elevation=Uint8Array.from(data.elevation.join(''),c=>parseInt(c,16));for(const e of map.expedition.graph.edges){const a=map.rooms[e.a],b=map.rooms[e.b];e.path=path(map,{x:a.cx,y:a.cy},{x:b.cx,y:b.cy});}}map.expedition.graph.nodes=map.rooms;map.mainPath=path(map,map.entrance,map.boss);map.metrics=metrics(map);const result=validate(map);if(!result.valid)throw new Error(result.errors.join('; '));return map;
  }
  return {VERSION,RECIPES,LAYOUTS:Layouts.TYPES,DIRS,generate,validate,metrics,path,distances,toJSON,fromJSON,seedOf};
});
