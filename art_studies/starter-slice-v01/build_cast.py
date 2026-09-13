"""Run in the live Blender MCP session. New art-study scenes; no game changes."""
import bpy, math, json
from pathlib import Path
from mathutils import Vector
R=Path('Z:/Code/.worktrees/wizard-art-player-guides/art_studies/starter-slice-v01')
BASE=R.parent/'player-unarmed-v14-sandals-alpha/sources/players-open-sandals.blend'
for n in ('sources','renders','guides','generated','prompts','review'): (R/n).mkdir(exist_ok=True)
def material(name,color):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=.9
 return m
def recolor(obj,color):
 o=bpy.data.objects.get(obj)
 if o and o.type=='MESH':o.data.materials.clear();o.data.materials.append(material(obj+'_cast',color))
def setup(name,sex=None):
 bpy.ops.wm.open_mainfile(filepath=str(BASE));s=bpy.context.scene;s.name='VG_Prologue_'+name
 for g in ('male','female'):
  bpy.data.objects['Sheet_Direction_'+g].rotation_euler.z=0
  for p in ('VG_','MH_'):
   c=bpy.data.collections[p+g];c.hide_render=g!=sex;c.hide_viewport=g!=sex
 s.render.resolution_percentage=100;s.render.film_transparent=True;s.render.image_settings.color_mode='RGBA';s.cycles.samples=32
 bpy.context.view_layer.update();return s
def propmesh(name,verts,faces,mat,pivot):
 m=bpy.data.meshes.new(name);m.from_pydata(verts,[],faces);m.materials.append(mat);m.update()
 o=bpy.data.objects.new(name,m);bpy.context.scene.collection.objects.link(o);o.parent=pivot;return o
def rod(name,a,b,r,mat,pivot):
 a=Vector(a);b=Vector(b);v=b-a
 bpy.ops.mesh.primitive_cylinder_add(vertices=10,radius=r,depth=v.length,location=(a+b)/2)
 o=bpy.context.view_layer.objects.active;o.name=name;o.rotation_euler=v.to_track_quat('Z','Y').to_euler();o.data.materials.append(mat)
 bpy.context.view_layer.update();mw=o.matrix_world.copy();o.parent=pivot;o.matrix_world=mw;return o
def human(name,sex,tunic,vest,kind):
 s=setup(name,sex);pivot=bpy.data.objects['Sheet_Direction_'+sex]
 recolor(sex+'_linen_tunic',tunic);recolor(sex+('_hide_vest' if sex=='male' else '_fitted_open_vest'),vest)
 rig=bpy.data.objects['MH_'+sex+'_Rig'];hand=rig.matrix_world@rig.pose.bones['hand_r'].head
 wood=material(name+'_weathered_wood',(.22,.115,.045));clay=material(name+'_clay',(.4,.24,.14))
 if kind in ('staff','spear','club'):
  length={'staff':1.45,'spear':1.55,'club':.56}[kind];bottom=hand-Vector((0,0,length*.58));top=bottom+Vector((0,0,length))
  rod(name+'_shaft',bottom,top,.016 if kind!='club' else .027,wood,pivot)
  if kind=='spear':
   # Small knapped point on the scout's hunting spear, distinct from a hand axe.
   v=[top+Vector(x) for x in [(-.045,0,0),(0,-.015,.01),(.045,0,0),(0,.015,.01),(0,0,.14)]]
   propmesh(name+'_flint_point',v,[(0,1,4),(1,2,4),(2,3,4),(3,0,4),(0,3,2,1)],material('flint',(.19,.20,.19)),pivot)
 elif kind=='tablet':
  bpy.ops.mesh.primitive_cube_add(size=1,location=hand+Vector((0,-.035,-.10)))
  o=bpy.context.view_layer.objects.active;o.name=name+'_clay_counting_tablet';o.dimensions=(.16,.035,.22);o.data.materials.append(clay)
  bpy.context.view_layer.update();mw=o.matrix_world.copy();o.parent=pivot;o.matrix_world=mw
 if name=='field-hand':recolor('MH_male_Scalp',(.12,.095,.065))
 if name=='scribe':recolor('female_hair_high_tail',(.04,.026,.02));recolor('MH_female_Scalp',(.04,.026,.02))
 render_save(name,s,pivot,48)
def render_save(name,s,pivot,w):
 s.render.resolution_x=w;s.render.resolution_y=96
 for i,d in enumerate(('front','right','back','left')):
  pivot.rotation_euler.z=math.radians(i*90);bpy.context.view_layer.update();s.render.filepath=str(R/'renders'/f'{name}-{d}.png');bpy.ops.render.render(write_still=True)
 pivot.rotation_euler.z=0
 bpy.data.texts.new('build_cast.py').write((R/'build_cast.py').read_text())
 bpy.ops.wm.save_as_mainfile(filepath=str(R/'sources'/f'{name}.blend'),compress=True)
 print('CAST_SAVED',name,flush=True)
def wolf(name,length,color):
 s=setup(name);s.camera.data.shift_y-=.09;p=(R/'imports/quaternius-wolf.blend')
 with bpy.data.libraries.load(str(p),link=False) as (src,dst):dst.objects=src.objects
 for o in dst.objects:
  if o:s.collection.objects.link(o)
 rig=next(o for o in dst.objects if o.type=='ARMATURE');body=next(o for o in dst.objects if o.type=='MESH')
 s.frame_set(1);bpy.context.view_layer.update()
 ev=body.evaluated_get(bpy.context.evaluated_depsgraph_get());pts=[ev.matrix_world@Vector(v) for v in ev.bound_box]
 lo=Vector(tuple(min(p[i] for p in pts) for i in range(3)));hi=Vector(tuple(max(p[i] for p in pts) for i in range(3)))
 center=Vector(((lo.x+hi.x)/2,(lo.y+hi.y)/2,lo.z));scale=length/(hi.x-lo.x)
 pivot=bpy.data.objects.new(name+'_facing',None);s.collection.objects.link(pivot)
 normal=bpy.data.objects.new(name+'_normalization',None);s.collection.objects.link(normal);normal.parent=pivot
 # Imported animal points along +X. Match human front to -Y, retaining slight yaw.
 normal.rotation_euler.z=math.radians(-108);normal.scale=(scale,)*3
 rig.parent=normal;rig.location-=center
 for i,m in enumerate(list(body.data.materials)):
  shade=max(.2,min(1.6,sum(m.diffuse_color[:3])/1.5)) if m else 1
  body.data.materials[i]=material(name+'_coat_'+str(i),tuple(c*shade for c in color))
 render_save(name,s,pivot,96)
TASKS={
 'field-hand':lambda:human('field-hand','male',(.36,.25,.12),(.17,.10,.05),'staff'),
 'scribe':lambda:human('scribe','female',(.58,.48,.30),(.20,.24,.22),'tablet'),
 'scout':lambda:human('scout','female',(.30,.31,.19),(.22,.13,.065),'spear'),
 'defender':lambda:human('defender','male',(.45,.18,.10),(.20,.13,.085),'club'),
 'pack-wolf':lambda:wolf('pack-wolf',1.25,(.24,.23,.20)),
 'well-alpha':lambda:wolf('well-alpha',1.85,(.12,.105,.09)),
}
if 'CAST_TARGET' in globals():TASKS[CAST_TARGET]()
