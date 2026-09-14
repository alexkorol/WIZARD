"""Anatomy-derived closed grip, thumb opposition and bone-bound prop placement."""
def fit_grip(rig,side='r',desired_axis=None):
 from mathutils import Vector,Matrix
 import bpy,math
 def wp(bone,part):return rig.matrix_world@getattr(rig.pose.bones[bone],part)
 for finger in ('index','middle','ring','pinky'):
  for link in (1,2,3):
   b=rig.pose.bones[f'{finger}_{link:02d}_{side}'];b.rotation_mode='XYZ';b.rotation_euler.x=math.radians(65 if link<3 else 45)
 bpy.context.view_layer.update()
 centers={}
 for finger in ('index','middle','ring','pinky'):
  ps=[wp(f'{finger}_{k:02d}_{side}','head') for k in (1,2,3)]+[wp(f'{finger}_03_{side}','tail')]
  centers[finger]=sum(ps,Vector())/4
 axis=(centers['index']-centers['pinky']).normalized();center=(centers['middle']+centers['ring'])/2
 if axis.z<0:axis=-axis
 if desired_axis is not None:
  hand=rig.pose.bones['hand_'+side];h=hand.head.copy();ri=rig.matrix_world.to_3x3().inverted()
  q=(ri@axis).rotation_difference(ri@desired_axis.normalized());hand.matrix=Matrix.Translation(h)@q.to_matrix().to_4x4()@Matrix.Translation(-h)@hand.matrix
  bpy.context.view_layer.update()
  for finger in centers:
   ps=[wp(f'{finger}_{k:02d}_{side}','head') for k in (1,2,3)]+[wp(f'{finger}_03_{side}','tail')]
   centers[finger]=sum(ps,Vector())/4
  axis=(centers['index']-centers['pinky']).normalized();center=(centers['middle']+centers['ring'])/2
  if axis.z<0:axis=-axis
 radius=.0115
 # Solve the last two thumb joints to contact the outside of the grip cylinder.
 thumb2=rig.pose.bones['thumb_02_'+side];thumb3=rig.pose.bones['thumb_03_'+side]
 base=wp('thumb_02_'+side,'head');normal=(base-center)-axis*(base-center).dot(axis);normal.normalize()
 target=center+axis*.025+normal*(radius+.005)
 l1=(wp('thumb_02_'+side,'tail')-base).length;l2=(wp('thumb_03_'+side,'tail')-wp('thumb_03_'+side,'head')).length
 reach=target-base;d=min(reach.length,l1+l2-.0005);direction=reach.normalized();target=base+direction*d
 along=(l1*l1-l2*l2+d*d)/(2*d);height=math.sqrt(max(0,l1*l1-along*along))
 pole=normal-direction*normal.dot(direction)
 if pole.length<.001:pole=Vector((1,0,0))-direction*direction.x
 pole.normalize();elbow=base+direction*along+pole*height
 def aim(bone,world_target):
  b=rig.pose.bones[bone];head=b.head.copy();local=rig.matrix_world.inverted()@world_target
  q=(b.tail-b.head).rotation_difference(local-head);b.matrix=Matrix.Translation(head)@q.to_matrix().to_4x4()@Matrix.Translation(-head)@b.matrix;bpy.context.view_layer.update()
 aim('thumb_02_'+side,elbow);aim('thumb_03_'+side,target)
 return center,axis,radius,{'center_world':list(center),'axis_world':list(axis),'shaft_radius_m':radius,'finger_loop_centers_world':{k:list(v) for k,v in centers.items()},'thumb_tip_target_error_m':(wp('thumb_03_'+side,'tail')-target).length}

def build_gripped_prop(name,kind,rig,pivot,wood,stone,mesh_fn):
 from mathutils import Vector,Matrix
 import math,bpy
 desired=Vector((0,-.08,1)) if kind=='club' else Vector((.015,-.035,1))
 center,axis,radius,report=fit_grip(rig,desired_axis=desired)
 low=-.065 if kind=='club' else max(-1.1,-(center.z-.028)/max(.25,axis.z))
 high=.43 if kind=='club' else .66 if kind=='spear' else .55
 verts=[];faces=[];q=axis.to_track_quat('Z','Y').to_matrix()
 for j in range(17):
  t=low+(high-low)*j/16
  r=radius if kind!='club' or t<.055 else radius+(.035-radius)*(t-.055)/(high-.055)
  for i in range(12):
   a=i*math.pi/6;co=center+axis*t+q@Vector((r*math.cos(a),r*math.sin(a),0));verts.append(co)
 for j in range(16):
  for i in range(12):faces.append((j*12+i,j*12+(i+1)%12,(j+1)*12+(i+1)%12,(j+1)*12+i))
 faces.extend([tuple(range(11,-1,-1)),tuple(range(192,204))])
 prop=mesh_fn(name+'_gripped_'+kind,verts,faces,wood,pivot)
 bpy.context.view_layer.update();world=prop.matrix_world.copy();prop.parent=rig;prop.parent_type='BONE';prop.parent_bone='hand_r';prop.matrix_world=world
 if kind=='spear':
  tip=center+axis*high
  points=[tip+q@Vector(p) for p in [(-.035,0,0),(0,-.009,0),(.035,0,0),(0,.009,0),(0,0,.13)]]
  head=mesh_fn(name+'_gripped_flint_point',points,[(0,1,4),(1,2,4),(2,3,4),(3,0,4),(0,3,2,1)],stone,pivot)
  bpy.context.view_layer.update();world=head.matrix_world.copy();head.parent=rig;head.parent_type='BONE';head.parent_bone='hand_r';head.matrix_world=world
 report.update(kind=kind,axis_interval_m=[low,high],bone_parent='hand_r')
 return report


def build_gripped_tablet(name,rig,pivot,mesh_fn,material):
 from mathutils import Vector
 import bpy
 old=bpy.data.objects.get(name+'_clay_counting_tablet')
 if old:old.hide_render=True;old.hide_set(True)
 center,axis,radius,report=fit_grip(rig)
 # Top edge lies in the curled fingers; the slab hangs away from the wrist.
 wrist=rig.matrix_world@rig.pose.bones['hand_r'].head
 down=center-wrist;down-=axis*down.dot(axis);down.normalize()
 normal=axis.cross(down).normalized()
 verts=[center+axis*x+down*y+normal*z for z in (-.009,.009) for y in (-.007,.15) for x in (-.066,.066)]
 faces=[(0,1,3,2),(4,6,7,5),(0,4,5,1),(2,3,7,6),(0,2,6,4),(1,5,7,3)]
 ob=mesh_fn(name+'_gripped_clay_tablet',verts,faces,material,pivot)
 bevel=ob.modifiers.new('Rounded clay edges','BEVEL');bevel.width=.006;bevel.segments=3
 bpy.context.view_layer.update();world=ob.matrix_world.copy();ob.parent=rig;ob.parent_type='BONE';ob.parent_bone='hand_r';ob.matrix_world=world
 report.update(kind='clay tablet',bone_parent='hand_r',attachment='Curled fingers support the top edge; slab extends away from wrist')
 return report
