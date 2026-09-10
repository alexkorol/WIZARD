'use strict';
const assert=require('node:assert/strict');
const E=require('./expedition.js');
const M=require('./mapgen.js');
let count=0;
for(const recipe of Object.keys(E.RECIPES))for(const shape of [{columns:4,rows:3,branches:0,loops:0},{columns:6,rows:4,branches:5,loops:2},{columns:10,rows:7,branches:18,loops:8}])for(let seed=0;seed<100;seed++){
  const options={recipe,seed,...shape},m=E.generate(options);
  assert.deepEqual(E.validate(m),{valid:true,errors:[]},JSON.stringify(options));
  assert.deepEqual(E.toJSON(m),E.toJSON(E.generate(options)),'full packet determinism');
  assert.deepEqual(E.toJSON(E.fromJSON(E.toJSON(m))),E.toJSON(m),'lossless runtime packet');
  assert.equal(m.spawns.filter(p=>p.type==='boss').length,1);
  assert(m.metrics.routeLength>=Math.abs(m.entrance.x-m.boss.x)+Math.abs(m.entrance.y-m.boss.y)+1&&m.metrics.routeLength<400,'continuous bounded walking route');
  assert(new Set(m.rooms.map(n=>n.cx%18)).size>1,'landmarks must not form a repeated column grid');
  assert(new Set(m.rooms.map(n=>n.w+","+n.h)).size>1,'district scales must vary');
  assert(m.metrics.loops>=0&&m.metrics.loops<=shape.loops,'loop budget is an upper bound on compatible connections');
  for(const n of m.rooms)for(const s of n.sockets){const d=E.DIRS[s.direction];for(let q=-1;q<=1;q++)assert(M.WALKABLE.has(m.tiles[(s.y+(d[0]?q:0))*m.width+s.x+(d[1]?q:0)]),'full socket width');}
  const route=E.path(m,m.entrance,m.exit);for(let i=1;i<route.length;i++)assert.equal(Math.abs(route[i].x-route[i-1].x)+Math.abs(route[i].y-route[i-1].y),1);
  count++;
}
const packet=E.toJSON(E.generate({seed:99}));
for(const mutate of [p=>p.width=999999,p=>p.tiles[0]='?',p=>p.version='99',p=>p.entrance.x=-1,p=>p.spawns[0].x=999,p=>p.tiles.fill('0'.repeat(p.width))]){const p=structuredClone(packet);mutate(p);assert.throws(()=>E.fromJSON(p));}
console.log(`${count} expedition seeds: deterministic packets, connected collision, 3-wide sockets, safe encounters, route continuity and JSON round trips passed. Malformed imports rejected.`);

// Included here so the laboratory verifier also exercises new layout grammars.
require('./layouts.test.js');
