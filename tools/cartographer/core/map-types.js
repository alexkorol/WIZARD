/* Map identities: original geographic and architectural generators.
   Features shape collision first; landmarks and encounters follow the final ground. */
(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./mapgen.js'));
  else root.CartographerTypes=factory(root.MapGen);
})(typeof self!=='undefined'?self:this,function(M){
  'use strict';
  const T=M.TILE;
  const TYPES={
    temple:{name:'Temple',zone:'ruins',theme:'desert',floor:T.FLOOR,void:T.VOID,area:true,glyph:'⌘',subtitle:'Courtyards · pools · arcades',description:'A sprawling sacred precinct: pillared courts, reflecting pools, shrines and interlocking galleries.',rule:'The processional avenue links the courts. Colonnades loop around reflecting pools; side shrines rejoin the galleries. The sanctuary lies beyond the upper court.'},
    mesa:{name:'Mesa',zone:'ruins',theme:'desert',floor:T.SAND,void:T.VOID,area:true,outdoor:true,glyph:'▱',subtitle:'Escarpment · ramps · plateau',description:'A weathered tableland with a central plateau, a broken cliff ring, dry washes and outer hunting grounds.',rule:'Follow the escarpment to a pale ramp. The guardian holds the inner plateau; the outer terraces are optional hunting grounds. A cliff edge is a boundary, not a route.'},
    cold_river:{name:'Cold River',zone:'caves',theme:'ice',floor:T.RUBBLE,void:T.VOID,area:true,outdoor:true,glyph:'≋',subtitle:'Banks · bridges · tributaries',description:'A winding glacial river divides broad snowy banks, with crossing bridges, tributary cuts and rocky islands.',rule:'Keep track of your bank. The river is impassable except at bridges; upstream crossings lead toward the guardian. Islands split the channel and tributaries interrupt the shoreline.'},
    canyon:{name:'Canyon',zone:'ruins',theme:'desert',floor:T.SAND,void:T.ROCK,area:true,outdoor:true,glyph:'⋔',subtitle:'Ravines · forks · basins',description:'An eroded gorge opens into fighting basins, divides around rock fins and sends side ravines into the cliffs.',rule:'The main gorge narrows and opens as it climbs upstream. Rock fins divide the route, then reconnect. Side ravines widen into sheltered reward pockets.'},
    cages:{name:'Cages',zone:'dungeon',theme:'prison',floor:T.FLOOR,void:T.VOID,area:true,glyph:'▦',subtitle:'Cell blocks · yards · galleries',description:'Dense, uneven prison wings around a central yard: rows of barred cells, guard galleries and connecting passages.',rule:'Guard galleries run through each cell block. Cells are short detours; the central yard links the wings. The warden occupies the far wing beyond the eastern gallery.'},
    summit:{name:'Summit',zone:'wilds',theme:'tundra',floor:T.RUBBLE,void:T.VOID,area:true,outdoor:true,glyph:'△',subtitle:'Ridges · saddles · snowfields',description:'A mountain ascent across successive snowfields, staggered ridge passes, exposed shelves and a final high plateau.',rule:'Each dark ridge is crossed at a broad saddle. Passes alternate across the slope, so the summit cannot be reached by walking straight north. Explore the shelves before climbing higher.'}
  };
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function build({type,seed,columns=6,rows=4}){
    const spec=TYPES[type],w=clamp(64+columns*24,144,256),h=clamp(60+rows*24,120,240),tiles=new Uint8Array(w*h).fill(spec.void),elevation=new Uint8Array(w*h),protectedGround=new Uint8Array(w*h),features=[],anchors=[];
    let state=(seed^0x92d68ca2)>>>0;const rand=n=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return Math.floor(state/4294967296*n);};
    const phase=rand(628)/100,phase2=rand(628)/100;
    function hash(x,y,salt=0){let v=(Math.imul(x,374761393)^Math.imul(y,668265263)^seed^salt)>>>0;v=Math.imul(v^(v>>>13),1274126177);return (v>>>0)/4294967295;}
    function noise(x,y,scale,salt=0){const gx=Math.floor(x/scale),gy=Math.floor(y/scale);let u=x/scale-gx,v=y/scale-gy;u=u*u*(3-2*u);v=v*v*(3-2*v);return (hash(gx,gy,salt)*(1-u)+hash(gx+1,gy,salt)*u)*(1-v)+(hash(gx,gy+1,salt)*(1-u)+hash(gx+1,gy+1,salt)*u)*v;}
    const point=(x,y)=>({x:Math.round(x),y:Math.round(y)});
    const put=(x,y,t=spec.floor,z=1)=>{x=Math.round(x);y=Math.round(y);if(x>1&&y>1&&x<w-2&&y<h-2){tiles[y*w+x]=t;elevation[y*w+x]=z;}};
    function rect(x,y,rw,rh,t=spec.floor,z=1){for(let yy=Math.round(y);yy<Math.round(y+rh);yy++)for(let xx=Math.round(x);xx<Math.round(x+rw);xx++)put(xx,yy,t,z);}
    function ellipse(cx,cy,rx,ry,t=spec.floor,z=1,rough=0){for(let y=Math.floor(cy-ry-rough);y<=cy+ry+rough;y++)for(let x=Math.floor(cx-rx-rough);x<=cx+rx+rough;x++){
      if((x-cx)**2/(rx*rx)+(y-cy)**2/(ry*ry)<1+(noise(x,y,7,39)-.5)*rough*.1)put(x,y,t,z);
    }}
    function stroke(points,r,t=spec.floor,z=1,protect=false){for(let k=1;k<points.length;k++){
      const a=points[k-1],b=points[k],steps=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)*2);
      for(let j=0;j<=steps;j++){const x=Math.round(a.x+(b.x-a.x)*j/Math.max(1,steps)),y=Math.round(a.y+(b.y-a.y)*j/Math.max(1,steps));for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)if(dx*dx+dy*dy<=r*r){put(x+dx,y+dy,t,z);if(protect&&x+dx>1&&y+dy>1&&x+dx<w-2&&y+dy<h-2)protectedGround[(y+dy)*w+x+dx]=1;}}
    }}
    function feature(kind,label,x,y,extra={}){const f={kind,label,...point(x,y),...extra};features.push(f);return f;}
    function anchor(label,x,y,role='combat'){anchors.push({label,...point(x,y),role});}
    let entrance,boss;
    if(type==='mesa'){
      const cx=w*(.49+rand(7)/100),cy=h*(.46+rand(7)/100),rx=w*.43,ry=h*.42;
      for(let y=3;y<h-3;y++)for(let x=3;x<w-3;x++){
        const a=Math.atan2((y-cy)/ry,(x-cx)/rx),radius=Math.hypot((x-cx)/rx,(y-cy)/ry),edge=1+.06*Math.sin(a*7+phase)+.035*Math.sin(a*13+phase2);
        const cliff=.51+.035*Math.sin(a*5+phase2);
        if(radius<edge){const ring=radius>cliff&&radius<cliff+.075,terrace=.77+.035*Math.sin(a*6+phase2),ledge=radius>terrace&&radius<terrace+.035&&Math.sin(a*3+phase)>.15;put(x,y,ring||ledge?T.ROCK:radius<cliff?T.RUBBLE:T.SAND,ring?2:radius<cliff?3:radius<terrace?2:1);}
      }
      feature('plateau','High tableland',cx,cy,{rx:Math.round(rx*.50),ry:Math.round(ry*.50)});
      for(const a of [Math.PI*.5+Math.sin(phase)*.3,Math.PI*1.6+Math.sin(phase2)*.3]){
        const p=point(cx+Math.cos(a)*rx*.43,cy+Math.sin(a)*ry*.43),q=point(cx+Math.cos(a)*rx*.66,cy+Math.sin(a)*ry*.66);
        stroke([p,q],3,T.PATH,2,true);feature('ramp','Escarpment ramp',(p.x+q.x)/2,(p.y+q.y)/2);
      }
      for(let k=0;k<10;k++){const a=k*Math.PI/5+phase*.1,p=point(cx+Math.cos(a)*rx*.84,cy+Math.sin(a)*ry*.84);if(k%2===0)feature('terrace','Broken outer terrace',p.x,p.y);anchor(k%3?'Outer terrace':'Dry wash',p.x,p.y,k%3?'combat':'treasure');}
      entrance=point(cx,h*.88);boss=point(cx,cy);anchor('Plateau approach',cx,cy+ry*.3);
      // Small dry gullies bite the outside boundary, preserving the plateau.
      for(let k=0;k<7;k++){const a=rand(628)/100,p=point(cx+Math.cos(a)*rx*.92,cy+Math.sin(a)*ry*.92);ellipse(p.x,p.y,2+rand(4),3+rand(5),T.ROCK,1,2);feature('gully','Eroded gully',p.x,p.y);}
    }else if(type==='cold_river'){
      const river=y=>w*.5+Math.sin(y/h*8+phase)*w*.07+Math.sin(y/h*19+phase2)*w*.025;
      for(let y=5;y<h-5;y++)for(let x=5;x<w-5;x++){
        const bank=Math.hypot((x-w*.5)/(w*.44),(y-h*.5)/(h*.54)),edge=1+.045*Math.sin(y*.13+phase)+(noise(x,y,11,19)-.5)*.12;
        if(bank<edge){const wet=Math.abs(x-river(y))<5+2*Math.sin(y*.12+phase2);put(x,y,wet?T.WATER:spec.floor,wet?0:1);}
      }

      for(let k=0;k<5;k++){const y=20+k*(h-40)/5,x=river(y);ellipse(x,y,2,4,T.ROCK,1);}
      for(let k=0;k<3;k++){const y=30+k*(h-60)/3,side=k%2?1:-1,x=river(y);stroke([point(x,y),point(x+side*w*.13,y-9),point(x+side*w*.22,y-5)],2,T.WATER,0);feature('tributary','Meltwater tributary',x+side*w*.13,y-9);}
      for(const f of [.22,.5,.77]){const y=Math.round(h*f+rand(7)-3),x=river(y);rect(x-12,y-2,25,5,T.BRIDGE,1);feature('bridge','River crossing',x,y,{axis:'east-west',span:25});anchor('Bridge approach',x-16,y);anchor('Far bank',x+16,y);}
      entrance=point(w*.23,h*.87);boss=point(w*.76,h*.13);
      for(let k=0;k<8;k++){const y=h*(.13+.1*k),side=k%2?1:-1;anchor(k%3?'Snow bank':'Abandoned camp',river(y)+side*w*.29,y,k%3?'combat':'treasure');}
      feature('river','Glacial channel',w*.5,h*.5);
    }else if(type==='canyon'){
      const center=y=>w*(.3+.4*(1-y/h))+Math.sin(y/h*8+phase)*w*.09+Math.sin(y/h*17+phase2)*w*.025;
      for(let y=7;y<h-7;y++)for(let x=3;x<w-3;x++){
        const breadth=(w*(.075+.04*(1+Math.sin(y/h*17+phase)))+(noise(x,y,7,93)-.5)*6)*Math.sqrt(Math.min(1,Math.max(0,Math.min(y-7,h-8-y))/12));
        if(Math.abs(x-center(y))<breadth)put(x,y,T.SAND,1);
      }
      for(let k=0;k<7;k++){
        const y=20+k*(h-40)/6,x=center(y),side=k%2?1:-1,end=point(clamp(x+side*w*(.15+rand(6)/100),12,w-13),y+rand(17)-8);
        stroke([point(x,y),point((x+end.x)/2,y-5),end],4+rand(3),T.SAND,1);
        ellipse(end.x,end.y,7+rand(5),6+rand(4),T.SAND,1,2);anchor('Sheltered ravine',end.x,end.y,k%2?'treasure':'combat');feature('ravine','Side ravine',end.x,end.y);
        if(k>0&&k<6){ellipse(x,y,3+rand(3),6+rand(5),T.ROCK,3,1);feature('rock-fin','Dividing rock fin',x,y);}
      }
      entrance=point(center(h-13),h-13);boss=point(center(14),14);
      for(let k=0;k<8;k++){const y=h*(.12+k*.105);anchor('Gorge basin',center(y)+w*.065,y);}
    }else if(type==='summit'){
      const center=y=>w*.5+Math.sin(y/h*6+phase)*w*.04;
      for(let y=6;y<h-6;y++)for(let x=4;x<w-4;x++){
        const breadth=w*(.27+.16*y/h)+(noise(x,y,10,41)-.5)*9;
        if(Math.abs(x-center(y))<breadth)put(x,y,spec.floor,Math.min(4,1+Math.floor((1-y/h)*4)));
      }
      for(let k=0;k<3;k++){
        const y=Math.round(h*(.28+.22*k)),pass=Math.round(w*(k%2?.72:.29)+rand(9)-4),z=3-k;
        const ridge=x=>Math.round(y+3*Math.sin(x/w*13+phase+k)+2*Math.sin(x/w*25+phase2));
        for(let x=3;x<w-3;x++)for(let yy=ridge(x)-2;yy<=ridge(x)+2;yy++)if(M.WALKABLE.has(tiles[yy*w+x]))put(x,yy,T.ROCK,z);
        const sy=ridge(pass);rect(pass-4,sy-6,9,13,T.PATH,z);feature('ridge','Mountain ridge',w*.5,ridge(w*.5));feature('saddle','Ridge saddle',pass,sy,{width:9});anchor('Ridge passage',pass,sy);
      }
      entrance=point(w*.5,h*.91);boss=point(center(h*.1),h*.1);
      for(let k=0;k<4;k++){const y=h*(.17+.22*k);anchor('Snow shelf',w*.31,y,k%2?'treasure':'combat');anchor('Exposed snowfield',w*.7,y);}
      feature('summit','Summit plateau',boss.x,boss.y,{rx:13,ry:10});
    }else if(type==='temple'){
      const colW=(w-30)/3,rowH=(h-26)/3,courts=[];
      // Seeded precinct footprints retain connected arcades while varying
      // pool proportions, colonnades, shrines and the outer building line.
      for(let r=0;r<3;r++)for(let c=0;c<3;c++){
        const x=Math.round(9+c*colW)+rand(4),y=Math.round(8+r*rowH)+rand(4),cw=Math.floor(colW-5-rand(7)),ch=Math.floor(rowH-4-rand(5));
        const px=x+Math.floor(cw/2),py=y+Math.floor(ch/2),court={x,y,cw,ch,px,py,r,c};courts.push(court);
        rect(x,y,cw,ch,T.FLOOR,1);feature('precinct','Temple precinct',px,py,{w:cw,h:ch});
        const pool=c!==1||r===1;
        if(pool){
          const pw=Math.max(7,cw-17-rand(6)),ph=Math.max(6,ch-16-rand(4));
          rect(px-pw/2,py-ph/2,pw,ph,T.WATER,0);
          // Stepped corners and a plinth give the basin an authored silhouette.
          for(const dx of [-1,1])for(const dy of [-1,1])rect(px+dx*pw/2-(dx>0?3:0),py+dy*ph/2-(dy>0?3:0),3,3,T.FLOOR,1);
          feature('pool','Reflecting pool',px,py,{w:pw,h:ph});
          for(let xx=x+5;xx<x+cw-3;xx+=8)for(const yy of [y+4,y+ch-5]){rect(xx,yy,2,2,T.WALL,1);feature('column','Arcade column',xx,yy);}
        }else{
          for(let xx=x+7;xx<x+cw-5;xx+=9)for(const yy of [y+8,y+ch-9]){rect(xx,yy,2,2,T.WALL,1);feature('column','Temple column',xx,yy);}
        }
        anchor('Cloister court',x+4,py);anchor('Arcade',x+cw-4,py);
        if(rand(3)!==0){rect(x+1,y+1,7,7,T.WALL,1);rect(x+2,y+2,5,5,T.FLOOR,1);put(x+4,y+7,T.DOOR);anchor('Side shrine',x+4,y+4,'treasure');feature('shrine','Votive shrine',x+4,y+4);}
      }
      for(const a of courts){
        if(a.c<2){const b=courts[a.r*3+a.c+1];stroke([point(a.x+a.cw-3,a.py),point((a.x+a.cw+b.x)/2,a.py),point((a.x+a.cw+b.x)/2,b.py),point(b.x+3,b.py)],2+rand(2),T.FLOOR,1,true);}
        if(a.r<2){const b=courts[(a.r+1)*3+a.c];stroke([point(a.px,a.y+a.ch-3),point(a.px,(a.y+a.ch+b.y)/2),point(b.px,(a.y+a.ch+b.y)/2),point(b.px,b.y+3)],2+rand(2),T.FLOOR,1,true);}
      }
      const south=courts[7],north=courts[1];entrance=point(south.px,south.py);boss=point(north.px,north.py);
      rect(north.px-5,north.py-5,11,11,T.FLOOR,2);feature('altar','Inner sanctuary',north.px,north.py,{w:11,h:11});
    }else if(type==='cages'){
      const blockW=Math.floor((w-38)/2),blockH=Math.floor((h-34)/2);
      const blocks=[];
      for(let r=0;r<2;r++)for(let c=0;c<2;c++){
        const x=12+c*(blockW+14),y=10+r*(blockH+12),hall=y+Math.floor(blockH/2);
        rect(x,y,blockW,blockH,T.FLOOR,1);rect(x-1,y-1,blockW+2,1,T.WALL);rect(x-1,y+blockH,blockW+2,1,T.WALL);rect(x-1,y,1,blockH,T.WALL);rect(x+blockW,y,1,blockH,T.WALL);
        for(let xx=x;xx<x+blockW;){
          const cellW=Math.min(7+rand(6),x+blockW-xx),door=xx+Math.floor(cellW/2);
          if(cellW<4)break;
          rect(xx,y,1,blockH,T.WALL);
          for(const yy of [hall-4,hall+4]){rect(xx,yy,cellW,1,T.WALL);put(door,yy,T.DOOR);}
          feature('cell','Barred cell',door,y+4,{w:cellW-1,h:hall-y-4});feature('cell','Barred cell',door,hall+9,{w:cellW-1,h:blockH-(hall-y)-5});
          if(rand(3)===0)anchor('Contraband cell',door,y+5,'treasure');xx+=cellW;
        }
        rect(x,hall-3,blockW,7,T.FLOOR,1);
        anchor('Guard gallery',x+blockW*.3,hall);anchor('Guard gallery',x+blockW*.7,hall);
        blocks.push({x,y,hall,cx:x+Math.floor(blockW/2)});
      }
      for(let r=0;r<2;r++)stroke([point(blocks[r*2].cx,blocks[r*2].hall),point(blocks[r*2+1].cx,blocks[r*2+1].hall)],3,T.FLOOR,1,true);
      for(let c=0;c<2;c++)stroke([point(blocks[c].cx,blocks[c].hall),point(blocks[c+2].cx,blocks[c+2].hall)],2,T.FLOOR,1,true);
      rect(w*.42,h*.41,w*.16,h*.18,T.FLOOR,1);feature('yard','Exercise yard',w*.5,h*.5,{w:Math.round(w*.16),h:Math.round(h*.18)});
      stroke([point(w*.5,blocks[0].hall),point(w*.5,blocks[2].hall)],3,T.FLOOR,1,true);
      entrance=point(blocks[2].x+4,blocks[2].hall);boss=point(blocks[1].x+blockW-5,blocks[1].hall);anchor('Central yard',w*.5,h*.5);
    }
    // Ground detail may add obstacles but never override major rivers, cliffs,
    // architectural walls, bridges or protected lanes.
    if(spec.outdoor)for(let k=0;k<Math.floor(w*h/180);k++){
      const x=8+rand(w-16),y=8+rand(h-16),i=y*w+x;
      if(!M.WALKABLE.has(tiles[i])||tiles[i]===T.BRIDGE||tiles[i]===T.PATH||protectedGround[i]||Math.hypot(x-entrance.x,y-entrance.y)<10||Math.hypot(x-boss.x,y-boss.y)<12)continue;
      const r=1+rand(2);let safe=true;
      for(let dy=-r-1;dy<=r+1;dy++)for(let dx=-r-1;dx<=r+1;dx++){const j=(y+dy)*w+x+dx;if(!M.WALKABLE.has(tiles[j])||tiles[j]===T.PATH||tiles[j]===T.BRIDGE||protectedGround[j])safe=false;}
      if(safe)ellipse(x,y,r,r+rand(2),T.ROCK,elevation[i]);
    }
    // Only seed-dependent decoration is pruned; essential destinations must be
    // reachable without arbitrary rescue tunnels through defining features.
    const nearby=(p,r=20)=>{let best=null,score=Infinity;for(let y=Math.max(2,p.y-r);y<=Math.min(h-3,p.y+r);y++)for(let x=Math.max(2,p.x-r);x<=Math.min(w-3,p.x+r);x++)if(M.WALKABLE.has(tiles[y*w+x])){const d=(x-p.x)**2+(y-p.y)**2;if(d<score){best={x,y};score=d;}}return best;};
    entrance=nearby(entrance);boss=nearby(boss);
    const seen=new Uint8Array(w*h),queue=[entrance.y*w+entrance.x];seen[queue[0]]=1;
    for(let k=0;k<queue.length;k++){const i=queue[k],x=i%w,y=Math.floor(i/w);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,j=ny*w+nx;if(nx>0&&ny>0&&nx<w&&ny<h&&!seen[j]&&M.WALKABLE.has(tiles[j])){seen[j]=1;queue.push(j);}}}
    if(!seen[boss.y*w+boss.x])throw Error('Map identity disconnected the guardian: '+type+' seed '+seed);
    for(let i=0;i<tiles.length;i++)if(M.WALKABLE.has(tiles[i])&&!seen[i])tiles[i]=spec.void;
    if(!spec.outdoor){const copy=tiles.slice();for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++)if(copy[y*w+x]===T.VOID&&[-w,1,w,-1].some(d=>M.WALKABLE.has(copy[y*w+x+d])))tiles[y*w+x]=T.WALL;}
    const marks=[];for(const a of anchors){const p=nearby(a,8);if(p&&seen[p.y*w+p.x]&&Math.hypot(p.x-entrance.x,p.y-entrance.y)>12&&Math.hypot(p.x-boss.x,p.y-boss.y)>10&&!marks.some(n=>Math.hypot(n.x-p.x,n.y-p.y)<9))marks.push({...a,...p});}
    const exit=nearby({x:boss.x+3,y:boss.y},6);
    return {type,seed,width:w,height:h,tiles,elevation,features,anchors:marks,entrance,boss,exit,spec};
  }
  return {TYPES,build};
});
