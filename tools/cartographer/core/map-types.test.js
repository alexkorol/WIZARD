/* Place identity contracts, independent of presentation or texture choices. */
'use strict';
const assert=require('node:assert/strict');
const E=require('./expedition.js'),M=require('./mapgen.js'),T=M.TILE;
let tested=0;
const seeds=[0,1,42,2718,1369384499,3983578785,583049053,4294967295,...Array.from({length:12},(_,i)=>Math.imul(i+13,2654435761)>>>0)];
for(const recipe of Object.keys(E.RECIPES).filter(id=>E.RECIPES[id].area)){
  const silhouettes=new Set();
  for(const extent of [{columns:4,rows:3},{columns:6,rows:4},{columns:10,rows:7}])for(const seed of seeds){
    const options={recipe,seed,...extent},m=E.generate(options),packet=E.toJSON(m);
    assert.deepEqual(E.validate(m),{valid:true,errors:[]},JSON.stringify(options));
    assert.deepEqual(E.toJSON(E.generate(options)),packet,'same seed reproduces full identity packet');
    assert.deepEqual(E.toJSON(E.fromJSON(structuredClone(packet))),packet,'features, elevation, routes and encounters survive JSON');
    assert(m.metrics.walkable>4000,'substantial continuous playable ground');
    assert(m.metrics.packs>25,'encounters distributed beyond a handful of graph nodes');
    assert(m.rooms.every(n=>n.depth>=0),'all labeled destinations reachable');
    assert(m.elevation.length===m.tiles.length);
    assert.equal(m.spawns.filter(s=>s.type==='boss').length,1);
    for(const e of m.expedition.graph.edges){
      assert(e.path.length>0);assert.deepEqual(e.path[0],{x:m.rooms[e.a].cx,y:m.rooms[e.a].cy});
      assert.deepEqual(e.path.at(-1),{x:m.rooms[e.b].cx,y:m.rooms[e.b].cy});
      for(let i=0;i<e.path.length;i++){const p=e.path[i];assert(M.WALKABLE.has(m.tiles[p.y*m.width+p.x]));if(i)assert.equal(Math.abs(p.x-e.path[i-1].x)+Math.abs(p.y-e.path[i-1].y),1);}
    }
    const feature=kind=>m.area.features.filter(f=>f.kind===kind);
    if(['mesa','cold_river','summit'].includes(recipe)){
      const sealed={...m,tiles:m.tiles.slice()},gate=recipe==='cold_river'?T.BRIDGE:T.PATH;
      sealed.tiles=sealed.tiles.map(t=>t===gate?T.ROCK:t);
      assert.equal(E.path(sealed,m.entrance,m.boss).length,0,recipe+' navigation depends on its crossings');
      for(const f of feature(recipe==='mesa'?'ramp':recipe==='cold_river'?'bridge':'saddle'))assert.equal(m.tiles[f.y*m.width+f.x],gate,'major feature stays open after detail placement');
    }
    if(recipe==='mesa'){assert.equal(feature('plateau').length,1);assert.equal(m.elevation[m.boss.y*m.width+m.boss.x],3);}
    if(recipe==='cold_river')assert.equal(feature('bridge').length,3);
    if(recipe==='summit'){assert.equal(feature('saddle').length,3);assert(m.mainPath.length>m.height*1.5,'successive ridges impose a traversing ascent');}
    if(recipe==='temple'){assert.equal(feature('precinct').length,9);assert(feature('pool').length>=6);assert(feature('column').length>30);}
    if(recipe==='cages'){assert(feature('cell').length>35);assert(m.tiles.filter(t=>t===T.DOOR).length>25);}
    if(recipe==='canyon'){assert.equal(feature('ravine').length,7);assert.equal(feature('rock-fin').length,5);assert(m.metrics.coverage<50);}
    silhouettes.add(packet.tiles.join(''));tested++;
  }
  assert.equal(silhouettes.size,60,'seed and extent vary actual collision geometry');
}
const p=E.toJSON(E.generate({recipe:'mesa',seed:2718}));
for(const mutate of [p=>p.expedition.columns='bad',p=>p.area.type='unknown',p=>p.area.features[0].x=-1,p=>p.elevation[0]='9'.repeat(p.width),p=>p.elevation.pop(),p=>p.version='4.0.0',p=>p.expedition.recipe='wildwood']){const bad=structuredClone(p);mutate(bad);assert.throws(()=>E.fromJSON(bad));}
const untrusted=structuredClone(p);untrusted.expedition.graph.edges[0].path=[{x:-999,y:999}];
assert.deepEqual(E.fromJSON(untrusted).expedition.graph.edges[0].path,E.fromJSON(structuredClone(p)).mainPath,'import reconstructs paths from collision');
console.log(`${tested} map identities: connected geometry, meaningful crossings, varied architecture, distributed encounters, deterministic packets and import validation passed.`);
