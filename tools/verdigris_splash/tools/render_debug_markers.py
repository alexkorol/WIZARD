"""Debug aid: render the detailed world top-down with markers at placements."""

from __future__ import annotations

import sys
from pathlib import Path

import bpy
from mathutils import Vector

MODULE_DIR = Path(__file__).resolve().parents[1]
TARGET = MODULE_DIR / "assets" / "world" / "celestial_world_runtime_detailed.glb"
OUT = MODULE_DIR / "assets" / "world" / "qa_detailed" / "debug_marked_top.png"

PLACEMENTS = [
    ("caldera", 0.3453, -3.2067),
    ("mesa1", -2.812, -1.8253),
    ("mesa2", -1.4307, -4.0947),
    ("mesa3", 1.7267, 2.3187),
    ("canyon_mid", -1.6478, -2.2739),
    ("ridge1", 4.7853, -0.8387),
    ("ridge2", -2.812, 2.22),
    ("zigg1", 1.628, 5.9693),
    ("zigg2", -4.7853, 3.7987),
    ("tower1", -2.516, 0.2467),
    ("tower2", 1.628, 4.3907),
    ("stack1", 5.2787, 4.3907),
    ("stack2", -5.5747, 0.444),
    ("stack3", 5.8707, 1.036),
    ("stack4", 5.2787, 2.9107),
    ("stack5", 6.1667, -2.4173),
]


def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(TARGET))

    marker_mesh = bpy.data.meshes.new("markers")
    import bmesh
    bm = bmesh.new()
    for name, x, y in PLACEMENTS:
        bmesh.ops.create_uvsphere(bm, u_segments=8, v_segments=6, diameter=0.28,
                                  matrix=__import__("mathutils").Matrix.Translation((x, y, 1.45)))
    bm.to_mesh(marker_mesh)
    bm.free()
    obj = bpy.data.objects.new("markers", marker_mesh)
    bpy.context.scene.collection.objects.link(obj)
    mat = bpy.data.materials.new("marker")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    emit = nodes.new("ShaderNodeEmission")
    emit.inputs[0].default_value = (1.0, 0.05, 0.05, 1.0)
    emit.inputs[1].default_value = 8.0
    outn = nodes.new("ShaderNodeOutputMaterial")
    mat.node_tree.links.new(emit.outputs[0], outn.inputs["Surface"])
    obj.data.materials.append(mat)

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 900
    scene.render.resolution_y = 900
    cam_data = bpy.data.cameras.new("dbg")
    cam_data.type = "ORTHO"
    cam_data.ortho_scale = 16.0
    cam = bpy.data.objects.new("dbg", cam_data)
    scene.collection.objects.link(cam)
    cam.location = (0.0, 0.0, 30.0)
    cam.rotation_euler = (0.0, 0.0, 0.0)
    scene.camera = cam

    sun_data = bpy.data.lights.new("sun", "SUN")
    sun_data.energy = 4.0
    sun = bpy.data.objects.new("sun", sun_data)
    sun.rotation_euler = (0.6, 0.2, 0.4)
    bpy.context.scene.collection.objects.link(sun)

    scene.render.filepath = str(OUT)
    bpy.ops.render.render(write_still=True)
    print("DEBUG_RENDER %s" % OUT, flush=True)


main()
