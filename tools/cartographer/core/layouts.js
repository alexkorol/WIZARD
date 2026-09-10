/* Original layout grammars informed by automap studies; no game code or assets.
   Cardinal ports are physical openings. Rooms vary inside separated districts,
   so adjacent unlinked districts cannot silently join during terrain blending. */
(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./mapgen.js'));
  else root.CartographerLayouts=factory(root.MapGen);
})(typeof self!=='undefined'?self:this,function(MapGen){
  'use strict';
  const T=MapGen.TILE,DIRS=[[0,-1],[1,0],[0,1],[-1,0]];
  const TYPES={
    terrain:{name:'Natural terrain',rule:'Free terrain blending; the graph describes intended pacing, not exclusive passages.'},
    cathedral:{name:'Cathedral spine',rule:'Read the broad central nave and paired columns. Short doorways lead to side chapels; the guardian continues along the nave.'},
    crypt:{name:'Oriented crypt',rule:'Leave the entry facing east. Approach the guardian chamber facing north: a left turn relative to the entry. This is a terminal doorway rule, not a command to turn left at every junction.'},
    circuit:{name:'Island circuit',rule:'Two arms circle a protected central void and reunite before the guardian. Choose either arm; optional offerings justify a detour. The circuit remains open even with zero extra loops.'}
  };
  function generate({layout,seed,columns,rows,branches,loops,floor,space,outdoor}){
    let state=(seed^0x76e15d3b)>>>0;
    const rand=n=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return Math.floor(state/4294967296*n);};
    const width=columns*18+24,height=rows*18+24;
    const nodes=[],edges=[],spine=[],used=new Map();
    function node(c,r,role='combat'){
      const key=c+','+r;if(used.has(key))return used.get(key);
      const n={id:nodes.length,c,r,role,cx:21+c*18+rand(3)-1,cy:21+r*18+rand(3)-1,rx:4+rand(2),ry:4+rand(2),sockets:[],variant:rand(4),rotation:0,prefab:layout==='cathedral'?'nave-and-chapel':layout==='crypt'?'oriented-vault':'island-clearing'};
      n.x=n.cx-n.rx;n.y=n.cy-n.ry;n.w=n.rx*2+1;n.h=n.ry*2+1;
      nodes.push(n);used.set(key,n);return n;
    }
    function link(a,b,kind){
      if(edges.some(e=>e.a===a.id&&e.b===b.id||e.a===b.id&&e.b===a.id))return false;
      edges.push({a:a.id,b:b.id,kind});return true;
    }
    let current;
    function step(c,r,role='combat'){
      const n=node(c,r,role);if(current)link(current,n,'main');current=n;spine.push(n.id);return n;
    }
    const mid=Math.floor(rows/2);
    if(layout==='crypt'){
      step(0,rows-1,'entry');
      for(let c=1;c<columns-1;c++)step(c,rows-1);
      for(let r=rows-2;r>=0;r--)step(columns-2,r,r===0?'boss':'combat');
    }else if(layout==='circuit'){
      step(0,mid,'entry');
      for(let r=mid-1;r>=0;r--)step(0,r);
      for(let c=1;c<columns-1;c++)step(c,0);
      for(let r=1;r<=mid;r++)step(columns-2,r);
      const join=current;step(columns-1,mid,'boss');
      let lower=nodes[0];
      const lowerStep=(c,r)=>{const n=node(c,r);link(lower,n,'circuit');lower=n;};
      for(let r=mid+1;r<rows;r++)lowerStep(0,r);
      for(let c=1;c<columns-1;c++)lowerStep(c,rows-1);
      for(let r=rows-2;r>mid;r--)lowerStep(columns-2,r);
      link(lower,join,'circuit');
    }else{
      for(let c=0;c<columns;c++)step(c,mid,c===0?'entry':c===columns-1?'boss':'combat');
    }
    const bossNode=current;
    // Reserve the entry and destination orientation. In the circuit, reserve
    // the entire inner island: side content may never bridge its two arms.
    const reserved=(c,r)=>layout==='circuit'&&c>0&&c<columns-2&&r>0&&r<rows-1;
    for(let k=0;k<branches;k++){
      const frontier=[];
      for(const n of nodes){if(n.role==='entry'||n.role==='boss')continue;
        for(const [dx,dy] of DIRS){const c=n.c+dx,r=n.r+dy;
          if(c>=0&&r>=0&&c<columns&&r<rows&&!used.has(c+','+r)&&!reserved(c,r))frontier.push({n,c,r});
        }
      }
      if(!frontier.length)break;
      const f=frontier[rand(frontier.length)];link(f.n,node(f.c,f.r,'optional'),'branch');
    }
    let extra=0;
    const candidates=[];
    for(const a of nodes)for(const b of nodes)if(a.id<b.id&&!['entry','boss'].includes(a.role)&&!['entry','boss'].includes(b.role)&&Math.abs(a.c-b.c)+Math.abs(a.r-b.r)===1)candidates.push([a,b]);
    while(candidates.length&&extra<loops){const [a,b]=candidates.splice(rand(candidates.length),1)[0];if(link(a,b,'loop'))extra++;}
    for(const n of nodes)if(n.role==='optional'&&edges.filter(e=>e.a===n.id||e.b===n.id).length===1)n.role='treasure';
    const tiles=new Uint8Array(width*height).fill(space);
    const put=(x,y,t=floor)=>{if(x>0&&y>0&&x<width-1&&y<height-1)tiles[y*width+x]=t;};
    function rectangle(x,y,w,h,t=floor){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)put(xx,yy,t);}
    for(const n of nodes){
      if(layout==='circuit'){
        for(let y=-n.ry;y<=n.ry;y++)for(let x=-n.rx;x<=n.rx;x++)if(x*x/(n.rx*n.rx)+y*y/(n.ry*n.ry)<=1.1)put(n.cx+x,n.cy+y);
        // Guaranteed clear encounter footprint, independent of silhouette.
        rectangle(n.cx-3,n.cy-3,7,7);
      }else rectangle(n.x,n.y,n.w,n.h);
    }
    function port(n,other){
      const dx=Math.sign(other.c-n.c),dy=Math.sign(other.r-n.r),direction=dy<0?0:dx>0?1:dy>0?2:3;
      const p={direction,to:other.id,x:n.cx+dx*(n.rx+1),y:n.cy+dy*(n.ry+1),width:3};n.sockets.push(p);return p;
    }
    function line(a,b,r,t){let x=a.x,y=a.y;rectangle(x-r,y-r,r*2+1,r*2+1,t);while(x!==b.x||y!==b.y){if(x!==b.x)x+=Math.sign(b.x-x);else y+=Math.sign(b.y-y);rectangle(x-r,y-r,r*2+1,r*2+1,t);}}
    for(const e of edges){
      const a=nodes[e.a],b=nodes[e.b],pa=port(a,b),pb=port(b,a),horizontal=a.r===b.r;
      const center=horizontal?Math.round((a.cx+b.cx)/2):Math.round((a.cy+b.cy)/2);
      const p=horizontal?{x:center,y:a.cy}:{x:a.cx,y:center};
      const q=horizontal?{x:center,y:b.cy}:{x:b.cx,y:center};
      const r=layout==='cathedral'&&e.kind==='main'?2:1;
      const material=outdoor?T.PATH:floor;
      line({x:a.cx,y:a.cy},p,r,material);line(p,q,r,material);line(q,{x:b.cx,y:b.cy},r,material);
      if(!outdoor&&layout!=='circuit')for(const s of [pa,pb]){
        const [dx,dy]=DIRS[s.direction];for(let k=-1;k<=1;k++)put(s.x+(dy?k:0),s.y+(dx?k:0),T.DOOR);
      }
    }
    if(layout==='cathedral')for(const n of nodes)if(n.role!=='entry'&&n.role!=='boss'){
      // Paired columns mark the nave without closing any three-wide portal.
      for(const dx of [-3,3])for(const dy of [-3,3])put(n.cx+dx,n.cy+dy,T.WALL);
    }
    if(!outdoor){const copy=tiles.slice();for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){
      const i=y*width+x;if(copy[i]===space&&DIRS.some(([dx,dy])=>MapGen.WALKABLE.has(copy[(y+dy)*width+x+dx])))tiles[i]=T.WALL;
    }}
    const entry=nodes[0],approach=layout==='crypt'?[0,-1]:[1,0];
    const result={nodes,edges,spine,tiles,width,height,entrance:{x:entry.cx-3,y:entry.cy},boss:{x:bossNode.cx,y:bossNode.cy},exit:{x:bossNode.cx+approach[0]*3,y:bossNode.cy+approach[1]*3},axis:approach,reading:{entryFacing:layout==='circuit'?'north / south':'east',exitFacing:layout==='crypt'?'north':'east',rule:TYPES[layout].rule},intrinsicLoops:layout==='circuit'?1:0};
    // Rotate the completed logical map, including every port and gate. This
    // preserves the relative rule while teaching it in all four orientations.
    const turns=(seed>>>0)%4,names=['north','east','south','west'];
    for(let turn=0;turn<turns;turn++){
      const w=result.width,h=result.height,next=new Uint8Array(w*h);
      const rotate=p=>{const x=p.x;p.x=h-1-p.y;p.y=x;};
      for(let y=0;y<h;y++)for(let x=0;x<w;x++)next[x*h+h-1-y]=result.tiles[y*w+x];
      for(const n of nodes){const p={x:n.cx,y:n.cy};rotate(p);n.cx=p.x;n.cy=p.y;[n.rx,n.ry]=[n.ry,n.rx];n.x=n.cx-n.rx;n.y=n.cy-n.ry;n.w=n.rx*2+1;n.h=n.ry*2+1;n.rotation=(n.rotation+1)%4;n.sockets.forEach(s=>{rotate(s);s.direction=(s.direction+1)%4;});}
      [result.entrance,result.boss,result.exit].forEach(rotate);
      result.axis=[-result.axis[1],result.axis[0]];result.tiles=next;result.width=h;result.height=w;
    }
    result.reading.entryFacing=layout==='circuit'?names[turns]+' / '+names[(turns+2)%4]:names[(turns+1)%4];
    result.reading.exitFacing=names[(turns+(layout==='crypt'?0:1))%4];
    if(layout==='crypt')result.reading.rule='Leave the entry facing '+result.reading.entryFacing+'. Approach the guardian chamber facing '+result.reading.exitFacing+': a left turn relative to the entry. This describes the terminal doorway, not every junction. Side passages can turn the other way.';
    result.rotation=turns;return result;
  }
  return {TYPES,generate};
});
