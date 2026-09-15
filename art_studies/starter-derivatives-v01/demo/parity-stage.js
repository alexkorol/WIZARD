// A single logical raster for scenery and actors. No per-prop display scales.
// Perspective is retained; the metric reference plane is world Y = 0.
export class ParityStage {
  constructor() {
    this.canvas=document.createElement('canvas');this.canvas.width=576;this.canvas.height=384;
    this.ctx=this.canvas.getContext('2d');this.images=new Map();
  }
  async load(load) {
    const root='../blender/parity/';
    const response=await fetch(root+'camera.json',{cache:'no-store'});if(!response.ok)throw Error('Missing Blender camera calibration');
    this.camera=await response.json();
    await Promise.all(this.camera.layers.map(async layer=>{if(!layer.sha256)throw Error('Unversioned scenery');this.images.set(layer.name,await load(root+layer.file+'?v='+layer.sha256));}));
    this.depths={dwelling_west:3.3,dwelling_east:5.5,fence:4.25,well:1.6,tree_west:.6,tree_east:1.6};
  }
  project(x,y) {
    const c=this.camera,angle=c.camera.rotation[0],sn=Math.cos(angle),cs=Math.sin(angle);
    const [cx,cy,cz]=c.camera.location;
    const depth=(y-cy)*cs+cz*sn;
    const up=(y-cy)*sn-cz*cs;
    return [288+c.pixel_focal_length*(x-cx)/depth,384*(.5+c.camera.shift_y)-c.pixel_focal_length*up/depth,(-cy*cs+cz*sn)/depth];
  }
  draw(ctx,state,actors) {
    const g=this.ctx;g.imageSmoothingEnabled=false;g.fillStyle='#252920';g.fillRect(0,0,576,384);
    g.drawImage(this.images.get('ground'),0,0);
    const items=this.camera.layers.filter(l=>l.name!=='ground').map(l=>({depth:this.depths[l.name],draw:()=>g.drawImage(this.images.get(l.name),0,0)}));
    for(const actor of actors) {
      const wx=actor.x/this.camera.player_plane_px_per_m;
      const wy=-actor.y/(this.camera.player_plane_px_per_m*Math.cos(this.camera.camera.rotation[0]));
      const [x,y,scale]=this.project(wx,wy);
      items.push({depth:wy,draw:()=>{
        const f=actor.frame;if(!f||!actor.image)return;
        g.fillStyle='#13170f55';g.beginPath();g.ellipse(x,y,9*scale,3*scale,0,0,Math.PI*2);g.fill();
        // Perspective scaling happens once into the common logical framebuffer.
        // At the player plane scale is exactly 1, independent of asset type.
        g.drawImage(actor.image,Math.round(x-f.anchor[0]*scale),Math.round(y-f.anchor[1]*scale),Math.round(f.width*scale),Math.round(f.height*scale));
        if(actor.primary&&state.showAnchors){g.strokeStyle='#a3cdb6';g.lineWidth=1;g.beginPath();g.moveTo(Math.round(x)+.5,y-100);g.lineTo(Math.round(x)+.5,y+5);g.stroke();}
      }});
    }
    items.sort((a,b)=>b.depth-a.depth).forEach(i=>i.draw());
    g.fillStyle='#d0cba8';g.font='8px monospace';g.fillText('1 m grid / player plane Y=0 / Blender structure',10,375);
    const z=state.zoom;
    ctx.imageSmoothingEnabled=false;
    ctx.drawImage(this.canvas,Math.floor((ctx.canvas.width-576*z)/2),Math.floor((ctx.canvas.height-384*z)/2),576*z,384*z);
  }
}
