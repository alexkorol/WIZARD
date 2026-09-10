'use strict';
const assert=require('node:assert/strict');
const E=require('./expedition.js'),M=require('./mapgen.js');
let count=0;
function closePort(map,port){
  const copy={...map,tiles:map.tiles.slice()},[dx,dy]=E.DIRS[port.direction];
  // Seal precisely the declared three-wide doorway.
  for(let k=-1;k<=1;k++)copy.tiles[(port.y+(dx?k:0))*map.width+port.x+(dy?k:0)]=M.TILE.WALL;
  return copy;
}
for(const layout of ['cathedral','crypt','circuit'])for(const recipe of Object.keys(E.RECIPES))for(const shape of [{columns:4,rows:3,branches:0,loops:0},{columns:6,rows:4,branches:6,loops:3},{columns:10,rows:7,branches:18,loops:8}])for(let seed=0;seed<30;seed++){
  const m=E.generate({layout,recipe,seed,...shape}),label=JSON.stringify({layout,recipe,seed,...shape});
  assert.deepEqual(E.validate(m),{valid:true,errors:[]},label);
  assert.deepEqual(E.toJSON(m),E.toJSON(E.generate({layout,recipe,seed,...shape})),label+' deterministic');
  assert.deepEqual(E.toJSON(E.fromJSON(E.toJSON(m))),E.toJSON(m),label+' round trip');
  assert(m.metrics.loops<=shape.loops+(layout==='circuit'?1:0),label+' extra loop budget');
  for(const n of m.rooms)for(const p of n.sockets){const [dx,dy]=E.DIRS[p.direction];for(let k=-1;k<=1;k++)assert(M.WALKABLE.has(m.tiles[(p.y+(dx?k:0))*m.width+p.x+(dy?k:0)]),label+' socket clearance');}
  const boss=m.rooms.find(n=>n.role==='boss');assert.equal(boss.sockets.length,1,label+' terminal guardian');
  if(layout==='crypt'){
    assert.equal(m.rooms[0].sockets.length,1,label+' entry');assert.equal(m.rooms[0].sockets[0].direction,(1+seed%4)%4,label+' entry bearing');
    assert.equal(boss.sockets[0].direction,(2+seed%4)%4,label+' relative left approach');
    assert.equal(E.path(closePort(m,boss.sockets[0]),m.entrance,m.boss).length,0,label+' physical terminal door cannot be bypassed');
  }
  if(layout==='circuit'){
    const entry=m.rooms[0];assert.equal(entry.sockets.length,2,label+' two arms');
    for(const port of entry.sockets)assert(E.path(closePort(m,port),m.entrance,m.boss).length>0,label+' alternate arm remains navigable');
    let x=39,y=39,w=shape.columns*18+24,h=shape.rows*18+24;for(let t=0;t<seed%4;t++){[x,y]=[h-1-y,x];[w,h]=[h,w];}assert(!M.WALKABLE.has(m.tiles[y*m.width+x]),label+' central void preserved');
  }
  count++;
}
const legacy=require('../fixtures/necropolis-2718.json');assert(E.validate(E.fromJSON(legacy)).valid,'v2 fixture still imports');
console.log(`${count} layout maps: physical doorway orientation, independent circuit arms, reserved void, connectivity, sockets, determinism and exports passed.`);
