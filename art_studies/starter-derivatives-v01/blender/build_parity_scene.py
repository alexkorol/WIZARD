"""Execute in Blender via MCP. All sizes are metres; render at native pixels.

Retains the saved player perspective camera's pixel focal length at the player
plane. Larger canvas changes field of view, never the metres-to-pixels scale.
"""
import bpy, math, json, random
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

R = Path(__file__).parent
OUT = R / 'parity'
OUT.mkdir(exist_ok=True)
source = bpy.context.scene
base_camera = source.camera
base_height = source.render.resolution_y
base_lens = base_camera.data.lens
s = bpy.data.scenes.new('Village_player_plane_calibration')
bpy.context.window.scene = s
s.render.engine = 'CYCLES'
s.cycles.samples = 32
s.cycles.use_denoising = False
s.render.resolution_x, s.render.resolution_y = 576, 384
s.render.resolution_percentage = 100
s.render.image_settings.file_format = 'PNG'
s.render.image_settings.color_mode = 'RGBA'
s.render.film_transparent = True
s.world = source.world.copy()
s.view_settings.view_transform = source.view_settings.view_transform
s.view_settings.look = source.view_settings.look
s.view_settings.exposure = source.view_settings.exposure
s.view_settings.gamma = source.view_settings.gamma
camera = base_camera.copy(); camera.data = base_camera.data.copy()
s.collection.objects.link(camera); s.camera = camera
camera.name = 'Parity_camera_same_pixel_focal_length'
camera.data.lens = base_lens * base_height / s.render.resolution_y
camera.data.shift_y = 0
bpy.context.view_layer.update()
origin = world_to_camera_view(s, camera, Vector((0,0,0)))
camera.data.shift_y = origin.y - .25
for obj in source.objects:
    if obj.type == 'LIGHT':
        light = obj.copy(); light.data = obj.data.copy(); s.collection.objects.link(light)

def material(name, color, noise=0):
    m = bpy.data.materials.new('parity_' + name); m.diffuse_color = (*color,1)
    m.use_nodes = True; p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*color,1); p.inputs['Roughness'].default_value = .9
    if noise:
        n = m.node_tree.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = noise
        ramp = m.node_tree.nodes.new('ShaderNodeValToRGB')
        ramp.color_ramp.elements[0].color = (*(v*.65 for v in color),1)
        ramp.color_ramp.elements[1].color = (*(v*1.15 for v in color),1)
        m.node_tree.links.new(n.outputs['Fac'],ramp.inputs['Fac'])
        m.node_tree.links.new(ramp.outputs['Color'],p.inputs['Base Color'])
    return m
earth = material('earth',(.14,.12,.075),7)
plaster = material('clay_plaster',(.42,.34,.21),11)
thatch = material('reed_thatch',(.23,.18,.085),24)
wood = material('timber',(.12,.072,.029),13)
stone = material('stone',(.23,.245,.20),8)
leaves = [material('leaf_'+str(i),c,5) for i,c in enumerate([(.075,.115,.026),(.12,.16,.042),(.09,.135,.029)])]
groups = {}
current = 'ground'
def add(obj, name, mat):
    obj.name = 'parity_' + name; obj.data.materials.append(mat)
    groups.setdefault(current,[]).append(obj)
    return obj
def cube(name, loc, size, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = add(bpy.context.object,name,mat); o.scale = size
    return o
def cone(name, loc, r1, r2, depth, mat, vertices=24):
    bpy.ops.mesh.primitive_cone_add(vertices=vertices, radius1=r1, radius2=r2, depth=depth, location=loc)
    return add(bpy.context.object,name,mat)
def beam(name,a,b,r,mat):
    a,b=Vector(a),Vector(b); o=cone(name,(a+b)/2,r,r*.85,(b-a).length,mat,10)
    o.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler();return o

cube('ground',(0,4,-.05),(25,30,.10),earth)
# Ground lines are modelled one metre apart; perspective remains intact.
gridmat=material('survey_lines',(.26,.24,.13))
for x in range(-10,11):cube('metre_grid_x',(x,4,.002),(.012,22,.003),gridmat)
for y in range(-7,16):cube('metre_grid_y',(0,y,.002),(20,.012,.003),gridmat)

def hut(name,x,y):
    global current
    current=name
    # Circular wall with a real open doorway, not an opaque painted opening.
    for i in range(28):
        a=2*math.pi*(i+.5)/28
        if abs(math.atan2(math.sin(a+math.pi/2),math.cos(a+math.pi/2)))<.30:continue
        o=cube(name+'_wall',(x+1.42*math.cos(a),y+1.42*math.sin(a),.80),(.35,.18,1.60),plaster)
        o.rotation_euler.z=a+math.pi/2
    for dx in [-.46,.46]:beam(name+'_doorpost',(x+dx,y-1.4,0),(x+dx,y-1.4,1.6),.07,wood)
    beam(name+'_lintel',(x-.53,y-1.4,1.55),(x+.53,y-1.4,1.55),.09,wood)
    cone(name+'_roof',(x,y,2.30),1.85,.09,1.45,thatch,40)
    for i in range(80):
        a=i*2*math.pi/80
        beam(name+'_reed_seam',(x+1.84*math.cos(a),y+1.84*math.sin(a),1.585),(x+.12*math.cos(a),y+.12*math.sin(a),3.02),.012,thatch)
    cone(name+'_smoke_cap',(x,y,3.05),.17,.12,.17,wood,12)

hut('dwelling_west',-3.15,3.3)
hut('dwelling_east',3.50,5.5)
current='fence'
for x in [-1.8,-.8,.2,1.2]:
    beam('fence_post',(x,4.25,0),(x,4.25,1.0),.055,wood)
for z in [.38,.76]:beam('fence_rail',(-1.85,4.25,z),(1.25,4.25,z),.045,wood)
current='well'
for row in range(3):
    for i in range(12):
        a=(i+row*.5)*2*math.pi/12
        o=cube('well_block',(1.45+.53*math.cos(a),1.6+.53*math.sin(a),.12+row*.20),(.30,.20,.19),stone)
        o.rotation_euler.z=a+math.pi/2
for x in [.87,2.03]:beam('well_upright',(x,1.6,.5),(x,1.6,1.65),.05,wood)
beam('well_crossbar',(.8,1.6,1.65),(2.1,1.6,1.65),.06,wood)
cone('well_bucket',(1.45,1.6,.75),.12,.17,.28,wood,12)

def tree(name,x,y,seed):
    global current
    current=name; rng=random.Random(seed)
    beam(name+'_trunk',(x,y,0),(x+.17,y,3.0),.17,wood)
    for i in range(13):
        a=i*2.399; h=2.25+rng.random()*1.2;r=.5+rng.random()*.75
        tip=(x+r*math.cos(a),y+r*math.sin(a),h)
        beam(name+'_branch',(x+.13,y,h-.7),tip,.065,wood)
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2,radius=.75,location=tip)
        o=add(bpy.context.object,name+'_canopy',leaves[i%3]);o.scale=(1,.85,.65)
tree('tree_west',-4.55,.6,47)
tree('tree_east',4.75,1.6,91)

def project(p):
    v=world_to_camera_view(s,camera,Vector(p))
    return [v.x*s.render.resolution_x,(1-v.y)*s.render.resolution_y,v.z]
data={'status':'Blender structural calibration; generated character scales still under review',
      'canvas':[576,384], 'player_frame':[48,96], 'player_source':str(source.name),
      'source_camera':{'lens_mm':base_lens,'sensor_height_mm':base_camera.data.sensor_height,'render_height':base_height},
      'camera':{'lens_mm':camera.data.lens,'sensor_height_mm':camera.data.sensor_height,'location':list(camera.location),'rotation':list(camera.rotation_euler),'shift_y':camera.data.shift_y},
      'player_origin':project((0,0,0)), 'metre_x':project((1,0,0)), 'metre_y':project((0,1,0)), 'metre_z':project((0,0,1)),
      'dimensions_m':{'dwelling':[3.7,3.7,3.135],'fence_height':1,'well_rim_height':.615,'trees_approx_height':4},
      'layers':[]}
# Explicit projective mapping from world metres to logical canvas coordinates.
data['ground_samples']=[{'world':[x,y],'pixel':project((x,y,0))} for x,y in [(0,0),(1,0),(0,1),(1,1)]]
data['pixel_focal_length']=base_lens/base_camera.data.sensor_height*base_height
data['player_plane_px_per_m']=data['metre_x'][0]-data['player_origin'][0]
for name,objects in groups.items():
    for other,obs in groups.items():
        for o in obs:
            o.hide_render=other!=name and name!='ground'
            o.visible_camera=other==name if name=='ground' else True
    s.render.filepath=str(OUT/(name+'.png'));bpy.ops.render.render(write_still=True)
    depth={'ground':100,'dwelling_west':3.3,'dwelling_east':5.5,'fence':4.25,'well':1.6,'tree_west':.6,'tree_east':1.6}[name]
    data['layers'].append({'name':name,'file':name+'.png','world_y':depth})
for obs in groups.values():
    for o in obs:o.hide_render=False;o.visible_camera=True
s.render.filepath=str(OUT/'combined.png');bpy.ops.render.render(write_still=True)
(OUT/'camera.json').write_text(json.dumps(data,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(R/'village-parity.blend'),compress=True)
print('PARITY_RENDER_COMPLETE',data['player_plane_px_per_m'])
