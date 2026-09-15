"""Live Blender MCP recipe: individual anatomy/hair and clean layered garment surfaces."""
import bpy,math,json,hashlib
from pathlib import Path
from mathutils import Vector,Matrix
from mathutils.bvhtree import BVHTree
from bl_ext.user_default.mpfb.services.targetservice import TargetService,HumanObjectProperties
R=Path('Z:/Code/.worktrees/wizard-art-player-guides/art_studies/starter-slice-v02-identities')
OLD=R.parent/'starter-slice-v01';PLAYER=R.parent/'player-unarmed-v14-sandals-alpha/sources/players-open-sandals.blend'
TARGETS=Path(__import__('bl_ext.user_default.mpfb.services.targetservice',fromlist=['x']).__file__).parent.parent/'data/targets'
for n in ('sources','renders','guides','review','identities','prompts','generated'): (R/n).mkdir(exist_ok=True)
SPECS={
 'player-female':{'sex':'female','hair':'loose-bob','hair_color':(.075,.035,.018),'height':1.0,'width':1.0,'face':{'head/head-oval':.32,'chin/chin-width-decr':.18,'nose/nose-scale-depth-incr':.13},'linen':(.65,.58,.43),'hide':(.31,.19,.09)},
 'scribe':{'sex':'female','hair':'centered-coil','hair_color':(.025,.018,.012),'height':.96,'width':1.04,'face':{'head/head-round':.28,'nose/nose-scale-horiz-incr':.18,'chin/chin-prominent-decr':.16},'linen':(.58,.48,.30),'hide':(.20,.24,.22)},
 'scout':{'sex':'female','hair':'short-crop','hair_color':(.13,.053,.022),'height':1.015,'width':.94,'face':{'head/head-diamond':.32,'chin/chin-prominent-incr':.18,'nose/nose-curve-convex':.2},'linen':(.30,.31,.19),'hide':(.22,.13,.065)},
 'player-male':{'sex':'male','hair':'short-wave','hair_color':(.035,.022,.014),'height':1.0,'width':1.0,'face':{'head/head-rectangular':.25,'chin/chin-width-incr':.18,'nose/nose-scale-depth-incr':.12},'linen':(.65,.58,.43),'hide':(.28,.17,.08)},
 'field-hand':{'sex':'male','hair':'back-crop-beard','hair_color':(.14,.12,.09),'height':.97,'width':1.07,'face':{'head/head-age-incr':.3,'nose/nose-curve-convex':.3,'chin/chin-width-incr':.3},'linen':(.36,.25,.12),'hide':(.17,.10,.05)},
 'defender':{'sex':'male','hair':'shaved','hair_color':(.07,.045,.027),'height':1.015,'width':1.1,'face':{'head/head-round':.23,'chin/chin-width-incr':.45,'nose/nose-scale-horiz-incr':.27},'linen':(.45,.18,.10),'hide':(.20,.13,.085)},
}
def mat(name,color):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=.86;return m
def mesh(name,verts,faces,material,pivot):
 m=bpy.data.meshes.new(name);m.from_pydata(verts,[],faces);m.materials.append(material);m.update();o=bpy.data.objects.new(name,m);bpy.context.scene.collection.objects.link(o);o.parent=pivot
 for f in m.polygons:f.use_smooth=True
 return o
def cord(name,points,radius,material,pivot,cyclic=False):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.bevel_depth=radius;c.bevel_resolution=3
 sp=c.splines.new('POLY');sp.points.add(len(points)-1)
 for p,co in zip(sp.points,points):p.co=(*co,1)
 sp.use_cyclic_u=cyclic;o=bpy.data.objects.new(name,c);bpy.context.scene.collection.objects.link(o);o.parent=pivot;c.materials.append(material);return o
def build(name):
 spec=SPECS[name];sex=spec['sex'];src=PLAYER if name.startswith('player') else OLD/'sources'/f'{name}.blend'
 starter=name.startswith('player')
 if starter:
  # The owner rejected the recurring female side braid. Do not reintroduce it
  # through this starter override when rebuilding the individual character.
  spec['hair']='short-crop' if sex=='female' else 'long-wave-beard';spec['hair_color']=(.11,.063,.028) if sex=='female' else (.14,.085,.036);spec['linen']=(.66,.59,.45)
  spec['kit']='Owner starter reference: single linen tunic, cord belt, small pendant, open sandals, rough wood club'
 bpy.ops.wm.open_mainfile(filepath=str(src));s=bpy.context.scene;s.name='VG_Individual_'+name
 pivot=bpy.data.objects['Sheet_Direction_'+sex];pivot.rotation_euler.z=0
 for other in ('male','female'):
  for prefix in ('VG_','MH_'):
   c=bpy.data.collections[prefix+other];c.hide_render=other!=sex;c.hide_viewport=other!=sex
 bpy.context.view_layer.update()
 body=bpy.data.objects['MH_'+sex+'_Body'];body.data=body.data.copy();body.data.name=name+'_anatomy_mesh'
 for key,value in [('caucasian',1.0),('african',0.0),('asian',0.0)]:HumanObjectProperties.set_value(key,value,entity_reference=body)
 if starter:HumanObjectProperties.set_value('muscle',.68 if sex=='male' else .58,entity_reference=body)
 TargetService.reapply_macro_details(body,remove_zero_weight_targets=False)
 spec['facial_reference_direction']='European, explicitly requested by owner; individual shape targets retained'
 for target,value in spec['face'].items():TargetService.load_target(body,str(TARGETS/(target+'.target.gz')),weight=value,name=name+'__'+target.replace('/','_'))
 bpy.context.view_layer.update()
 if True:
  rig=bpy.data.objects['MH_'+sex+'_Rig']
  def aim(bone,direction):
   b=rig.pose.bones[bone];head=b.head.copy();q=(b.tail-b.head).rotation_difference(Vector(direction));b.matrix=Matrix.Translation(head)@q.to_matrix().to_4x4()@Matrix.Translation(-head)@b.matrix;bpy.context.view_layer.update()
  for side,sign in ([('l',1),('r',-1)] if starter else [('r',-1)]):
   aim('upperarm_'+side,(sign*.09,-.025,-.245));aim('lowerarm_'+side,(sign*.045,-.12,-.18));aim('hand_'+side,(sign*.006,-.04,-.025))
  for finger in ('index','middle','ring','pinky'):
   for link in (1,2,3):
    b=rig.pose.bones[f'{finger}_{link:02d}_r'];b.rotation_mode='XYZ';b.rotation_euler.x=math.radians(65 if link<3 else 45)
  bpy.context.view_layer.update()
 root=bpy.data.objects[sex+'_ROOT'].matrix_world.copy();inv=root.inverted();mask=body.modifiers.get('Hide skin under kit');mask.show_viewport=False;mask.show_render=False;bpy.context.view_layer.update()
 ev=body.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ev.to_mesh();pts=[inv@(ev.matrix_world@v.co) for v in me.vertices];faces=[tuple(p.vertices) for p in me.polygons]
 tree=BVHTree.FromPolygons(pts,faces);top=max(p.z for p in pts);ev.to_mesh_clear()
 # Retire the entire inherited hair assembly and old garment shells. Preserve in source as hidden history.
 retired=[]
 for o in bpy.data.objects:
  if o.type=='MESH' and ((o.name.startswith(sex+'_') and any(t in o.name for t in ('hair','vest','linen_tunic','belt','wrist_guard'))) or o.name=='MH_'+sex+'_Scalp'):
   o.hide_render=True;o.hide_set(True);retired.append(o.name)
 # Derive fitted hair directly from anatomical scalp surface, after facial morphs.
 hf=[]
 for face in faces:
  ps=[pts[i] for i in face]
  if all(p.z>top-(.072 if p.y<-.04 else (.125 if spec['hair']=='shaved' else .17)) for p in ps):hf.append(face)
 used=sorted({i for f in hf for i in f});mapping={i:k for k,i in enumerate(used)};hv=[]
 for i in used:
  p=pts[i];hit,n,_,_=tree.find_nearest(p);thick=.003 if spec['hair']=='shaved' else .010
  if spec['hair'] in ('short-crop','short-wave'):thick+=.003*(1+math.sin(p.x*130)*math.cos(p.y*170))
  hv.append(root@(p+n*thick))
 hair=mesh(name+'_hair_scalp',hv,[tuple(mapping[i] for i in f) for f in hf],mat(name+'_hair',spec['hair_color']),pivot)
 if spec['hair']=='shaved':hair.hide_render=True;hair.hide_set(True)
 if spec['hair'] in ('loose-bob','back-crop-beard','long-wave-beard'):
  # Extend back/side scalp boundary into a continuous cut hairstyle, never a side tail.
  counts={}
  for f in hair.data.polygons:
   for edge in f.edge_keys:counts[edge]=counts.get(edge,0)+1
  verts=[v.co.copy() for v in hair.data.vertices];polys=[tuple(f.vertices) for f in hair.data.polygons]
  ext={};length=.145 if spec['hair'] in ('loose-bob','long-wave-beard') else .055
  for (a,b),count in counts.items():
   if count!=1:continue
   pa=inv@verts[a];pb=inv@verts[b]
   if min(pa.y,pb.y)<-.068:continue
   for i in (a,b):
    if i not in ext:
     p=inv@verts[i];p.x=.025+(p.x-.025)*1.12;p.y+=.015;p.z-=length;ext[i]=len(verts);verts.append(root@p)
   polys.append((a,b,ext[b],ext[a]))
  hm=hair.data;hm.clear_geometry();hm.from_pydata(verts,[],polys);hm.update()
  for f in hm.polygons:f.use_smooth=True
  sub=hair.modifiers.new('Continuous haircut surface','SUBSURF');sub.levels=1;sub.render_levels=1
  sol=hair.modifiers.new('Hair surface thickness','SOLIDIFY');sol.thickness=.012
 if spec['hair']=='centered-coil':
  curve=bpy.data.curves.new(name+'_nape_coil','CURVE');curve.dimensions='3D';curve.bevel_depth=.013;curve.bevel_resolution=3
  sp=curve.splines.new('POLY');sp.points.add(72)
  for i,p in enumerate(sp.points):
   t=i/72;angle=t*math.pi*5;r=.043*(1-.55*t);co=root@Vector((.025+r*math.cos(angle),.074+.024*t,top-.11+r*math.sin(angle)));p.co=(*co,1)
  co=bpy.data.objects.new(name+'_centered_nape_coil',curve);s.collection.objects.link(co);co.parent=pivot;curve.materials.append(hair.data.materials[0])
 if spec['hair']=='long-braid':
  controls=[Vector(p) for p in [(.025,.075,top-.10),(.10,.08,top-.18),(.155,.015,top-.26),(.175,-.09,top-.34),(.17,-.17,top-.45),(.15,-.18,top-.57)]]
  for strand in range(3):
   points=[]
   for i in range(161):
    t=i/160;f=t*(len(controls)-1);k=min(len(controls)-2,int(f));co=controls[k].lerp(controls[k+1],f-k);a=t*math.pi*15+strand*2*math.pi/3;rad=.012*(1-.55*t)
    co+=Vector((rad*math.cos(a),rad*math.sin(a),0));points.append(root@co)
   cord(name+'_braid_strand_'+str(strand),points,.0085,hair.data.materials[0],pivot)
 if spec['hair'] in ('back-crop-beard','long-wave-beard'):
  def beard_region(p):
   # Cheek line rises away from the mouth. Central nose/lip column stays bare.
   side=abs(p.x-.012);upper=top-.187+min(1,max(0,(side-.025)/.047))*.037
   return top-.235<p.z<upper and p.y<-.062
  fs=[f for f in faces if all(beard_region(pts[i]) for i in f)];ids=sorted({i for f in fs for i in f});mp={i:j for j,i in enumerate(ids)}
  mesh(name+'_jaw_beard',[root@(pts[i]+tree.find_nearest(pts[i])[1]*.003) for i in ids],[tuple(mp[i] for i in f) for f in fs],hair.data.materials[0],pivot)
 # Tailored front/back panels follow the actual body; side seams and shoulder bridges are explicit.
 female=sex=='female';hem=.68 if female else .71;shoulder=top-.26;armpit=top-.49;neck=top-.345;waist=top-.68
 def width(z):
  samples=[(hem,.19 if female else .225),(waist,.135 if female else .175),(armpit,.174 if female else .213),(shoulder,.18 if female else .222)]
  for (z0,a),(z1,b) in zip(samples,samples[1:]):
   if z0<=z<=z1:return a+(b-a)*(z-z0)/(z1-z0)
  return samples[0][1] if z<hem else samples[-1][1]
 def panel(name,outer):
  nu=32;nv=36;verts=[];faces=[];indices={};offset=.029 if outer else .014;bottom=hem+(.115 if outer else 0)
  for side in (-1,1):
   for j in range(nv+1):
    v=j/nv
    for i in range(nu+1):
     u=(i/nu*2-1);a=abs(u)
     # Separate neck opening, load-bearing shoulder strips, and armhole edge.
     ztop=neck+(shoulder-neck)*min(1,a/.52) if a<.62 else shoulder+(armpit-shoulder)*((a-.62)/.38)
     if side==1 and a<.52:ztop+=.045*(1-a/.52)
     ztop+=.010 if outer else 0
     z=bottom+(ztop-bottom)*v;x=.025+u*(width(z)+(.010 if outer else 0))
     # Smooth cross section measured through the torso, excluding the arms.
     center=-.015;ry=.115 if female else .135
     if z>waist-.07:
      depths=[]
      for samplex in (-.045,.025,.095):
       hit,n,_,_=tree.ray_cast(Vector((samplex,side*.8,z)),Vector((0,-side,0)),1.6)
       if hit is not None:depths.append(abs(hit.y-center))
      if depths:ry=max(depths)+.008
     y=center+side*ry*math.sqrt(max(0,1-u*u))
     y+=side*offset;indices[(side,j,i)]=len(verts);verts.append(root@Vector((x,y,z)))
   for j in range(nv):
    for i in range(nu):
     u=((i+.5)/nu*2-1)
     if outer and side==-1 and abs(u)<.23:continue
     q=(indices[(side,j,i)],indices[(side,j,i+1)],indices[(side,j+1,i+1)],indices[(side,j+1,i)])
     faces.append(q if side==-1 else q[::-1])
  for i in (0,nu):
   for j in range(nv):
    q=(indices[(-1,j,i)],indices[(1,j,i)],indices[(1,j+1,i)],indices[(-1,j+1,i)])
    faces.append(q[::-1] if i==0 else q)
  for i in range(nu):
   u=abs((i+.5)/nu*2-1)
   if .55<u<.88:
    last=[indices[(-1,nv,i)],indices[(-1,nv,i+1)]]
    for step in range(1,13):
     row=[]
     for k in (i,i+1):
      pa=inv@verts[indices[(-1,nv,k)]];pb=inv@verts[indices[(1,nv,k)]];t=step/12;p=pa.lerp(pb,t)
      hit,_,_,_=tree.ray_cast(Vector((p.x,p.y,top+.1)),Vector((0,0,-1)),.6)
      if hit is not None and hit.z<shoulder+.095:p.z=max(p.z,hit.z+offset)
      row.append(len(verts));verts.append(root@p)
     faces.append((last[0],last[1],row[1],row[0]));last=row
   # Correct skin penetration in world-independent anatomy coordinates.
  for k,wp in enumerate(verts):
   p=inv@wp;hit,n,_,dist=tree.find_nearest(p)
   if hit is not None and dist<.085 and (p-hit).dot(n)<offset:verts[k]=root@(hit+n*offset)

  ob=mesh(name,verts,faces,mat(name+'_material',spec['hide' if outer else 'linen']),pivot)
  return ob
 inner=panel(name+'_linen_single_shell',False);outer=panel(name+'_hide_outer_shell',True)
 # Relax interior tessellation while retaining designed hems/openings and shoulder boundaries.
 for garment in (inner,outer):
  counts={};neighbors={i:set() for i in range(len(garment.data.vertices))}
  for face in garment.data.polygons:
   for a,b in face.edge_keys:
    key=tuple(sorted((a,b)));counts[key]=counts.get(key,0)+1;neighbors[a].add(b);neighbors[b].add(a)
  boundary={i for edge,count in counts.items() if count==1 for i in edge}
  for iteration in range(6):
   positions=[v.co.copy() for v in garment.data.vertices]
   for i,v in enumerate(garment.data.vertices):
    if i in boundary or not neighbors[i]:continue
    avg=sum((positions[j] for j in neighbors[i]),Vector())/len(neighbors[i]);v.co=positions[i].lerp(avg,.35)
  garment.data.update()
 # Derive the outer layer from the finished inner surface so hems and armholes cannot cross.
 outer.hide_render=True;outer.hide_set(True)
 inner.data.update()
 overlay=[]
 for face in inner.data.polygons:
  ps=[inv@inner.data.vertices[i].co for i in face.vertices]
  center=sum(ps,Vector())/len(ps)
  if min(p.z for p in ps)<hem+.115:continue
  if center.y<-.025 and abs(center.x-.025)<width(center.z)*.23:continue
  overlay.append(tuple(face.vertices))
 ov=[v.co+v.normal*.009 for v in inner.data.vertices]
 outer=mesh(name+'_hide_fitted_overlay',ov,overlay,mat(name+'_hide_material',spec['hide']),pivot)
 clearance=[]
 # Low-resolution kit uses a continuous surface with material-defined outer panels.
 # This eliminates duplicate coplanar shoulders/armholes in the guide geometry.
 outer.hide_render=True;outer.hide_set(True)
 if not starter:
  inner.data.materials.append(outer.data.materials[0]);selected=set(overlay)
  for face in inner.data.polygons:
   if tuple(face.vertices) in selected:face.material_index=1
 if starter:
  outer.hide_render=True;outer.hide_set(True)
  binding=mat(name+'_russet_binding',(.22,.065,.035));wood=mat(name+'_club_wood',(.20,.105,.043));z=waist+.025
  belt=[]
  for i in range(96):
   a=i*2*math.pi/96;p=Vector((.025+(width(z)+.013)*math.cos(a),-.015+.14*math.sin(a),z))
   hit,n,_,_=BVHTree.FromPolygons([inv@v.co for v in inner.data.vertices],[tuple(f.vertices) for f in inner.data.polygons]).find_nearest(p)
   if hit is not None:p=hit+n*.009
   belt.append(root@p)
  cord(name+'_waist_cord',belt,.009,binding,pivot,True)
  cord(name+'_belt_ends',[root@Vector((.025,-.16,z)),root@Vector((.01,-.16,z-.13)),root@Vector((.035,-.16,z-.23))],.007,binding,pivot)
  for side in (-1,1):
   base=0 if side==-1 else 37*33;points=[inner.data.vertices[base+36*33+i].co+Vector((0,side*.003,.001)) for i in range(8,25)]
   cord(name+'_neck_binding_'+str(side),points,.007,binding,pivot)
 # Upper surfaces of the old rear sandal straps incorrectly reached onto the shin.
 for ob in bpy.data.objects:
  if ob.type=='MESH' and ob.name.startswith(sex+'_sandal_strap'):
   wm=ob.matrix_world.copy();wi=wm.inverted()
   for vertex in ob.data.vertices:
    p=inv@(wm@vertex.co)
    if p.z>.105:p.z=.085;vertex.co=wi@(root@p)

 # Every pole/club uses the actual curled palm, not the wrist origin.
 grip_report=None
 if name!='scribe':
  kind='club' if starter or name=='defender' else 'spear' if name=='scout' else 'staff'
  for ob in bpy.data.objects:
   if ob.type=='MESH' and ob.name.startswith(name+'_') and any(t in ob.name for t in ('_shaft','_flint_point','_rough_wood_club')):ob.hide_render=True;ob.hide_set(True)
  exec((R/'grips.py').read_text(),globals())
  grip_report=build_gripped_prop(name,kind,bpy.data.objects['MH_'+sex+'_Rig'],pivot,mat(name+'_grip_wood',(.21,.11,.05)),mat(name+'_knapped_flint',(.20,.20,.18)),mesh)
 else:
  exec((R/'grips.py').read_text(),globals())
  grip_report=build_gripped_tablet(name,bpy.data.objects['MH_'+sex+'_Rig'],pivot,mesh,mat(name+'_clay',(.34,.22,.12)))
 # Preserve adult proportions while giving each full dressed assembly its own build.
 # Apply assembly proportions after computing the body-local visibility mask.
 # Rebuild skin mask for the new hem and armholes, leaving upper chest/shoulders real skin.
 saved=[(m,m.show_viewport,m.show_render) for m in body.modifiers if m.type=='MASK']
 for m,_,_ in saved:m.show_viewport=False;m.show_render=False
 bpy.context.view_layer.update();ev=body.evaluated_get(bpy.context.evaluated_depsgraph_get());mm=ev.to_mesh()
 visible=body.vertex_groups.new(name=name+'_visible_skin')
 for v in mm.vertices:
  p=inv@(ev.matrix_world@v.co);covered=p.z>hem+.10 and ((p.z<armpit-.025 and abs(p.x-.025)<width(p.z)-.006) or (p.z<neck-.025 and abs(p.x-.025)<width(p.z)*.82))
  arm_weights=sum(g.weight for g in body.data.vertices[v.index].groups if any(k in body.vertex_groups[g.group].name for k in ('upperarm','lowerarm','hand','clavicle')))
  if not covered or arm_weights>.12:visible.add([v.index],1,'REPLACE')
 ev.to_mesh_clear()
 for m,a,b in saved:m.show_viewport=a;m.show_render=b
 mask.vertex_group=visible.name;mask.show_viewport=True;mask.show_render=True
 pivot.scale=(spec['width'],1+(spec['width']-1)*.65,spec['height'])
 bpy.context.view_layer.update();s.render.film_transparent=True;s.render.image_settings.color_mode='RGBA';s.render.resolution_percentage=100;s.cycles.samples=48
 # Scene identity metadata makes independent model variants inspectable.
 body['character_identity']=name;body['shared_foundation']='MakeHuman CC0';body['facial_targets']=json.dumps(spec['face']);pivot['identity_build']=json.dumps(spec)
 for i,direction in enumerate(('front','right','back','left')):
  pivot.rotation_euler.z=math.radians(i*90);bpy.context.view_layer.update()
  for suffix,w,h in [('',48,96),('-inspection',384,768)]:
   s.render.resolution_x=w;s.render.resolution_y=h;s.render.filepath=str(R/'renders'/f'{name}-{direction}{suffix}.png');bpy.ops.render.render(write_still=True)
 pivot.rotation_euler.z=0;s.render.resolution_x=48;s.render.resolution_y=96
 bpy.data.texts.new('revise_models.py').write((R/'revise_models.py').read_text())
 bpy.ops.wm.save_as_mainfile(filepath=str(R/'sources'/f'{name}.blend'),compress=True)
 info={'name':name,'grip':grip_report,'source':str(src),'spec':spec,'retired_meshes':retired,'garment_layers':[inner.name,outer.name],'layer_offset_m':[.014,.029],'outer_vertex_min_signed_clearance_m':min(clearance) if clearance else None,'logical_frame':[48,96],'model_variant':'Independent mesh datablock, unique facial shape keys, hair geometry and dressed assembly proportions'}
 (R/'identities'/f'{name}.json').write_text(json.dumps(info,indent=2));print('INDIVIDUAL_MODEL_SAVED',name)
if 'IDENTITY_TARGET' in globals():build(IDENTITY_TARGET)
