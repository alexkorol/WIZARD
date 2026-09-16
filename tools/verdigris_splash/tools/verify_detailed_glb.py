"""Fresh-session verification of celestial_world_runtime_detailed.glb.

Run:
  blender --background --python tools/verify_detailed_glb.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import bpy

MODULE_DIR = Path(__file__).resolve().parents[1]
TARGET = MODULE_DIR / "assets" / "world" / "celestial_world_runtime_detailed.glb"


def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(TARGET))
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    others = sorted(obj.type for obj in bpy.context.scene.objects if obj.type != "MESH")

    result = {"target": TARGET.name, "mesh_objects": len(meshes), "other_objects": others}

    if len(meshes) != 1:
        print("VERDIGRIS_DETAIL_VERIFY %s" % json.dumps(dict(result, ok=False, error="expected exactly one mesh object")))
        raise SystemExit(2)

    obj = meshes[0]
    tris = sum(len(p.vertices) - 2 for p in obj.data.polygons)
    verts = len(obj.data.vertices)
    points = [obj.matrix_world @ v.co for v in obj.data.vertices]
    lo = (
        min(p.x for p in points),
        min(p.y for p in points),
        min(p.z for p in points),
    )
    hi = (
        max(p.x for p in points),
        max(p.y for p in points),
        max(p.z for p in points),
    )

    problems = []
    if abs(lo[0]) > 7.85 or abs(hi[0]) > 7.85:
        problems.append("x extent outside +-7.85")
    if abs(lo[1]) > 7.85 or abs(hi[1]) > 7.85:
        problems.append("y extent outside +-7.85")
    if not (-5.4 <= lo[2] <= -4.0):
        problems.append("bottom z %.3f outside expected ~-5" % lo[2])
    if not (0.9 <= hi[2] <= 1.8):
        problems.append("top z %.3f outside expected ~+1.5" % hi[2])
    if tris > 230000:
        problems.append("triangle budget exceeded")

    result.update({
        "object": obj.name,
        "triangles": tris,
        "vertices": verts,
        "bounds_min_blender_zup": [round(v, 4) for v in lo],
        "bounds_max_blender_zup": [round(v, 4) for v in hi],
        "materials": [m.name if m else None for m in obj.data.materials],
        "problems": problems,
        "ok": not problems,
    })
    print("VERDIGRIS_DETAIL_VERIFY %s" % json.dumps(result, sort_keys=True))
    if problems:
        raise SystemExit(2)


main()
